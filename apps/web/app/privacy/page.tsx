import { Header } from '@/components/layout/header';
import { MedicalDisclaimer } from '@/components/safety/medical-disclaimer';
import { ShieldCheck, Lock, EyeOff, Server } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — MedCo',
  description: 'Data handling, healthcare privacy boundaries, and research disclosure for MedCo.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-[#050505] text-[#f5f5f7] relative">
      <div className="purple-glow-ambient absolute inset-0 pointer-events-none" />
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8 relative z-10">
        <div className="border-b border-white/5 pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-zinc-400 mt-1">Healthcare data boundaries & prototype confidentiality notice</p>
        </div>

        <div className="glass-panel rounded-2xl p-6 space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <div className="flex items-center gap-2 text-white font-semibold text-base">
            <Lock className="w-5 h-5 text-[#8b5cf6]" />
            1. In-Memory Session Storage
          </div>
          <p>
            During prototype development, MedCo maintains conversation history strictly in volatile frontend memory. Messages, questions, and responses are not written to browser localStorage, cookies, or remote persistent tracking databases.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <div className="flex items-center gap-2 text-white font-semibold text-base">
            <EyeOff className="w-5 h-5 text-[#8b5cf6]" />
            2. Medical Records & Personal Identifiable Information (PII)
          </div>
          <p>
            Users must not enter real personal health information (PHI), medical record numbers, government identification numbers, or real patient names. MedCo is designed exclusively for educational, synthetic medical inquiry.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <div className="flex items-center gap-2 text-white font-semibold text-base">
            <Server className="w-5 h-5 text-[#8b5cf6]" />
            3. AI Provider Communication
          </div>
          <p>
            When a question is submitted, the question string is sent via a secure server proxy to the local FastAPI backend. The backend retrieves matching reference passages from Supabase pgvector and submits the prompt to Google Gemini Flash-Lite. All API credentials remain server-side and are never transmitted to the browser client.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <div className="flex items-center gap-2 text-white font-semibold text-base">
            <ShieldCheck className="w-5 h-5 text-[#8b5cf6]" />
            4. Compliance Status
          </div>
          <p>
            MedCo is an educational prototype and is not certified for HIPAA compliance, GDPR medical tier compliance, or clinical deployment.
          </p>
        </div>

        <MedicalDisclaimer variant="full" />
      </main>
    </div>
  );
}
