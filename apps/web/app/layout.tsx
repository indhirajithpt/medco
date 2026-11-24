import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ChatProvider } from '@/providers/chat-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MedCo — AI Healthcare Assistant',
  description: 'Evidence-based healthcare information assistant powered by RAG and Supabase pgvector.',
  icons: {
    icon: '/favicon.ico',
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
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-[#050505] text-[#f5f5f7]">
          <ChatProvider>
            {children}
          </ChatProvider>
        </body>
      </html>
    );
  }
