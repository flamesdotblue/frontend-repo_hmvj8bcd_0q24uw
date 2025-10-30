import React, { useState } from 'react';
import { Calculator, LineChart, ArrowRight } from 'lucide-react';

export default function ScenarioModeler() {
  const [elss, setElss] = useState(50000);
  const [compareRegimes, setCompareRegimes] = useState(true);
  const [homeLoan, setHomeLoan] = useState(false);
  const [result, setResult] = useState(null);

  const runDemoEstimate = () => {
    // Non-authoritative, purely illustrative client-side feedback
    const capped80C = Math.min(Math.max(Number(elss) || 0, 0), 150000);
    const indicativeSave = Math.round(capped80C * 0.2); // illustrative
    const text = `If you invest ₹${capped80C.toLocaleString()} in ELSS, your indicative tax saving could be about ₹${indicativeSave.toLocaleString()} (assuming 20% slab).`;
    const regime = compareRegimes ? 'We will compare Old vs New regimes.' : 'Using your selected regime.';
    const hl = homeLoan ? 'Home loan benefits (Sections 24(b)/80EEA) will be considered by Chanakya.' : 'No home loan adjustments included.';
    setResult({ text, regime, hl });
  };

  return (
    <section id="scenarios" className="mx-auto max-w-6xl px-6 py-16">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-geist text-2xl font-semibold text-white">Proactive scenario modeling</h2>
            <p className="mt-1 text-sm text-slate-300">Ask “what‑if” questions and let Chanakya recompute your taxes in real time.</p>
          </div>
          <LineChart className="h-6 w-6 text-violet-300" />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <label className="text-sm text-slate-300">ELSS additional investment (₹)</label>
            <input
              type="number"
              value={elss}
              onChange={(e) => setElss(e.target.value)}
              className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400"
              min={0}
              step={1000}
            />
            <p className="mt-2 text-xs text-slate-400">Section 80C cap is ₹1,50,000.</p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <label className="text-sm text-slate-300">Compare Old vs New Regime</label>
            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={() => setCompareRegimes((v) => !v)}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm ${compareRegimes ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-200'}`}
              >
                {compareRegimes ? 'Enabled' : 'Disabled'}
              </button>
              <span className="text-xs text-slate-400">See effective difference for your bracket.</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <label className="text-sm text-slate-300">Planning a home loan next year?</label>
            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={() => setHomeLoan((v) => !v)}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm ${homeLoan ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-200'}`}
              >
                {homeLoan ? 'Yes' : 'No'}
              </button>
              <span className="text-xs text-slate-400">Affects Sections 24(b) and potentially 80EEA (conditions apply).</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <button
            onClick={runDemoEstimate}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            <Calculator className="h-4 w-4" /> Estimate impact
          </button>
          <p className="text-xs text-slate-400">Connect the AI backend to run Gemini‑powered calculations and advice.</p>
        </div>

        {result && (
          <div className="mt-6 rounded-xl border border-emerald-700/40 bg-emerald-900/20 p-4 text-emerald-200">
            <div className="flex items-start gap-3">
              <ArrowRight className="mt-0.5 h-5 w-5 flex-none" />
              <div>
                <p className="text-sm font-medium">Illustrative outcome</p>
                <p className="mt-1 text-sm">{result.text}</p>
                <p className="mt-1 text-xs opacity-90">{result.regime} {result.hl}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
