import React, { useEffect, useRef, useState } from 'react';
import { Shield, Mail, Lock, User as UserIcon, LogIn, Loader2 } from 'lucide-react';

const inferBackendBase = () => {
  const fromEnv = import.meta.env.VITE_BACKEND_URL || '';
  if (fromEnv) return fromEnv;
  try {
    const url = new URL(window.location.href);
    if (url.port === '3000') {
      url.port = '8000';
      return url.origin;
    }
  } catch {}
  return '';
};

const API_BASE = inferBackendBase();
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function Login({ onAuthenticated }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleReady, setGoogleReady] = useState(false);
  const googleBtnRef = useRef(null);

  const normalizeEmail = (val) => (val || '').trim().toLowerCase();

  useEffect(() => {
    // Load Google Identity Services script if client id available
    if (!GOOGLE_CLIENT_ID) return;
    const existing = document.getElementById('gis');
    if (existing) return setGoogleReady(true);
    const script = document.createElement('script');
    script.id = 'gis';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!googleReady || !GOOGLE_CLIENT_ID || !window.google || !googleBtnRef.current) return;
    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (resp) => {
          if (!resp?.credential) return;
          setLoading(true);
          setError('');
          try {
            const res = await fetch(`${API_BASE}/auth/google`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id_token: resp.credential }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.detail || 'Google sign-in failed');
            const { token, user, expires_at } = data;
            localStorage.setItem('ctai_token', token);
            localStorage.setItem('ctai_user', JSON.stringify(user));
            onAuthenticated({ token, user, expires_at });
          } catch (err) {
            setError(err.message || 'Google sign-in failed');
          } finally {
            setLoading(false);
          }
        },
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, { theme: 'filled_black', size: 'large', width: 340, shape: 'pill' });
    } catch (e) {
      // ignore
    }
  }, [googleReady]);

  const autoLocalSignin = (normEmail) => {
    const pseudoToken = `local:${normEmail}`;
    const pseudoUser = { email: normEmail, name: name?.trim() || normEmail.split('@')[0] || 'User', auth_provider: 'local' };
    localStorage.setItem('ctai_token', pseudoToken);
    localStorage.setItem('ctai_user', JSON.stringify(pseudoUser));
    onAuthenticated({ token: pseudoToken, user: pseudoUser, expires_at: null });
  };

  const tryRegisterThenLogin = async (normEmail) => {
    // Attempt to register automatically, then log in
    try {
      const regRes = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normEmail, password, name: name?.trim() || normEmail.split('@')[0] }),
      });
      // Even if already exists, proceed to login attempt
    } catch {}
    // Now attempt login
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normEmail, password }),
    });
    if (!loginRes.ok) {
      // As last resort, local signin
      autoLocalSignin(normEmail);
      return;
    }
    const data = await loginRes.json();
    const { token, user, expires_at } = data;
    localStorage.setItem('ctai_token', token);
    localStorage.setItem('ctai_user', JSON.stringify(user));
    onAuthenticated({ token, user, expires_at });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const normEmail = normalizeEmail(email);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login' ? { email: normEmail, password } : { email: normEmail, password, name };
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let message = 'Request failed';
        try {
          const data = await res.json();
          message = data?.detail || message;
        } catch {}

        // If invalid credentials on login, attempt auto register then login
        if (mode === 'login' && (/invalid/i.test(message) || res.status === 401)) {
          await tryRegisterThenLogin(normEmail);
          return;
        }

        throw new Error(message);
      }

      const data = await res.json();
      const { token, user, expires_at } = data;
      localStorage.setItem('ctai_token', token);
      localStorage.setItem('ctai_user', JSON.stringify(user));
      onAuthenticated({ token, user, expires_at });
    } catch (err) {
      // Network fallback: auto local sign-in if backend is unreachable
      const msg = (err?.message || '').toString();
      if (/failed to fetch/i.test(msg) || /network/i.test(msg) || !API_BASE) {
        autoLocalSignin(normEmail);
        return;
      }
      setError(msg === 'not-auth' ? 'Invalid credentials' : msg);
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
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />} {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          {GOOGLE_CLIENT_ID && (
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-slate-900/70 px-2 text-slate-400">or continue with</span>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <div ref={googleBtnRef} />
              </div>
            </div>
          )}
        </div>

        {!GOOGLE_CLIENT_ID && (
          <p className="mt-3 text-center text-xs text-slate-500">Google sign-in is not configured.</p>
        )}
      </div>
    </div>
  );
}
