import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentGatewaySettings, User, Transaction, DailyTask } from '../types';
import {
  ShieldCheck,
  Users,
  CreditCard,
  ArrowDownToLine,
  ArrowUpFromLine,
  BookOpen,
  DollarSign,
  Search,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Save,
  RotateCcw,
  Sparkles,
  Phone,
  Building,
  Coins,
  Edit3,
  Clock,
  Eye,
  Trash2,
  RefreshCw,
  Sliders,
  Crown,
  Plus,
  Minus,
  Palette
} from 'lucide-react';
import { THEME_PRESETS } from '../data/themes';

export const AdminPanel: React.FC = () => {
  const {
    users,
    paymentSettings,
    transactions,
    tasks,
    plans,
    toggleUserStatus,
    adjustUserBalance,
    assignUserPlan,
    updatePaymentSettings,
    approveDeposit,
    rejectDeposit,
    approveWithdrawal,
    rejectWithdrawal,
    updateTaskReward,
    resetAllDemoData,
    showToast,
    syncWithServer,
    currentTheme,
    setCurrentTheme
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);

  // Auto-sync with server when admin console opens
  useEffect(() => {
    syncWithServer();
  }, [syncWithServer]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await syncWithServer();
      showToast('success', 'Database Synchronized', 'All user accounts and records updated across devices.');
    } catch {
      showToast('error', 'Sync Error', 'Failed to connect to server database.');
    } finally {
      setIsSyncing(false);
    }
  };

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'users' | 'gateways' | 'deposits' | 'withdrawals' | 'tasks' | 'portal-security'
  >('overview');

  // Search in user management
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'frozen'>('all');

  // User Balance Adjust Modal State
  const [adjustingUser, setAdjustingUser] = useState<User | null>(null);
  const [adjAmount, setAdjAmount] = useState<number>(500);
  const [adjReason, setAdjReason] = useState<string>('Bonus reward for exceptional performance');

  // Plan Assignment Modal State
  const [planModalUser, setPlanModalUser] = useState<User | null>(null);

  // Freeze user custom reason state
  const [freezingUserId, setFreezingUserId] = useState<string | null>(null);
  const [freezeReasonText, setFreezeReasonText] = useState('Suspicious activity / Duplicate payment slip submitted');

  // Live editable payment settings form state
  const [gatewayForm, setGatewayForm] = useState<PaymentGatewaySettings>(paymentSettings);

  // Keep form synced when paymentSettings updates from server
  useEffect(() => {
    setGatewayForm(paymentSettings);
  }, [paymentSettings]);

  // Sync gatewayForm when paymentSettings updates
  const handleSaveGateways = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentSettings(gatewayForm);
  };

  const portalSettings = gatewayForm?.adminPortalSettings || {
    footerButtonMode: 'button',
    footerButtonLabel: 'Staff / Admin Access',
    showInHeader: true
  };

  const handleUpdatePortalSettings = (partial: Partial<typeof portalSettings>) => {
    const updated: PaymentGatewaySettings = {
      ...gatewayForm,
      adminPortalSettings: {
        ...portalSettings,
        ...partial
      }
    };
    setGatewayForm(updated);
    updatePaymentSettings(updated);
    showToast('success', 'Admin Portal Settings Saved', 'Footer button and portal visibility updated instantly.');
  };

  // Pending items counts
  const pendingDeposits = transactions.filter((t) => t.type === 'deposit' && t.status === 'pending');
  const pendingWithdrawals = transactions.filter((t) => t.type === 'withdraw' && t.status === 'pending');

  // Overall financial calculations
  const totalApprovedDepositsPKR = transactions
    .filter((t) => t.type === 'deposit' && t.status === 'approved')
    .reduce((sum, t) => sum + t.amountPKR, 0);

  const totalApprovedWithdrawalsPKR = transactions
    .filter((t) => t.type === 'withdraw' && t.status === 'approved')
    .reduce((sum, t) => sum + t.amountPKR, 0);

  const totalReferralBonusDisbursedPKR = transactions
    .filter((t) => t.type === 'referral_bonus' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amountPKR, 0);

  const totalUsersCount = users.length;
  const frozenUsersCount = users.filter((u) => u.status === 'frozen').length;

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone.includes(userSearch) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.referralCode.toLowerCase().includes(userSearch.toLowerCase());

    const matchesStatus =
      userStatusFilter === 'all' ? true : u.status === userStatusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Admin Top Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/70 via-[#181119] to-[#12141c] border-2 border-red-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/40">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
                ADMIN MASTER CONTROL CONSOLE
              </h1>
              <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold font-mono uppercase tracking-wider">
                SUPER ADMIN
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-1">
              Full control: Freeze/Activate accounts, edit deposit numbers &amp; bank accounts, approve/reject transactions, edit task rewards.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono transition-colors disabled:opacity-50"
            title="Refresh accounts & records from server database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Cross-Device'}</span>
          </button>

          <button
            onClick={resetAllDemoData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
            title="Clear all stored data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Platform Data</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-[#10121a] p-1.5 rounded-2xl border border-zinc-800">
        {[
          { id: 'overview', label: 'Financial Overview', icon: DollarSign, badge: null },
          { id: 'users', label: 'User Control & Freeze', icon: Users, badge: frozenUsersCount > 0 ? `${frozenUsersCount} Frozen` : null },
          { id: 'gateways', label: 'Edit Payment Numbers', icon: CreditCard, badge: 'Live Config' },
          { id: 'portal-security', label: 'Admin Hide & Footer Button', icon: Sliders, badge: 'Customize' },
          { id: 'deposits', label: 'Deposit Review', icon: ArrowDownToLine, badge: pendingDeposits.length > 0 ? pendingDeposits.length : null },
          { id: 'withdrawals', label: 'Withdrawal Approvals', icon: ArrowUpFromLine, badge: pendingWithdrawals.length > 0 ? pendingWithdrawals.length : null },
          { id: 'tasks', label: 'Edit Tasks & Rewards', icon: BookOpen, badge: null }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-black/40 text-white' : 'bg-red-500/30 text-red-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: FINANCIAL OVERVIEW */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#12141e] border border-zinc-800 space-y-1">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono">
                Total Deposits Approved
              </span>
              <p className="text-2xl font-extrabold text-blue-400 font-mono-numbers">
                Rs {totalApprovedDepositsPKR.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-500 font-mono">From member enrollments</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#12141e] border border-zinc-800 space-y-1">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono">
                Total Payouts Disbursed
              </span>
              <p className="text-2xl font-extrabold text-rose-400 font-mono-numbers">
                Rs {totalApprovedWithdrawalsPKR.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-500 font-mono">To user bank/wallets</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#12141e] border border-zinc-800 space-y-1">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono">
                10% Referral Bonuses Paid
              </span>
              <p className="text-2xl font-extrabold text-amber-400 font-mono-numbers">
                Rs {totalReferralBonusDisbursedPKR.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-500 font-mono">To affiliate sponsors</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#12141e] border border-zinc-800 space-y-1">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono">
                Platform Vault Reserve
              </span>
              <p className="text-2xl font-extrabold text-emerald-400 font-mono-numbers">
                Rs {(totalApprovedDepositsPKR - totalApprovedWithdrawalsPKR).toLocaleString()}
              </p>
              <p className="text-xs text-zinc-500 font-mono">Net operational balance</p>
            </div>
          </div>

          {/* Quick Action Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#12141e] border border-amber-500/30 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">Pending Deposits Waiting</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {pendingDeposits.length} payment slips awaiting verification
                </p>
              </div>
              <button
                onClick={() => setActiveAdminTab('deposits')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase"
              >
                Review ({pendingDeposits.length})
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#12141e] border border-red-500/30 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">Pending Withdrawals</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {pendingWithdrawals.length} cashout requests pending approval
                </p>
              </div>
              <button
                onClick={() => setActiveAdminTab('withdrawals')}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs uppercase"
              >
                Disburse ({pendingWithdrawals.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER CONTROL (FREEZE / ACTIVATE / EDIT BALANCE) */}
      {activeAdminTab === 'users' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#12141e] p-3.5 rounded-2xl border border-zinc-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user name, phone, referral code..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              {(['all', 'active', 'frozen'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setUserStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    userStatusFilter === st
                      ? 'bg-amber-500 text-black font-bold'
                      : 'text-zinc-400 hover:text-white bg-zinc-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile User Cards Layout (Screen < md) */}
          <div className="block md:hidden space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#12141e] border border-zinc-800">
                <Users className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-zinc-300">No Users in Database</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Registered members will appear here.
                </p>
              </div>
            ) : (
              filteredUsers.map((u) => {
                const isFrozen = u.status === 'frozen';
                return (
                  <div
                    key={u.id}
                    className="p-4 rounded-2xl bg-[#12141e] border border-zinc-800 space-y-3 shadow-md"
                  >
                    {/* Header: Avatar, Name, Email, Status */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                          alt={u.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-amber-500/40 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-white font-bold text-sm truncate">{u.fullName}</p>
                          <p className="text-xs text-zinc-400 font-mono">{u.phone}</p>
                          <p className="text-[10px] text-zinc-500 font-mono truncate">{u.email}</p>
                        </div>
                      </div>

                      {/* Status badge */}
                      {isFrozen ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-700 text-[10px] font-bold uppercase shrink-0">
                          <Lock className="w-3 h-3" />
                          FROZEN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold uppercase shrink-0">
                          <Unlock className="w-3 h-3" />
                          ACTIVE
                        </span>
                      )}
                    </div>

                    {/* Balance, Plan, and Referral Code Grid */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#0b0c10] border border-zinc-800/80 font-mono text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase block">Wallet Balance</span>
                        <span className="text-sm font-bold text-amber-300">
                          Rs {u.balancePKR.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase block">Plan Tier</span>
                        <span className="text-xs font-bold text-white uppercase flex items-center gap-1">
                          {u.currentPlanId ? (
                            <>
                              <Crown className="w-3 h-3 text-amber-400" />
                              <span>{u.currentPlanId}</span>
                            </>
                          ) : (
                            <span className="text-zinc-500">Free Member</span>
                          )}
                        </span>
                      </div>
                    </div>

                    {isFrozen && u.freezeReason && (
                      <p className="text-[11px] text-red-300 p-2 rounded-xl bg-red-950/40 border border-red-900/50 leading-relaxed font-mono">
                        <strong className="text-red-400">Freeze Reason:</strong> {u.freezeReason}
                      </p>
                    )}

                    {/* Touch-Friendly Action Buttons for Mobile Screen */}
                    <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                      <button
                        onClick={() => {
                          setAdjustingUser(u);
                          setAdjAmount(500);
                        }}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold active:scale-95 transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Adjust Balance</span>
                      </button>

                      <button
                        onClick={() => setPlanModalUser(u)}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 font-bold active:scale-95 transition-all cursor-pointer"
                      >
                        <Crown className="w-3.5 h-3.5" />
                        <span>Change Tier</span>
                      </button>

                      <div className="col-span-2">
                        {isFrozen ? (
                          <button
                            onClick={() => toggleUserStatus(u.id)}
                            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all cursor-pointer active:scale-95"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Unfreeze &amp; Activate User</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setFreezingUserId(u.id)}
                            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-red-950/60 text-zinc-300 hover:text-red-300 border border-zinc-700 hover:border-red-500/50 transition-all cursor-pointer active:scale-95"
                          >
                            <Lock className="w-3.5 h-3.5 text-red-400" />
                            <span>Freeze Account</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop Table (Shown on md+ screens) */}
          <div className="hidden md:block rounded-2xl bg-[#12141e] border border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b0c10] text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">User / Contact</th>
                    <th className="py-3 px-4">Plan Tier</th>
                    <th className="py-3 px-4">Wallet Balance</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Referral Code</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center font-sans">
                        <Users className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-zinc-300">No Users in Database</p>
                        <p className="text-xs text-zinc-500 mt-1">
                          When real users register on the platform, their details and status will appear here.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isFrozen = u.status === 'frozen';

                      return (
                        <tr key={u.id} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-sans">
                            <div className="flex items-center gap-3">
                              <img
                                src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                                alt={u.fullName}
                                className="w-8 h-8 rounded-full object-cover border border-zinc-700 flex-shrink-0"
                              />
                              <div>
                                <p className="text-white font-bold">{u.fullName}</p>
                                <p className="text-xs text-zinc-400 font-mono">{u.phone}</p>
                                <p className="text-[10px] text-zinc-500 font-mono">{u.email}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => setPlanModalUser(u)}
                              className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase transition-colors cursor-pointer"
                              title="Click to change plan"
                            >
                              {u.currentPlanId ? u.currentPlanId.toUpperCase() : 'NO PLAN'}
                            </button>
                          </td>

                          <td className="py-3.5 px-4 font-bold text-white text-sm">
                            Rs {u.balancePKR.toLocaleString()}
                          </td>

                          <td className="py-3.5 px-4">
                            {isFrozen ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-700 text-[10px] font-bold uppercase">
                                <Lock className="w-3 h-3" />
                                FROZEN
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold uppercase">
                                <Unlock className="w-3 h-3" />
                                ACTIVE
                              </span>
                            )}
                            {isFrozen && u.freezeReason && (
                              <p className="text-[10px] text-red-400 mt-1 max-w-[180px] truncate" title={u.freezeReason}>
                                {u.freezeReason}
                              </p>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-amber-300 font-semibold">
                            {u.referralCode}
                          </td>

                          <td className="py-3.5 px-4 text-right space-x-1.5">
                            {/* Plan Assign Button */}
                            <button
                              onClick={() => setPlanModalUser(u)}
                              className="px-2.5 py-1 rounded-lg bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 text-xs font-sans transition-colors cursor-pointer"
                            >
                              Tier
                            </button>

                            {/* Balance Adjust Button */}
                            <button
                              onClick={() => {
                                setAdjustingUser(u);
                                setAdjAmount(500);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-sans transition-colors cursor-pointer"
                            >
                              Adjust Balance
                            </button>

                            {/* Freeze / Unfreeze Toggle */}
                            {isFrozen ? (
                              <button
                                onClick={() => toggleUserStatus(u.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-sans font-semibold transition-colors cursor-pointer"
                              >
                                Activate
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setFreezingUserId(u.id);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-sans font-semibold transition-colors cursor-pointer"
                              >
                                Freeze User
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Freeze Reason Modal Dialog */}
      {freezingUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#13151f] border border-red-500/50 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-red-400">
              <Lock className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Freeze Account &amp; Halt Withdrawals</h3>
            </div>
            <p className="text-xs text-zinc-300">
              When frozen, this member will be restricted from requesting withdrawals and earning from daily tasks.
            </p>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Reason for Administrative Freeze:</label>
              <textarea
                value={freezeReasonText}
                onChange={(e) => setFreezeReasonText(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-red-400"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setFreezingUserId(null)}
                className="px-3.5 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toggleUserStatus(freezingUserId, freezeReasonText);
                  setFreezingUserId(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
              >
                Confirm Freeze
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Balance Adjust Modal */}
      {adjustingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-5 sm:p-6 rounded-2xl bg-[#13151f] border border-amber-500/50 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400">
              <Edit3 className="w-5 h-5" />
              <h3 className="text-base font-bold text-white font-display">
                Adjust Wallet Balance: {adjustingUser.fullName}
              </h3>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0b0c10] border border-zinc-800 text-xs font-mono">
              <span className="text-zinc-400">Current Balance:</span>
              <strong className="text-amber-300 font-bold text-sm">Rs {adjustingUser.balancePKR.toLocaleString()}</strong>
            </div>

            {/* Quick Adjustment Chips for Mobile Users */}
            <div>
              <span className="text-[11px] text-zinc-400 font-mono block mb-1.5">
                Quick PKR Adjustment Chips (Tap to Set):
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[500, 1000, 2500, 5000, 10000, -500].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAdjAmount(amt)}
                    className={`py-2 px-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer active:scale-95 ${
                      adjAmount === amt
                        ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                        : 'bg-zinc-850 hover:bg-zinc-750 text-zinc-300 border border-zinc-750'
                    }`}
                  >
                    {amt > 0 ? `+Rs ${amt.toLocaleString()}` : `-Rs ${Math.abs(amt).toLocaleString()}`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1 font-mono">
                Custom Amount in PKR (+ Credit, - Debit):
              </label>
              <input
                type="number"
                value={adjAmount}
                onChange={(e) => setAdjAmount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm font-mono font-bold text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Projected Balance Calculation */}
            <div className="p-3 rounded-xl bg-[#0e1017] border border-zinc-800 flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-400">Projected Balance:</span>
              <span className={`font-bold text-sm ${
                (adjustingUser.balancePKR + adjAmount) < adjustingUser.balancePKR
                  ? 'text-rose-400'
                  : 'text-emerald-400'
              }`}>
                Rs {Math.max(0, adjustingUser.balancePKR + adjAmount).toLocaleString()}
              </span>
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1 font-mono">Audit Reason / Note:</label>
              <input
                type="text"
                value={adjReason}
                onChange={(e) => setAdjReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setAdjustingUser(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700 font-mono transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  adjustUserBalance(adjustingUser.id, adjAmount, adjReason);
                  setAdjustingUser(null);
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs font-mono transition-all cursor-pointer shadow-md shadow-amber-500/20 active:scale-95"
              >
                Apply Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plan Assignment Modal for Direct Tier Adjustment */}
      {planModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-5 sm:p-6 rounded-2xl bg-[#13151f] border border-purple-500/50 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-purple-400">
              <Crown className="w-5 h-5" />
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Assign Membership Tier
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Target User: <strong className="text-white">{planModalUser.fullName}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {/* Option to clear plan */}
              <button
                onClick={() => {
                  assignUserPlan(planModalUser.id, null);
                  setPlanModalUser(null);
                }}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs font-mono transition-all cursor-pointer ${
                  !planModalUser.currentPlanId
                    ? 'bg-zinc-800/80 border-zinc-500 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
                }`}
              >
                <span>No Plan (Free Member)</span>
                {!planModalUser.currentPlanId && <span className="text-[10px] text-amber-400 font-bold">CURRENT</span>}
              </button>

              {plans.map((p) => {
                const isSelected = planModalUser.currentPlanId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      assignUserPlan(planModalUser.id, p.id);
                      setPlanModalUser(null);
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs font-mono transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-950/50 border-purple-400 text-white shadow-md'
                        : 'bg-[#0f111a] border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <span className="font-bold block text-white">{p.name}</span>
                      <span className="text-[11px] text-zinc-400">
                        Rs {p.pricePKR.toLocaleString()} • Profit: Rs {(p.dailyProfitPKR || p.maxDailyEarnPKR).toLocaleString()}/day
                      </span>
                    </div>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                        CURRENT
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPlanModalUser(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EDIT PAYMENT NUMBERS & GATEWAYS */}
      {activeAdminTab === 'gateways' && (
        <form onSubmit={handleSaveGateways} className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                PAYMENT GATEWAY CONFIGURATION &amp; NUMBERS
              </h2>
              <p className="text-xs text-zinc-400">
                Update account numbers, titles, instructions, and USDT conversion rates shown to students.
              </p>
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Save Gateway Numbers</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* JazzCash Section */}
            <div className="p-5 rounded-2xl bg-[#12141e] border border-red-500/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-sm font-bold text-red-400 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  JazzCash Mobile Account
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-mono">
                  ACTIVE
                </span>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">JazzCash Account Number</label>
                <input
                  type="text"
                  value={gatewayForm.jazzcash.accountNumber}
                  onChange={(e) =>
                    setGatewayForm({
                      ...gatewayForm,
                      jazzcash: { ...gatewayForm.jazzcash, accountNumber: e.target.value }
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-white focus:outline-none focus:border-red-400"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">JazzCash Account Title</label>
                <input
                  type="text"
                  value={gatewayForm.jazzcash.accountTitle}
                  onChange={(e) =>
                    setGatewayForm({
                      ...gatewayForm,
                      jazzcash: { ...gatewayForm.jazzcash, accountTitle: e.target.value }
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-red-400"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Transfer Instructions</label>
                <textarea
                  rows={2}
                  value={gatewayForm.jazzcash.instructions}
                  onChange={(e) =>
                    setGatewayForm({
                      ...gatewayForm,
                      jazzcash: { ...gatewayForm.jazzcash, instructions: e.target.value }
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-red-400"
                />
              </div>
            </div>

            {/* Easypaisa Section */}
            <div className="p-5 rounded-2xl bg-[#12141e] border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Easypaisa Mobile Account
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  ACTIVE
                </span>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Easypaisa Account Number</label>
                <input
                  type="text"
                  value={gatewayForm.easypaisa.accountNumber}
                  onChange={(e) =>
                    setGatewayForm({
                      ...gatewayForm,
                      easypaisa: { ...gatewayForm.easypaisa, accountNumber: e.target.value }
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Easypaisa Account Title</label>
                <input
                  type="text"
                  value={gatewayForm.easypaisa.accountTitle}
                  onChange={(e) =>
                    setGatewayForm({
                      ...gatewayForm,
                      easypaisa: { ...gatewayForm.easypaisa, accountTitle: e.target.value }
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Transfer Instructions</label>
                <textarea
                  rows={2}
                  value={gatewayForm.easypaisa.instructions}
                  onChange={(e) =>
                    setGatewayForm({
                      ...gatewayForm,
                      easypaisa: { ...gatewayForm.easypaisa, instructions: e.target.value }
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Bank Transfer Section */}
            <div className="p-5 rounded-2xl bg-[#12141e] border border-blue-500/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-sm font-bold text-blue-400 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Pakistani Bank (Raast / IBFT)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                  ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={gatewayForm.bank.bankName}
                    onChange={(e) =>
                      setGatewayForm({
                        ...gatewayForm,
                        bank: { ...gatewayForm.bank, bankName: e.target.value }
                      })
                    }
                    className="w-full p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Account Title</label>
                  <input
                    type="text"
                    value={gatewayForm.bank.accountTitle}
                    onChange={(e) =>
                      setGatewayForm({
                        ...gatewayForm,
                        bank: { ...gatewayForm.bank, accountTitle: e.target.value }
                      })
                    }
                    className="w-full p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">IBAN (24 Characters)</label>
                <input
                  type="text"
                  value={gatewayForm.bank.iban}
                  onChange={(e) =>
                    setGatewayForm({
                      ...gatewayForm,
                      bank: { ...gatewayForm.bank, iban: e.target.value }
                    })
                  }
                  className="w-full p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Account Number</label>
                <input
                  type="text"
                  value={gatewayForm.bank.accountNumber}
                  onChange={(e) =>
                    setGatewayForm({
                      ...gatewayForm,
                      bank: { ...gatewayForm.bank, accountNumber: e.target.value }
                    })
                  }
                  className="w-full p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-white focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            {/* USDT Crypto Section */}
            <div className="p-5 rounded-2xl bg-[#12141e] border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  USDT Crypto Gateway &amp; Rate
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                  ACTIVE
                </span>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">USDT (TRC-20) Deposit Address</label>
                <input
                  type="text"
                  value={gatewayForm.usdt.trc20Address}
                  onChange={(e) =>
                    setGatewayForm({
                      ...gatewayForm,
                      usdt: { ...gatewayForm.usdt, trc20Address: e.target.value }
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Exchange Rate (PKR per 1 USDT)</label>
                  <input
                    type="number"
                    value={gatewayForm.usdt.exchangeRatePKR}
                    onChange={(e) =>
                      setGatewayForm({
                        ...gatewayForm,
                        usdt: { ...gatewayForm.usdt, exchangeRatePKR: Number(e.target.value) }
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Min Cashout (PKR)</label>
                  <input
                    type="number"
                    value={gatewayForm.minWithdrawPKR}
                    onChange={(e) =>
                      setGatewayForm({
                        ...gatewayForm,
                        minWithdrawPKR: Number(e.target.value)
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 4: DEPOSIT REQUESTS REVIEW */}
      {activeAdminTab === 'deposits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-display">
              PENDING MEMBERSHIP DEPOSITS ({pendingDeposits.length})
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              Approving automatically grants 10% sponsor referral commission!
            </span>
          </div>

          {pendingDeposits.length === 0 ? (
            <div className="p-8 text-center bg-[#12141e] rounded-2xl border border-zinc-800 text-zinc-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-semibold text-white">All Deposits Processed</p>
              <p className="text-xs text-zinc-500 mt-1">No pending deposit slips awaiting review.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingDeposits.map((dep) => (
                <div
                  key={dep.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#12141e] border border-amber-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{dep.userName}</span>
                      <span className="text-xs text-zinc-400 font-mono">({dep.userPhone})</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase">
                        {dep.planId?.toUpperCase() || 'ENROLLMENT'}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300">
                      Channel: <strong className="uppercase text-amber-300">{dep.method}</strong> • Sender Account:{' '}
                      <strong className="font-mono">{dep.senderAccount}</strong> ({dep.senderTitle})
                    </p>

                    <p className="text-xs text-zinc-400 font-mono">
                      Trx ID / TID: <strong className="text-white bg-black/60 px-2 py-0.5 rounded">{dep.trxId}</strong> • Date: {dep.date}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-zinc-400 font-mono block">Amount</span>
                      <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
                        Rs {dep.amountPKR.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => approveDeposit(dep.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      Approve &amp; Activate
                    </button>

                    <button
                      onClick={() => {
                        const reason = prompt('Enter rejection reason for this deposit:', 'Transaction ID not verified with bank');
                        if (reason) rejectDeposit(dep.id, reason);
                      }}
                      className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-red-900/60 text-zinc-300 hover:text-red-300 text-xs font-semibold transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: WITHDRAWAL REQUESTS APPROVAL */}
      {activeAdminTab === 'withdrawals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-display">
              PENDING CASHOUT REQUESTS ({pendingWithdrawals.length})
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              Rejecting automatically refunds balance back to member wallet.
            </span>
          </div>

          {pendingWithdrawals.length === 0 ? (
            <div className="p-8 text-center bg-[#12141e] rounded-2xl border border-zinc-800 text-zinc-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-semibold text-white">All Cashouts Processed</p>
              <p className="text-xs text-zinc-500 mt-1">No withdrawals awaiting disbursement.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingWithdrawals.map((wd) => (
                <div
                  key={wd.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#12141e] border border-red-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{wd.userName}</span>
                      <span className="text-xs text-zinc-400 font-mono">({wd.userPhone})</span>
                      <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold uppercase">
                        {wd.method?.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300">
                      Destination Account: <strong className="font-mono text-amber-300">{wd.recipientAccount}</strong> (
                      {wd.recipientTitle})
                    </p>

                    <p className="text-xs text-zinc-400 font-mono">
                      Requested: {wd.date}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-zinc-400 font-mono block">Payout Amount</span>
                      <span className="text-base sm:text-lg font-bold text-amber-300 font-mono">
                        Rs {wd.amountPKR.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        const trxRef = prompt('Enter Bank / Wallet Disbursal Reference Trx ID:', `WD-SENT-${Math.floor(100000 + Math.random() * 900000)}`);
                        approveWithdrawal(wd.id, trxRef || undefined);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      Disburse &amp; Mark Sent
                    </button>

                    <button
                      onClick={() => {
                        const reason = prompt('Enter rejection reason (Balance will be refunded to user):', 'Incorrect account title / verification failure');
                        if (reason) rejectWithdrawal(wd.id, reason);
                      }}
                      className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-red-900/60 text-zinc-300 hover:text-red-300 text-xs font-semibold transition-colors"
                    >
                      Reject &amp; Refund
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: TASK REWARDS & DAILY PROFIT MANAGEMENT */}
      {activeAdminTab === 'tasks' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div>
              <h2 className="text-base font-bold text-white font-display">
                DAILY CURRENT PROFIT &amp; TASK CONFIGURATION
              </h2>
              <p className="text-xs text-zinc-400">
                Review and manage daily current profit payouts for each activated payment plan.
              </p>
            </div>
          </div>

          {/* Plan Daily Profit Rates Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="p-4 rounded-xl bg-[#12141e] border border-amber-500/20 flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    {plan.badge}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    Fee: Rs {plan.pricePKR.toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0b0c10] border border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-mono">Daily Current Profit:</span>
                  <span className="text-sm font-extrabold text-amber-300 font-mono">
                    Rs {(plan.dailyProfitPKR || plan.maxDailyEarnPKR).toLocaleString()} / day
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-1">{plan.courseTitle}</p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono mb-2">
              Valid Learning Task Rewards (Individual Tasks)
            </h3>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-xl bg-[#12141e] border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-mono uppercase">
                        {task.requiredPlan.toUpperCase()} TIER
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-xs text-amber-400 font-semibold">{task.category}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">{task.title}</h4>
                    <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{task.learningSnippet}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="text-xs text-zinc-400 font-mono">Reward:</span>
                    <input
                      type="number"
                      value={task.rewardPKR}
                      onChange={(e) => updateTaskReward(task.id, Number(e.target.value))}
                      className="w-24 p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono font-bold text-emerald-400 text-center focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-xs font-mono text-zinc-400">PKR</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: PORTAL HIDE & FOOTER BUTTON SETTINGS */}
      {activeAdminTab === 'portal-security' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#11131c] border border-zinc-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-3">
              <div className="flex items-center gap-3 text-red-400">
                <div className="w-10 h-10 rounded-xl bg-red-950/50 border border-red-500/40 flex items-center justify-center">
                  <Sliders className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display tracking-wide flex items-center gap-2">
                    <span>ADMIN PANEL HIDE &amp; FOOTER BUTTON SETTINGS</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-600/20 text-red-400 font-mono border border-red-500/30">
                      LIVE CONFIG
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Customize whether the admin entry point is visible, discreet/hidden, or removed from the footer.
                  </p>
                </div>
              </div>
            </div>

            {/* Visibility Mode Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-200 font-mono uppercase tracking-wider block">
                Choose Footer Admin Button Mode:
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Mode 1: Visible Footer Button */}
                <div
                  onClick={() => handleUpdatePortalSettings({ footerButtonMode: 'button' })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    portalSettings.footerButtonMode === 'button'
                      ? 'bg-red-950/40 border-red-500 shadow-lg shadow-red-950/40 ring-1 ring-red-500/50'
                      : 'bg-[#141622] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      1. Visible Footer Button
                    </span>
                    {portalSettings.footerButtonMode === 'button' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-500 font-mono">Click to Select</span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Adds a dedicated button in the footer bottom next to Privacy &amp; Terms. Clicking it opens the manual email &amp; password admin login modal.
                  </p>
                </div>

                {/* Mode 2: Stealth / Discreet Trigger */}
                <div
                  onClick={() => handleUpdatePortalSettings({ footerButtonMode: 'discreet' })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    portalSettings.footerButtonMode === 'discreet'
                      ? 'bg-red-950/40 border-red-500 shadow-lg shadow-red-950/40 ring-1 ring-red-500/50'
                      : 'bg-[#141622] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-amber-400" />
                      2. Stealth / Discreet
                    </span>
                    {portalSettings.footerButtonMode === 'discreet' ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-500 font-mono">Click to Select</span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Hides a subtle lock touchpoint inside the copyright line. Invisible to regular visitors; clicking it opens the manual email &amp; password login.
                  </p>
                </div>

                {/* Mode 3: Completely Hidden */}
                <div
                  onClick={() => handleUpdatePortalSettings({ footerButtonMode: 'hidden' })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    portalSettings.footerButtonMode === 'hidden'
                      ? 'bg-red-950/40 border-red-500 shadow-lg shadow-red-950/40 ring-1 ring-red-500/50'
                      : 'bg-[#141622] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-zinc-400" />
                      3. Completely Hidden
                    </span>
                    {portalSettings.footerButtonMode === 'hidden' ? (
                      <span className="px-2 py-0.5 rounded-full bg-zinc-500/20 text-zinc-300 text-[10px] font-mono font-bold">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-500 font-mono">Click to Select</span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Removes all admin buttons from the footer entirely. Admin logs in exclusively through the top header or the sign-in modal.
                  </p>
                </div>
              </div>
            </div>

            {/* Customize Button Label (Shown when in 'button' mode) */}
            {portalSettings.footerButtonMode === 'button' && (
              <div className="p-4 rounded-xl bg-[#0e1017] border border-zinc-800 space-y-2">
                <label className="text-xs font-bold text-zinc-300 font-mono block">
                  Customize Footer Button Label:
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={portalSettings.footerButtonLabel}
                    onChange={(e) =>
                      setGatewayForm({
                        ...gatewayForm,
                        adminPortalSettings: {
                          ...portalSettings,
                          footerButtonLabel: e.target.value
                        }
                      })
                    }
                    placeholder="e.g. Staff / Admin Access"
                    className="flex-1 p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white font-mono focus:outline-none focus:border-red-400"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdatePortalSettings({
                        footerButtonLabel: gatewayForm.adminPortalSettings?.footerButtonLabel || 'Staff / Admin Access'
                      })
                    }
                    className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-mono transition-colors cursor-pointer"
                  >
                    Save Custom Label
                  </button>
                </div>
                <div className="flex items-center gap-1.5 pt-1 text-[11px] text-zinc-500 font-mono">
                  <span>Quick suggestions:</span>
                  {['Staff / Admin Access', 'Administrator Portal', 'System Console', 'Staff Login'].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleUpdatePortalSettings({ footerButtonLabel: label })}
                      className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Header Admin Button Visibility Toggle */}
            <div className="p-4 rounded-xl bg-[#0e1017] border border-zinc-800 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-white font-mono flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Show "Admin" Button in Top Header</span>
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Display the red Admin button in the navigation header bar when logged out.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleUpdatePortalSettings({ showInHeader: !portalSettings.showInHeader })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                  portalSettings.showInHeader ? 'bg-emerald-500' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    portalSettings.showInHeader ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Live Interactive Footer Preview Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider block">
                Live Preview of Website Footer Bottom:
              </label>
              <div className="p-4 rounded-xl bg-[#07080b] border border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 font-mono">
                <div className="flex items-center gap-1.5">
                  <span>© 2026 Learn to Earn Gold Academy Pvt Ltd. All rights reserved.</span>
                  {portalSettings.footerButtonMode === 'discreet' && (
                    <span className="inline-flex items-center text-amber-400/80 bg-amber-400/10 px-1 py-0.5 rounded text-[10px]" title="Discreet lock visible only on hover">
                      <Lock className="w-2.5 h-2.5 mr-0.5" /> [Secret Trigger]
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-600">Privacy &amp; Terms</span>
                  {portalSettings.footerButtonMode === 'button' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#10121a] text-zinc-300 border border-red-500/40 text-[11px] font-mono shadow-sm">
                      <ShieldCheck className="w-3 h-3 text-red-400" />
                      <span>{portalSettings.footerButtonLabel || 'Staff / Admin Access'}</span>
                    </span>
                  )}
                  {portalSettings.footerButtonMode === 'hidden' && (
                    <span className="text-[10px] text-zinc-600 italic">(Button Hidden from Footer)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Platform Theme Style Selector */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1017] border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white font-mono uppercase">
                    Platform Theme Style (All Visitors)
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono">
                  {THEME_PRESETS.find((p) => p.id === currentTheme)?.name || 'Theme'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Choose the visual design and color identity for the academy portal. Updates immediately across all sections.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                {THEME_PRESETS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setCurrentTheme(t.id);
                      showToast('success', 'Theme Style Changed', `Activated ${t.name} style.`);
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                      currentTheme === t.id
                        ? 'bg-zinc-900 border-amber-400 ring-1 ring-amber-400/50 shadow-md'
                        : 'bg-[#12151f] border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex items-center -space-x-1 shrink-0">
                        <span className="w-3.5 h-3.5 rounded-full border border-black/40" style={{ backgroundColor: t.primaryColor }} />
                        <span className="w-3 h-3 rounded-full border border-black/40" style={{ backgroundColor: t.accentColor }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{t.name}</p>
                        <p className="text-[10px] text-zinc-400 font-mono truncate">{t.tagline.split(',')[0]}</p>
                      </div>
                    </div>
                    {currentTheme === t.id && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-xs text-red-200/90 space-y-1.5 font-mono">
              <div className="flex items-center gap-2 text-white font-bold">
                <ShieldCheck className="w-4 h-4 text-red-400" />
                <span>Security &amp; Manual Login Notice</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Clicking the footer button in any mode prompts for manual email (<code className="text-amber-300">maharmadni058@gmail.com</code> / <code className="text-amber-300">maharmadni58@gmail.com</code>) and password (<code className="text-amber-300">MNB123@@$$&amp;11</code>).
                All attempts are safeguarded by the 5-attempt rate-limiting shield and 15-minute lockout cooldown.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
