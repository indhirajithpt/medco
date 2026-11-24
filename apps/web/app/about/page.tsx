import { Header } from '@/components/layout/header';
import { PulseLogo } from '@/components/ui/pulse-logo';
import { MedicalDisclaimer } from '@/components/safety/medical-disclaimer';
import { Database, Sparkles, ShieldCheck, Cpu } from 'lucide-react';

export const metadata = {
  title: 'About MedCo — Architecture & Methodology',
  description: 'Evidence-based healthcare architecture combining RAG, Gemini 2.5, and Supabase pgvector.',
};

export default function AboutPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-[#050505] text-[#f5f5f7] relative">
      <div className="purple-glow-ambient absolute inset-0 pointer-events-none" />
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8 relative z-10">
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <PulseLogo size="lg" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">About MedCo</h1>
            <p className="text-sm text-zinc-400">
              Retrieval-Augmented Generation (RAG) AI Healthcare Assistant
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel rounded-2xl p-5 space-y-3">
            <div className="p-2.5 rounded-xl bg-[#8b5cf6]/20 text-[#c4b5fd] w-fit">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Supabase pgvector</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Medical references from MedQuAD and vetted research datasets are converted to 384-dimensional dense vectors using <code className="text-[#c4b5fd]">all-MiniLM-L6-v2</code> and indexed for cosine distance similarity.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-5 space-y-3">
            <div className="p-2.5 rounded-xl bg-[#8b5cf6]/20 text-[#c4b5fd] w-fit">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Gemini 2.5 Flash-Lite</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Google&apos;s high-efficiency frontier LLM synthesizes ground-truth evidence into clear medical explanations, strictly bounded by grounding instructions and citations.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-5 space-y-3">
            <div className="p-2.5 rounded-xl bg-[#8b5cf6]/20 text-[#c4b5fd] w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Clinical Safety Rules</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Enforces non-diagnostic guidance, forbids unverified prescriptions, avoids speculative claims, and prioritizes immediate emergency intervention whenever critical symptoms appear.
            </p>
          </div>
        </div>

        {/* System Flow Card */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#8b5cf6]" />
            Request Pipeline & Retrieval Flow
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <li><strong className="text-zinc-100">Question Vectorization:</strong> User question is mapped to embedding coordinates using SentenceTransformers.</li>
            <li><strong className="text-zinc-100">Vector Similarity Search:</strong> FastAPI calls Supabase RPC <code className="text-[#c4b5fd]">match_medical_documents</code> to retrieve the top 5 highest-similarity medical excerpts.</li>
            <li><strong className="text-zinc-100">Evidence Framing:</strong> Retrieved passages are structured into an untrusted reference list with reference index numbers.</li>
            <li><strong className="text-zinc-100">Constrained Generation:</strong> Gemini 2.5 generates an educational answer that cites each verified claim with inline markers like <code className="text-[#c4b5fd]">[1]</code>.</li>
            <li><strong className="text-zinc-100">Interactive Source Presentation:</strong> The frontend presents citations as interactive buttons linked directly to verified evidence cards.</li>
          </ol>
        </div>

        {/* Disclaimer Card */}
        <MedicalDisclaimer variant="full" />
      </main>
    </div>
  );
}
