// app/api/generate-assessment/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const {
    diagnosis,
    historyOfTrauma,
    symptoms,
    historyOfProblem,
    treatmentPlan,
  } = await request.json();

  console.log(
    diagnosis,
    historyOfTrauma,
    symptoms,
    historyOfProblem,
    treatmentPlan
  );

  // Construct the prompt for Hugging Face model
  const prompt = `
    Based on the following information, generate a comprehensive medical assessment:
    
    Diagnosis: ${diagnosis}
    History of Trauma: ${historyOfTrauma}
    Symptoms: ${symptoms}
    History of the Problem: ${historyOfProblem}
    Treatment Plan: ${treatmentPlan}
  `;

  // Hugging Face API call
  const response = await fetch(
    "https://api-inference.huggingface.co/models/gpt2",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: prompt,
        options: { use_cache: false },
        // Adjust the parameters as needed
        max_length: 300, // Change based on the expected response length
        temperature: 0.7, // Controls randomness: lower is more deterministic
      }),
    }
  );

  if (!response.ok) {
    const errorResponse = await response.json();
    console.error("Hugging Face API error:", errorResponse);
    return NextResponse.json(
      { error: "Failed to generate assessment." },
      { status: 500 }
    );
  }

  const result = await response.json();

  console.log("Hugging Face API response:", result);
  const assessment = result[0]?.generated_text || "No assessment generated.";

  return NextResponse.json({ assessment });
}
