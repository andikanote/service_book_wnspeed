import React, { useState } from 'react';
import { AppRole } from '../../types';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/api';

interface LoginViewProps {
  onLogin: (role: AppRole, userEmail?: string) => void;
}

// Fallback user credentials and role mapping for offline/standalone mode
const USER_DATABASE: Record<string, { role: AppRole; name: string }> = {
  'admin@artnspeed.id': { role: 'admin', name: 'Workshop Chief Admin' },
  'admin': { role: 'admin', name: 'Master Administrator' },
  'bambang.wijaya@artnspeed.id': { role: 'admin', name: 'Bambang Wijaya (Chief Tuner)' },
  'rian.pratama@artnspeed.id': { role: 'admin', name: 'Rian Pratama (Dyno Specialist)' },
  'aldi.racer99@artnspeed.id': { role: 'racer', name: 'Aldi Taher Prasetyo' },
  'racer': { role: 'racer', name: 'Racer Demo Account' },
  'reza.zx25@gmail.com': { role: 'racer', name: 'Reza Fahlevi' },
  'dimas.cbr@yahoo.com': { role: 'racer', name: 'Dimas Setiawan' },
  'fajar.vespa@gmail.com': { role: 'racer', name: 'Fajar Nugraha' },
};

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('admin@artnspeed.id');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const trimmed = identifier.trim().toLowerCase();

    try {
      // 1. Try real NestJS backend API call
      const res = await apiClient.post('/auth/login', {
        identifier: trimmed,
        password: password,
      });

      if (res && res.token) {
        localStorage.setItem('access_token', res.token);
        setIsLoading(false);
        onLogin(res.user?.role || 'admin', res.user?.email || trimmed);
        return;
      }
    } catch (err) {
      console.warn('Backend API connection not reachable, falling back to local auto-detect:', err);
    }

    // 2. Fallback logic if backend server is not running yet
    setTimeout(() => {
      let detectedRole: AppRole = 'racer';

      if (USER_DATABASE[trimmed]) {
        detectedRole = USER_DATABASE[trimmed].role;
      } else if (trimmed.includes('admin') || trimmed.includes('staff') || trimmed.endsWith('@artnspeed.id')) {
        detectedRole = 'admin';
      } else {
        detectedRole = 'racer';
      }

      setIsLoading(false);
      onLogin(detectedRole, trimmed);
    }, 350);
  };

  const handleQuickFill = (email: string) => {
    setIdentifier(email);
    setPassword('password123');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col justify-between text-slate-200 select-none">
      {/* Top Bar matching CMS Header */}
      <header className="border-b border-slate-800 bg-[#0f172a]/95 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-600/30">
            AS
          </div>
          <div>
            <h1 className="text-base font-black tracking-wider text-white font-brand uppercase">
              ART N SPEED
            </h1>
            <p className="text-[10px] font-mono text-slate-400 tracking-tight">
              Precision Workshop & Racing Telemetry CMS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/60">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold">System Online</span>
          <span className="text-slate-600">•</span>
          <span>v2.4.0</span>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Main Form Card */}
          <div className="bg-white rounded-2xl p-7 sm:p-8 shadow-2xl border border-slate-200 text-slate-800">
            <div className="border-b border-slate-100 pb-5 mb-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono text-[11px] font-bold uppercase mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                Workshop Single Sign-On
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Sign In to Account
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your credentials. The system will automatically direct you to your authorized dashboard.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                  Email / Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="name@artnspeed.id or username"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-3.5 py-2.5 text-xs font-mono text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700">
                    Password
                  </label>
                  <a href="#help" onClick={(e) => { e.preventDefault(); alert("Silakan hubungi admin workshop untuk reset sandi."); }} className="text-[11px] text-indigo-600 hover:underline font-mono">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-3.5 py-2.5 text-xs font-mono text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-mono font-bold text-xs py-3 px-4 rounded-lg tracking-wider uppercase transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 mt-3 cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Test Accounts */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2.5 font-bold">
                Quick Test Accounts (Auto Role Detect)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@artnspeed.id')}
                  className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition cursor-pointer group"
                >
                  <div className="w-6 h-6 rounded bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold font-mono">
                    AD
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-800 truncate font-mono">Admin CMS</p>
                    <p className="text-[9px] text-slate-400 font-mono truncate">admin@artnspeed.id</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('aldi.racer99@artnspeed.id')}
                  className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition cursor-pointer group"
                >
                  <div className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold font-mono">
                    RC
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-800 truncate font-mono">Racer Portal</p>
                    <p className="text-[9px] text-slate-400 font-mono truncate">aldi.racer99@...</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 px-6 py-4 text-center text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>&copy; {new Date().getFullYear()} ART N SPEED Precision Engineering. All rights reserved.</p>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Workshop Dyno Link: ACTIVE</span>
          <span>•</span>
          <span>Security Protocol TLS 1.3</span>
        </div>
      </footer>
    </div>
  );
};
