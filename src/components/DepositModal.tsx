import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod, PlanTier } from '../types';
import {
  X,
  Copy,
  Check,
  QrCode,
  Upload,
  AlertCircle,
  ShieldCheck,
  Building2,
  Smartphone,
  Coins,
  ArrowRight
} from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlanId?: PlanTier | null;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  defaultPlanId
}) => {
  const { paymentSettings, plans, submitDeposit, showToast } = useApp();

  const [selectedPlanId, setSelectedPlanId] = useState<PlanTier>(defaultPlanId || 'gold');
  const [method, setMethod] = useState<PaymentMethod>('jazzcash');
  const [senderAccount, setSenderAccount] = useState('');
  const [senderTitle, setSenderTitle] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptSimulated, setReceiptSimulated] = useState<string>('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80');

  if (!isOpen) return null;

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[2];
  const requiredAmountPKR = selectedPlan.pricePKR;
  const usdtAmount = (requiredAmountPKR / (paymentSettings.usdt.exchangeRatePKR || 280)).toFixed(2);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast('info', 'Copied to Clipboard', `${label}: ${text}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
                Instant Pakistani Mobile Wallets &amp; USDT Gateways
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

          {/* Payment Method Tabs */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block mb-2 font-mono">
              2. Select Payment Gateway
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setMethod('jazzcash')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  method === 'jazzcash'
                    ? 'bg-red-950/70 border-red-500 text-red-200 shadow-md'
                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <span>JazzCash</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('easypaisa')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  method === 'easypaisa'
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-md'
                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <span>Easypaisa</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('bank')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  method === 'bank'
                    ? 'bg-blue-950/70 border-blue-500 text-blue-200 shadow-md'
                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Bank Transfer</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('usdt')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  method === 'usdt'
                    ? 'bg-amber-950/70 border-amber-500 text-amber-200 shadow-md'
                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>USDT Crypto</span>
              </button>
            </div>
          </div>

          {/* Account Details Box (Dynamically fetched from Admin settings!) */}
          <div className="p-4 rounded-xl bg-[#090a10] border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider font-mono">
                Official Academy Receiver Details:
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Verified Gateway</span>
            </div>

            {method === 'jazzcash' && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Account Number:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm">
                      {paymentSettings.jazzcash.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentSettings.jazzcash.accountNumber, 'JazzCash Number')}
                      className="text-amber-400 hover:text-amber-300 p-1"
                    >
                      {copiedField === 'JazzCash Number' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Account Title:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-200">
                      {paymentSettings.jazzcash.accountTitle}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentSettings.jazzcash.accountTitle, 'JazzCash Title')}
                      className="text-amber-400 hover:text-amber-300 p-1"
                    >
                      {copiedField === 'JazzCash Title' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/80">
                  {paymentSettings.jazzcash.instructions}
                </p>
              </div>
            )}

            {method === 'easypaisa' && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Account Number:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm">
                      {paymentSettings.easypaisa.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentSettings.easypaisa.accountNumber, 'Easypaisa Number')}
                      className="text-amber-400 hover:text-amber-300 p-1"
                    >
                      {copiedField === 'Easypaisa Number' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Account Title:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-200">
                      {paymentSettings.easypaisa.accountTitle}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentSettings.easypaisa.accountTitle, 'Easypaisa Title')}
                      className="text-amber-400 hover:text-amber-300 p-1"
                    >
                      {copiedField === 'Easypaisa Title' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/80">
                  {paymentSettings.easypaisa.instructions}
                </p>
              </div>
            )}

            {method === 'bank' && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Bank Name:</span>
                  <span className="font-bold text-white">{paymentSettings.bank.bankName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Account Title:</span>
                  <span className="font-semibold text-zinc-200">{paymentSettings.bank.accountTitle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">IBAN:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-zinc-200 text-[11px]">{paymentSettings.bank.iban}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentSettings.bank.iban, 'IBAN')}
                      className="text-amber-400 hover:text-amber-300 p-1"
                    >
                      {copiedField === 'IBAN' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Account No:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-zinc-200 text-xs font-bold">{paymentSettings.bank.accountNumber}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentSettings.bank.accountNumber, 'Account Number')}
                      className="text-amber-400 hover:text-amber-300 p-1"
                    >
                      {copiedField === 'Account Number' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/80">
                  {paymentSettings.bank.instructions}
                </p>
              </div>
            )}

            {method === 'usdt' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between bg-zinc-900/60 p-2 rounded-lg">
                  <span className="text-zinc-400">Rate &amp; Amount:</span>
                  <span className="font-mono font-bold text-amber-300">
                    Rs {requiredAmountPKR} = {usdtAmount} USDT
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">USDT (TRC-20) Wallet:</span>
                  <div className="flex items-center gap-2 mt-1 bg-black/60 p-2 rounded-lg border border-zinc-800">
                    <span className="font-mono text-[11px] text-zinc-300 truncate flex-1">
                      {paymentSettings.usdt.trc20Address}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentSettings.usdt.trc20Address, 'USDT TRC20 Address')}
                      className="text-amber-400 hover:text-amber-300 px-2 py-0.5 rounded bg-zinc-800 text-[10px]"
                    >
                      {copiedField === 'USDT TRC20 Address' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/80">
                  {paymentSettings.usdt.instructions}
                </p>
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
