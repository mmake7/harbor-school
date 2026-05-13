import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "다온이 시뮬레이터",
  description: "염창동 옥상농장 운영 시스템 미니 버전",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
