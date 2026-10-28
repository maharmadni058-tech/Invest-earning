import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, PhoneCall } from 'lucide-react';

export const FrozenAccountBanner: React.FC = () => {
  const { currentUser, paymentSettings } = useApp();

  if (currentUser.status !== 'frozen') return null;

  return (
    <div className="bg-gradient-to-r from-red-950/80 via-red-900/60 to-zinc-950 border-b border-red-500/40 px-4 py-3 text-red-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-red-100 uppercase">
                Account Temporarily Frozen / Restricted
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-900/80 text-red-200 border border-red-500/30 font-mono">
                COMPLIANCE AUDIT
              </span>
            </div>
            <p className="text-xs text-red-300/90 mt-0.5">
              {currentUser.freezeReason || 'Administrative freeze placed. Withdrawals and daily task earnings are paused.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-300">
          <span className="hidden sm:inline">Support Helpline:</span>
          <a
            href={`https://wa.me/92${paymentSettings.jazzcash.accountNumber.replace(/^0/, '')}?text=Hello%20Admin,%20my%20Learn%20to%20Earn%20Gold%20account%20(${currentUser.phone})%20is%20frozen.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Contact Admin WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
