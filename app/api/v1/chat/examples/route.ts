import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    examples: [
      {
        category: 'Suvarma',
        questions: [
          'Pomidoru nə vaxt suvarmalıyam?',
          'Nə qədər su vermək lazımdır?',
          'Damcı suvarma nədir?',
        ],
      },
      {
        category: 'Gübrələmə',
        questions: [
          'Buğdaya hansı gübrə lazımdır?',
          'NPK nədir?',
          'Nə vaxt gübrələmək lazımdır?',
        ],
      },
      {
        category: 'Xəstəlik/Zərərverici',
        questions: [
          'Yarpaqlar niyə saraldı?',
          'Fitoftora nədir?',
          'Mənənə ilə necə mübarizə aparım?',
        ],
      },
      {
        category: 'Heyvandarlıq',
        questions: [
          'İnəyi necə yemləmək lazımdır?',
          'Peyvənd vaxtları nədir?',
          'Süd azalıbsa nə edim?',
        ],
      },
      {
        category: 'Hava',
        questions: [
          'Hava çox istidir, nə edim?',
          'Şaxta olacaqsa nə edim?',
          'Yağış gözlənilir, nə edim?',
        ],
      },
    ],
  });
}
