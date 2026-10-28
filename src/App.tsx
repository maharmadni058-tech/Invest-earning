/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { FrozenAccountBanner } from './components/FrozenAccountBanner';
import { DashboardOverview } from './components/DashboardOverview';
import { PlansSection } from './components/PlansSection';
import { DailyTasksView } from './components/DailyTasksView';
import { CoursesView } from './components/CoursesView';
import { ReferralView } from './components/ReferralView';
import { TransactionHistoryView } from './components/TransactionHistoryView';
import { AdminPanel } from './components/AdminPanel';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { AuthModal } from './components/AuthModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PlanTier } from './types';

function MainAppContent() {
  const { isAdminMode } = useApp();

  const [activeTab, setActiveTab] = useState<string>('plans');
  const [isDepositOpen, setIsDepositOpen] = useState<boolean>(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState<boolean>(false);
  const [selectedPlanForDeposit, setSelectedPlanForDeposit] = useState<PlanTier | null>(null);

  const handleOpenDepositWithPlan = (planId: PlanTier) => {
    setSelectedPlanForDeposit(planId);
    setIsDepositOpen(true);
  };

  const handleOpenGeneralDeposit = () => {
    setSelectedPlanForDeposit(null);
    setIsDepositOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Header */}
      <Header
        onOpenDeposit={handleOpenGeneralDeposit}
        onOpenWithdraw={() => setIsWithdrawOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Warning banner if account is restricted */}
      <FrozenAccountBanner />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-12 space-y-8">
        {isAdminMode ? (
          <AdminPanel />
        ) : (
          <>
            {/* User Dashboard VIP Card & Metric Overview */}
            <DashboardOverview
              onOpenDeposit={handleOpenGeneralDeposit}
              onOpenWithdraw={() => setIsWithdrawOpen(true)}
              setActiveTab={setActiveTab}
            />

            {/* Active Sub-View */}
            <div className="pt-2">
              {activeTab === 'plans' && (
                <PlansSection onSelectPlanForDeposit={handleOpenDepositWithPlan} />
              )}
              {activeTab === 'tasks' && (
                <DailyTasksView
                  onOpenDeposit={handleOpenGeneralDeposit}
                  setActiveTab={setActiveTab}
                />
              )}
              {activeTab === 'courses' && <CoursesView />}
              {activeTab === 'referrals' && <ReferralView />}
              {activeTab === 'wallet' && <TransactionHistoryView />}
            </div>
          </>
        )}
      </main>

      {/* Deposit & Enrollment Modal */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        defaultPlanId={selectedPlanForDeposit}
      />

      {/* Withdrawal Cashout Modal */}
      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
      />

      {/* User Login & Register Modal */}
      <AuthModal />

      {/* Secret Admin Authentication Modal */}
      <AdminLoginModal />

      {/* Floating Toast Notification Container */}
      <ToastContainer />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDeposit={handleOpenGeneralDeposit}
      />

      {/* Platform Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
