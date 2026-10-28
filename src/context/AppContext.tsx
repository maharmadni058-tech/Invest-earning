import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  MembershipPlan,
  PaymentGatewaySettings,
  Transaction,
  DailyTask,
  CourseModule,
  PlanTier,
  PaymentMethod
} from '../types';
import {
  MEMBERSHIP_PLANS,
  INITIAL_PAYMENT_SETTINGS,
  INITIAL_TASKS,
  INITIAL_COURSES,
  INITIAL_USERS,
  INITIAL_TRANSACTIONS
} from '../data/initialData';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface AppContextType {
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  currentUser: User;
  users: User[];
  plans: MembershipPlan[];
  paymentSettings: PaymentGatewaySettings;
  tasks: DailyTask[];
  courses: CourseModule[];
  transactions: Transaction[];
  toasts: ToastNotification[];
  dismissToast: (id: string) => void;
  showToast: (type: ToastNotification['type'], title: string, message: string) => void;
  
  // User Actions
  switchUser: (userId: string) => void;
  completeTask: (taskId: string, chosenOptionIndex: number) => { success: boolean; message: string; reward?: number };
  submitDeposit: (payload: {
    planId: PlanTier;
    amountPKR: number;
    method: PaymentMethod;
    senderAccount: string;
    senderTitle: string;
    trxId: string;
    proofUrl?: string;
  }) => { success: boolean; message: string };
  submitWithdrawal: (payload: {
    amountPKR: number;
    method: PaymentMethod;
    recipientAccount: string;
    recipientTitle: string;
  }) => { success: boolean; message: string };
  enrollPlanDirect: (planId: PlanTier) => { success: boolean; message: string };

  // Admin Actions
  toggleUserStatus: (userId: string, reason?: string) => void;
  adjustUserBalance: (userId: string, amountPKR: number, reason: string) => void;
  updatePaymentSettings: (newSettings: PaymentGatewaySettings) => void;
  approveDeposit: (transactionId: string) => void;
  rejectDeposit: (transactionId: string, reason: string) => void;
  approveWithdrawal: (transactionId: string, trxId?: string) => void;
  rejectWithdrawal: (transactionId: string, reason: string) => void;
  updateTaskReward: (taskId: string, newRewardPKR: number) => void;
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'lte_gold_users_v1',
  CURRENT_USER_ID: 'lte_gold_curr_uid_v1',
  PAYMENTS: 'lte_gold_payments_v1',
  TRANSACTIONS: 'lte_gold_txs_v1',
  TASKS: 'lte_gold_tasks_v1',
  ADMIN_MODE: 'lte_gold_admin_mode_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminMode, setIsAdminModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_MODE);
    return saved ? JSON.parse(saved) : false;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'usr-1';
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentGatewaySettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENT_SETTINGS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [courses] = useState<CourseModule[]>(INITIAL_COURSES);
  const [plans] = useState<MembershipPlan[]>(MEMBERSHIP_PLANS);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, JSON.stringify(isAdminMode));
  }, [isAdminMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(paymentSettings));
  }, [paymentSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  const showToast = (type: ToastNotification['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setIsAdminMode = (val: boolean) => {
    setIsAdminModeState(val);
    showToast('info', val ? 'Admin Mode Activated' : 'User Mode Activated', val ? 'You now have full control over users, payment numbers, and approvals.' : 'Switched back to user dashboard.');
  };

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
    const target = users.find((u) => u.id === userId);
    if (target) {
      showToast('info', 'User Switched', `Now logged in as ${target.fullName} (${target.currentPlanId?.toUpperCase() || 'NO PLAN'})`);
    }
  };

  // Complete a micro-task
  const completeTask = (taskId: string, chosenOptionIndex: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return { success: false, message: 'Task not found' };

    if (currentUser.status === 'frozen') {
      showToast('error', 'Account Frozen', 'Your account is currently frozen by administrator. Task earnings are paused.');
      return { success: false, message: 'Account is frozen' };
    }

    if (!currentUser.currentPlanId) {
      showToast('warning', 'No Active Membership', 'Please enroll in a membership plan to claim daily task rewards.');
      return { success: false, message: 'No active plan' };
    }

    // Check if already completed today
    if (currentUser.completedTasksToday?.includes(taskId)) {
      return { success: false, message: 'You have already completed this task today.' };
    }

    // Check plan tier requirement
    const userPlan = plans.find((p) => p.id === currentUser.currentPlanId);
    const taskPlan = plans.find((p) => p.id === task.requiredPlan);
    
    // Check daily limit
    const maxDaily = userPlan?.dailyTasksCount || 3;
    if ((currentUser.completedTasksToday?.length || 0) >= maxDaily) {
      showToast('warning', 'Daily Limit Reached', `You have reached your daily limit of ${maxDaily} tasks for your tier.`);
      return { success: false, message: `Daily limit of ${maxDaily} tasks reached` };
    }

    if (chosenOptionIndex !== task.correctOptionIndex) {
      showToast('error', 'Incorrect Answer', `Review the learning snippet and try again! Hint: ${task.explanation.substring(0, 45)}...`);
      return { success: false, message: 'Incorrect answer. Please re-read the learning material.' };
    }

    // Correct! Reward user
    const reward = task.rewardPKR;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          const completedList = [...(u.completedTasksToday || []), taskId];
          return {
            ...u,
            balancePKR: u.balancePKR + reward,
            totalEarnedPKR: u.totalEarnedPKR + reward,
            completedTasksToday: completedList,
            lastTaskDate: dateStr
          };
        }
        return u;
      })
    );

    // Record transaction
    const newTx: Transaction = {
      id: `tx-task-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userPhone: currentUser.phone,
      type: 'task_reward',
      amountPKR: reward,
      status: 'completed',
      date: `${dateStr} ${now.toTimeString().substring(0, 5)}`,
      notes: `Verified Learning Task Reward: ${task.title}`
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast('success', 'Task Verified & Rewarded!', `+Rs ${reward} credited to your Gold Wallet.`);
    return { success: true, message: 'Task rewarded', reward };
  };

  // Submit Deposit
  const submitDeposit = (payload: {
    planId: PlanTier;
    amountPKR: number;
    method: PaymentMethod;
    senderAccount: string;
    senderTitle: string;
    trxId: string;
    proofUrl?: string;
  }) => {
    if (currentUser.status === 'frozen') {
      showToast('error', 'Account Frozen', 'Your account is restricted. Contact support.');
      return { success: false, message: 'Account frozen' };
    }

    if (!payload.trxId.trim()) {
      showToast('error', 'Missing Trx ID', 'Please provide the transaction ID / TID.');
      return { success: false, message: 'Missing transaction ID' };
    }

    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 5)}`;

    const newTx: Transaction = {
      id: `tx-dep-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userPhone: currentUser.phone,
      type: 'deposit',
      amountPKR: payload.amountPKR,
      method: payload.method,
      status: 'pending',
      date: dateStr,
      senderAccount: payload.senderAccount,
      senderTitle: payload.senderTitle,
      trxId: payload.trxId,
      planId: payload.planId,
      notes: `Membership Enrollment Request: ${payload.planId.toUpperCase()} Tier (Rs ${payload.amountPKR})`,
      proofImageUrl: payload.proofUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80'
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast('success', 'Deposit Submitted', 'Your payment receipt is under Admin review. Plan will activate upon confirmation.');
    return { success: true, message: 'Deposit submitted successfully' };
  };

  // Submit Withdrawal
  const submitWithdrawal = (payload: {
    amountPKR: number;
    method: PaymentMethod;
    recipientAccount: string;
    recipientTitle: string;
  }) => {
    if (currentUser.status === 'frozen') {
      showToast('error', 'Account Frozen', 'Withdrawals are locked due to administrative freeze on your account.');
      return { success: false, message: 'Account frozen' };
    }

    if (payload.amountPKR > currentUser.balancePKR) {
      showToast('error', 'Insufficient Balance', `Your current available balance is Rs ${currentUser.balancePKR}.`);
      return { success: false, message: 'Insufficient balance' };
    }

    if (payload.amountPKR < paymentSettings.minWithdrawPKR) {
      showToast('error', 'Minimum Limit', `Minimum withdrawal amount is Rs ${paymentSettings.minWithdrawPKR}.`);
      return { success: false, message: 'Below minimum limit' };
    }

    // Deduct balance upfront & hold in pending
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            balancePKR: u.balancePKR - payload.amountPKR
          };
        }
        return u;
      })
    );

    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 5)}`;

    const newTx: Transaction = {
      id: `tx-wd-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userPhone: currentUser.phone,
      type: 'withdraw',
      amountPKR: payload.amountPKR,
      method: payload.method,
      status: 'pending',
      date: dateStr,
      recipientAccount: payload.recipientAccount,
      recipientTitle: payload.recipientTitle,
      notes: `Withdrawal request to ${payload.method.toUpperCase()} (${payload.recipientAccount})`
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast('success', 'Withdrawal Request Sent', `Rs ${payload.amountPKR} held. Admin will disburse to your account.`);
    return { success: true, message: 'Withdrawal requested' };
  };

  // Direct enroll from existing balance
  const enrollPlanDirect = (planId: PlanTier) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return { success: false, message: 'Plan not found' };

    if (currentUser.balancePKR < plan.pricePKR) {
      showToast('warning', 'Insufficient Wallet Balance', `You need Rs ${plan.pricePKR}. You have Rs ${currentUser.balancePKR}. Please make a deposit.`);
      return { success: false, message: 'Insufficient balance' };
    }

    // Deduct and activate plan
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + plan.durationDays);
    const expiryStr = expiry.toISOString().split('T')[0];

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            balancePKR: u.balancePKR - plan.pricePKR,
            currentPlanId: planId,
            planExpiryDate: expiryStr,
            completedTasksToday: []
          };
        }
        return u;
      })
    );

    // Check if user has a referrer and credit 10% instant commission!
    if (currentUser.referredByCode) {
      const sponsor = users.find((u) => u.referralCode === currentUser.referredByCode);
      if (sponsor) {
        const commission = Math.round(plan.pricePKR * 0.10);
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id === sponsor.id) {
              return {
                ...u,
                balancePKR: u.balancePKR + commission,
                totalEarnedPKR: u.totalEarnedPKR + commission,
                referralEarningsPKR: u.referralEarningsPKR + commission
              };
            }
            return u;
          })
        );

        const refTx: Transaction = {
          id: `tx-ref-${Date.now()}`,
          userId: sponsor.id,
          userName: sponsor.fullName,
          userPhone: sponsor.phone,
          type: 'referral_bonus',
          amountPKR: commission,
          status: 'completed',
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          notes: `10% Direct Referral Commission from ${currentUser.fullName} purchasing ${plan.name}`
        };
        setTransactions((prev) => [refTx, ...prev]);
      }
    }

    const now = new Date();
    const tx: Transaction = {
      id: `tx-buy-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userPhone: currentUser.phone,
      type: 'plan_purchase',
      amountPKR: plan.pricePKR,
      status: 'completed',
      date: `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 5)}`,
      planId: planId,
      notes: `Purchased ${plan.name} directly from wallet balance.`
    };
    setTransactions((prev) => [tx, ...prev]);

    showToast('success', `${plan.name} Activated!`, `Enjoy course access, ${plan.dailyTasksCount} daily tasks, and 10% referral perks.`);
    return { success: true, message: 'Enrolled successfully' };
  };

  // ADMIN ACTIONS
  const toggleUserStatus = (userId: string, reason?: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'active' ? 'frozen' : 'active';
          return {
            ...u,
            status: newStatus,
            freezeReason: newStatus === 'frozen' ? (reason || 'Administrative restriction placed by supervisor.') : undefined
          };
        }
        return u;
      })
    );
    showToast('info', 'User Status Updated', `User account status changed.`);
  };

  const adjustUserBalance = (userId: string, amountPKR: number, reason: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updatedBalance = Math.max(0, u.balancePKR + amountPKR);
          return {
            ...u,
            balancePKR: updatedBalance,
            totalEarnedPKR: amountPKR > 0 ? u.totalEarnedPKR + amountPKR : u.totalEarnedPKR
          };
        }
        return u;
      })
    );

    const targetUser = users.find((u) => u.id === userId);
    const now = new Date();
    const tx: Transaction = {
      id: `tx-adj-${Date.now()}`,
      userId,
      userName: targetUser?.fullName || 'User',
      userPhone: targetUser?.phone || '',
      type: 'admin_adjustment',
      amountPKR: Math.abs(amountPKR),
      status: 'completed',
      date: `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 5)}`,
      notes: `Admin adjustment (${amountPKR >= 0 ? '+' : '-'}${Math.abs(amountPKR)} PKR): ${reason}`
    };
    setTransactions((prev) => [tx, ...prev]);
    showToast('success', 'Balance Adjusted', `User balance updated with note: "${reason}"`);
  };

  const updatePaymentSettings = (newSettings: PaymentGatewaySettings) => {
    setPaymentSettings(newSettings);
    showToast('success', 'Gateways Updated', 'Payment numbers, bank details and USDT exchange rates saved successfully.');
  };

  const approveDeposit = (transactionId: string) => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx || tx.status !== 'pending') return;

    // Upgrade user plan if associated with planId
    const userToUpgrade = users.find((u) => u.id === tx.userId);
    if (userToUpgrade && tx.planId) {
      const plan = plans.find((p) => p.id === tx.planId);
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + (plan?.durationDays || 30));
      const expiryStr = expiry.toISOString().split('T')[0];

      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === tx.userId) {
            return {
              ...u,
              currentPlanId: tx.planId || u.currentPlanId,
              planExpiryDate: expiryStr
            };
          }
          return u;
        })
      );

      // Check 10% referral commission for sponsor
      if (userToUpgrade.referredByCode) {
        const sponsor = users.find((u) => u.referralCode === userToUpgrade.referredByCode);
        if (sponsor && plan) {
          const commission = Math.round(plan.pricePKR * 0.10);
          setUsers((prev) =>
            prev.map((u) => {
              if (u.id === sponsor.id) {
                return {
                  ...u,
                  balancePKR: u.balancePKR + commission,
                  totalEarnedPKR: u.totalEarnedPKR + commission,
                  referralEarningsPKR: u.referralEarningsPKR + commission
                };
              }
              return u;
            })
          );

          const refTx: Transaction = {
            id: `tx-ref-comm-${Date.now()}`,
            userId: sponsor.id,
            userName: sponsor.fullName,
            userPhone: sponsor.phone,
            type: 'referral_bonus',
            amountPKR: commission,
            status: 'completed',
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            notes: `10% Direct Referral Commission from ${userToUpgrade.fullName} approved enrollment (${plan.name})`
          };
          setTransactions((prev) => [refTx, ...prev]);
        }
      }
    }

    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === transactionId) {
          return {
            ...t,
            status: 'approved',
            notes: `${t.notes || ''} [Approved by Admin]`
          };
        }
        return t;
      })
    );
    showToast('success', 'Deposit Approved', `Deposit of Rs ${tx.amountPKR} confirmed and plan activated.`);
  };

  const rejectDeposit = (transactionId: string, reason: string) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === transactionId) {
          return {
            ...t,
            status: 'rejected',
            rejectionReason: reason,
            notes: `Rejected by Admin: ${reason}`
          };
        }
        return t;
      })
    );
    showToast('info', 'Deposit Rejected', `Marked as rejected. Reason: ${reason}`);
  };

  const approveWithdrawal = (transactionId: string, trxId?: string) => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx || tx.status !== 'pending') return;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === tx.userId) {
          return {
            ...u,
            totalWithdrawnPKR: u.totalWithdrawnPKR + tx.amountPKR
          };
        }
        return u;
      })
    );

    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === transactionId) {
          return {
            ...t,
            status: 'approved',
            trxId: trxId || `TXD-${Math.floor(100000 + Math.random() * 900000)}`,
            notes: `${t.notes || ''} [Disbursed & Completed]`
          };
        }
        return t;
      })
    );
    showToast('success', 'Withdrawal Processed', `Disbursed Rs ${tx.amountPKR} to ${tx.recipientAccount}`);
  };

  const rejectWithdrawal = (transactionId: string, reason: string) => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx || tx.status !== 'pending') return;

    // Refund held amount back to user's wallet!
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === tx.userId) {
          return {
            ...u,
            balancePKR: u.balancePKR + tx.amountPKR
          };
        }
        return u;
      })
    );

    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === transactionId) {
          return {
            ...t,
            status: 'rejected',
            rejectionReason: reason,
            notes: `Rejected & Refunded: ${reason}`
          };
        }
        return t;
      })
    );
    showToast('info', 'Withdrawal Rejected', `Amount refunded back to user wallet. Reason: ${reason}`);
  };

  const updateTaskReward = (taskId: string, newRewardPKR: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, rewardPKR: newRewardPKR } : t))
    );
    showToast('success', 'Task Reward Updated', `Updated reward for task to Rs ${newRewardPKR}`);
  };

  const resetAllDemoData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUserId('usr-1');
    setPaymentSettings(INITIAL_PAYMENT_SETTINGS);
    setTransactions(INITIAL_TRANSACTIONS);
    setTasks(INITIAL_TASKS);
    setIsAdminModeState(false);
    showToast('info', 'Data Reset', 'All demo state has been reset to defaults.');
  };

  return (
    <AppContext.Provider
      value={{
        isAdminMode,
        setIsAdminMode,
        currentUser,
        users,
        plans,
        paymentSettings,
        tasks,
        courses,
        transactions,
        toasts,
        dismissToast,
        showToast,
        switchUser,
        completeTask,
        submitDeposit,
        submitWithdrawal,
        enrollPlanDirect,
        toggleUserStatus,
        adjustUserBalance,
        updatePaymentSettings,
        approveDeposit,
        rejectDeposit,
        approveWithdrawal,
        rejectWithdrawal,
        updateTaskReward,
        resetAllDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
