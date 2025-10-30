import React, { useEffect, useState } from 'react';
import Hero from './components/Hero';
import UploadSection from './components/UploadSection';
import ScenarioModeler from './components/ScenarioModeler';
import ConfidenceMeter from './components/ConfidenceMeter';
import Login from './components/Login';
import { Shield, LogOut } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

function App() {
  const [auth, setAuth] = useState({ token: null, user: null });
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ctai_token');
    if (!token) {
      setChecking(false);
      return;
    }
    // Validate token
    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('not-auth');
        const user = await res.json();
        setAuth({ token, user });
      })
      .catch(() => {
        localStorage.removeItem('ctai_token');
      })
      .finally(() => setChecking(false));
  }, []);

  const handleAuthenticated = ({ token, user }) => {
    setAuth({ token, user });
  };

  const logout = () => {
    localStorage.removeItem('ctai_token');
    setAuth({ token: null, user: null });
  };

  if (checking) return null;

  if (!auth.token) {
    return <Login onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-geist text-lg font-semibold">ClearTaxers‑Ai</span>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden gap-6 text-sm text-slate-300 sm:flex">
              <a href="#upload" className="hover:text-white">Upload</a>
              <a href="#scenarios" className="hover:text-white">Scenarios</a>
              <a href="#confidence" className="hover:text-white">Confidence</a>
            </nav>
            <div className="hidden text-sm text-slate-300 md:block">Hi, {auth.user?.name || auth.user?.email}</div>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main>
        <Hero />
        <UploadSection />
        <ScenarioModeler />
        <section id="confidence">
          <ConfidenceMeter />
        </section>
      </main>

      <footer className="border-t border-white/10 bg-slate-950/80 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-xs text-slate-400">
          <p>
            Guidance is informational and grounded in Indian Income Tax sections. Connect the AI backend to enable document intelligence and personalized strategies.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
