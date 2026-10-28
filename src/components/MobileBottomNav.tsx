import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Layers,
  Award,
  BookOpen,
  Share2,
  Wallet,
  ShieldCheck
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDeposit: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenDeposit
}) => {
  const { isAdminMode } = useApp();

  if (isAdminMode) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#0a0b0f]/95 backdrop-blur-md border-t border-zinc-800 px-2 py-1.5 flex items-center justify-around text-[10px] font-medium text-zinc-400">
      <button
        onClick={() => setActiveTab('plans')}
        className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
          activeTab === 'plans' ? 'text-amber-400 font-bold' : 'hover:text-white'
        }`}
      >
        <Layers className="w-4 h-4" />
        <span>Plans</span>
      </button>

      <button
        onClick={() => setActiveTab('tasks')}
        className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
          activeTab === 'tasks' ? 'text-amber-400 font-bold' : 'hover:text-white'
        }`}
      >
        <Award className="w-4 h-4" />
        <span>Tasks</span>
      </button>

      <button
        onClick={onOpenDeposit}
        className="flex flex-col items-center justify-center -mt-4 w-11 h-11 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black shadow-lg shadow-amber-500/30 active:scale-95 transition-transform"
      >
        <span className="text-[10px] font-black uppercase">PAY</span>
      </button>

      <button
        onClick={() => setActiveTab('referrals')}
        className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
          activeTab === 'referrals' ? 'text-amber-400 font-bold' : 'hover:text-white'
        }`}
      >
        <Share2 className="w-4 h-4" />
        <span>10% Ref</span>
      </button>

      <button
        onClick={() => setActiveTab('wallet')}
        className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
          activeTab === 'wallet' ? 'text-amber-400 font-bold' : 'hover:text-white'
        }`}
      >
        <Wallet className="w-4 h-4" />
        <span>Wallet</span>
      </button>
    </div>
  );
};
