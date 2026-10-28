export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'frozen';

export type PlanTier =
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond'
  | 'executive'
  | 'royal';

export interface MembershipPlan {
  id: PlanTier;
  name: string;
  pricePKR: number;
  durationDays: number;
  dailyTasksCount: number;
  dailyProfitPKR: number;
  rewardPerTaskPKR: number;
  maxDailyEarnPKR: number;
  courseTitle: string;
  courseCategory: string;
  color: string;
  badge: string;
  popular?: boolean;
  features: string[];
}

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  joinedDate: string;
  currentPlanId: PlanTier | null;
  planExpiryDate: string | null;
  balancePKR: number;
  totalEarnedPKR: number;
  totalWithdrawnPKR: number;
  referralCode: string;
  referredByCode: string | null;
  referralEarningsPKR: number;
  level2ReferralEarningsPKR?: number;
  level3ReferralEarningsPKR?: number;
  status: UserStatus;
  freezeReason?: string;
  completedTasksToday: string[];
  lastTaskDate: string;
  password?: string;
}

export type PaymentMethod = 'jazzcash' | 'easypaisa' | 'bank' | 'usdt';

export interface PaymentGatewaySettings {
  jazzcash: {
    accountNumber: string;
    accountTitle: string;
    instructions: string;
    isEnabled: boolean;
  };
  easypaisa: {
    accountNumber: string;
    accountTitle: string;
    instructions: string;
    isEnabled: boolean;
  };
  bank: {
    bankName: string;
    accountNumber: string;
    iban: string;
    accountTitle: string;
    branchCode: string;
    instructions: string;
    isEnabled: boolean;
  };
  usdt: {
    trc20Address: string;
    bep20Address: string;
    exchangeRatePKR: number; // e.g. 280 PKR = 1 USDT
    instructions: string;
    isEnabled: boolean;
  };
  minDepositPKR: number;
  minWithdrawPKR: number;
  withdrawFeePercent: number;
}

export type TransactionType = 'deposit' | 'withdraw' | 'task_reward' | 'referral_bonus' | 'plan_purchase' | 'admin_adjustment';
export type TransactionStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  type: TransactionType;
  amountPKR: number;
  method?: PaymentMethod;
  status: TransactionStatus;
  date: string;
  senderAccount?: string;
  senderTitle?: string;
  trxId?: string;
  recipientAccount?: string;
  recipientTitle?: string;
  planId?: PlanTier;
  rejectionReason?: string;
  notes?: string;
  proofImageUrl?: string;
}

export interface DailyTask {
  id: string;
  title: string;
  category: string;
  requiredPlan: PlanTier;
  rewardPKR: number;
  estimatedMinutes: number;
  learningSnippet: string;
  practicalQuestion: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface CourseModule {
  id: string;
  title: string;
  tier: PlanTier;
  duration: string;
  totalLessons: number;
  instructor: string;
  thumbnail: string;
  description: string;
  lessons: {
    id: string;
    title: string;
    duration: string;
    isCompleted?: boolean;
  }[];
}
