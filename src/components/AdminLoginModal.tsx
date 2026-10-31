import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldAlert,
  Lock,
  Mail,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2
} from 'lucide-react';

const MAX_ATTEMPTS = 5;

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginModalOpen,
    closeAdminLoginModal,
    adminLogin
  } = useApp();

  // Manual input only: strictly empty initially
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Security attempt & lockout states
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState(MAX_ATTEMPTS);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutSecondsRemaining, setLockoutSecondsRemaining] = useState(0);

  // Sync security status with server whenever modal opens
  useEffect(() => {
    if (isAdminLoginModalOpen) {
      // Clear inputs for manual security entry
      setAdminEmail('');
      setAdminPassword('');

      fetch('/api/auth/admin-status')
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setIsLocked(Boolean(data.locked));
            if (typeof data.remainingAttempts === 'number') {
              setRemainingAttempts(data.remainingAttempts);
            }
            if (typeof data.failedAttempts === 'number') {
              setFailedAttempts(data.failedAttempts);
            }
            if (typeof data.lockoutSecondsRemaining === 'number') {
              setLockoutSecondsRemaining(data.lockoutSecondsRemaining);
            }
          }
        })
        .catch(() => {
          // Keep local state if server is offline
        });
    }
  }, [isAdminLoginModalOpen]);

  // Live countdown timer for 15-minute lockout
  useEffect(() => {
    if (!isLocked || lockoutSecondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setLockoutSecondsRemaining((prev) => {
        if (prev <= 1) {
          setIsLocked(false);
          setRemainingAttempts(MAX_ATTEMPTS);
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked, lockoutSecondsRemaining]);

  if (!isAdminLoginModalOpen) return null;

  const formatCountdown = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || isSubmitting) return;

    if (!adminEmail.trim() || !adminPassword.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await adminLogin(adminEmail, adminPassword);

      if (!res.success) {
        if (res.locked) {
          setIsLocked(true);
          setRemainingAttempts(0);
          setFailedAttempts(MAX_ATTEMPTS);
          setLockoutSecondsRemaining(res.lockoutSecondsRemaining || 900);
        } else if (typeof res.remainingAttempts === 'number') {
          setRemainingAttempts(res.remainingAttempts);
          setFailedAttempts(MAX_ATTEMPTS - res.remainingAttempts);
        }
      } else {
        // Success: clear inputs
        setAdminEmail('');
        setAdminPassword('');
        setFailedAttempts(0);
        setRemainingAttempts(MAX_ATTEMPTS);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0b0c13] border-2 border-red-500/40 shadow-2xl shadow-red-950/60 overflow-hidden">
        {/* Ambient red security glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-44 h-44 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-[#08090f]">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              isLocked
                ? 'bg-rose-950/60 border-rose-500 text-rose-400'
                : 'bg-red-950/40 border-red-500/50 text-red-400'
            }`}>
              {isLocked ? (
                <ShieldAlert className="w-5 h-5 animate-bounce" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display tracking-wider flex items-center gap-2">
                <span>ADMIN CONSOLE</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-mono border border-red-500/30">
                  SECURE WEB
                </span>
              </h3>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">
                Manual Authentication Only
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

        {/* Security Lockout Banner OR Attempts Bar */}
        {isLocked ? (
          <div className="p-4 bg-rose-950/70 border-b border-rose-500/40 text-rose-200 animate-in fade-in duration-300">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-white">
                  Security Lockout Active
                </p>
                <p className="text-[11px] text-rose-300/90 leading-relaxed">
                  5 consecutive failed attempts detected. For web protection, administrative access is temporarily locked.
                </p>
                <div className="flex items-center gap-1.5 pt-1 text-xs font-mono font-bold text-amber-300">
                  <Clock className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Cooldown timer: {formatCountdown(lockoutSecondsRemaining)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-5 py-3 bg-[#0d0f18] border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-mono text-zinc-300">
                Attempt Protection:
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: MAX_ATTEMPTS }).map((_, idx) => {
                  const isUsed = idx < failedAttempts;
                  return (
                    <div
                      key={idx}
                      className={`w-3.5 h-1.5 rounded-sm transition-all ${
                        isUsed ? 'bg-red-500 shadow-sm shadow-red-500/50' : 'bg-emerald-500/60'
                      }`}
                      title={isUsed ? `Failed Attempt #${idx + 1}` : `Available Attempt`}
                    />
                  );
                })}
              </div>
              <span className={`text-[10px] font-mono font-bold ${
                remainingAttempts <= 2 ? 'text-red-400 font-extrabold' : 'text-zinc-400'
              }`}>
                {remainingAttempts} of {MAX_ATTEMPTS} left
              </span>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">
            Enter administrator email and master password. No automatic logins or shortcuts are permitted.
          </p>

          {/* Email input */}
          <div>
            <label className="text-xs text-zinc-300 block mb-1 font-medium font-mono">
              Admin Email / Mobile *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                disabled={isLocked || isSubmitting}
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="Enter administrator email"
                autoComplete="off"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-400 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="text-xs text-zinc-300 block mb-1 font-medium font-mono">
              Admin Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLocked || isSubmitting}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter master password"
                autoComplete="off"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-400 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                disabled={isLocked}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 disabled:opacity-50"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-[10px] text-zinc-400 font-mono flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-red-400" />
              <span>Strict 5-Attempt Lockout Policy</span>
            </span>
            <span className="text-zinc-500">15m Cooldown</span>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLocked || isSubmitting || !adminEmail || !adminPassword}
              className={`w-full py-3 px-4 rounded-xl text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                isLocked
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                  : 'bg-gradient-to-r from-red-600 via-red-500 to-amber-600 hover:from-red-500 hover:to-amber-500 shadow-red-950/50 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : isLocked ? (
                <>
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Locked: Wait {formatCountdown(lockoutSecondsRemaining)}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate Admin</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
