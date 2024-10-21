// app/assessment/page.tsx
"use client"
import { useState, ChangeEvent, FormEvent } from "react";

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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/generate-assessment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setAssessment(data.assessment);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Create a Medical Assessment
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        >
          Generate Assessment
        </button>
      </form>

      {assessment && (
        <div className="mt-6 p-4 border rounded-md bg-gray-50">
          <h2 className="text-lg font-bold">Your Assessment:</h2>
          <p>{assessment}</p>
        </div>
      )}
    </div>
  );
}
