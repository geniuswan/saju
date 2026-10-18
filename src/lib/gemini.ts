import { GoogleGenAI } from '@google/genai';
import { ManseryeokResult, SajuAnalysisReport, ChatMessage } from './saju/types';
import { buildGeminiPrompt, generateLocalReport } from './saju/interpretations';

export async function analyzeSajuWithGemini(
  manseryeok: ManseryeokResult,
  customApiKey?: string
): Promise<{ report: SajuAnalysisReport; isAI: boolean }> {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log('[Saju Web] No Gemini API key provided. Using high-fidelity local calculation engine.');
    return {
      report: generateLocalReport(manseryeok),
      isAI: false,
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildGeminiPrompt(manseryeok);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text?.trim() || '';
    // JSON 파싱 (코드블록 감싸진 경우 정리)
    const cleanedJson = text.replace(/^```json/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(cleanedJson) as SajuAnalysisReport;

    return {
      report: parsed,
      isAI: true,
    };
  } catch (err) {
    console.error('[Saju Web] Gemini API Error during analysis, falling back to local engine:', err);
    return {
      report: generateLocalReport(manseryeok),
      isAI: false,
    };
  }
}

export async function chatWithSajuMaster(
  manseryeok: ManseryeokResult,
  report: SajuAnalysisReport,
  history: ChatMessage[],
  newMessage: string,
  customApiKey?: string
): Promise<string> {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // API 키가 없을 때의 스마트 룰베이스 사주도사 응답
    return `[알림: GEMINI_API_KEY가 설정되지 않아 로컬 도사 모드로 답변드립니다]\n\n내담자님의 사주 일간은 ${manseryeok.ilgan.title}이며, ${manseryeok.ilju.traits}의 기운을 타고났습니다.\n\n물어보신 내용("${newMessage}")에 대해 살펴보면, 현재 2026년 병오년(丙午年)의 화(火) 기운과 조화를 이루는 것이 관건입니다. 부족한 ${manseryeok.lackingOhaeng.join(', ') || '오행'} 기운을 보완하고 조급함을 내려놓으신다면 원하시는 결실에 순조롭게 닿으실 것입니다. (.env.local에 GEMINI_API_KEY를 등록하시면 더 무한하고 깊이 있는 실시간 사주 문답이 가능합니다.)`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
당신은 한국의 저명하고 지혜로운 사주 명리 스승(도사)입니다.
신뢰감 있고 온화하며 따뜻한 경어체('해요체')로 내담자의 고민과 질문에 대해 사주 원국과 오행의 관점에서 깊이 있는 통찰과 실천적 조언을 들려주세요.

[내담자 사주 핵심 요약]
- 이름: ${manseryeok.birthDate.name || '내담자'} (${manseryeok.birthDate.gender === 'male' ? '남성' : '여성'})
- 일주: ${manseryeok.ilju.hangul} (${manseryeok.ilju.traits})
- 일간 본원: ${manseryeok.ilgan.title}
- 오행 분포: 목(${manseryeok.ohaengCounts.목}), 화(${manseryeok.ohaengCounts.화}), 토(${manseryeok.ohaengCounts.토}), 금(${manseryeok.ohaengCounts.금}), 수(${manseryeok.ohaengCounts.수})
- 부족한 기운: ${manseryeok.lackingOhaeng.join(', ') || '없음'}
- 올해 운세 흐름: ${report.currentYearFortune.title} - ${report.currentYearFortune.flow}

[답변 원칙]
1. 단순한 길흉화복 예언보다는 내담자의 기운을 어떻게 다스리고 실생활에서 어떻게 행동해야 하는지 구체적인 심리적·처세술적 개운 조언을 제공하세요.
2. 따뜻한 사주 명리학자 어투를 일관되게 유지하세요 ("~한 기운이 깃들어 있답니다", "~해보시는 것을 권해드려요").
3. 답변 길이는 핵심을 담아 3~5문단 내외로 읽기 편하게 구성하세요.
`;

    // 이전 대화 기록 컨텍스트 구성
    const conversationContext = history
      .slice(-6)
      .map((m) => `${m.role === 'user' ? '내담자' : '사주도사'}: ${m.content}`)
      .join('\n');

    const prompt = `
${conversationContext ? `[이전 대화]\n${conversationContext}\n` : ''}
내담자의 새로운 질문: "${newMessage}"

위 질문에 대해 내담자의 사주 원국과 오행을 깊이 고려하여 정성껏 답변해 주세요.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.75,
      },
    });

    return response.text?.trim() || '답변을 구성하는 중 일시적인 지연이 발생했습니다. 잠시 후 다시 질문해 주세요.';
  } catch (err) {
    console.error('[Saju Web] Gemini Chat Error:', err);
    return '죄송합니다. 도사님과의 연결에 일시적인 혼선이 있었습니다. 잠시 후 다시 여쭈어 보시길 바랍니다.';
  }
}
