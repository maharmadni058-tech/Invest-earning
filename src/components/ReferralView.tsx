import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Share2,
  Copy,
  Check,
  Users,
  Percent,
  Sparkles,
  Award,
  ArrowRight,
  TrendingUp,
  MessageCircle
} from 'lucide-react';

export const ReferralView: React.FC = () => {
  const { currentUser, users, transactions, plans, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  const inviteUrl = `${window.location.origin}/?ref=${currentUser.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    showToast('success', 'Referral Link Copied!', 'Share your link on WhatsApp, Facebook, or Telegram.');
    setTimeout(() => setCopied(false), 2500);
  };

  // Find all referees sponsored by this user
  const downlineMembers = users.filter((u) => u.referredByCode === currentUser.referralCode);

  // Find referral transactions for this user
  const referralTxs = transactions.filter(
    (t) => t.userId === currentUser.id && t.type === 'referral_bonus'
  );

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `Assalam o Alaikum! Join Learn to Earn Gold Academy.\nLearn high-demand digital skills (Freelancing, Dropshipping, AI Tools) and earn daily practical verified task rewards!\n\nSign up with my 10% bonus link:\n${inviteUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareTelegram = () => {
    const text = encodeURIComponent(
      `Join Learn to Earn Gold Academy. Daily skill tasks + 10% referral commissions!\n${inviteUrl}`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1b1c28] via-[#13151f] to-[#0c0d12] border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-bold uppercase">
              Affiliate Program
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-xs text-emerald-400 font-mono">10% Instant Payout</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2 font-display">
            REFER &amp; EARN 10% COMMISSION
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl leading-relaxed">
            Invite students, friends, and freelancers. Whenever an invited member activates any academy membership tier, 10% is credited directly to your wallet instantly with zero delay.
          </p>
        </div>

        {/* Stats card */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          <div className="bg-[#0b0c10] p-4 rounded-xl border border-zinc-800 text-center min-w-[130px]">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono block">
              Total Team Size
            </span>
            <span className="text-2xl font-extrabold text-amber-300 font-mono-numbers mt-1 block">
              {downlineMembers.length}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Direct Invites</span>
          </div>

          <div className="bg-[#0b0c10] p-4 rounded-xl border border-zinc-800 text-center min-w-[130px]">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono block">
              Referral Profit
            </span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono-numbers mt-1 block">
              Rs {currentUser.referralEarningsPKR.toLocaleString()}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">10% Cash Paid</span>
          </div>
        </div>
      </div>

      {/* Share Box & Quick Links */}
      <div className="p-6 rounded-2xl bg-[#12141e] border border-zinc-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <Share2 className="w-4 h-4 text-amber-400" />
          Your Unique 10% Referral Invitation Link
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="flex-1 w-full bg-[#0a0b0f] px-3.5 py-2.5 rounded-xl border border-zinc-700 font-mono text-xs text-amber-300 truncate">
            {inviteUrl}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
            <button
              onClick={shareWhatsApp}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              onClick={shareTelegram}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
              title="Share on Telegram"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Telegram</span>
            </button>
          </div>
        </div>

        {/* Commission Table per Tier */}
        <div className="pt-3 border-t border-zinc-800/80">
          <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono block mb-2">
            Instant 10% Earnings Breakdown Across All Tiers:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
            {plans.map((p) => {
              const commission = Math.round(p.pricePKR * 0.10);
              return (
                <div key={p.id} className="p-2.5 rounded-xl bg-[#090a10] border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 font-mono block truncate">{p.name.split(' ')[0]}</span>
                  <span className="text-[11px] text-zinc-500 font-mono">Rs {p.pricePKR}</span>
                  <span className="text-xs font-bold text-amber-300 font-mono block mt-1">
                    +Rs {commission}
                  </span>
                  <span className="text-[9px] text-emerald-400 font-mono">10% Cash</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Direct Referrals List */}
      <div className="rounded-2xl bg-[#12141e] border border-zinc-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Your Enrolled Downline Members ({downlineMembers.length})
            </h3>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">
            Real-Time Network Sync
          </span>
        </div>

        {downlineMembers.length === 0 ? (
          <div className="p-8 text-center bg-[#090a0f] rounded-xl border border-zinc-800/80 text-zinc-400 space-y-2">
            <Users className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-sm font-semibold text-zinc-300">No Direct Referrals Yet</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Share your link with colleagues and social media groups to start earning 10% commissions today.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0c10] text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Enrolled Tier</th>
                  <th className="py-2.5 px-3">Joined Date</th>
                  <th className="py-2.5 px-3 text-right">Commission Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {downlineMembers.map((member) => {
                  const memberPlan = plans.find((p) => p.id === member.currentPlanId);
                  const commissionPaid = memberPlan ? Math.round(memberPlan.pricePKR * 0.10) : 0;

                  return (
                    <tr key={member.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-3 text-white font-medium flex items-center gap-2">
                        <img
                          src={member.avatarUrl}
                          alt={member.fullName}
                          className="w-6 h-6 rounded-full object-cover border border-zinc-700"
                        />
                        <span>{member.fullName}</span>
                      </td>
                      <td className="py-3 px-3 text-zinc-400">{member.phone}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold uppercase">
                          {member.currentPlanId ? member.currentPlanId.toUpperCase() : 'FREE'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-zinc-400">{member.joinedDate}</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-400">
                        +Rs {commissionPaid.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
