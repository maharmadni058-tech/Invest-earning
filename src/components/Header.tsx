import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Crown,
  ShieldCheck,
  Wallet,
  ArrowRightLeft,
  Users,
  ChevronDown,
  Sparkles,
  Zap,
  Lock,
  Layers,
  Award,
  BookOpen,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  LogOut,
  Sliders,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { PlanTier } from '../types';

interface HeaderProps {
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDeposit,
  onOpenWithdraw,
  activeTab,
  setActiveTab
}) => {
  const {
    currentUser,
    users,
    plans,
    isAdminMode,
    setIsAdminMode,
    paymentSettings,
    transactions,
    isLoggedIn,
    openAuthModal,
    logout,
    isAdminAuthenticated,
    adminLogout,
    openAdminLoginModal,
    showToast
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pending transactions count for admin badge
  const pendingDepositsCount = transactions.filter((t) => t.type === 'deposit' && t.status === 'pending').length;
  const pendingWithdrawalsCount = transactions.filter((t) => t.type === 'withdraw' && t.status === 'pending').length;
  const totalPending = pendingDepositsCount + pendingWithdrawalsCount;

  // Current user's plan details
  const userPlan = plans.find((p) => p.id === currentUser.currentPlanId);

  // Check if daily profit can be claimed today
  const todayStr = new Date().toISOString().split('T')[0];
  const canClaimDaily =
    currentUser.currentPlanId &&
    (!currentUser.completedTasksToday?.includes('daily_profit_claim') || currentUser.lastTaskDate !== todayStr);

  const usdtEquiv = (currentUser.balancePKR / (paymentSettings.usdt.exchangeRatePKR || 280)).toFixed(2);

  const handleCopyReferral = (e: React.MouseEvent) => {
    e.stopPropagation();
    const refUrl = `${window.location.origin}/?ref=${currentUser.referralCode}`;
    navigator.clipboard.writeText(refUrl);
    setCopiedRef(true);
    showToast('success', 'Referral Link Copied', `Share your link to earn 10% direct + 3% team commissions!`);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const getTierBadgeStyle = (tierId: PlanTier | null) => {
    switch (tierId) {
      case 'royal':
        return 'from-amber-400 via-amber-300 to-yellow-500 text-black border-amber-300';
      case 'executive':
        return 'from-purple-500 to-indigo-600 text-white border-purple-400/50';
      case 'diamond':
        return 'from-cyan-400 to-blue-600 text-black border-cyan-300';
      case 'gold':
        return 'from-amber-400 to-amber-600 text-black border-amber-400';
      case 'silver':
        return 'from-zinc-300 to-zinc-400 text-black border-zinc-200';
      case 'bronze':
        return 'from-amber-700 to-amber-800 text-amber-100 border-amber-600';
      default:
        return 'from-zinc-800 to-zinc-900 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07080c]/90 backdrop-blur-2xl border-b border-amber-500/15 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.85)] transition-all">
      {/* Top Metallic Gold Accent Hairline */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

      {/* Top Live Rates & Gateway Ticker Strip */}
      <div className="bg-[#0a0b12] border-b border-zinc-800/80 px-4 py-1.5 text-[11px] text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 font-mono">
          {/* Left: Real-time Gateway & Conversion Indicator */}
          <div className="flex items-center gap-2.5 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              GATEWAYS LIVE
            </span>
            <span className="text-zinc-500 hidden sm:inline">|</span>
            <span className="text-zinc-300 flex items-center gap-1.5">
              <span className="text-zinc-500">Live Rate:</span>
              <span className="text-amber-300 font-bold">1 USDT = Rs {paymentSettings.usdt.exchangeRatePKR} PKR</span>
            </span>
            <span className="text-zinc-600 hidden md:inline">·</span>
            <span className="text-zinc-400 hidden md:inline flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              JazzCash &amp; Easypaisa Direct Auto-Ledger
            </span>
          </div>

          {/* Right: Commission & Legal Mark */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-amber-400/90 font-medium">
              3-Level Commission: <strong className="text-white">10%</strong> · <strong className="text-zinc-300">3%</strong> · <strong className="text-zinc-400">1%</strong>
            </span>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <a
              href={`https://wa.me/923087348367?text=Hello%20Learn%20to%20Earn%20Gold%20Support`}
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1 text-[10px]"
            >
              <MessageCircle className="w-3 h-3 text-emerald-400" />
              <span>WhatsApp: <strong className="text-zinc-200">{paymentSettings.jazzcash.accountNumber}</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo & Emblem */}
        <div
          onClick={() => {
            setIsAdminMode(false);
            setActiveTab('plans');
          }}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          {/* Hexagonal Gold Shield Insignia */}
          <div className="relative flex items-center justify-center w-10 sm:w-11 h-10 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[1.5px] shadow-[0_0_20px_rgba(245,158,11,0.25)] group-hover:shadow-[0_0_28px_rgba(245,158,11,0.45)] transition-all">
            <div className="w-full h-full bg-[#0a0b12] rounded-[14px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-amber-400/15" />
              <Crown className="w-5 h-5 text-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)] group-hover:scale-110 transition-transform" />
            </div>
            {/* Live active beacon */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#07080c] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </div>

          {/* Typography */}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-extrabold tracking-wider text-white font-display uppercase">
                LEARN TO EARN
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-amber-400 to-amber-600 text-black shadow-sm shadow-amber-500/30">
                GOLD
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-zinc-400 tracking-[0.2em] uppercase font-mono">
              Academy &amp; Daily Profit
            </p>
          </div>
        </div>

        {/* Desktop Navigation Segmented Dock (User Mode) */}
        {!isAdminMode && (
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-[#10121a]/90 rounded-2xl border border-zinc-800/90 shadow-inner">
            <button
              onClick={() => setActiveTab('plans')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'plans'
                  ? 'bg-gradient-to-r from-amber-500/25 via-amber-400/20 to-amber-600/20 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-500/10'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${activeTab === 'plans' ? 'text-amber-400' : 'text-zinc-400'}`} />
              <span>Plans</span>
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-gradient-to-r from-amber-500/25 via-amber-400/20 to-amber-600/20 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-500/10'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
              }`}
            >
              <Award className={`w-3.5 h-3.5 ${activeTab === 'tasks' ? 'text-amber-400' : 'text-zinc-400'}`} />
              <span>Daily Tasks</span>
              {canClaimDaily && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-2 right-2" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'courses'
                  ? 'bg-gradient-to-r from-amber-500/25 via-amber-400/20 to-amber-600/20 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-500/10'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${activeTab === 'courses' ? 'text-amber-400' : 'text-zinc-400'}`} />
              <span>Academy</span>
            </button>

            <button
              onClick={() => setActiveTab('referrals')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'referrals'
                  ? 'bg-gradient-to-r from-amber-500/25 via-amber-400/20 to-amber-600/20 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-500/10'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
              }`}
            >
              <Users className={`w-3.5 h-3.5 ${activeTab === 'referrals' ? 'text-amber-400' : 'text-zinc-400'}`} />
              <span>Referrals</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                10%
              </span>
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'wallet'
                  ? 'bg-gradient-to-r from-amber-500/25 via-amber-400/20 to-amber-600/20 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-500/10'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
              }`}
            >
              <ArrowRightLeft className={`w-3.5 h-3.5 ${activeTab === 'wallet' ? 'text-amber-400' : 'text-zinc-400'}`} />
              <span>Wallet Ledger</span>
            </button>
          </nav>
        )}

        {/* Right Section: Fintech Wallet, Profile / Auth, & Admin Mode */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* GUEST: Log In / Register CTAs */}
          {!isAdminMode && !isLoggedIn && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="px-3 sm:px-4 py-2 rounded-xl bg-[#12141c] hover:bg-[#191c28] border border-zinc-700/80 text-xs font-bold text-zinc-200 transition-all flex items-center gap-1.5 cursor-pointer hover:border-zinc-500 active:scale-95"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Log In</span>
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(245,158,11,0.25)] active:scale-95 flex items-center gap-1.5 cursor-pointer hover:shadow-[0_4px_25px_rgba(245,158,11,0.4)]"
              >
                <Sparkles className="w-3.5 h-3.5 fill-black" />
                <span>Register</span>
              </button>
            </div>
          )}

          {/* LOGGED IN: Luxury Wallet Card + Action Buttons + VIP Profile */}
          {!isAdminMode && isLoggedIn && (
            <>
              {/* Wallet Balance Badge */}
              <div className="flex items-center gap-2 bg-[#0e1017] p-1.5 sm:p-2 rounded-2xl border border-amber-500/25 shadow-sm">
                <div className="flex flex-col items-end px-2 sm:px-2.5">
                  <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Gold Wallet</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-amber-300 font-mono-numbers tracking-tight">
                      Rs {currentUser.balancePKR.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
                      (${usdtEquiv})
                    </span>
                  </div>
                </div>

                {/* Quick Deposit & Cashout Actions */}
                <div className="flex items-center gap-1 border-l border-zinc-800 pl-1.5">
                  <button
                    onClick={onOpenDeposit}
                    className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-extrabold text-[11px] sm:text-xs flex items-center gap-1 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                    title="Deposit & Activate Plan"
                  >
                    <Zap className="w-3.5 h-3.5 fill-black" />
                    <span className="hidden xs:inline">Deposit</span>
                  </button>
                  <button
                    onClick={onOpenWithdraw}
                    className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#161822] hover:bg-[#202330] border border-zinc-700 text-zinc-200 hover:text-white font-medium text-[11px] sm:text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                    title="Withdraw Funds"
                  >
                    <Wallet className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="hidden xs:inline">Cashout</span>
                  </button>
                </div>
              </div>

              {/* VIP Profile Avatar & Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl bg-[#11131c] hover:bg-[#181b28] border border-zinc-700/80 text-xs text-zinc-200 transition-all cursor-pointer hover:border-amber-500/40"
                  title="VIP Account Details"
                >
                  <div className="relative">
                    <img
                      src={
                        currentUser.avatarUrl ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={currentUser.fullName}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-amber-400/60 shadow-sm"
                    />
                    {userPlan && (
                      <span className="absolute -top-1 -right-1 text-[10px]">👑</span>
                    )}
                  </div>
                  <div className="hidden md:flex flex-col items-start leading-tight max-w-[110px]">
                    <span className="font-bold text-white text-xs truncate w-full">
                      {currentUser.fullName}
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono font-medium truncate uppercase">
                      {currentUser.currentPlanId ? `${currentUser.currentPlanId} Tier` : 'Free Member'}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* VIP Dropdown Card */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#0e1018] border border-amber-500/35 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-3 z-50 animate-in fade-in slide-in-from-top-2">
                    {/* VIP Identity Header */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#161824] to-[#0c0d14] border border-zinc-800 mb-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            currentUser.avatarUrl ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                          }
                          alt=""
                          className="w-11 h-11 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-white truncate">{currentUser.fullName}</p>
                            <span className="w-2 h-2 rounded-full bg-emerald-400" title="Active Account" />
                          </div>
                          <p className="text-xs text-zinc-400 font-mono truncate">{currentUser.phone}</p>
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase font-mono border bg-gradient-to-r ${getTierBadgeStyle(
                              currentUser.currentPlanId
                            )}`}
                          >
                            {currentUser.currentPlanId ? `${currentUser.currentPlanId.toUpperCase()} TIER` : 'UNACTIVATED'}
                          </span>
                        </div>
                      </div>

                      {/* Plan Expiry countdown if active */}
                      {currentUser.currentPlanId && currentUser.planExpiryDate && (
                        <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono">
                          <span className="text-zinc-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            Plan Validity:
                          </span>
                          <span className="text-amber-300 font-bold">{currentUser.planExpiryDate}</span>
                        </div>
                      )}
                    </div>

                    {/* Financial Summary Inside Dropdown */}
                    <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs mb-2">
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-mono block">Total Earned</span>
                        <span className="text-emerald-400 font-bold font-mono text-xs">
                          Rs {currentUser.totalEarnedPKR.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-mono block">Direct Referrals</span>
                        <span className="text-amber-400 font-bold font-mono text-xs">
                          Rs {currentUser.referralEarningsPKR.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* 1-Click Referral Link Share */}
                    <div className="p-2.5 rounded-xl bg-[#13151f] border border-amber-500/20 mb-2">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-zinc-400 font-mono">My Referral Code:</span>
                        <span className="text-amber-400 font-mono font-bold">{currentUser.referralCode}</span>
                      </div>
                      <button
                        onClick={handleCopyReferral}
                        className="w-full py-1.5 px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedRef ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-mono">Link Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-amber-400" />
                            <span>Copy Direct Invite Link (10%)</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Admin Switcher (Only if Admin is Authenticated) */}
                    {isAdminAuthenticated && (
                      <div className="pb-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsAdminMode(true);
                          }}
                          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-bold text-xs transition-colors cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                          <span>Switch to Super Admin Console</span>
                        </button>
                      </div>
                    )}

                    {/* Logout Button */}
                    <div className="pt-1 border-t border-zinc-800">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out / لاگ آؤٹ</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ADMIN ACTIVE CONSOLE CONTROL BUTTON */}
          {isAdminAuthenticated && (
            isAdminMode ? (
              <button
                onClick={adminLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 ring-2 ring-rose-400 active:scale-95 cursor-pointer"
                title="Exit and lock admin console"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Exit Admin</span>
                {totalPending > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-black text-rose-300 text-[10px] font-mono font-black">
                    {totalPending}
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={() => setIsAdminMode(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 hover:text-white font-bold text-xs transition-all shadow-sm shadow-red-950/40 cursor-pointer"
                title="Open Admin Console"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                <span>Admin Panel</span>
                {totalPending > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-900 text-red-100 text-[10px] font-mono">
                    {totalPending}
                  </span>
                )}
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
};
