import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MembershipPlan, PlanTier } from '../types';
import {
  Crown,
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Percent,
  Clock
} from 'lucide-react';

interface PlansSectionProps {
  onSelectPlanForDeposit: (planId: PlanTier) => void;
}

export const PlansSection: React.FC<PlansSectionProps> = ({ onSelectPlanForDeposit }) => {
  const { plans, currentUser, enrollPlanDirect, paymentSettings, isLoggedIn, openAuthModal, showToast } = useApp();
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<MembershipPlan | null>(null);

  const handleEnroll = (plan: MembershipPlan) => {
    if (!isLoggedIn) {
      showToast('info', 'Login Required', `Please login or register to enroll in ${plan.name}.`);
      openAuthModal('register');
      return;
    }

    // If user has enough balance in their wallet, offer direct enrollment or deposit
    if (currentUser.balancePKR >= plan.pricePKR) {
      const confirmDirect = window.confirm(
        `You have Rs ${currentUser.balancePKR.toLocaleString()} in your wallet.\nWould you like to activate ${plan.name} directly using Rs ${plan.pricePKR.toLocaleString()} from your wallet balance?`
      );
      if (confirmDirect) {
        enrollPlanDirect(plan.id);
        return;
      }
    }
    // Otherwise open deposit slip modal
    onSelectPlanForDeposit(plan.id);
  };

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-bold uppercase tracking-wider">
              Educational Memberships
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Legal &amp; Compliance Verified
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-display">
            ACADEMY MEMBERSHIP TIERS
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Unlock premium real-world digital courses, earn verified micro-task rewards, and receive an instant 10% cash commission on every referred student member.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#12141d] px-4 py-2 rounded-xl border border-amber-500/20 text-xs">
          <Percent className="w-4 h-4 text-amber-400" />
          <span className="text-zinc-300">Direct Sponsor Commission:</span>
          <strong className="text-amber-300 font-bold">10% Flat</strong>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {plans.map((plan) => {
          const isCurrent = currentUser.currentPlanId === plan.id;
          const isHigherTier =
            currentUser.currentPlanId &&
            plans.findIndex((p) => p.id === plan.id) >
              plans.findIndex((p) => p.id === currentUser.currentPlanId);

          const usdtPrice = (plan.pricePKR / (paymentSettings.usdt.exchangeRatePKR || 280)).toFixed(1);

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-2xl bg-[#12141d] p-5 border gold-card-hover transition-all duration-300 ${
                plan.popular
                  ? 'border-amber-400/80 shadow-xl shadow-amber-500/15 bg-gradient-to-b from-[#181a26] to-[#11131c]'
                  : 'border-zinc-800 hover:bg-[#151722]'
              } ${isCurrent ? 'ring-2 ring-emerald-500/60' : ''}`}
            >
              {/* Popular / Active Badge */}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-wider shadow-md">
                  Current Active Plan
                </div>
              )}
              {!isCurrent && plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-black" />
                  Most Popular Choice
                </div>
              )}

              <div>
                {/* Header info */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    {plan.badge}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {plan.durationDays} Days
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono-numbers">
                      Rs {plan.pricePKR.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    ≈ ${usdtPrice} USDT (One-time enrollment)
                  </p>
                </div>

                {/* Course Name */}
                <div className="mt-4 p-2.5 rounded-xl bg-[#090a0f] border border-zinc-800/80">
                  <p className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    Included Curriculum:
                  </p>
                  <p className="text-xs font-bold text-zinc-200 mt-1 line-clamp-1">
                    {plan.courseTitle}
                  </p>
                </div>

                {/* Daily Current Profit Highlight Box */}
                <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400 font-mono uppercase">Daily Current Profit:</span>
                    <span className="text-sm font-extrabold text-amber-300 font-mono">
                      Rs {(plan.dailyProfitPKR || plan.maxDailyEarnPKR).toLocaleString()} / day
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-emerald-400 font-mono">
                    <span>1-Click Daily Claim</span>
                    <span>Direct Wallet Payout</span>
                  </div>
                </div>

                {/* Features list */}
                <ul className="mt-4 space-y-2 text-xs text-zinc-300">
                  {plan.features.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-zinc-800/80">
                <button
                  onClick={() => handleEnroll(plan)}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    isCurrent
                      ? 'bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer'
                      : plan.popular
                      ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black shadow-lg shadow-amber-500/20 active:scale-98'
                      : 'bg-[#222533] hover:bg-amber-500 hover:text-black text-amber-300 border border-amber-500/30 active:scale-98'
                  }`}
                >
                  {isCurrent ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      Enrolled Tier (Renew)
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      {currentUser.balancePKR >= plan.pricePKR
                        ? `Instant Enroll (Rs ${plan.pricePKR})`
                        : `Pay & Enroll (Rs ${plan.pricePKR})`}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Transparency Note */}
      <div className="p-4 rounded-xl bg-[#0e1017] border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-zinc-200 font-semibold">100% Transparent Skill &amp; Referral Model</p>
            <p className="text-zinc-400 text-[11px] mt-0.5">
              No illegal fixed daily ROI promises. Earnings are tied directly to completing real educational tasks and official 10% referral affiliate sales.
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right w-full sm:w-auto">
          <span className="text-[11px] text-zinc-500 font-mono">SUPPORTED PAYMENT CHANNELS:</span>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 font-bold text-zinc-300">
            <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-800 text-red-300 text-[10px]">
              JazzCash
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-[10px]">
              Easypaisa
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800 text-blue-300 text-[10px]">
              All Banks
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800 text-amber-300 text-[10px]">
              USDT TRC-20
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
