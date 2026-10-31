import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TransactionType } from '../types';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Award,
  Share2,
  Zap,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';

export const TransactionHistoryView: React.FC = () => {
  const { transactions, currentUser, isLoggedIn, openAuthModal } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  if (!isLoggedIn) {
    return (
      <div className="p-8 sm:p-12 text-center rounded-3xl bg-[#11131c] border border-amber-500/30 max-w-xl mx-auto space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
          <SlidersHorizontal className="w-7 h-7" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
          TRANSACTION &amp; FINANCIAL HISTORY
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          Please sign in to view your ledger of deposit approvals, task profit claims, and withdrawal disbursements.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => openAuthModal('login')}
            className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Sign In / لاگ ان
          </button>
          <button
            onClick={() => openAuthModal('register')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>Register New Account</span>
          </button>
        </div>
      </div>
    );
  }

  // Filter transactions for current logged-in user
  const userTransactions = transactions.filter((t) => t.userId === currentUser.id);

  const filtered = userTransactions.filter((t) => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-bold uppercase">
              Financial Ledger
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-xs text-zinc-400">Audited Activity Log</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1.5 font-display">
            TRANSACTION HISTORY
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Complete records of your deposits, approved payouts, daily task verification rewards, and 10% referral credits.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#12141d] p-1.5 rounded-xl border border-zinc-800 self-start sm:self-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'deposit', label: 'Deposits' },
            { id: 'withdraw', label: 'Withdrawals' },
            { id: 'task_reward', label: 'Tasks' },
            { id: 'referral_bonus', label: '10% Referrals' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterType === tab.id
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="rounded-2xl bg-[#12141e] border border-zinc-800 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-zinc-500 space-y-2">
            <SlidersHorizontal className="w-8 h-8 mx-auto text-zinc-600" />
            <p className="text-sm font-semibold text-zinc-400">No Transactions Found</p>
            <p className="text-xs text-zinc-600">No activity matching this filter criteria.</p>
          </div>
        ) : (
          <>
            {/* Mobile Card List (< sm: 640px) */}
            <div className="block sm:hidden divide-y divide-zinc-800/80">
              {filtered.map((tx) => {
                let Icon = Zap;
                let iconColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                let amountPrefix = '+';
                let amountClass = 'text-emerald-400';

                if (tx.type === 'deposit') {
                  Icon = ArrowDownToLine;
                  iconColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20';
                  amountPrefix = '+';
                  amountClass = 'text-blue-400';
                } else if (tx.type === 'withdraw') {
                  Icon = ArrowUpFromLine;
                  iconColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                  amountPrefix = '-';
                  amountClass = 'text-rose-400';
                } else if (tx.type === 'task_reward') {
                  Icon = Award;
                  iconColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                  amountPrefix = '+';
                  amountClass = 'text-emerald-400';
                } else if (tx.type === 'referral_bonus') {
                  Icon = Share2;
                  iconColor = 'text-purple-400 bg-purple-500/10 border-purple-500/20';
                  amountPrefix = '+';
                  amountClass = 'text-purple-400';
                } else if (tx.type === 'plan_purchase') {
                  amountPrefix = '-';
                  amountClass = 'text-zinc-300';
                }

                return (
                  <div key={tx.id} className="p-3.5 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`p-2 rounded-xl border shrink-0 ${iconColor}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white uppercase truncate">
                            {tx.type.replace('_', ' ')}
                          </p>
                          <p className="text-[10px] text-zinc-400 font-mono">
                            {tx.date}
                          </p>
                        </div>
                      </div>
                      <div className={`text-right shrink-0 font-bold font-mono text-sm ${amountClass}`}>
                        {amountPrefix}Rs {tx.amountPKR.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-800/40 text-[11px] font-mono">
                      <span className="text-zinc-400 uppercase truncate">
                        {tx.method || 'Wallet'}
                      </span>
                      <div>
                        {tx.status === 'approved' || tx.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Completed
                          </span>
                        ) : tx.status === 'pending' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold uppercase">
                            <Clock className="w-2.5 h-2.5" />
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-bold uppercase">
                            <XCircle className="w-2.5 h-2.5" />
                            Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (>= sm: 640px) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b0c10] text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">Transaction / Type</th>
                    <th className="py-3 px-4">Channel / Method</th>
                    <th className="py-3 px-4">Date &amp; Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Amount (PKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                {filtered.map((tx) => {
                  let Icon = Zap;
                  let iconColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                  let amountPrefix = '+';
                  let amountClass = 'text-emerald-400';

                  if (tx.type === 'deposit') {
                    Icon = ArrowDownToLine;
                    iconColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20';
                    amountPrefix = '+';
                    amountClass = 'text-blue-400';
                  } else if (tx.type === 'withdraw') {
                    Icon = ArrowUpFromLine;
                    iconColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                    amountPrefix = '-';
                    amountClass = 'text-rose-400';
                  } else if (tx.type === 'task_reward') {
                    Icon = Award;
                    iconColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                    amountPrefix = '+';
                    amountClass = 'text-emerald-400';
                  } else if (tx.type === 'referral_bonus') {
                    Icon = Share2;
                    iconColor = 'text-purple-400 bg-purple-500/10 border-purple-500/20';
                    amountPrefix = '+';
                    amountClass = 'text-purple-400';
                  } else if (tx.type === 'plan_purchase') {
                    amountPrefix = '-';
                    amountClass = 'text-zinc-300';
                  }

                  return (
                    <tr key={tx.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl border ${iconColor}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-white font-bold tracking-wide uppercase font-sans">
                              {tx.type.replace('_', ' ')}
                            </p>
                            <p className="text-[11px] text-zinc-400 line-clamp-1 font-sans">
                              {tx.notes || tx.trxId || tx.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-zinc-300 uppercase">
                        {tx.method || 'Internal Wallet'}
                      </td>

                      <td className="py-3.5 px-4 text-zinc-400 text-[11px]">
                        {tx.date}
                      </td>

                      <td className="py-3.5 px-4">
                        {tx.status === 'approved' || tx.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </span>
                        ) : tx.status === 'pending' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold uppercase">
                            <Clock className="w-3 h-3" />
                            Pending Review
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-bold uppercase">
                            <XCircle className="w-3 h-3" />
                            Rejected
                          </span>
                        )}
                      </td>

                      <td className={`py-3.5 px-4 text-right text-sm font-bold font-mono ${amountClass}`}>
                        {amountPrefix}Rs {tx.amountPKR.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      </div>
    </div>
  );
};
