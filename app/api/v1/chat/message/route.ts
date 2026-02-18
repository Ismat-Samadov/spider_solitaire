import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/lib/gemini-chatbot';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, session_id } = body;

    if (!message) {
      return NextResponse.json({ detail: 'message is required' }, { status: 422 });
    }

    const result = await chat(message, session_id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ detail: String(error) }, { status: 500 });
  }
}
