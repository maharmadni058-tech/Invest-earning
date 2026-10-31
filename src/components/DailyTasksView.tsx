import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PlanTier, MembershipPlan } from '../types';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  TrendingUp,
  AlertCircle,
  Crown,
  Lock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Wallet
} from 'lucide-react';

interface DailyTasksViewProps {
  onOpenDeposit: () => void;
  setActiveTab: (tab: string) => void;
}

export const DailyTasksView: React.FC<DailyTasksViewProps> = ({
  onOpenDeposit,
  setActiveTab
}) => {
  const {
    currentUser,
    plans,
    claimDailyProfit,
    isLoggedIn,
    openAuthModal,
    showToast
  } = useApp();

  const [isClaiming, setIsClaiming] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate live countdown until midnight PKT (Pakistan Standard Time, UTC+5)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // Next midnight in PKT (UTC+5)
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diffMs = tomorrow.getTime() - now.getTime();
      if (diffMs <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const totalSecs = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSecs / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = totalSecs % 60;
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentPlan = plans.find((p) => p.id === currentUser.currentPlanId);
  const todayStr = new Date().toISOString().split('T')[0];

  // Has the user claimed today's daily profit?
  const isClaimedToday =
    Boolean(currentUser.currentPlanId) &&
    currentUser.lastTaskDate === todayStr &&
    currentUser.completedTasksToday &&
    currentUser.completedTasksToday.includes('daily_profit_claim');

  const dailyProfitAmount = currentPlan
    ? currentPlan.dailyProfitPKR || currentPlan.maxDailyEarnPKR || currentPlan.rewardPerTaskPKR
    : 0;

  const handleClaimProfit = () => {
    if (!isLoggedIn) {
      showToast('warning', 'Login Required', 'Please sign in to claim your daily current profit.');
      openAuthModal('login');
      return;
    }

    if (!currentUser.currentPlanId) {
      showToast('warning', 'No Active Plan', 'Please activate a membership payment plan to claim daily profit.');
      setActiveTab('plans');
      return;
    }

    if (currentUser.status === 'frozen') {
      showToast('error', 'Account Frozen', 'Your account is restricted. Contact support.');
      return;
    }

    setIsClaiming(true);

    setTimeout(() => {
      const res = claimDailyProfit();
      setIsClaiming(false);

      if (res.success) {
        // Fire celebration confetti!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e5b842', '#f59e0b', '#10b981', '#ffffff']
        });
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#171924] via-[#12141e] to-[#0c0d12] border border-amber-500/35 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-bold uppercase tracking-wider">
              Daily Profit Task System
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Valid Plan Verification
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-display">
            DAILY CURRENT PROFIT CLAIM
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl leading-relaxed">
            Claim your plan's daily current profit every 24 hours. Instant credited directly to your Gold Wallet balance for cashout via JazzCash, Easypaisa, Bank, or USDT.
          </p>
        </div>

        {/* Live Reset Timer Badge */}
        <div className="bg-[#0b0c10] px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-zinc-800 text-center w-full md:w-auto md:min-w-[190px]">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono block">
            Next Daily Reset (PKT)
          </span>
          <div className="text-2xl font-mono font-extrabold text-amber-300 mt-1 tracking-wider">
            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
            Resets Daily at 12:00 AM Midnight
          </p>
        </div>
      </div>

      {/* CASE 1: USER HAS AN ACTIVATED PAYMENT PLAN */}
      {currentPlan ? (
        <div className="space-y-6">
          {/* Active Plan Daily Task Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c1e2b] via-[#12141f] to-[#0a0b10] border-2 border-amber-500/50 p-4 sm:p-8 shadow-2xl">
            {/* Ambient Gold Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-[1px] shadow-lg shadow-amber-500/20 shrink-0">
                  <div className="w-full h-full bg-[#0d0e15] rounded-2xl flex items-center justify-center">
                    <Crown className="w-7 h-7 text-amber-400" />
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Activated Payment Plan
                    </span>
                    <span className="text-xs text-zinc-500">•</span>
                    <span className="text-xs text-emerald-400 font-mono">100% Active</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-display mt-0.5 truncate">
                    {currentPlan.name}
                  </h2>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    Enrollment Value: Rs {currentPlan.pricePKR.toLocaleString()} • Valid till {currentUser.planExpiryDate || 'Active'}
                  </p>
                </div>
              </div>

              {/* Daily Current Profit Value Box */}
              <div className="bg-[#090a10] px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl border border-amber-500/30 text-left md:text-right w-full md:w-auto md:min-w-[200px]">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono block">
                  Today's Current Profit
                </span>
                <div className="text-3xl font-extrabold text-amber-300 font-mono mt-0.5">
                  Rs {dailyProfitAmount.toLocaleString()}
                  <span className="text-xs text-zinc-400 font-normal"> / day</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">
                  Guaranteed Plan Task Reward
                </span>
              </div>
            </div>

            {/* Daily Task Claim Action Area */}
            <div className="relative z-10 pt-6">
              {!isClaimedToday ? (
                /* READY TO CLAIM TODAY */
                <div className="rounded-2xl bg-[#090b10] border border-amber-500/30 p-4 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono">
                      <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
                      <span>Valid Task Ready for Claim</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Claim Your Today's Profit: Rs {dailyProfitAmount.toLocaleString()} PKR
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-lg leading-relaxed">
                      Tap the button below to complete today's plan check-in and immediately credit{' '}
                      <strong className="text-amber-300 font-mono">Rs {dailyProfitAmount.toLocaleString()} PKR</strong> directly to your available balance.
                    </p>
                  </div>

                  <button
                    onClick={handleClaimProfit}
                    disabled={isClaiming}
                    className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Zap className="w-5 h-5 fill-black" />
                    <span>
                      {isClaiming
                        ? 'Verifying & Claiming...'
                        : `Claim Daily Profit (Rs ${dailyProfitAmount.toLocaleString()})`}
                    </span>
                  </button>
                </div>
              ) : (
                /* ALREADY CLAIMED TODAY */
                <div className="rounded-2xl bg-emerald-950/30 border-2 border-emerald-500/40 p-4 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold font-mono uppercase">
                          Claimed for Today
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">{todayStr}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                        Today's Profit Successfully Credited (+Rs {dailyProfitAmount.toLocaleString()} PKR)
                      </h3>
                      <p className="text-xs text-zinc-300/80 mt-0.5">
                        Your daily profit is sitting safely in your Gold Wallet. You can withdraw anytime via JazzCash or Easypaisa.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                      onClick={() => setActiveTab('wallet')}
                      className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors font-mono"
                    >
                      <Wallet className="w-4 h-4 text-amber-400" />
                      <span>View Wallet</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Metrics Footer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-zinc-800/80 text-xs">
              <div className="p-3 rounded-xl bg-[#0b0d13] border border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase font-mono block">Wallet Balance</span>
                <span className="text-sm font-bold text-amber-300 font-mono mt-0.5 block">
                  Rs {currentUser.balancePKR.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0b0d13] border border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase font-mono block">Total Earned</span>
                <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5 block">
                  Rs {currentUser.totalEarnedPKR.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0b0d13] border border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase font-mono block">Daily Profit Rate</span>
                <span className="text-sm font-bold text-amber-400 font-mono mt-0.5 block">
                  Rs {dailyProfitAmount} / day
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0b0d13] border border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase font-mono block">Upgrade Tier</span>
                <button
                  onClick={() => setActiveTab('plans')}
                  className="text-xs text-amber-400 font-bold hover:underline flex items-center gap-1 mt-0.5"
                >
                  <span>Higher Daily Profit</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* CASE 2: USER DOES NOT HAVE AN ACTIVATED PAYMENT PLAN */
        <div className="space-y-6">
          {/* Warning Banner */}
          <div className="p-6 rounded-3xl bg-[#141012] border-2 border-amber-500/40 flex flex-col md:flex-row items-center justify-between gap-5 shadow-xl">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Payment Plan Activation Required to Claim Daily Profit
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                  You currently have no active membership. Activate any of the verified payment plans below to unlock your guaranteed daily current profit claims.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('plans')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider flex-shrink-0 shadow-lg shadow-amber-500/20 hover:from-amber-300 hover:to-amber-500 transition-all"
            >
              Select Payment Plan
            </button>
          </div>

          {/* All 7 Payment Plans & Their Daily Current Profit Rates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>OFFICIAL PAYMENT PLANS &amp; DAILY CURRENT PROFIT RATES</span>
              </h2>
              <span className="text-xs text-zinc-400 font-mono">100% SECP &amp; Legal</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {plans.map((plan) => {
                const dailyProfit = plan.dailyProfitPKR || plan.maxDailyEarnPKR || plan.rewardPerTaskPKR;

                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl bg-[#12141f] border p-5 flex flex-col justify-between transition-all ${
                      plan.popular
                        ? 'border-amber-400 shadow-lg shadow-amber-500/10'
                        : 'border-zinc-800 hover:border-amber-500/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                          {plan.badge}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {plan.durationDays} Days
                        </span>
                      </div>

                      {/* Plan Activation Price */}
                      <div className="mb-3">
                        <span className="text-[10px] text-zinc-400 uppercase font-mono block">
                          Activation Fee
                        </span>
                        <div className="text-xl font-extrabold text-white font-mono">
                          Rs {plan.pricePKR.toLocaleString()}
                        </div>
                      </div>

                      {/* Daily Current Profit Highlight Box */}
                      <div className="p-3 rounded-xl bg-[#090b12] border border-amber-500/30 mb-3">
                        <span className="text-[10px] text-zinc-400 uppercase font-mono block">
                          Daily Current Profit:
                        </span>
                        <div className="text-xl font-extrabold text-amber-300 font-mono mt-0.5">
                          Rs {dailyProfit.toLocaleString()}
                          <span className="text-xs text-zinc-400 font-normal"> / day</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          Instant Daily Task Claim
                        </span>
                      </div>

                      <p className="text-xs text-zinc-400 line-clamp-2">
                        Includes {plan.courseTitle} and 10% direct sponsor rewards.
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-zinc-800">
                      <button
                        onClick={() => {
                          setActiveTab('plans');
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-amber-500 hover:text-black text-amber-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Activate Plan (Rs {plan.pricePKR.toLocaleString()})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
