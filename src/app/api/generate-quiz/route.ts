import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { NextResponse } from 'next/server';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { role } = await req.json();

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    const { object } = await generateObject({
      model: google('gemini-2.5-flash') as any,
      schema: z.object({
        questions: z.array(z.object({
          question: z.string(),
          options: z.array(z.string()).length(4),
          correctIndex: z.number().min(0).max(3),
          explanation: z.string(),
        })).length(3),
      }),
      prompt: `You are an expert technical interviewer. Generate a difficult, 3-question multiple-choice assessment for the role: ${role}. Make the questions challenging and highly specific to advanced concepts in that role. Provide clear explanations for the correct answer.`,
    });

    return NextResponse.json(object, { status: 200 });
  } catch (error: any) {
    console.error("Quiz Gen Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate quiz" }, { status: 500 });
  }
}
