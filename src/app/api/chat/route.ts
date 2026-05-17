import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const SYSTEM_PROMPT = `You are an Elite Tech Recruiter & Career Coach for IT/Tech students. Your name is CareerOS Mentor.
Your mission is to help students land their dream tech jobs, analyze companies, provide actionable interview preparation, and give strategic career advice.

Guidelines:
1. Be concise, professional, and encouraging.
2. Provide highly actionable advice. No fluff.
3. If asked for a mock interview, act as the interviewer, asking one question at a time and evaluating their response.
4. If asked about a company, provide insights on their tech stack, interview process, and company culture based on typical industry knowledge.
5. Keep your formatting clean using markdown (bullet points, bold text).
6. Remind them to log their applications and skills in the CareerOS dashboard when relevant.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-2.5-flash') as any,
    system: SYSTEM_PROMPT,
    messages,
  });

  return result.toDataStreamResponse();
}
