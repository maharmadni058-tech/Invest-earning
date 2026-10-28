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
  MessageCircle,
  Layers,
  Network
} from 'lucide-react';

export const ReferralView: React.FC = () => {
  const { currentUser, users, transactions, plans, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [selectedLevelTab, setSelectedLevelTab] = useState<'all' | 'l1' | 'l2' | 'l3'>('all');

  const inviteUrl = `${window.location.origin}/?ref=${currentUser.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    showToast('success', 'Referral Link Copied!', 'Share your link on WhatsApp, Facebook, or Telegram.');
    setTimeout(() => setCopied(false), 2500);
  };

  // Find Level 1 Members (Directly referred by current user)
  const level1Members = users.filter((u) => u.referredByCode === currentUser.referralCode);
  const level1Codes = level1Members.map((m) => m.referralCode);

  // Find Level 2 Members (Referred by Level 1 members)
  const level2Members = users.filter((u) => u.referredByCode && level1Codes.includes(u.referredByCode));
  const level2Codes = level2Members.map((m) => m.referralCode);

  // Find Level 3 Members (Referred by Level 2 members)
  const level3Members = users.filter((u) => u.referredByCode && level2Codes.includes(u.referredByCode));

  const totalTeamCount = level1Members.length + level2Members.length + level3Members.length;

  const level1Earnings = currentUser.referralEarningsPKR || 0;
  const level2Earnings = currentUser.level2ReferralEarningsPKR || 0;
  const level3Earnings = currentUser.level3ReferralEarningsPKR || 0;
  const totalMultiTierEarnings = level1Earnings + level2Earnings + level3Earnings;

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `Assalam o Alaikum! Join Learn to Earn Gold Academy.\nLearn high-demand digital skills (Freelancing, Dropshipping, AI Tools) and earn 3-Tier team rewards (10% + 3% + 1%)!\n\nSign up with my official invite link:\n${inviteUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareTelegram = () => {
    const text = encodeURIComponent(
      `Join Learn to Earn Gold Academy. Daily skill tasks + 3-Tier referral commissions (10%, 3%, 1%)!\n${inviteUrl}`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${text}`, '_blank');
  };

  // Filter members based on selected tab
  const displayedMembers = [
    ...level1Members.map((m) => ({ ...m, level: 1, rate: '10%' })),
    ...level2Members.map((m) => ({ ...m, level: 2, rate: '3%' })),
    ...level3Members.map((m) => ({ ...m, level: 3, rate: '1%' }))
  ].filter((m) => {
    if (selectedLevelTab === 'all') return true;
    if (selectedLevelTab === 'l1') return m.level === 1;
    if (selectedLevelTab === 'l2') return m.level === 2;
    if (selectedLevelTab === 'l3') return m.level === 3;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1b1c28] via-[#13151f] to-[#0c0d12] border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-bold uppercase">
              3-Tier Affiliate Network
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-xs text-emerald-400 font-mono">10% + 3% + 1% Payouts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2 font-display">
            3-LEVEL REFERRAL SYSTEM
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl leading-relaxed">
            Earn instant multi-tier commissions when students enroll in academy memberships. Receive <strong>10% from Level 1</strong>, <strong>3% from Level 2</strong>, and <strong>1% from Level 3</strong> team members.
          </p>
        </div>

        {/* 3-Tier Earnings Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full md:w-auto">
          <div className="bg-[#0b0c10] p-3.5 rounded-xl border border-amber-500/30 text-center">
            <span className="text-[10px] text-amber-400 uppercase tracking-wider font-mono block">
              Level 1 (10%)
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-white font-mono-numbers mt-0.5 block">
              Rs {level1Earnings.toLocaleString()}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">{level1Members.length} Direct</span>
          </div>

          <div className="bg-[#0b0c10] p-3.5 rounded-xl border border-blue-500/30 text-center">
            <span className="text-[10px] text-blue-400 uppercase tracking-wider font-mono block">
              Level 2 (3%)
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-white font-mono-numbers mt-0.5 block">
              Rs {level2Earnings.toLocaleString()}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">{level2Members.length} Team</span>
          </div>

          <div className="bg-[#0b0c10] p-3.5 rounded-xl border border-emerald-500/30 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-mono block">
              Level 3 (1%)
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-white font-mono-numbers mt-0.5 block">
              Rs {level3Earnings.toLocaleString()}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">{level3Members.length} Network</span>
          </div>
        </div>
      </div>

      {/* Share Box & Quick Links */}
      <div className="p-6 rounded-2xl bg-[#12141e] border border-zinc-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <Share2 className="w-4 h-4 text-amber-400" />
          Your Unique 3-Tier Sponsor Invitation Link
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

        {/* 3-Tier Commission Table Breakdown per Plan */}
        <div className="pt-3 border-t border-zinc-800/80">
          <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono block mb-2">
            3-Level Commission Calculator per Membership Tier:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
            {plans.map((p) => {
              const commL1 = Math.round(p.pricePKR * 0.10);
              const commL2 = Math.round(p.pricePKR * 0.03);
              const commL3 = Math.round(p.pricePKR * 0.01);

              return (
                <div key={p.id} className="p-2.5 rounded-xl bg-[#090a10] border border-zinc-800 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-300 font-mono font-bold block truncate">{p.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Rs {p.pricePKR}</span>
                  </div>

                  <div className="mt-2 pt-1 border-t border-zinc-800/80 space-y-0.5 text-[10px] font-mono text-left">
                    <div className="flex justify-between text-amber-300">
                      <span>L1 (10%):</span>
                      <span className="font-bold">Rs {commL1}</span>
                    </div>
                    <div className="flex justify-between text-blue-300">
                      <span>L2 (3%):</span>
                      <span className="font-bold">Rs {commL2}</span>
                    </div>
                    <div className="flex justify-between text-emerald-300">
                      <span>L3 (1%):</span>
                      <span className="font-bold">Rs {commL3}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Downline Network List with Level 1, 2, and 3 Filters */}
      <div className="rounded-2xl bg-[#12141e] border border-zinc-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Team Downline Network ({displayedMembers.length} / {totalTeamCount})
            </h3>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#090a0f] p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => setSelectedLevelTab('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-mono ${
                selectedLevelTab === 'all'
                  ? 'bg-amber-500 text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All ({totalTeamCount})
            </button>
            <button
              onClick={() => setSelectedLevelTab('l1')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-mono ${
                selectedLevelTab === 'l1'
                  ? 'bg-amber-500 text-black font-bold'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              Level 1 ({level1Members.length})
            </button>
            <button
              onClick={() => setSelectedLevelTab('l2')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-mono ${
                selectedLevelTab === 'l2'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-blue-400 hover:text-blue-300'
              }`}
            >
              Level 2 ({level2Members.length})
            </button>
            <button
              onClick={() => setSelectedLevelTab('l3')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-mono ${
                selectedLevelTab === 'l3'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              Level 3 ({level3Members.length})
            </button>
          </div>
        </div>

        {displayedMembers.length === 0 ? (
          <div className="p-8 text-center bg-[#090a0f] rounded-xl border border-zinc-800/80 text-zinc-400 space-y-2">
            <Users className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-sm font-semibold text-zinc-300">No Members in This Tier Yet</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Share your link with colleagues. As your direct students refer others, your Level 2 and Level 3 network expands automatically!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0c10] text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Network Level</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Enrolled Tier</th>
                  <th className="py-2.5 px-3">Joined Date</th>
                  <th className="py-2.5 px-3 text-right">Commission Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {displayedMembers.map((member) => {
                  let levelBadge = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
                  if (member.level === 2) levelBadge = 'bg-blue-500/10 text-blue-300 border-blue-500/30';
                  if (member.level === 3) levelBadge = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';

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
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${levelBadge}`}>
                          Level {member.level} ({member.rate})
                        </span>
                      </td>
                      <td className="py-3 px-3 text-zinc-400">{member.phone}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-bold uppercase">
                          {member.currentPlanId ? member.currentPlanId.toUpperCase() : 'FREE'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-zinc-400">{member.joinedDate}</td>
                      <td className="py-3 px-3 text-right font-bold text-amber-400">
                        {member.rate} Payout
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
