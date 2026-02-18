/**
 * Gemini Chatbot - AI-powered agricultural assistant
 * Port of Python gemini_engine.py using @google/generative-ai Node.js SDK
 */

import { GoogleGenerativeAI, ChatSession } from '@google/generative-ai';

const SYSTEM_PROMPT = `Sən AgriAdvisor adlı kənd təsərrüfatı məsləhətçisisən. Azərbaycan fermerlərinin kənd təsərrüfatı ilə bağlı suallarına Azərbaycan dilində cavab verirsən.

Sənin biliklərin:
- Suvarma: vaxt, miqdar, üsullar (damcı, şırım, yağmurlama)
- Gübrələmə: NPK, üzvi gübrələr, normalar, vaxtlar
- Xəstəliklər və zərərvericilər: diaqnoz, müalicə, profilaktika
- Hava şəraiti: isti, soyuq, yağış zamanı tədbirlər
- Heyvandarlıq: yemləmə, sağlamlıq, peyvənd
- Yığım: vaxtlar, üsullar

Azərbaycan iqlimi və kənd təsərrüfatı şəraitini nəzərə al.

QAYDALAR:
✅ Həmişə Azərbaycan dilində cavab ver
✅ Praktik, konkret məsləhətlər ver - QISA və AYDIN
✅ Rəqəmlər və normalar göstər (məs: "Pomidora gündə 5-10 L su")
✅ Emoji istifadə et (🌾 🍅 💧 ✅)
✅ Hava şəraiti və regionu nəzərə al
✅ Əgər dəqiq cavab bilmirsənsə, ümumi məlumat ver

⚠️ ÇOX VACIB FORMATLAŞDIRMA QAYDALARI:
❌ HEÇ VAXT cədvəl (table) istifadə etmə!
❌ HEÇ VAXT | simvolu ilə cədvəl yaratma!
✅ Yalnız bullet point siyahılardan istifadə et
✅ Qısa, aydın, oxunaqlı format
✅ Maksimum 5-6 bullet point

CAVAB FORMATI (QISA):
1. Başlıq (emoji + maksimum 5 söz)
2. Qısa giriş (1 cümlə)
3. Əsas məlumat (3-5 bullet point, CƏDVƏL YOX!)
4. Konkret rəqəmlər (2-3 nümunə, bullet point ilə)
5. 1-2 praktik tövsiyə
6. 1 vacib xəbərdarlıq (⚠️)

Uzun cavabdan çəkin! Qısa, dəqiq, faydalı ol!
Fermerə dost, peşəkar və faydalı ol!`;

// Module-level cache for sessions — same Lambda instance reuse
const sessions = new Map<string, ChatSession>();
let _model: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null;

function getModel() {
  if (_model) return _model;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set');

  const genAI = new GoogleGenerativeAI(apiKey);
  _model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 1500,
    },
  });

  return _model;
}

function getOrCreateSession(sessionId?: string): ChatSession {
  if (sessionId && sessions.has(sessionId)) {
    return sessions.get(sessionId)!;
  }

  const chat = getModel().startChat();
  if (sessionId) sessions.set(sessionId, chat);
  return chat;
}

function generateQuickReplies(userMessage: string): string[] {
  const msg = userMessage.toLowerCase();

  if (/suvar|su|nəmlik/.test(msg)) {
    return ['💧 Nə qədər su?', '⏰ Nə vaxt suvarım?', '🌊 Hansı üsul?'];
  }
  if (/gübrə|npk|azot/.test(msg)) {
    return ['🌿 Hansı gübrə?', '⚖️ Nə qədər?', '📅 Nə vaxt?'];
  }
  if (/xəstə|zərər|böcək|saral/.test(msg)) {
    return ['🐛 Nə xəstəlikdir?', '💊 Müalicə?', '🛡️ Qoruma?'];
  }
  if (/hava|isti|soyuq|yağış/.test(msg)) {
    return ['🌡️ İsti hava', '❄️ Soyuq hava', '🌧️ Yağış'];
  }
  if (/heyvan|inək|qoyun|yem/.test(msg)) {
    return ['🐄 Yemləmə', '💉 Peyvənd', '🩺 Sağlamlıq'];
  }

  return ['📋 Tövsiyə al', '❓ Kömək', '🌾 Başqa sual'];
}

export async function chat(
  userMessage: string,
  sessionId?: string
): Promise<{ response: string; quick_replies: string[] }> {
  try {
    const session = getOrCreateSession(sessionId);
    const result = await session.sendMessage(userMessage);
    const responseText = result.response.text();

    return {
      response: responseText,
      quick_replies: generateQuickReplies(userMessage),
    };
  } catch (error) {
    return {
      response: `Bağışlayın, texniki xəta baş verdi. Zəhmət olmasa bir az sonra yenidən cəhd edin.\n\nXəta: ${String(error)}`,
      quick_replies: ['🔄 Yenidən cəhd et', '🏠 Ana səhifə'],
    };
  }
}

export function resetSession(sessionId: string): void {
  sessions.delete(sessionId);
}

export function getSessionCount(): number {
  return sessions.size;
}
