import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';
import {
  X,
  Wallet,
  AlertCircle,
  Building2,
  Coins,
  CheckCircle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, paymentSettings, submitWithdrawal, showToast } = useApp();

  const [method, setMethod] = useState<PaymentMethod>('jazzcash');
  const [recipientAccount, setRecipientAccount] = useState(currentUser.phone || '');
  const [recipientTitle, setRecipientTitle] = useState(currentUser.fullName || '');
  const [amountPKR, setAmountPKR] = useState<number>(Math.min(currentUser.balancePKR, 1000));
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const minWithdraw = paymentSettings.minWithdrawPKR || 300;
  const isFrozen = currentUser.status === 'frozen';
  const feePKR = 0; // 0% processing fee
  const netPayoutPKR = Math.max(0, amountPKR - feePKR);

  const handleSetPercent = (pct: number) => {
    const calculated = Math.floor((currentUser.balancePKR * pct) / 100);
    setAmountPKR(calculated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isFrozen) {
      showToast('error', 'Account Frozen', 'Your account is under compliance review. Withdrawals are disabled.');
      return;
    }

    if (amountPKR < minWithdraw) {
      showToast('error', 'Minimum Limit', `Minimum cashout is Rs ${minWithdraw}.`);
      return;
    }

    if (amountPKR > currentUser.balancePKR) {
      showToast('error', 'Insufficient Balance', `You only have Rs ${currentUser.balancePKR} available.`);
      return;
    }

    if (!recipientAccount.trim()) {
      showToast('error', 'Missing Account', 'Please specify your payout recipient number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = submitWithdrawal({
        amountPKR,
        method,
        recipientAccount: recipientAccount.trim(),
        recipientTitle: recipientTitle.trim() || currentUser.fullName
      });
      setIsSubmitting(false);

      if (res.success) {
        onClose();
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#11131c] border border-amber-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-[#0c0d14]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                REQUEST WITHDRAWAL
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Direct to JazzCash, Easypaisa, Bank or USDT
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Frozen Warning if applicable */}
          {isFrozen && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500 text-xs text-red-200 flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Withdrawals Locked</p>
                <p className="text-[11px] text-red-300 mt-0.5">
                  Your account is flagged by admin: {currentUser.freezeReason || 'Compliance audit in progress.'}
                </p>
              </div>
            </div>
          )}

          {/* Balance card */}
          <div className="p-4 rounded-xl bg-[#0a0b10] border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
                Available Wallet Balance
              </span>
              <p className="text-2xl font-extrabold text-amber-300 font-mono-numbers mt-0.5">
                Rs {currentUser.balancePKR.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
                Minimum Cashout
              </span>
              <p className="text-sm font-bold text-zinc-300 font-mono mt-0.5">
                Rs {minWithdraw.toLocaleString()}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block mb-2 font-mono">
                1. Select Payout Channel
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('jazzcash')}
                  className={`p-2 rounded-xl text-center border text-xs font-bold transition-all ${
                    method === 'jazzcash'
                      ? 'bg-red-950/70 border-red-500 text-red-200 shadow-md'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  JazzCash
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('easypaisa')}
                  className={`p-2 rounded-xl text-center border text-xs font-bold transition-all ${
                    method === 'easypaisa'
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-md'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Easypaisa
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('bank')}
                  className={`p-2 rounded-xl text-center border text-xs font-bold transition-all ${
                    method === 'bank'
                      ? 'bg-blue-950/70 border-blue-500 text-blue-200 shadow-md'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Bank Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('usdt')}
                  className={`p-2 rounded-xl text-center border text-xs font-bold transition-all ${
                    method === 'usdt'
                      ? 'bg-amber-950/70 border-amber-500 text-amber-200 shadow-md'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  USDT TRC20
                </button>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-300 block mb-1 font-medium">
                  {method === 'usdt' ? 'Your USDT TRC-20 Address *' : 'Receiver Mobile / Account Number *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={method === 'usdt' ? 'e.g. TYw8eZ... TRC20 address' : 'e.g. 0300-1234567'}
                  value={recipientAccount}
                  onChange={(e) => setRecipientAccount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-300 block mb-1 font-medium">
                  Receiver Account Title / Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahmed Raza Khan"
                  value={recipientTitle}
                  onChange={(e) => setRecipientTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Amount & Quick Percents */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-zinc-300 font-medium">Withdrawal Amount (PKR) *</label>
                <div className="flex items-center gap-1">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleSetPercent(pct)}
                      className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300 font-mono"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="number"
                min={minWithdraw}
                max={currentUser.balancePKR}
                step={50}
                value={amountPKR || ''}
                onChange={(e) => setAmountPKR(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white font-mono font-bold focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Calculation summary */}
            <div className="p-3 rounded-xl bg-[#090a10] border border-zinc-800/80 text-xs space-y-1.5">
              <div className="flex justify-between text-zinc-400">
                <span>Requested Amount:</span>
                <span className="font-mono text-white">Rs {amountPKR.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Processing Fee (0% Promotion):</span>
                <span className="font-mono text-emerald-400">Rs 0</span>
              </div>
              <div className="flex justify-between text-zinc-200 font-bold pt-1 border-t border-zinc-800">
                <span>Net Transfer Amount:</span>
                <span className="font-mono text-amber-300">Rs {netPayoutPKR.toLocaleString()}</span>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isFrozen || amountPKR < minWithdraw || amountPKR > currentUser.balancePKR}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Request...</span>
                ) : (
                  <>
                    <span>Confirm Cashout Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
