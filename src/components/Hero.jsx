import React from 'react';
import Spline from '@splinetool/react-spline';
import { ShieldCheck, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Soft gradient overlay to improve text readability; doesn't block Spline */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(17,24,39,0.15),rgba(2,6,23,0.9))]" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center text-white">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm backdrop-blur">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>India Tax Advisor • Sections 80C, 80D, HRA & more</span>
        </div>

        <h1 className="font-geist text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
          ClearTaxers‑Ai — Your Strategic AI Tax Guru
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
          Upload Form 16, ask “what-if” questions, and get confident, compliant advice grounded in Indian Income Tax law.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#upload"
            className="inline-flex items-center justify-center rounded-md bg-indigo-500 px-5 py-3 text-sm font-medium text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            Start with your documents
          </a>
          <a
            href="#scenarios"
            className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            Try a what‑if scenario
          </a>
        </div>

        <div className="mt-10 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
          <Sparkles className="h-4 w-4 text-violet-300" />
          <span>Formal, proactive guidance grounded in specific sections</span>
        </div>
      </div>
    </section>
  );
}
