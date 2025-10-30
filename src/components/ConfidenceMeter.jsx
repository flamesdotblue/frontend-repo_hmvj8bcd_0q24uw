import React from 'react';
import { CheckCircle2, AlertCircle, Target, CalendarClock } from 'lucide-react';

export default function ConfidenceMeter() {
  const score = 92; // illustrative static score for the demo UI

  const items = [
    {
      ok: true,
      text: 'Form 16 and 26AS are consistent (TDS matched).',
      note: 'Good to go.'
    },
    {
      ok: false,
      text: 'HRA proof pending: upload rent agreement and rent receipts.',
      note: 'To maximize compliance for HRA exemption.'
    },
    {
      ok: true,
      text: '80C investments detected (EPF/PPF).',
      note: 'Consider optimizing the remaining limit if any.'
    }
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-geist text-2xl font-semibold text-white">Audit confidence</h2>
            <p className="mt-1 text-sm text-slate-300">Live score and specific instructions to reach 100% confidence.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16">
              <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-700"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
                />
                <path
                  className="text-emerald-400"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${score}, 100`}
                  d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
                {score}%
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Confidence</p>
              <p className="text-xs text-slate-400">Consistency, completeness, and proof readiness</p>
            </div>
          </div>
        </div>

        <ul className="mt-6 grid gap-3 md:grid-cols-3">
          {items.map((it, idx) => (
            <li key={idx} className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              {it.ok ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-400" />
              ) : (
                <AlertCircle className="mt-0.5 h-5 w-5 flex-none text-amber-400" />
              )}
              <div>
                <p className="text-sm text-white">{it.text}</p>
                <p className="mt-1 text-xs text-slate-400">{it.note}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center gap-2 text-white"><Target className="h-4 w-4 text-violet-300" />
              <span className="text-sm font-medium">Next‑year action 1</span>
            </div>
            <p className="mt-2 text-xs text-slate-300">Consider increasing PPF/ELSS to fully utilize Section 80C (₹1.5L).</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center gap-2 text-white"><Target className="h-4 w-4 text-violet-300" />
              <span className="text-sm font-medium">Next‑year action 2</span>
            </div>
            <p className="mt-2 text-xs text-slate-300">Track rent receipts monthly to strengthen HRA claim; keep rental agreement updated.</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center gap-2 text-white"><CalendarClock className="h-4 w-4 text-violet-300" />
              <span className="text-sm font-medium">Review checkpoint</span>
            </div>
            <p className="mt-2 text-xs text-slate-300">Schedule a mid‑year review in Oct to rebalance investments and health insurance (80D).</p>
          </div>
        </div>
      </div>
    </section>
  );
}
