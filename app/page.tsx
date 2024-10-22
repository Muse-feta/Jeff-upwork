"use client";
import { useState, ChangeEvent, FormEvent, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface FormData {
  diagnosis: string;
  historyOfTrauma: string;
  symptoms: string;
  historyOfProblem: string;
  treatmentPlan: string;
}

interface AssessmentResponse {
  assessment: string; // Adjust based on your actual API response structure
}

export default function AssessmentForm() {
  const [formData, setFormData] = useState<FormData>({
    diagnosis: "",
    historyOfTrauma: "",
    symptoms: "",
    historyOfProblem: "",
    treatmentPlan: "",
  });

  const [assessment, setAssessment] = useState<string>("");
  console.log("thsi is.................",assessment);
  const [loading, setLoading] = useState<boolean>(false);
  const assessmentRef = useRef<HTMLDivElement | null>(null); // Reference to the assessment div

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/generate-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate assessment");
      }

      const data: AssessmentResponse = await response.json(); // Specify the response type
      setAssessment(data.assessment);
    } catch (error) {
      console.error("Error generating assessment:", error);
    } finally {
      setLoading(false);
    }
  };

  // Split the assessment response into lines for table rendering
  const assessmentLines = assessment
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => line.split(": ").map((part) => part.trim()));

  // Function to download the assessment as a PDF
  const downloadPDF = async () => {
    if (assessmentRef.current) {
      const element = assessmentRef.current;

      // Temporarily hide the download button
      const button = document.getElementById("download-button");
      if (button) {
        button.style.display = "none"; // Hide the button
      }

      // Use html2canvas to create a canvas from the assessment div
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190; // Set width of the image in PDF
      const pageHeight = pdf.internal.pageSize.height; // Get the page height
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate height based on width
      let heightLeft = imgHeight;

      let position = 0;

      // Add image to PDF and handle page breaks
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("assessment.pdf"); // Download the PDF

      // Restore the button visibility
      if (button) {
        button.style.display = "block"; // Show the button again
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Create a Medical Assessment
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input fields for diagnosis, history of trauma, symptoms, history of problem, and treatment plan */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Diagnosis:
          </label>
          <input
            type="text"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-3 transition duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            History of Trauma:
          </label>
          <input
            type="text"
            name="historyOfTrauma"
            value={formData.historyOfTrauma}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-3 transition duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Symptoms:
          </label>
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 h-24 p-3 transition duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            History of Problem:
          </label>
          <textarea
            name="historyOfProblem"
            value={formData.historyOfProblem}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 h-24 p-3 transition duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Treatment Plan:
          </label>
          <textarea
            name="treatmentPlan"
            value={formData.treatmentPlan}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 h-24 p-3 transition duration-200"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
          disabled={loading}
        >
          {loading ? "Please wait..." : "Generate Assessment"}
        </button>
      </form>

      {assessment && (
        <div
          className="mt-6 p-4 border rounded-md bg-gray-50"
          ref={assessmentRef}
        >
          <h2 className="text-sm text-center font-bold mb-4">
            Medical Assessment Details
          </h2>

          {/* Client Information Section */}
          <div className="mb-6 border-b border-gray-300 pb-4">
            <div className="bg-gray-100 py-1 px-2">
              {" "}
              {/* Same style as other titles */}
              <h3 className="font-bold text-[12px] text-gray-800">
                Client Information
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-2 md: py-2 px-3">
              {" "}
              {/* Two-column layout */}
              {/* Column 1 */}
              <div className="flex flex-col">
                <span className="font-bold text-[12px] text-gray-800">
                  Client Name
                </span>
                <span className="text-[12px] text-gray-600">John Doe</span>{" "}
                {/* Placeholder */}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[12px] text-gray-800">
                  Date of Birth
                </span>
                <span className="text-[12px] text-gray-600">01/01/1990</span>{" "}
                {/* Placeholder */}
              </div>
              {/* Column 2 */}
              <div className="flex flex-col">
                <span className="font-bold text-[12px] text-gray-800">
                  Date of Assessment
                </span>
                <span className="text-[12px] text-gray-600">10/22/2024</span>{" "}
                {/* Placeholder */}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[12px] text-gray-800">
                  Referral Source
                </span>
                <span className="text-[12px] text-gray-600">Dr. Smith</span>{" "}
                {/* Placeholder */}
              </div>
            </div>
          </div>

          {/* Existing assessment details */}
          <div className="space-y-6">
            {assessmentLines.map((line, index) => {
              if (line.length > 1) {
                const field = line[0];
                const details = line.slice(1).join(": ");
                return (
                  <div key={index} className="border-b border-gray-300 pb-2">
                    <div className="bg-gray-100 py-1 px-2">
                      <h3 className="font-bold text-[12px] text-gray-800">
                        {field}
                      </h3>
                    </div>
                    <div className="py-2 px-4">
                      <p className="text-[12px] text-gray-600">{details}</p>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>

          <button
            id="download-button"
            onClick={downloadPDF}
            className="mt-4 py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200"
          >
            Download as PDF
          </button>
        </div>
      )}
    </div>
  );
}
