import React, { useState } from 'react';
import { AppRole } from '../../types';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/api';

interface LoginViewProps {
  onLogin: (role: AppRole, userEmail?: string) => void;
}

// Fallback user credentials and role mapping for offline/standalone mode
const USER_DATABASE: Record<string, { role: AppRole; name: string }> = {
  'admin@wenspeed.my.id': { role: 'admin', name: 'Workshop Chief Admin' },
  'admin': { role: 'admin', name: 'Master Administrator' },
  'bambang.wijaya@wenspeed.my.id': { role: 'admin', name: 'Bambang Wijaya (Chief Tuner)' },
  'rian.pratama@wenspeed.my.id': { role: 'admin', name: 'Rian Pratama (Dyno Specialist)' },
  'aldi.racer99@wenspeed.my.id': { role: 'racer', name: 'Aldi Taher Prasetyo' },
  'racer': { role: 'racer', name: 'Racer Demo Account' },
  'reza.zx25@gmail.com': { role: 'racer', name: 'Reza Fahlevi' },
  'dimas.cbr@yahoo.com': { role: 'racer', name: 'Dimas Setiawan' },
  'fajar.vespa@gmail.com': { role: 'racer', name: 'Fajar Nugraha' },
};

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@wenspeed.my.id');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const trimmed = email.trim().toLowerCase();

    try {
      // 1. Send authentication request to NestJS Backend API (/api/v1/auth/login)
      const res = await apiClient.post('/auth/login', {
        email: trimmed,
        password: password,
      });

      if (res && res.token) {
        // Save JWT access token & user profile to localStorage
        localStorage.setItem('access_token', res.token);
        if (res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
        }

        setIsLoading(false);
        const userRole: AppRole = res.user?.role === 'admin' ? 'admin' : 'racer';
        onLogin(userRole, res.user?.email || trimmed);
        return;
      } else {
        throw new Error('Respon login dari server tidak valid');
      }
    } catch (err: any) {
      setIsLoading(false);
      let rawError = err?.message || '';

      // Strip redundant prefix if present
      rawError = rawError.replace(/^kredensial tidak valid:\s*/i, '').trim();

      // Check if error is due to backend offline / unreachable
      if (
        rawError.toLowerCase().includes('failed to fetch') ||
        rawError.toLowerCase().includes('network') ||
        rawError.toLowerCase().includes('connection') ||
        rawError.toLowerCase().includes('refused') ||
        rawError.toLowerCase().includes('load failed')
      ) {
        setErrorMsg(
          'Koneksi Gagal: Server Backend (http://localhost:5001) tidak aktif atau tidak dapat dijangkau. Pastikan backend sudah dijalankan dengan "npm run dev:backend".'
        );
        return;
      }

      // Display backend authentication error (e.g. "Password yang Anda masukkan salah" / "Email tidak terdaftar")
      setErrorMsg(rawError || 'Login gagal. Periksa kembali email dan password Anda.');
    }
  };

  const handleQuickFill = (targetEmail: string) => {
    setEmail(targetEmail);
    setPassword('password123');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#131313] flex flex-col justify-between text-[#e5e2e1] font-sans select-none">
      {/* Top Bar matching Velocity Precision */}
      <header className="border-b border-[#1E293B] bg-[#131313]/95 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#FFE01B] flex items-center justify-center text-black font-black text-sm shadow-md shadow-[#FFE01B]/20">
            WS
          </div>
          <div>
            <h1 className="text-base font-black tracking-wider text-[#e5e2e1] font-display uppercase">
              WE N SPEED
            </h1>
            <p className="text-[10px] font-mono text-[#cec6ab] tracking-tight">
              Precision Workshop & Racing Telemetry CMS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#cec6ab] bg-[#1c1b1b] px-3 py-1.5 rounded border border-[#1E293B]">
          <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
          <span className="text-[#CCFF00] font-semibold">System Online</span>
          <span className="text-slate-600">•</span>
          <span>v2.4.0</span>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Main Form Card */}
          <div className="bg-[#1c1b1b] rounded p-7 sm:p-8 shadow-2xl border border-[#1E293B] text-[#e5e2e1]">
            <div className="border-b border-[#1E293B] pb-5 mb-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#FFE01B]/10 border border-[#FFE01B]/30 text-[#FFE01B] font-mono text-[11px] font-bold uppercase mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                Workshop Single Sign-On
              </div>
              <h2 className="text-xl font-bold text-[#e5e2e1] tracking-tight font-display uppercase">
                Sign In to Account
              </h2>
              <p className="text-xs text-[#cec6ab] mt-1 font-sans">
                Enter your credentials. The system will automatically direct you to your authorized dashboard.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#cec6ab] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#cec6ab]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@wenspeed.my.id"
                    className="w-full bg-[#131313] border border-[#1E293B] rounded pl-10 pr-3.5 py-2.5 text-xs font-mono text-[#e5e2e1] placeholder-slate-500 focus:outline-none focus:border-[#FFE01B] transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-mono font-bold uppercase text-[#cec6ab]">
                    Password
                  </label>
                  <a href="#help" onClick={(e) => { e.preventDefault(); alert("Silakan hubungi admin workshop untuk reset sandi."); }} className="text-[11px] text-[#FFE01B] hover:underline font-mono">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#cec6ab]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#131313] border border-[#1E293B] rounded pl-10 pr-3.5 py-2.5 text-xs font-mono text-[#e5e2e1] placeholder-slate-500 focus:outline-none focus:border-[#FFE01B] transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FFE01B] hover:bg-[#ffe241] active:bg-[#e2c600] disabled:opacity-50 text-black font-mono font-bold text-xs py-3 px-4 rounded tracking-wider uppercase transition shadow-md shadow-[#FFE01B]/20 flex items-center justify-center gap-2 mt-3 cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Test Accounts */}
            <div className="mt-6 pt-5 border-t border-[#1E293B]">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-[#cec6ab] mb-2.5 font-bold">
                Quick Test Accounts (Auto Role Detect)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@wenspeed.my.id')}
                  className="flex items-center gap-2 p-2 rounded border border-[#1E293B] hover:border-[#FFE01B]/40 hover:bg-[#131313] text-left transition cursor-pointer group"
                >
                  <div className="w-6 h-6 rounded bg-[#FFE01B] text-black flex items-center justify-center text-[10px] font-bold font-mono">
                    AD
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-[#e5e2e1] truncate font-mono">Admin CMS</p>
                    <p className="text-[9px] text-[#cec6ab] font-mono truncate">admin@wenspeed.my.id</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('aldi.racer99@wenspeed.my.id')}
                  className="flex items-center gap-2 p-2 rounded border border-[#1E293B] hover:border-[#FFE01B]/40 hover:bg-[#131313] text-left transition cursor-pointer group"
                >
                  <div className="w-6 h-6 rounded bg-[#CCFF00] text-black flex items-center justify-center text-[10px] font-bold font-mono">
                    RC
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-[#e5e2e1] truncate font-mono">Racer Portal</p>
                    <p className="text-[9px] text-[#cec6ab] font-mono truncate">aldi.racer99@...</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1E293B] px-6 py-4 text-center text-xs font-mono text-[#cec6ab] flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>&copy; {new Date().getFullYear()} WE N SPEED Precision Engineering. All rights reserved.</p>
        <div className="flex items-center gap-4 text-[#cec6ab]">
          <span className="text-[#CCFF00]">Workshop Dyno Link: ACTIVE</span>
          <span>•</span>
          <span>Security Protocol TLS 1.3</span>
        </div>
      </footer>
    </div>
  );
};
