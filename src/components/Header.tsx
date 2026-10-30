import React, { useState } from 'react';
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
  Globe
} from 'lucide-react';

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
    isAdminMode,
    setIsAdminMode,
    paymentSettings,
    transactions,
    isLoggedIn,
    openAuthModal,
    logout,
    isAdminAuthenticated,
    adminLogout,
    openAdminLoginModal
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Count pending transactions for admin badge
  const pendingDepositsCount = transactions.filter((t) => t.type === 'deposit' && t.status === 'pending').length;
  const pendingWithdrawalsCount = transactions.filter((t) => t.type === 'withdraw' && t.status === 'pending').length;
  const totalPending = pendingDepositsCount + pendingWithdrawalsCount;

  const usdtEquiv = (currentUser.balancePKR / (paymentSettings.usdt.exchangeRatePKR || 280)).toFixed(2);

  return (
    <header className="sticky top-0 z-40 bg-[#090a0d]/95 backdrop-blur-md border-b border-[#252836]">
      {/* Top micro-ticker bar */}
      <div className="bg-[#0e1017] border-b border-amber-500/10 py-1.5 px-4 text-[11px] text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Sparkles className="w-3 h-3 animate-spin text-amber-400" />
              EduGold Academy:
            </span>
            <span>100% Legal Skill & Course Membership</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-300">
              1 USDT = <strong className="text-amber-300 font-mono">Rs {paymentSettings.usdt.exchangeRatePKR}</strong> PKR
            </span>
            <span className="text-zinc-600 hidden md:inline">|</span>
            <span className="text-emerald-400 hidden md:inline flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              JazzCash, Easypaisa & Bank Instant Verification
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-amber-400/90 font-medium hidden sm:inline">
              3-Tier (10% + 3% + 1%) Referral Rewards
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-zinc-400">PKR Portal v3.2</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setIsAdminMode(false); setActiveTab('plans'); }}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[1px] shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-[#0d0e14] rounded-xl flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#090a0d]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-bold tracking-wider gold-gradient-text uppercase font-display">
                LEARN TO EARN GOLD
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">
              Academy &amp; Skill Rewards
            </p>
          </div>
        </div>

        {/* Center Navigation (when in User Mode) */}
        {!isAdminMode && (
          <nav className="hidden lg:flex items-center gap-1 bg-[#12141c] p-1 rounded-xl border border-zinc-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'plans'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold shadow-md shadow-amber-500/20'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              Membership Plans
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'tasks'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold shadow-md shadow-amber-500/20'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              Daily Tasks
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'courses'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold shadow-md shadow-amber-500/20'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => setActiveTab('referrals')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'referrals'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold shadow-md shadow-amber-500/20'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              Referrals (10%)
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'wallet'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold shadow-md shadow-amber-500/20'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              Transactions
            </button>
          </nav>
        )}

        {/* Right Section: Balance, Switcher, Admin Button */}
          {/* Right Section: Balance, Auth Buttons, Switcher, Admin Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* If NOT logged in: Show Login & Register CTA */}
            {!isAdminMode && !isLoggedIn && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 rounded-xl bg-[#141620] hover:bg-[#1d202e] border border-zinc-700 text-xs font-semibold text-zinc-200 transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-black" />
                  <span>Register</span>
                </button>
              </div>
            )}

            {/* If LOGGED IN: Show Balance, Deposit/Withdraw, and User Avatar */}
            {!isAdminMode && isLoggedIn && (
              <>
                {/* User Balance Badge */}
                <div className="hidden sm:flex flex-col items-end px-3 py-1.5 bg-[#141620] border border-amber-500/20 rounded-xl">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
                    Gold Wallet
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-amber-300 font-mono-numbers">
                      Rs {currentUser.balancePKR.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      (${usdtEquiv})
                    </span>
                  </div>
                </div>

                {/* Quick Deposit & Withdraw Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onOpenDeposit}
                    className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs flex items-center gap-1 shadow-md shadow-amber-500/20 transition-transform active:scale-95"
                  >
                    <Zap className="w-3.5 h-3.5 fill-black" />
                    <span className="hidden xs:inline">Deposit</span>
                  </button>
                  <button
                    onClick={onOpenWithdraw}
                    className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#1a1d28] hover:bg-[#232736] border border-zinc-700 text-zinc-200 font-medium text-xs flex items-center gap-1 transition-colors"
                  >
                    <Wallet className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="hidden xs:inline">Withdraw</span>
                  </button>
                </div>

                {/* User Dropdown with Logout */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#141620] hover:bg-[#1a1d29] border border-zinc-700/80 text-xs text-zinc-200 transition-colors"
                    title="Account Options"
                  >
                    <img
                      src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                      alt={currentUser.fullName}
                      className="w-5 h-5 rounded-full object-cover border border-amber-500/40"
                    />
                    <span className="hidden md:inline font-medium max-w-[100px] truncate">
                      {currentUser.fullName.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-zinc-400" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-[#12141e] border border-amber-500/30 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1">
                      <div className="px-3 py-2 border-b border-zinc-800 mb-1">
                        <div className="flex items-center gap-2">
                          <img
                            src={currentUser.avatarUrl}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover border border-amber-400/50"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white truncate">{currentUser.fullName}</p>
                            <p className="text-[10px] text-zinc-400 font-mono truncate">{currentUser.phone}</p>
                          </div>
                        </div>
                        <div className="mt-2 pt-1 border-t border-zinc-800/60 flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400 font-mono">Plan:</span>
                          <span className="font-bold text-amber-300 font-mono uppercase">
                            {currentUser.currentPlanId?.toUpperCase() || 'NO PLAN'}
                          </span>
                        </div>
                      </div>

                      <div className="p-2 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                          <span>Referral Code:</span>
                          <span className="font-bold text-amber-300">{currentUser.referralCode}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                          <span>Account Status:</span>
                          <span className={`font-bold uppercase ${currentUser.status === 'frozen' ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {currentUser.status}
                          </span>
                        </div>
                      </div>

                      {/* Logout Action */}
                      <div className="pt-1 border-t border-zinc-800">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Sign Out / لاگ آؤٹ</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ADMIN CONSOLE BUTTON - ONLY VISIBLE TO AUTHENTICATED ADMINISTRATOR */}
            {isAdminAuthenticated && (
              isAdminMode ? (
                <button
                  onClick={adminLogout}
                  className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 ring-2 ring-rose-400"
                  title="Exit and lock admin console"
                >
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Exit Admin</span>
                  {totalPending > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-red-950 text-white text-[10px] font-mono">
                      {totalPending}
                    </span>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setIsAdminMode(true)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 hover:text-white font-bold text-xs transition-all shadow-sm shadow-red-950/40"
                  title="Open Admin Console"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                  <span>Admin Panel</span>
                </button>
              )
            )}
          </div>
      </div>
    </header>
  );
};
