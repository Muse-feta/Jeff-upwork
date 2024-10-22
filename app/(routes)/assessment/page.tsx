"use client";
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
  const [assessment, setAssessment] = useState<any>(null);

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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Create a Medical Assessment
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields for the inputs */}
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
            className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm p-3"
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
            className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm p-3"
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
            className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm p-3"
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
            className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm p-3"
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
            className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm p-3"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md"
        >
          Generate Assessment
        </button>
      </form>

      {assessment && (
        <div className="mt-6 p-4 border rounded-md bg-gray-50">
          <h2 className="text-lg font-bold mb-4">Assessment Report</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2 font-semibold">
                  Field
                </th>
                <th className="border border-gray-300 p-2 font-semibold">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">
                  Diagnosis
                </td>
                <td className="border border-gray-300 p-2">
                  {assessment.diagnosis}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">
                  History of Trauma
                </td>
                <td className="border border-gray-300 p-2">
                  {assessment.historyOfTrauma}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">
                  Symptoms
                </td>
                <td className="border border-gray-300 p-2">
                  {assessment.symptoms}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">
                  History of Problem
                </td>
                <td className="border border-gray-300 p-2">
                  {assessment.historyOfProblem}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">
                  Treatment Plan
                </td>
                <td className="border border-gray-300 p-2">
                  {assessment.treatmentPlan}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
