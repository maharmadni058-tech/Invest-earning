import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  MembershipPlan,
  PaymentGatewaySettings,
  Transaction,
  DailyTask,
  CourseModule,
  PlanTier,
  PaymentMethod,
  ThemeStyle
} from '../types';
import { DEFAULT_THEME } from '../data/themes';
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
  currentTheme: ThemeStyle;
  setCurrentTheme: (theme: ThemeStyle) => void;
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
  
  // Real-time server sync across devices
  syncWithServer: () => Promise<void>;

  // Auth & Session
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (phoneOrEmail: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (payload: {
    fullName: string;
    phone: string;
    email: string;
    password: string;
    referralCode?: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loginWithDemo: (userId: string) => void;

  // User Actions
  switchUser: (userId: string) => void;
  claimDailyProfit: () => { success: boolean; message: string; amount?: number };
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

  // Admin Actions & Security
  isAdminAuthenticated: boolean;
  isAdminLoginModalOpen: boolean;
  openAdminLoginModal: () => void;
  closeAdminLoginModal: () => void;
  adminLogin: (email: string, password: string) => Promise<{
    success: boolean;
    message: string;
    remainingAttempts?: number;
    locked?: boolean;
    lockoutSecondsRemaining?: number;
  }>;
  adminLogout: () => void;
  toggleUserStatus: (userId: string, reason?: string) => void;
  adjustUserBalance: (userId: string, amountPKR: number, reason: string) => void;
  assignUserPlan: (userId: string, planId: PlanTier | null) => void;
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
  USERS: 'lte_gold_users_v2',
  CURRENT_USER_ID: 'lte_gold_curr_uid_v2',
  PAYMENTS: 'lte_gold_payments_v3',
  TRANSACTIONS: 'lte_gold_txs_v2',
  TASKS: 'lte_gold_tasks_v2',
  ADMIN_MODE: 'lte_gold_admin_mode_v2',
  ADMIN_AUTH: 'lte_gold_admin_auth_v2',
  THEME: 'lte_gold_theme_style_v1'
};

const GUEST_FALLBACK_USER: User = {
  id: '',
  fullName: 'Guest User',
  phone: '',
  email: '',
  joinedDate: '',
  currentPlanId: null,
  planExpiryDate: null,
  balancePKR: 0,
  totalEarnedPKR: 0,
  totalWithdrawnPKR: 0,
  referralCode: 'GOLD-GUEST',
  referredByCode: null,
  referralEarningsPKR: 0,
  status: 'active',
  completedTasksToday: [],
  lastTaskDate: ''
};

const ADMIN_CREDENTIALS = {
  emails: ['maharmadni58@gmail.com', 'maharmadni058@gmail.com'],
  email: 'maharmadni58@gmail.com',
  phone: '03087348367',
  password: 'MNB123@@$$&11'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [isAdminMode, setIsAdminModeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_MODE);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);

  const [currentTheme, setCurrentThemeState] = useState<ThemeStyle>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (
        saved &&
        ['emerald-wealth', 'obsidian-gold', 'sapphire-night', 'crimson-ruby', 'royal-slate'].includes(saved)
      ) {
        return saved as ThemeStyle;
      }
    } catch {}
    return DEFAULT_THEME;
  });

  const setCurrentTheme = useCallback((newTheme: ThemeStyle) => {
    setCurrentThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      document.body.setAttribute('data-theme', newTheme);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.body.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      return saved || '';
    } catch {
      return '';
    }
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentGatewaySettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (!saved) return INITIAL_PAYMENT_SETTINGS;
    try {
      const parsed = JSON.parse(saved);
      if (parsed?.jazzcash?.accountNumber !== '03087348367') {
        return {
          ...parsed,
          jazzcash: INITIAL_PAYMENT_SETTINGS.jazzcash
        };
      }
      return parsed;
    } catch {
      return INITIAL_PAYMENT_SETTINGS;
    }
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

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(isAdminAuthenticated));
  }, [isAdminAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, JSON.stringify(isAdminMode));
  }, [isAdminMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
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

  // Synchronize state across all client devices with the persistent server database
  const syncWithServer = useCallback(async () => {
    try {
      const localUsersRaw = localStorage.getItem(STORAGE_KEYS.USERS);
      const localTxsRaw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      const localUsers = localUsersRaw ? JSON.parse(localUsersRaw) : [];
      const localTxs = localTxsRaw ? JSON.parse(localTxsRaw) : [];

      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: localUsers, transactions: localTxs })
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.users)) {
          setUsers(data.users);
        }
        if (Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
        }
        if (data.paymentSettings) {
          setPaymentSettings(data.paymentSettings);
        }
        if (Array.isArray(data.tasks)) {
          setTasks(data.tasks);
        }
      }
    } catch {
      // Server starting up or temporary network offline
    }
  }, []);

  // Poll server for updates across devices (every 3 seconds and on tab focus)
  useEffect(() => {
    syncWithServer();

    const interval = setInterval(syncWithServer, 3000);
    const onFocus = () => syncWithServer();
    window.addEventListener('focus', onFocus);
    window.addEventListener('visibilitychange', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('visibilitychange', onFocus);
    };
  }, [syncWithServer]);

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

  const openAdminLoginModal = () => {
    syncWithServer();
    setIsAdminLoginModalOpen(true);
  };
  const closeAdminLoginModal = () => setIsAdminLoginModalOpen(false);

  const adminLogin = async (
    email: string,
    pass: string
  ): Promise<{
    success: boolean;
    message: string;
    remainingAttempts?: number;
    locked?: boolean;
    lockoutSecondsRemaining?: number;
  }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAdminAuthenticated(true);
        setIsAdminModeState(true);
        const adminUser = users.find(
          (u) =>
            u.email?.toLowerCase() === cleanEmail ||
            ADMIN_CREDENTIALS.emails.includes(u.email?.toLowerCase() || '')
        );
        const targetAdminId = adminUser?.id || 'user-admin-master';
        setCurrentUserId(targetAdminId);
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, targetAdminId);
        localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
        localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, 'true');
        setIsAdminLoginModalOpen(false);
        showToast('success', 'Admin Access Granted', 'Welcome Super Admin! Master control console unlocked.');
        await syncWithServer();
        return { success: true, message: data.message || 'Admin authenticated' };
      } else {
        const errorMsg = data.message || 'Invalid administrator email or password.';
        showToast('error', data.locked ? 'Security Lockout' : 'Access Denied', errorMsg);
        return {
          success: false,
          message: errorMsg,
          remainingAttempts: data.attemptsRemaining,
          locked: data.locked,
          lockoutSecondsRemaining: data.lockoutSecondsRemaining
        };
      }
    } catch {
      // Offline fallback: check credentials locally
      const isMatch =
        (ADMIN_CREDENTIALS.emails.includes(cleanEmail) || cleanEmail === ADMIN_CREDENTIALS.phone) &&
        cleanPass === ADMIN_CREDENTIALS.password;

      if (isMatch) {
        setIsAdminAuthenticated(true);
        setIsAdminModeState(true);
        const adminUser = users.find(
          (u) =>
            u.email?.toLowerCase() === cleanEmail ||
            ADMIN_CREDENTIALS.emails.includes(u.email?.toLowerCase() || '')
        );
        const targetAdminId = adminUser?.id || 'user-admin-master';
        setCurrentUserId(targetAdminId);
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, targetAdminId);
        localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
        localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, 'true');
        setIsAdminLoginModalOpen(false);
        showToast('success', 'Admin Access Granted', 'Welcome Super Admin!');
        return { success: true, message: 'Admin authenticated' };
      } else {
        showToast('error', 'Access Denied', 'Invalid administrator email or password.');
        return { success: false, message: 'Invalid admin credentials' };
      }
    }
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminModeState(false);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_MODE);
    showToast('info', 'Admin Session Ended', 'Admin console locked and hidden.');
  };

  const setIsAdminMode = (val: boolean) => {
    if (val && !isAdminAuthenticated) {
      openAdminLoginModal();
      return;
    }
    setIsAdminModeState(val);
    if (val) {
      syncWithServer();
    }
    showToast(
      'info',
      val ? 'Admin Mode Activated' : 'User Mode Activated',
      val ? 'You now have full control over users, payment numbers, and approvals.' : 'Switched back to user dashboard.'
    );
  };

  const isLoggedIn = Boolean(currentUserId && users.some((u) => u.id === currentUserId));
  const currentUser = users.find((u) => u.id === currentUserId) || GUEST_FALLBACK_USER;

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
    syncWithServer();
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (
    phoneOrEmail: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanInput = phoneOrEmail.trim().toLowerCase();
    const cleanDigits = phoneOrEmail.replace(/[^0-9]/g, '');

    // Check if logging in with Super Admin master credentials
    const isAdminEmail =
      ADMIN_CREDENTIALS.emails.includes(cleanInput) ||
      (cleanDigits.length >= 10 && cleanDigits.endsWith('3087348367'));
    const isMasterPassword = password === ADMIN_CREDENTIALS.password;

    if (isAdminEmail && isMasterPassword) {
      setIsAdminAuthenticated(true);
      setIsAdminModeState(true);
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: phoneOrEmail, password })
      });

      const data = await response.json();

      if (response.ok && data.success && data.user) {
        const loggedUser: User = data.user;
        setUsers((prev) => [loggedUser, ...prev.filter((u) => u.id !== loggedUser.id)]);
        setCurrentUserId(loggedUser.id);
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, loggedUser.id);
        if (data.isAdmin || (isAdminEmail && isMasterPassword)) {
          setIsAdminAuthenticated(true);
          setIsAdminModeState(true);
        }
        closeAuthModal();
        showToast('success', 'Logged In Successfully', `Welcome back, ${loggedUser.fullName}!`);
        await syncWithServer();
        return { success: true, message: 'Logged in successfully' };
      } else {
        const errorMsg = data.message || 'Invalid mobile number/email or password.';
        showToast('error', 'Login Failed', errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch {
      // Offline fallback: check in-memory cache
      const foundUser = users.find((u) => {
        const emailMatch = u.email && u.email.toLowerCase() === cleanInput;
        const userPhoneDigits = (u.phone || '').replace(/[^0-9]/g, '');
        const phoneMatch =
          cleanDigits.length >= 7 &&
          (userPhoneDigits.endsWith(cleanDigits.slice(-10)) || userPhoneDigits === cleanDigits);
        const nameMatch = u.fullName && u.fullName.toLowerCase() === cleanInput;
        return emailMatch || phoneMatch || nameMatch;
      });

      if (foundUser) {
        if (foundUser.password && foundUser.password !== password && password !== ADMIN_CREDENTIALS.password) {
          showToast('error', 'Incorrect Password', 'The password entered does not match our records.');
          return { success: false, message: 'Incorrect password' };
        }

        if (foundUser.status === 'frozen') {
          showToast('error', 'Account Restricted', 'Your account is currently frozen. Contact support on WhatsApp: 03087348367.');
          return { success: false, message: 'Account is frozen' };
        }

        setCurrentUserId(foundUser.id);
        closeAuthModal();
        showToast('success', 'Logged In Successfully', `Welcome back, ${foundUser.fullName}!`);
        return { success: true, message: 'Logged in successfully' };
      }

      showToast('error', 'Authentication Error', 'No account found. Check phone/email and password.');
      return { success: false, message: 'Account not found or password incorrect.' };
    }
  };

  const register = async (payload: {
    fullName: string;
    phone: string;
    email: string;
    password: string;
    referralCode?: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success && data.user) {
        const newUser: User = data.user;
        setUsers((prev) => [newUser, ...prev.filter((u) => u.id !== newUser.id)]);
        setCurrentUserId(newUser.id);
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, newUser.id);
        closeAuthModal();
        showToast(
          'success',
          'Account Created Successfully!',
          `Welcome to Learn to Earn Gold, ${newUser.fullName}!`
        );
        return { success: true, message: 'Registered successfully' };
      } else {
        const errorMsg = data.message || 'Could not register account. Please try again.';
        showToast('error', 'Registration Error', errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch {
      showToast('error', 'Network Error', 'Could not reach server to create account. Please check connection.');
      return { success: false, message: 'Server connection failed.' };
    }
  };

  const logout = () => {
    setCurrentUserId('');
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    showToast('info', 'Logged Out', 'You have been safely signed out.');
  };

  const loginWithDemo = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUserId(userId);
      closeAuthModal();
      showToast(
        'success',
        'Demo Login Successful',
        `Logged in as ${target.fullName} (${target.currentPlanId?.toUpperCase() || 'NO PLAN'})`
      );
    }
  };

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
    const target = users.find((u) => u.id === userId);
    if (target) {
      showToast('info', 'User Switched', `Now logged in as ${target.fullName} (${target.currentPlanId?.toUpperCase() || 'NO PLAN'})`);
    }
  };

  // Claim Daily Current Profit for Activated Payment Plan
  const claimDailyProfit = () => {
    if (currentUser.status === 'frozen') {
      showToast('error', 'Account Frozen', 'Your account is currently frozen by administrator. Daily profit claims are locked.');
      return { success: false, message: 'Account is frozen' };
    }

    if (!currentUser.currentPlanId) {
      showToast('warning', 'No Active Payment Plan', 'Please activate a membership payment plan to claim daily profit.');
      return { success: false, message: 'No active plan' };
    }

    const userPlan = plans.find((p) => p.id === currentUser.currentPlanId);
    if (!userPlan) {
      return { success: false, message: 'Plan configuration not found' };
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    // Check if user already claimed today
    const hasClaimedToday =
      currentUser.lastTaskDate === dateStr &&
      currentUser.completedTasksToday &&
      currentUser.completedTasksToday.includes('daily_profit_claim');

    if (hasClaimedToday) {
      showToast('warning', 'Already Claimed Today', 'You have already claimed your daily profit for today. Next claim unlocks at 12:00 AM PKT.');
      return { success: false, message: 'Daily profit already claimed for today' };
    }

    const dailyProfit = userPlan.dailyProfitPKR || userPlan.maxDailyEarnPKR || userPlan.rewardPerTaskPKR;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            balancePKR: u.balancePKR + dailyProfit,
            totalEarnedPKR: u.totalEarnedPKR + dailyProfit,
            completedTasksToday: ['daily_profit_claim'],
            lastTaskDate: dateStr
          };
        }
        return u;
      })
    );

    const newTx: Transaction = {
      id: `tx-profit-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userPhone: currentUser.phone,
      type: 'task_reward',
      amountPKR: dailyProfit,
      status: 'completed',
      date: `${dateStr} ${now.toTimeString().substring(0, 5)}`,
      notes: `Daily Current Profit Claim: ${userPlan.name} (+Rs ${dailyProfit.toLocaleString()})`
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast(
      'success',
      'Daily Profit Claimed Successfully!',
      `+Rs ${dailyProfit.toLocaleString()} daily profit credited to your Gold Wallet.`
    );

    // Persist claim to server database across all devices
    fetch('/api/tasks/claim-daily-profit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id })
    })
      .then(() => syncWithServer())
      .catch((err) => console.error('Failed to sync profit claim to server:', err));

    return { success: true, message: 'Daily profit claimed', amount: dailyProfit };
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

    if (payload.method !== 'jazzcash' && payload.method !== 'easypaisa') {
      showToast('error', 'Invalid Option', 'Deposit is only permitted via JazzCash or Easypaisa.');
      return { success: false, message: 'Invalid payment option. Only JazzCash and Easypaisa are accepted.' };
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

    fetch('/api/deposits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.id,
        planId: payload.planId,
        amountPKR: payload.amountPKR,
        method: payload.method,
        senderAccount: payload.senderAccount,
        senderTitle: payload.senderTitle,
        trxId: payload.trxId,
        proofUrl: payload.proofUrl
      })
    })
      .then(() => syncWithServer())
      .catch((err) => console.error('Error submitting deposit to server:', err));

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

    fetch('/api/withdrawals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.id,
        amountPKR: payload.amountPKR,
        method: payload.method,
        recipientAccount: payload.recipientAccount,
        recipientTitle: payload.recipientTitle
      })
    })
      .then(() => syncWithServer())
      .catch((err) => console.error('Error submitting withdrawal to server:', err));

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

    // Distribute 3-Level Multi-Tier Referral Commissions (Level 1: 10%, Level 2: 3%, Level 3: 1%)
    if (currentUser.referredByCode) {
      const sponsor1 = users.find((u) => u.referralCode === currentUser.referredByCode);
      if (sponsor1) {
        const comm1 = Math.round(plan.pricePKR * 0.10);
        let updatedUsersList = users.map((u) => {
          if (u.id === sponsor1.id) {
            return {
              ...u,
              balancePKR: u.balancePKR + comm1,
              totalEarnedPKR: u.totalEarnedPKR + comm1,
              referralEarningsPKR: u.referralEarningsPKR + comm1
            };
          }
          return u;
        });

        const newRefTxs: Transaction[] = [
          {
            id: `tx-ref-l1-${Date.now()}`,
            userId: sponsor1.id,
            userName: sponsor1.fullName,
            userPhone: sponsor1.phone,
            type: 'referral_bonus',
            amountPKR: comm1,
            status: 'completed',
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            notes: `Level 1 (10% Direct) Referral Commission from ${currentUser.fullName} purchasing ${plan.name}`
          }
        ];

        // Level 2 (3% Commission)
        if (sponsor1.referredByCode) {
          const sponsor2 = updatedUsersList.find((u) => u.referralCode === sponsor1.referredByCode);
          if (sponsor2) {
            const comm2 = Math.round(plan.pricePKR * 0.03);
            updatedUsersList = updatedUsersList.map((u) => {
              if (u.id === sponsor2.id) {
                return {
                  ...u,
                  balancePKR: u.balancePKR + comm2,
                  totalEarnedPKR: u.totalEarnedPKR + comm2,
                  level2ReferralEarningsPKR: (u.level2ReferralEarningsPKR || 0) + comm2
                };
              }
              return u;
            });

            newRefTxs.push({
              id: `tx-ref-l2-${Date.now()}`,
              userId: sponsor2.id,
              userName: sponsor2.fullName,
              userPhone: sponsor2.phone,
              type: 'referral_bonus',
              amountPKR: comm2,
              status: 'completed',
              date: new Date().toISOString().replace('T', ' ').substring(0, 16),
              notes: `Level 2 (3% Team) Referral Commission from ${currentUser.fullName} (via ${sponsor1.fullName}) purchasing ${plan.name}`
            });

            // Level 3 (1% Commission)
            if (sponsor2.referredByCode) {
              const sponsor3 = updatedUsersList.find((u) => u.referralCode === sponsor2.referredByCode);
              if (sponsor3) {
                const comm3 = Math.round(plan.pricePKR * 0.01);
                updatedUsersList = updatedUsersList.map((u) => {
                  if (u.id === sponsor3.id) {
                    return {
                      ...u,
                      balancePKR: u.balancePKR + comm3,
                      totalEarnedPKR: u.totalEarnedPKR + comm3,
                      level3ReferralEarningsPKR: (u.level3ReferralEarningsPKR || 0) + comm3
                    };
                  }
                  return u;
                });

                newRefTxs.push({
                  id: `tx-ref-l3-${Date.now()}`,
                  userId: sponsor3.id,
                  userName: sponsor3.fullName,
                  userPhone: sponsor3.phone,
                  type: 'referral_bonus',
                  amountPKR: comm3,
                  status: 'completed',
                  date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                  notes: `Level 3 (1% Network) Referral Commission from ${currentUser.fullName} (via ${sponsor2.fullName}) purchasing ${plan.name}`
                });
              }
            }
          }
        }

        setUsers(updatedUsersList);
        setTransactions((prev) => [...newRefTxs, ...prev]);
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

    // Persist plan direct enrollment to server across devices
    fetch('/api/plans/enroll-direct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id, planId })
    })
      .then(() => syncWithServer())
      .catch((err) => console.error('Failed to sync plan enrollment to server:', err));

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

    fetch(`/api/admin/users/${userId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    })
      .then(() => syncWithServer())
      .catch((err) => console.error('Failed to update status on server:', err));
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

    fetch(`/api/admin/users/${userId}/balance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amountPKR, reason })
    })
      .then(() => syncWithServer())
      .catch((err) => console.error('Failed to adjust balance on server:', err));
  };

  const assignUserPlan = (userId: string, planId: PlanTier | null) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const plan = plans.find((p) => p.id === planId);
          const expiry = new Date();
          expiry.setDate(expiry.getDate() + (plan?.durationDays || 30));
          return {
            ...u,
            currentPlanId: planId,
            planExpiryDate: planId ? expiry.toISOString().split('T')[0] : null
          };
        }
        return u;
      })
    );
    showToast('success', 'User Plan Updated', `Plan changed to ${planId ? planId.toUpperCase() : 'Free Member'}`);

    fetch(`/api/admin/users/${userId}/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId })
    })
      .then(() => syncWithServer())
      .catch((err) => console.error('Failed to update user plan on server:', err));
  };

  const updatePaymentSettings = (newSettings: PaymentGatewaySettings) => {
    setPaymentSettings(newSettings);
    showToast('success', 'Gateways Updated', 'Payment numbers, bank details and USDT exchange rates saved successfully.');

    fetch('/api/admin/settings/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentSettings: newSettings })
    })
      .then(() => syncWithServer())
      .catch((err) => console.error('Failed to update settings on server:', err));
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

      // Distribute 3-Level Multi-Tier Referral Commissions (Level 1: 10%, Level 2: 3%, Level 3: 1%)
      if (userToUpgrade.referredByCode && plan) {
        const sponsor1 = users.find((u) => u.referralCode === userToUpgrade.referredByCode);
        if (sponsor1) {
          const comm1 = Math.round(plan.pricePKR * 0.10);
          let updatedUsersList = users.map((u) => {
            if (u.id === userToUpgrade.id) {
              return {
                ...u,
                currentPlanId: tx.planId || u.currentPlanId,
                planExpiryDate: expiryStr
              };
            }
            if (u.id === sponsor1.id) {
              return {
                ...u,
                balancePKR: u.balancePKR + comm1,
                totalEarnedPKR: u.totalEarnedPKR + comm1,
                referralEarningsPKR: u.referralEarningsPKR + comm1
              };
            }
            return u;
          });

          const newRefTxs: Transaction[] = [
            {
              id: `tx-ref-comm-l1-${Date.now()}`,
              userId: sponsor1.id,
              userName: sponsor1.fullName,
              userPhone: sponsor1.phone,
              type: 'referral_bonus',
              amountPKR: comm1,
              status: 'completed',
              date: new Date().toISOString().replace('T', ' ').substring(0, 16),
              notes: `Level 1 (10% Direct) Referral Commission from ${userToUpgrade.fullName} approved enrollment (${plan.name})`
            }
          ];

          // Level 2 (3% Commission)
          if (sponsor1.referredByCode) {
            const sponsor2 = updatedUsersList.find((u) => u.referralCode === sponsor1.referredByCode);
            if (sponsor2) {
              const comm2 = Math.round(plan.pricePKR * 0.03);
              updatedUsersList = updatedUsersList.map((u) => {
                if (u.id === sponsor2.id) {
                  return {
                    ...u,
                    balancePKR: u.balancePKR + comm2,
                    totalEarnedPKR: u.totalEarnedPKR + comm2,
                    level2ReferralEarningsPKR: (u.level2ReferralEarningsPKR || 0) + comm2
                  };
                }
                return u;
              });

              newRefTxs.push({
                id: `tx-ref-comm-l2-${Date.now()}`,
                userId: sponsor2.id,
                userName: sponsor2.fullName,
                userPhone: sponsor2.phone,
                type: 'referral_bonus',
                amountPKR: comm2,
                status: 'completed',
                date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                notes: `Level 2 (3% Team) Referral Commission from ${userToUpgrade.fullName} (via ${sponsor1.fullName}) approved enrollment (${plan.name})`
              });

              // Level 3 (1% Commission)
              if (sponsor2.referredByCode) {
                const sponsor3 = updatedUsersList.find((u) => u.referralCode === sponsor2.referredByCode);
                if (sponsor3) {
                  const comm3 = Math.round(plan.pricePKR * 0.01);
                  updatedUsersList = updatedUsersList.map((u) => {
                    if (u.id === sponsor3.id) {
                      return {
                        ...u,
                        balancePKR: u.balancePKR + comm3,
                        totalEarnedPKR: u.totalEarnedPKR + comm3,
                        level3ReferralEarningsPKR: (u.level3ReferralEarningsPKR || 0) + comm3
                      };
                    }
                    return u;
                  });

                  newRefTxs.push({
                    id: `tx-ref-comm-l3-${Date.now()}`,
                    userId: sponsor3.id,
                    userName: sponsor3.fullName,
                    userPhone: sponsor3.phone,
                    type: 'referral_bonus',
                    amountPKR: comm3,
                    status: 'completed',
                    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                    notes: `Level 3 (1% Network) Referral Commission from ${userToUpgrade.fullName} (via ${sponsor2.fullName}) approved enrollment (${plan.name})`
                  });
                }
              }
            }
          }

          setUsers(updatedUsersList);
          setTransactions((prev) => [...newRefTxs, ...prev]);
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

    fetch(`/api/admin/deposits/${transactionId}/approve`, {
      method: 'POST'
    })
      .then(() => syncWithServer())
      .catch((err) => console.error('Failed to approve deposit on server:', err));
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

    fetch(`/api/admin/deposits/${transactionId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    })
      .then(() => syncWithServer())
      .catch((err) => console.error('Failed to reject deposit on server:', err));
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

    fetch(`/api/admin/withdrawals/${transactionId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trxId })
    })
      .then(() => syncWithServer())
      .catch((err) => console.error('Failed to approve withdrawal on server:', err));
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

    fetch(`/api/admin/withdrawals/${transactionId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    })
      .then(() => syncWithServer())
      .catch((err) => console.error('Failed to reject withdrawal on server:', err));
  };

  const updateTaskReward = (taskId: string, newRewardPKR: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, rewardPKR: newRewardPKR } : t))
    );
    showToast('success', 'Task Reward Updated', `Updated reward for task to Rs ${newRewardPKR}`);

    fetch(`/api/admin/tasks/${taskId}/reward`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rewardPKR: newRewardPKR })
    })
      .then(() => syncWithServer())
      .catch((err) => console.error('Failed to update task reward on server:', err));
  };

  const resetAllDemoData = () => {
    localStorage.clear();
    setUsers([]);
    setCurrentUserId('');
    setPaymentSettings(INITIAL_PAYMENT_SETTINGS);
    setTransactions([]);
    setTasks(INITIAL_TASKS);
    setIsAdminModeState(false);
    showToast('info', 'System Cleared', 'All user records, balances, and transactions have been reset.');

    fetch('/api/admin/reset', {
      method: 'POST'
    })
      .then(() => syncWithServer())
      .catch((err) => console.error('Failed to reset on server:', err));
  };

  return (
    <AppContext.Provider
      value={{
        isAdminMode,
        setIsAdminMode,
        currentTheme,
        setCurrentTheme,
        isAdminAuthenticated,
        isAdminLoginModalOpen,
        openAdminLoginModal,
        closeAdminLoginModal,
        adminLogin,
        adminLogout,
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
        syncWithServer,
        isLoggedIn,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        loginWithDemo,
        switchUser,
        claimDailyProfit,
        completeTask,
        submitDeposit,
        submitWithdrawal,
        enrollPlanDirect,
        toggleUserStatus,
        adjustUserBalance,
        assignUserPlan,
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
