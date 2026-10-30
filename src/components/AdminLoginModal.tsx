import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldAlert,
  Lock,
  Mail,
  Eye,
  EyeOff,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginModalOpen,
    closeAdminLoginModal,
    adminLogin
  } = useApp();

  const [adminEmail, setAdminEmail] = useState('maharmadni58@gmail.com');
  const [adminPassword, setAdminPassword] = useState('MNB123@@$$&11');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      adminLogin(adminEmail, adminPassword);
      setIsSubmitting(false);
    }, 400);
  };

  const handleFillCredentials = () => {
    setAdminEmail('maharmadni58@gmail.com');
    setAdminPassword('MNB123@@$$&11');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0e1017] border-2 border-red-500/50 shadow-2xl shadow-red-950/50 overflow-hidden">
        {/* Ambient red & gold glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-[#090a10]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display tracking-wider">
                ADMIN CONSOLE LOGIN
              </h3>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">
                Super Admin Master Gateway
              </p>
            </div>
          </div>

          <button
            onClick={closeAdminLoginModal}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200">
            <p className="font-semibold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-red-400" />
              Super Admin Console Gateway
            </p>
            <p className="text-[11px] text-red-300/80 mt-0.5">
              Enter your master administrator credentials to access the user ledger, approve deposits, and update payment numbers.
            </p>
          </div>

          {/* Quick Credential Chips */}
          <div>
            <span className="text-[10px] text-zinc-400 font-mono block mb-1.5 uppercase tracking-wider">
              Quick Admin Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setAdminEmail('maharmadni58@gmail.com');
                  setAdminPassword('MNB123@@$$&11');
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all border ${
                  adminEmail === 'maharmadni58@gmail.com'
                    ? 'bg-red-900/60 border-red-500 text-white'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'
                }`}
              >
                maharmadni58@gmail.com
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdminEmail('maharmadni058@gmail.com');
                  setAdminPassword('MNB123@@$$&11');
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all border ${
                  adminEmail === 'maharmadni058@gmail.com'
                    ? 'bg-red-900/60 border-red-500 text-white'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'
                }`}
              >
                maharmadni058@gmail.com
              </button>
            </div>
          </div>

          {/* Email input */}
          <div>
            <label className="text-xs text-zinc-300 block mb-1 font-medium font-mono">
              Admin Email / Mobile *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="maharmadni58@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-400 font-mono"
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-zinc-300 font-medium font-mono">
                Admin Master Password *
              </label>
              <button
                type="button"
                onClick={handleFillCredentials}
                className="text-[10px] text-amber-400 hover:underline font-mono flex items-center gap-1"
              >
                <Zap className="w-3 h-3 fill-amber-400" />
                Reset Default Password
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="MNB123@@$$&11"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-400 font-mono"
              />
              <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Log In to Super Admin Panel</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => adminLogin('maharmadni58@gmail.com', 'MNB123@@$$&11')}
              className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 text-amber-300 hover:text-amber-200 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>⚡ 1-Click Master Admin Auto-Unlock</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
