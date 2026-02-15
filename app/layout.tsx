import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ワークス-S | Threads投稿自動生成ツール",
  description: "エアコンクリーニング専用のThreads投稿をAIで自動生成",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
