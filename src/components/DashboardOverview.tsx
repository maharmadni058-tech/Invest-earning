import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Crown,
  Copy,
  Check,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle,
  Share2,
  BookOpen,
  Award,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface DashboardOverviewProps {
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  setActiveTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onOpenDeposit,
  onOpenWithdraw,
  setActiveTab
}) => {
  const { currentUser, plans, paymentSettings, tasks, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  const currentPlan = plans.find((p) => p.id === currentUser.currentPlanId);
  const dailyTasksCount = currentPlan?.dailyTasksCount || 3;
  const completedTodayCount = currentUser.completedTasksToday?.length || 0;
  const taskProgressPct = Math.min(100, Math.round((completedTodayCount / dailyTasksCount) * 100));

  const usdtEquiv = (currentUser.balancePKR / (paymentSettings.usdt.exchangeRatePKR || 280)).toFixed(2);

  const handleCopyRef = () => {
    const inviteUrl = `${window.location.origin}/?ref=${currentUser.referralCode}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    showToast('success', 'Referral Link Copied!', 'Share this link to earn 10% instant commission on member enrollments.');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* VIP Gold Card & Quick Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Luxury Gold VIP Membership Card */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1b1c24] via-[#12131a] to-[#0a0b0e] p-6 sm:p-7 border border-amber-500/30 shadow-2xl">
          {/* Subtle gold metallic light sheen */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
            {/* Card Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={currentUser.fullName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/50 shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-500 text-black">
                    <Crown className="w-3 h-3 fill-black" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide font-display">
                      {currentUser.fullName}
                    </h2>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono flex items-center gap-1.5 mt-0.5">
                    <span>{currentUser.phone}</span>
                    <span className="text-zinc-600">•</span>
                    <span>Member since {currentUser.joinedDate}</span>
                  </p>
                </div>
              </div>

              {/* Tier Badge */}
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-400/10 border border-amber-500/40 text-amber-300 font-bold text-xs tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {currentPlan ? currentPlan.badge : 'No Active Plan'}
                </span>
                {currentUser.planExpiryDate && (
                  <p className="text-[10px] text-zinc-400 font-mono mt-1">
                    Valid till: {currentUser.planExpiryDate}
                  </p>
                )}
              </div>
            </div>

            {/* Wallet Balances Display */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/80">
              <div>
                <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono">
                  Available Balance
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold gold-gradient-text font-mono-numbers">
                    Rs {currentUser.balancePKR.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  ≈ ${usdtEquiv} USDT
                </p>
              </div>

              <div>
                <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono">
                  Total Earned
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono-numbers">
                    Rs {currentUser.totalEarnedPKR.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Tasks + Referrals
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono">
                  10% Referral Bonus
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl sm:text-2xl font-bold text-amber-400 font-mono-numbers">
                    Rs {currentUser.referralEarningsPKR.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Direct network payouts
                </p>
              </div>
            </div>

            {/* Referral Code Quick Copy Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d0f15] p-3 rounded-xl border border-zinc-800/80">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-zinc-300">Your Invite Code:</span>
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {currentUser.referralCode}
                </span>
              </div>
              <button
                onClick={handleCopyRef}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy 10% Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Daily Tasks & Quick Status Card */}
        <div className="rounded-2xl bg-[#12141c] p-6 border border-zinc-800 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                    Today's Tasks
                  </h3>
                  <p className="text-xs text-zinc-400">Skill verification &amp; rewards</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                {completedTodayCount} / {dailyTasksCount}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Completion Status</span>
                <span className="font-mono text-amber-300">{taskProgressPct}%</span>
              </div>
              <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
                  style={{ width: `${taskProgressPct}%` }}
                />
              </div>
            </div>

            {/* Quick Task Info */}
            <div className="mt-4 p-3 rounded-xl bg-[#0b0c10] border border-zinc-800/80 text-xs text-zinc-300 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-400">Task Reward Rate:</span>
                <span className="font-semibold text-amber-300 font-mono">
                  Rs {currentPlan?.rewardPerTaskPKR || 15} / task
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Max Daily Potential:</span>
                <span className="font-semibold text-emerald-400 font-mono">
                  Rs {currentPlan?.maxDailyEarnPKR || 45} / day
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('tasks')}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 transition-transform active:scale-98"
            >
              <CheckCircle className="w-4 h-4" />
              Complete Tasks &amp; Earn
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className="w-full py-2 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              Access Enrolled Courses
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={onOpenDeposit}
          className="flex items-center gap-3 p-4 rounded-xl bg-[#13151e] hover:bg-[#1a1d2b] border border-zinc-800 hover:border-amber-500/40 transition-all text-left group"
        >
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
            <ArrowDownToLine className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
              Deposit / Upgrade
            </p>
            <p className="text-[11px] text-zinc-400">JazzCash, EP, Bank, USDT</p>
          </div>
        </button>

        <button
          onClick={onOpenWithdraw}
          className="flex items-center gap-3 p-4 rounded-xl bg-[#13151e] hover:bg-[#1a1d2b] border border-zinc-800 hover:border-amber-500/40 transition-all text-left group"
        >
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
            <ArrowUpFromLine className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
              Request Withdrawal
            </p>
            <p className="text-[11px] text-zinc-400">Direct to Pakistani Account</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('referrals')}
          className="flex items-center gap-3 p-4 rounded-xl bg-[#13151e] hover:bg-[#1a1d2b] border border-zinc-800 hover:border-amber-500/40 transition-all text-left group"
        >
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
              10% Referral System
            </p>
            <p className="text-[11px] text-zinc-400">Instant Team Commissions</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className="flex items-center gap-3 p-4 rounded-xl bg-[#13151e] hover:bg-[#1a1d2b] border border-zinc-800 hover:border-amber-500/40 transition-all text-left group"
        >
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
              Transactions &amp; Logs
            </p>
            <p className="text-[11px] text-zinc-400">Complete Ledger History</p>
          </div>
        </button>
      </div>
    </div>
  );
};
