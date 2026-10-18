import { NextRequest, NextResponse } from 'next/server';
import { calculateManseryeok } from '@/lib/saju/manseryeok';
import { analyzeSajuWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      year,
      month,
      day,
      hour,
      minute,
      isLunar = false,
      isLeapMonth = false,
      gender = 'female',
      name = '내담자',
      hasTime = true,
      customApiKey,
    } = body;

    if (!year || !month || !day) {
      return NextResponse.json(
        { success: false, error: '생년월일 정보를 입력해 주세요.' },
        { status: 400 }
      );
    }

    // 1. 만세력 정밀 계산
    const manseryeok = calculateManseryeok({
      year: Number(year),
      month: Number(month),
      day: Number(day),
      hour: hasTime && hour !== undefined ? Number(hour) : undefined,
      minute: hasTime && minute !== undefined ? Number(minute) : undefined,
      isLunar: Boolean(isLunar),
      isLeapMonth: Boolean(isLeapMonth),
      gender: gender as 'male' | 'female',
      name: String(name || '내담자'),
      hasTime: Boolean(hasTime),
    });

    // 2. AI 또는 로컬 심층 리포트 생성
    const { report, isAI } = await analyzeSajuWithGemini(manseryeok, customApiKey);

    return NextResponse.json({
      success: true,
      manseryeok,
      report,
      isAI,
    });
  } catch (error: unknown) {
    console.error('[API /api/saju/analyze] Error:', error);
    const message = error instanceof Error ? error.message : '사주 분석 중 오류가 발생했습니다.';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
