import React, { useEffect, useState } from 'react';
import { Shield, Mail, Lock, User as UserIcon, LogIn } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

export default function Login({ onAuthenticated }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mode === 'login'
            ? { email, password }
            : { email, password, name }
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || 'Request failed');
      const { token, user, expires_at } = data;
      localStorage.setItem('ctai_token', token);
      onAuthenticated({ token, user, expires_at });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-indigo-600">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-geist text-xl font-semibold">ClearTaxers‑Ai</h1>
            <p className="text-xs text-slate-400">Sign in to continue</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur">
          <div className="mb-4 flex gap-2 rounded-md bg-slate-800/60 p-1">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 rounded-md px-3 py-2 text-sm ${mode==='login' ? 'bg-slate-900 text-white' : 'text-slate-300'}`}
            >Login</button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 rounded-md px-3 py-2 text-sm ${mode==='register' ? 'bg-slate-900 text-white' : 'text-slate-300'}`}
            >Register</button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-xs text-slate-300">Name</label>
                <div className="mt-1 flex items-center gap-2 rounded-md border border-slate-700 bg-slate-950/60 px-3">
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent py-2 text-sm text-white outline-none"
                    placeholder="Your name"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="text-xs text-slate-300">Email</label>
              <div className="mt-1 flex items-center gap-2 rounded-md border border-slate-700 bg-slate-950/60 px-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent py-2 text-sm text-white outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-300">Password</label>
              <div className="mt-1 flex items-center gap-2 rounded-md border border-slate-700 bg-slate-950/60 px-3">
                <Lock className="h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent py-2 text-sm text-white outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && <p className="text-xs text-rose-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-70"
            >
              <LogIn className="h-4 w-4" /> {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
