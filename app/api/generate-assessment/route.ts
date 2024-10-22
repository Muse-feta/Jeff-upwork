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
    Generate a comprehensive medical assessment based on the following information:

    Diagnosis: ${diagnosis}
    History of Trauma: ${historyOfTrauma}
    Symptoms: ${symptoms}
    History of the Problem: ${historyOfProblem}
    Treatment Plan: ${treatmentPlan}

    Please provide the assessment in a narrative format. Each section should be summarized into a coherent statement that connects all fields together. For example:

    Symptoms: After assessing the patient's symptoms, including ${symptoms}, it is concluded that ${diagnosis}. Furthermore, considering the ${historyOfTrauma}, it appears that the trauma could be linked to the patient's condition.
    Treatment Plan: The recommended treatment plan includes ${treatmentPlan} which addresses the identified issues.
     
    Conclusion: Based on the above assessments, it can be concluded that the patient requires careful monitoring and follow-up treatment, particularly focusing on the implications of ${diagnosis} and ${historyOfProblem}. Additional recommendations for further evaluation or treatment may include consideration of specific therapies or interventions based on the patient's individual response and needs.

    Ensure that each part of the assessment is clearly articulated and connects back to the overall medical context of the patient.
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
  const assessment = result[0]?.generated_text || "No assessment generated.";

  return NextResponse.json({ assessment });
}
