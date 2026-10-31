import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Crown,
  ShieldCheck,
  MessageCircle,
  Mail,
  Lock,
  Sliders
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { paymentSettings, openAdminLoginModal, isAdminAuthenticated, setIsAdminMode } = useApp();

  const portalSettings = paymentSettings?.adminPortalSettings || {
    footerButtonMode: 'button',
    footerButtonLabel: 'Staff / Admin Access',
    showInHeader: true
  };

  return (
    <footer className="mt-16 border-t border-zinc-850 bg-[#07080b] text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Crown className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white font-display tracking-wider gold-gradient-text uppercase">
                LEARN TO EARN GOLD
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
              Pakistan's premier digital skills academy and transparent learn-to-earn platform. Providing practical freelance education, verified daily assessment rewards, and a legal 10% direct affiliate commission.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Legal Educational Membership Framework • SECP &amp; FIA Compliant</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Accepted Gateways
            </h4>
            <ul className="space-y-1.5 text-zinc-400 text-xs font-mono">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                JazzCash Pakistan (Instant)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Easypaisa Mobile Wallet
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                All Pakistani Banks (Raast / IBFT)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                USDT (TRC-20 &amp; BEP-20)
              </li>
            </ul>
          </div>

          {/* Official Helpline */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Helpline &amp; Support
            </h4>
            <div className="space-y-1.5 text-xs text-zinc-400">
              <p className="flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp: {paymentSettings.jazzcash.accountNumber}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>support@learntoearngold.pk</span>
              </p>
              <p className="text-[11px] text-zinc-500 font-mono pt-1">
                Hours: 10:00 AM - 10:00 PM PKT
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal disclaimer with customizable admin access */}
        <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
          <div className="flex items-center gap-2">
            <p>
              © 2026 Learn to Earn Gold Academy Pvt Ltd. All rights reserved.
            </p>
            {/* Discreet stealth trigger if configured as 'discreet' */}
            {portalSettings.footerButtonMode === 'discreet' && !isAdminAuthenticated && (
              <button
                onClick={openAdminLoginModal}
                className="opacity-30 hover:opacity-100 text-zinc-400 hover:text-red-400 transition-opacity p-0.5 cursor-pointer ml-1"
                title="Admin Security"
                aria-label="Admin Security"
              >
                <Lock className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-zinc-600">Privacy &amp; Terms</span>

            {/* Optional Custom Footer Admin Button (Only if explicitly enabled by admin in settings) */}
            {portalSettings.footerButtonMode === 'button' && !isAdminAuthenticated && (
              <button
                onClick={openAdminLoginModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10121a] hover:bg-[#181a26] text-zinc-300 hover:text-white border border-red-500/35 hover:border-red-500/60 text-xs font-mono transition-all cursor-pointer shadow-sm active:scale-95"
                title="Administrator Console Login"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                <span>{portalSettings.footerButtonLabel || 'Staff / Admin Access'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
