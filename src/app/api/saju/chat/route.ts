import { NextRequest, NextResponse } from 'next/server';
import { chatWithSajuMaster } from '@/lib/gemini';
import { ManseryeokResult, SajuAnalysisReport, ChatMessage } from '@/lib/saju/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      manseryeok,
      report,
      history = [],
      message,
      customApiKey,
    } = body as {
      manseryeok: ManseryeokResult;
      report: SajuAnalysisReport;
      history: ChatMessage[];
      message: string;
      customApiKey?: string;
    };

    if (!manseryeok || !message) {
      return NextResponse.json(
        { success: false, error: '질문과 사주 정보가 필요합니다.' },
        { status: 400 }
      );
    }

    const reply = await chatWithSajuMaster(
      manseryeok,
      report,
      history,
      message,
      customApiKey
    );

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error: unknown) {
    console.error('[API /api/saju/chat] Error:', error);
    const message = error instanceof Error ? error.message : '대화 중 오류가 발생했습니다.';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
