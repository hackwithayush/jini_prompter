import type { Metadata } from "next";
import "./globals.css";

const inter = { variable: "font-inter" };
const cinzel = { variable: "font-cinzel" };
const jetbrainsMono = { variable: "font-jetbrains" };

export const metadata: Metadata = {
  title: "JINI — AI Blueprint Architect | From Idea to Execution",
  description:
    "Transform any idea into a complete, professional, executable blueprint. JINI is the world's first AI Blueprint Architect and Prompt Operating System. Generate business plans, app architectures, startup blueprints, and AI agent workflows from a single sentence.",
  keywords: [
    "AI blueprint",
    "prompt engineering",
    "startup generator",
    "business plan AI",
    "app architecture",
    "AI agents",
    "blueprint OS",
    "JINI",
  ],
  openGraph: {
    title: "JINI — AI Blueprint Architect",
    description:
      "Describe your dream. Receive the blueprint. Turn any idea into a complete execution plan.",
    type: "website",
    siteName: "JINI Intelligence",
  },
  twitter: {
    card: "summary_large_image",
    title: "JINI — AI Blueprint Architect",
    description:
      "From Idea To Execution. The world's most advanced Blueprint and Prompt Intelligence Platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${cinzel.variable} dark`}
    >
      <body className="min-h-screen bg-[#08060f] text-zinc-50 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
