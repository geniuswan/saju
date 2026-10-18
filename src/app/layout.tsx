import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '천기누설 (天機漏洩) - AI 맞춤형 모던 사주명리 리포트',
  description: '정통 60갑자 만세력 알고리즘과 Google Gemini AI를 결합한 차세대 사주 풀이 및 1:1 대화 상담 서비스',
  keywords: ['사주', '사주팔자', '만세력', 'AI사주', '신년운세', '오행', '천기누설', 'Gemini AI'],
  verification: {
    google: 'OAMkPNpmVxND4ut7MZb4btOjwZKyZqcL1j8qNk3AKOM',
  },
  openGraph: {
    title: '천기누설 (天機漏洩) - AI 맞춤형 모던 사주명리 리포트',
    description: '나를 이끄는 천명과 2026년 운의 흐름을 꿰뚫다. 정통 만세력 & Gemini AI 융합',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <body className="min-h-screen bg-[#090a0f] text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  );
}
