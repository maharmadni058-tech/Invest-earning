import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlanTier } from '../types';
import {
  X,
  Copy,
  Check,
  Upload,
  AlertCircle,
  ShieldCheck,
  Smartphone,
  ArrowRight
} from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlanId?: PlanTier | null;
}

export type DepositPaymentMethod = 'jazzcash' | 'easypaisa';

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  defaultPlanId
}) => {
  const { paymentSettings, plans, submitDeposit, showToast, isLoggedIn, openAuthModal } = useApp();

  const [selectedPlanId, setSelectedPlanId] = useState<PlanTier>(defaultPlanId || 'gold');
  const [method, setMethod] = useState<DepositPaymentMethod>('jazzcash');
  const [senderAccount, setSenderAccount] = useState('');
  const [senderTitle, setSenderTitle] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptSimulated] = useState<string>('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80');

  if (!isOpen) return null;

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[2];
  const requiredAmountPKR = selectedPlan.pricePKR;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast('info', 'Copied to Clipboard', `${label}: ${text}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      showToast('warning', 'Login Required', 'Please sign in or register to submit deposit payment receipts.');
      onClose();
      openAuthModal('login');
      return;
    }

    if (method !== 'jazzcash' && method !== 'easypaisa') {
      showToast('error', 'Invalid Option', 'Only JazzCash and Easypaisa are valid deposit options.');
      return;
    }

    if (!senderAccount.trim()) {
      showToast('error', 'Missing Information', 'Please enter your sender mobile / account number.');
      return;
    }
    if (!trxId.trim()) {
      showToast('error', 'Missing Transaction ID', 'Please enter the Trx ID / TID from your receipt SMS.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = submitDeposit({
        planId: selectedPlanId,
        amountPKR: requiredAmountPKR,
        method,
        senderAccount,
        senderTitle: senderTitle.trim() || 'Valued Member',
        trxId: trxId.trim(),
        proofUrl: receiptSimulated
      });
      setIsSubmitting(false);

      if (res.success) {
        setSenderAccount('');
        setSenderTitle('');
        setTrxId('');
        onClose();
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl bg-[#11131c] border border-amber-500/30 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-[#0c0d14]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                DEPOSIT / ENROLL MEMBERSHIP
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Official Deposit Channels: JazzCash &amp; Easypaisa Only
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Plan Selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block mb-2 font-mono">
              1. Select Desired Membership Tier
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {plans.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    selectedPlanId === p.id
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/10'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <p className="text-xs font-bold truncate">{p.name.split(' ')[0]}</p>
                  <p className="text-xs font-mono font-bold text-amber-300 mt-0.5">
                    Rs {p.pricePKR}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Tabs (ONLY JazzCash & Easypaisa) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
                2. Select Payment Gateway (2 Channels Available)
              </label>
              <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Direct Mobile Accounts
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMethod('jazzcash')}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                  method === 'jazzcash'
                    ? 'bg-red-950/70 border-red-500 text-red-100 shadow-lg shadow-red-950/40 ring-1 ring-red-500/40'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850'
                }`}
              >
                <div className={`p-2 rounded-lg ${method === 'jazzcash' ? 'bg-red-500 text-white' : 'bg-zinc-800 text-red-400'}`}>
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    JazzCash
                    {method === 'jazzcash' && <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-mono">SELECTED</span>}
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                    03087348367
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMethod('easypaisa')}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                  method === 'easypaisa'
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-100 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/40'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850'
                }`}
              >
                <div className={`p-2 rounded-lg ${method === 'easypaisa' ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-emerald-400'}`}>
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    Easypaisa
                    {method === 'easypaisa' && <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">SELECTED</span>}
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                    {paymentSettings.easypaisa.accountNumber}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Account Details Box */}
          <div className="p-4 rounded-xl bg-[#090a10] border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider font-mono">
                Official Academy Receiver Details:
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Verified Deposit Receiver</span>
            </div>

            {method === 'jazzcash' && (
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between bg-zinc-900/70 p-2.5 rounded-lg border border-red-500/20">
                  <span className="text-zinc-400">Account Number:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-300 text-base tracking-wider">
                      {paymentSettings.jazzcash.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentSettings.jazzcash.accountNumber, 'JazzCash Number')}
                      className="text-amber-400 hover:text-amber-300 p-1.5 rounded-md hover:bg-zinc-800"
                    >
                      {copiedField === 'JazzCash Number' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-zinc-900/70 p-2.5 rounded-lg border border-zinc-800">
                  <span className="text-zinc-400">Account Title:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white uppercase tracking-wide">
                      {paymentSettings.jazzcash.accountTitle}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentSettings.jazzcash.accountTitle, 'JazzCash Title')}
                      className="text-amber-400 hover:text-amber-300 p-1.5 rounded-md hover:bg-zinc-800"
                    >
                      {copiedField === 'JazzCash Title' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-300 pt-2 border-t border-zinc-800/80 leading-relaxed bg-zinc-950/40 p-2 rounded">
                  <strong className="text-amber-400">Instructions:</strong> {paymentSettings.jazzcash.instructions}
                </div>
              </div>
            )}

            {method === 'easypaisa' && (
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between bg-zinc-900/70 p-2.5 rounded-lg border border-emerald-500/20">
                  <span className="text-zinc-400">Account Number:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-300 text-base tracking-wider">
                      {paymentSettings.easypaisa.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentSettings.easypaisa.accountNumber, 'Easypaisa Number')}
                      className="text-emerald-400 hover:text-emerald-300 p-1.5 rounded-md hover:bg-zinc-800"
                    >
                      {copiedField === 'Easypaisa Number' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-zinc-900/70 p-2.5 rounded-lg border border-zinc-800">
                  <span className="text-zinc-400">Account Title:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white uppercase tracking-wide">
                      {paymentSettings.easypaisa.accountTitle}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentSettings.easypaisa.accountTitle, 'Easypaisa Title')}
                      className="text-emerald-400 hover:text-emerald-300 p-1.5 rounded-md hover:bg-zinc-800"
                    >
                      {copiedField === 'Easypaisa Title' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-300 pt-2 border-t border-zinc-800/80 leading-relaxed bg-zinc-950/40 p-2 rounded">
                  <strong className="text-emerald-400">Instructions:</strong> {paymentSettings.easypaisa.instructions}
                </div>
              </div>
            )}

            {method !== 'jazzcash' && method !== 'easypaisa' && (
              <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Invalid deposit option selected. Please select either JazzCash or Easypaisa.</span>
              </div>
            )}
          </div>

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-300 block mb-1 font-medium">
                  Your Sender Phone / Account Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0300-1234567"
                  value={senderAccount}
                  onChange={(e) => setSenderAccount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-300 block mb-1 font-medium">
                  Your Sender Account Title / Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Muhammad Ali"
                  value={senderTitle}
                  onChange={(e) => setSenderTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-300 block mb-1 font-medium">
                Transaction ID / TID / Blockchain TxHash *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 11-digit TID from 8558 or 3737 SMS"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
              />
              <p className="text-[10px] text-zinc-400 mt-1">
                Enter the exact reference ID received in your confirmation SMS or payment receipt.
              </p>
            </div>

            {/* Proof Attachment Simulation */}
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-dashed border-zinc-700 text-xs text-zinc-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Payment Screenshot Slip</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                Ready for Verification
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting Payment Slip...</span>
                ) : (
                  <>
                    <span>Submit Deposit Proof (Rs {requiredAmountPKR.toLocaleString()})</span>
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
