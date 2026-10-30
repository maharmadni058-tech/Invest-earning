import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Crown,
  ShieldCheck,
  Lock,
  MessageCircle,
  HelpCircle,
  Mail,
  Award
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { paymentSettings, isAdminMode, isAdminAuthenticated, openAdminLoginModal, adminLogout } = useApp();

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

        {/* Bottom copyright and legal disclaimer */}
        <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
          <p>
            <span
              onClick={openAdminLoginModal}
              className="cursor-default select-none"
              title=""
            >
              ©
            </span>{' '}
            2026 Learn to Earn Gold Academy Pvt Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {isAdminAuthenticated && (
              <>
                <button
                  onClick={() => {
                    if (isAdminMode) {
                      adminLogout();
                    } else {
                      openAdminLoginModal();
                    }
                  }}
                  className="text-red-400 hover:text-red-300 font-mono flex items-center gap-1 transition-colors text-[10px] font-bold"
                  title="Administrator Authentication"
                >
                  <Lock className="w-2.5 h-2.5" />
                  <span>{isAdminMode ? 'Exit Admin' : 'Admin Panel'}</span>
                </button>
                <span>•</span>
              </>
            )}
            <span className="text-zinc-600">Privacy &amp; Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
