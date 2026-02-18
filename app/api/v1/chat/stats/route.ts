import { NextResponse } from 'next/server';
import { getSessionCount } from '@/lib/gemini-chatbot';

export async function GET() {
  return NextResponse.json({
    active_sessions: getSessionCount(),
    model: 'gemini-1.5-flash',
    status: 'operational',
  });
}
