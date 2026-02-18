import { NextRequest, NextResponse } from 'next/server';
import { resetSession } from '@/lib/gemini-chatbot';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { session_id } = body;

    if (!session_id) {
      return NextResponse.json({ detail: 'session_id is required' }, { status: 422 });
    }

    resetSession(session_id);
    return NextResponse.json({ status: 'ok', message: 'Session reset' });
  } catch (error) {
    return NextResponse.json({ detail: String(error) }, { status: 500 });
  }
}
