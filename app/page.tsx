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

export default function AssessmentForm() {
  const [formData, setFormData] = useState<FormData>({
    diagnosis: "",
    historyOfTrauma: "",
    symptoms: "",
    historyOfProblem: "",
    treatmentPlan: "",
  });
  const [assessment, setAssessment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const assessmentRef = useRef<HTMLDivElement | null>(null); // Reference to the assessment div

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/generate-assessment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setAssessment(data.assessment);
    setLoading(false);
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
          <h2 className="text-lg font-bold">Your Assessment:</h2>
          <table className="min-w-full divide-y divide-gray-200 mt-4">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Field</th>
                <th className="px-4 py-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {assessmentLines.map((line, index) => {
                if (line.length > 1) {
                  const field = line[0];
                  const details = line.slice(1).join(": ");
                  return (
                    <tr key={index}>
                      <td className="border px-4 py-2">{field}</td>
                      <td className="border px-4 py-2">{details}</td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
          <button
            id="download-button" // Add this ID for the button
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
