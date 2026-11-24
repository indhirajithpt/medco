import { PulseLogo } from '@/components/ui/pulse-logo';

export default function Loading() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-[#050505] text-zinc-100">
      <div className="flex flex-col items-center space-y-4">
        <PulseLogo size="lg" animated />
        <p className="text-xs font-medium text-zinc-400 tracking-wide uppercase">
          Loading MedCo...
        </p>
      </div>
    </div>
  );
}
