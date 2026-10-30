import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  INITIAL_PAYMENT_SETTINGS,
  INITIAL_TASKS,
  MEMBERSHIP_PLANS
} from './src/data/initialData.ts';
import {
  User,
  Transaction,
  PaymentGatewaySettings,
  DailyTask,
  PlanTier,
  PaymentMethod
} from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

interface DatabaseSchema {
  users: User[];
  transactions: Transaction[];
  paymentSettings: PaymentGatewaySettings;
  tasks: DailyTask[];
  version: number;
}

const MASTER_ADMIN_USER: User = {
  id: 'user-admin-master',
  fullName: 'Mahar Madni',
  phone: '03087348367',
  email: 'maharmadni58@gmail.com',
  joinedDate: '2026-01-01',
  currentPlanId: 'royal',
  planExpiryDate: '2030-12-31',
  balancePKR: 10000,
  totalEarnedPKR: 15000,
  totalWithdrawnPKR: 0,
  referralCode: 'GOLD-ADMIN',
  referredByCode: null,
  referralEarningsPKR: 0,
  status: 'active',
  completedTasksToday: [],
  lastTaskDate: '',
  password: 'MNB123@@$$&11'
};

// Ensure database file exists
function initDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(raw) as DatabaseSchema;
      let changed = false;

      // Ensure payment settings are up to date with new JazzCash number
      if (data.paymentSettings?.jazzcash?.accountNumber !== '03087348367') {
        data.paymentSettings = {
          ...data.paymentSettings,
          jazzcash: INITIAL_PAYMENT_SETTINGS.jazzcash
        };
        changed = true;
      }

      // Ensure tasks are available
      if (!Array.isArray(data.tasks) || data.tasks.length === 0) {
        data.tasks = INITIAL_TASKS;
        changed = true;
      }

      // Ensure Master Admin account exists in users array
      if (!Array.isArray(data.users)) {
        data.users = [MASTER_ADMIN_USER];
        changed = true;
      } else {
        const hasAdmin = data.users.some(
          (u) =>
            u.email?.toLowerCase() === 'maharmadni58@gmail.com' ||
            u.email?.toLowerCase() === 'maharmadni058@gmail.com' ||
            u.phone?.replace(/[^0-9]/g, '').endsWith('3087348367')
        );
        if (!hasAdmin) {
          data.users.unshift(MASTER_ADMIN_USER);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      }
      return data;
    } catch (err) {
      console.error('Failed to parse db.json, reinitializing...', err);
    }
  }

  const initialDb: DatabaseSchema = {
    users: [MASTER_ADMIN_USER],
    transactions: [],
    paymentSettings: INITIAL_PAYMENT_SETTINGS,
    tasks: INITIAL_TASKS,
    version: 1
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
  return initialDb;
}

function readDb(): DatabaseSchema {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.users)) parsed.users = [MASTER_ADMIN_USER];
    return parsed;
  } catch {
    return initDb();
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to database:', err);
  }
}

const ADMIN_CREDENTIALS = {
  emails: ['maharmadni58@gmail.com', 'maharmadni058@gmail.com'],
  phone: '03087348367',
  password: 'MNB123@@$$&11'
};

async function startServer() {
  initDb();

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes

  // 1. Bootstrap: provides shared state for any client device
  app.get('/api/bootstrap', (req, res) => {
    try {
      const db = readDb();
      res.json({
        users: db.users,
        transactions: db.transactions,
        paymentSettings: db.paymentSettings,
        tasks: db.tasks
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to read database' });
    }
  });

  // 1b. Bidirectional Sync: merges accounts and records across all client devices
  app.post('/api/sync', (req, res) => {
    try {
      const { users: clientUsers, transactions: clientTxs } = req.body || {};
      const db = readDb();
      let changed = false;

      if (Array.isArray(clientUsers)) {
        for (const cu of clientUsers) {
          if (!cu || !cu.id) continue;
          const cuPhoneDigits = (cu.phone || '').replace(/[^0-9]/g, '');
          const cuEmail = (cu.email || '').trim().toLowerCase();

          const existingIndex = db.users.findIndex((u) => {
            if (u.id === cu.id) return true;
            if (cuEmail && u.email && u.email.trim().toLowerCase() === cuEmail) return true;
            const uPhoneDigits = (u.phone || '').replace(/[^0-9]/g, '');
            if (cuPhoneDigits.length >= 7 && uPhoneDigits.length >= 7) {
              if (
                uPhoneDigits.endsWith(cuPhoneDigits.slice(-10)) ||
                cuPhoneDigits.endsWith(uPhoneDigits.slice(-10))
              ) {
                return true;
              }
            }
            return false;
          });

          if (existingIndex === -1) {
            // New account created on client device, merge into server database
            db.users.push(cu);
            changed = true;
            console.log(`[SYNC] Merged new user from client device: ${cu.fullName} (${cu.phone})`);
          } else {
            // Merge progress if client has active plan or higher balance
            const existing = db.users[existingIndex];
            if (
              (cu.balancePKR && cu.balancePKR > existing.balancePKR) ||
              (cu.currentPlanId && !existing.currentPlanId)
            ) {
              db.users[existingIndex] = { ...existing, ...cu };
              changed = true;
            }
          }
        }
      }

      if (Array.isArray(clientTxs)) {
        for (const ctx of clientTxs) {
          if (!ctx || !ctx.id) continue;
          const exists = db.transactions.some(
            (t) => t.id === ctx.id || (ctx.trxId && t.trxId && t.trxId === ctx.trxId)
          );
          if (!exists) {
            db.transactions.unshift(ctx);
            changed = true;
          }
        }
      }

      if (changed) {
        writeDb(db);
      }

      return res.json({
        users: db.users,
        transactions: db.transactions,
        paymentSettings: db.paymentSettings,
        tasks: db.tasks
      });
    } catch (err: any) {
      console.error('Error handling /api/sync:', err);
      const db = readDb();
      return res.json({
        users: db.users,
        transactions: db.transactions,
        paymentSettings: db.paymentSettings,
        tasks: db.tasks
      });
    }
  });

  // 2. User Registration (Cross-device synchronized)
  app.post('/api/auth/register', (req, res) => {
    try {
      const { fullName, phone, email, password, referralCode } = req.body;

      if (!fullName || !phone || !password) {
        return res.status(400).json({ success: false, message: 'Full name, phone number, and password are required.' });
      }

      const cleanPhone = String(phone).trim();
      const cleanDigits = cleanPhone.replace(/[^0-9]/g, '');
      const cleanEmail = email ? String(email).trim().toLowerCase() : `${cleanPhone.replace(/[^0-9]/g, '')}@learntoearngold.pk`;

      if (cleanDigits.length < 10) {
        return res.status(400).json({ success: false, message: 'Please enter a valid 11-digit mobile phone number.' });
      }

      const db = readDb();

      // Check if phone or email already registered across devices
      const exists = db.users.find((u) => {
        if (!u) return false;
        const uEmail = (u.email || '').trim().toLowerCase();
        const emailDup = Boolean(cleanEmail && uEmail && uEmail === cleanEmail);
        const uDigits = (u.phone || '').replace(/[^0-9]/g, '');
        const phoneExact = (u.phone || '').trim().replace(/\s+/g, '') === cleanPhone.replace(/\s+/g, '');
        const phoneDup =
          cleanDigits.length >= 7 &&
          uDigits.length >= 7 &&
          (uDigits.endsWith(cleanDigits.slice(-10)) ||
            cleanDigits.endsWith(uDigits.slice(-10)) ||
            uDigits === cleanDigits);

        return emailDup || phoneExact || phoneDup;
      });

      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'An account with this mobile number or email already exists. Please login instead.'
        });
      }

      // Check referral code
      let validReferredBy: string | null = null;
      if (referralCode && String(referralCode).trim()) {
        const codeUpper = String(referralCode).trim().toUpperCase();
        const referrer = db.users.find((u) => (u.referralCode || '').toUpperCase() === codeUpper);
        if (referrer) {
          validReferredBy = referrer.referralCode;
        }
      }

      const newUserId = `user-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      const randomCode = `GOLD-${Math.floor(1000 + Math.random() * 9000)}`;
      const today = new Date().toISOString().split('T')[0];

      const newUser: User = {
        id: newUserId,
        fullName: String(fullName).trim(),
        phone: cleanPhone,
        email: cleanEmail,
        joinedDate: today,
        currentPlanId: null,
        planExpiryDate: null,
        balancePKR: 0,
        totalEarnedPKR: 0,
        totalWithdrawnPKR: 0,
        referralCode: randomCode,
        referredByCode: validReferredBy,
        referralEarningsPKR: 0,
        status: 'active',
        completedTasksToday: [],
        lastTaskDate: '',
        password: String(password).trim()
      };

      db.users.push(newUser);
      writeDb(db);

      console.log(`[API] New user registered across all devices: ${newUser.fullName} (${newUser.phone})`);
      return res.json({ success: true, user: newUser });
    } catch (err: any) {
      console.error('Registration server error:', err);
      return res.status(500).json({ success: false, message: 'Server registration error. Please retry.' });
    }
  });

  // 3. User Login (Multi-format, cross-device match)
  app.post('/api/auth/login', (req, res) => {
    try {
      const { identifier, password } = req.body;

      if (!identifier || !password) {
        return res.status(400).json({ success: false, message: 'Phone/Email and password required.' });
      }

      const cleanIdent = String(identifier).trim().toLowerCase();
      const cleanDigits = cleanIdent.replace(/[^0-9]/g, '');
      const cleanPass = String(password).trim();

      const db = readDb();

      // Check for Super Admin Master Credentials
      const isAdminEmail =
        ADMIN_CREDENTIALS.emails.includes(cleanIdent) ||
        (cleanDigits.length >= 10 && cleanDigits.endsWith('3087348367'));
      const isMasterPassword = cleanPass === ADMIN_CREDENTIALS.password;

      if (isAdminEmail && isMasterPassword) {
        let adminUser = db.users.find(
          (u) =>
            ADMIN_CREDENTIALS.emails.includes((u.email || '').toLowerCase()) ||
            (u.phone || '').replace(/[^0-9]/g, '').endsWith('3087348367')
        );
        if (!adminUser) {
          adminUser = MASTER_ADMIN_USER;
          db.users.unshift(adminUser);
          writeDb(db);
        }
        return res.json({ success: true, user: adminUser, isAdmin: true });
      }

      // Search all users across database
      const user = db.users.find((u) => {
        if (!u) return false;
        const uEmail = (u.email || '').trim().toLowerCase();
        const uPhone = (u.phone || '').trim().toLowerCase();
        const uDigits = (u.phone || '').replace(/[^0-9]/g, '');
        const uName = (u.fullName || '').trim().toLowerCase();
        const uRef = (u.referralCode || '').trim().toLowerCase();

        // 1. Match by Email
        const emailMatch = Boolean(uEmail && uEmail === cleanIdent);

        // 2. Match by exact phone string (with or without spaces/dashes)
        const phoneExactMatch =
          Boolean(uPhone && (uPhone === cleanIdent || uPhone.replace(/[-\s]/g, '') === cleanIdent.replace(/[-\s]/g, '')));

        // 3. Match by phone digits (supports 0308..., 92308..., 308...)
        const phoneDigitMatch =
          cleanDigits.length >= 7 &&
          uDigits.length >= 7 &&
          (uDigits.endsWith(cleanDigits.slice(-10)) ||
            cleanDigits.endsWith(uDigits.slice(-10)) ||
            uDigits === cleanDigits);

        // 4. Match by full name
        const nameMatch = Boolean(uName && uName === cleanIdent);

        // 5. Match by referral code
        const refMatch = Boolean(uRef && uRef === cleanIdent);

        // 6. Match by internal user ID
        const idMatch = Boolean(u.id && u.id.toLowerCase() === cleanIdent);

        const isUserMatch = emailMatch || phoneExactMatch || phoneDigitMatch || nameMatch || refMatch || idMatch;

        // Password matching: stored user password OR Master Admin password
        const passwordMatch =
          u.password === cleanPass ||
          u.password === password ||
          cleanPass === ADMIN_CREDENTIALS.password;

        return isUserMatch && passwordMatch;
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid mobile number/email or password.'
        });
      }

      if (user.status === 'frozen') {
        return res.status(403).json({
          success: false,
          message: 'Account restricted. Contact admin on WhatsApp: 03087348367.'
        });
      }

      console.log(`[API] User logged in successfully across devices: ${user.fullName} (${user.phone})`);
      return res.json({ success: true, user });
    } catch (err: any) {
      console.error('Login route error:', err);
      return res.status(500).json({ success: false, message: 'Server login error. Please retry.' });
    }
  });

  // 4. Admin Login
  app.post('/api/auth/admin-login', (req, res) => {
    try {
      const { email, password } = req.body;
      const cleanEmail = String(email || '').trim().toLowerCase();
      const cleanPass = String(password || '').trim();

      const isMatch =
        (ADMIN_CREDENTIALS.emails.includes(cleanEmail) || cleanEmail === '03087348367') &&
        cleanPass === ADMIN_CREDENTIALS.password;

      if (isMatch) {
        return res.json({ success: true, message: 'Admin authenticated' });
      }

      return res.status(401).json({ success: false, message: 'Invalid Admin Credentials' });
    } catch {
      return res.status(500).json({ success: false, message: 'Admin auth error' });
    }
  });

  // 5. Submit Deposit (JazzCash & Easypaisa only)
  app.post('/api/deposits', (req, res) => {
    const { userId, planId, amountPKR, method, senderAccount, senderTitle, trxId, proofUrl } = req.body;

    if (method !== 'jazzcash' && method !== 'easypaisa') {
      return res.status(400).json({
        success: false,
        message: 'Invalid deposit option. Only JazzCash and Easypaisa are accepted.'
      });
    }

    if (!trxId || !trxId.trim()) {
      return res.status(400).json({ success: false, message: 'Missing transaction TID.' });
    }

    const db = readDb();
    const user = db.users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.status === 'frozen') {
      return res.status(403).json({ success: false, message: 'Account is frozen.' });
    }

    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 5)}`;

    const newTx: Transaction = {
      id: `tx-dep-${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      userPhone: user.phone,
      type: 'deposit',
      amountPKR: Number(amountPKR),
      method: method as PaymentMethod,
      status: 'pending',
      date: dateStr,
      senderAccount: senderAccount?.trim(),
      senderTitle: senderTitle?.trim() || user.fullName,
      trxId: trxId.trim(),
      planId: planId as PlanTier,
      notes: `Membership Enrollment Request: ${String(planId).toUpperCase()} Tier (Rs ${amountPKR})`,
      proofImageUrl: proofUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80'
    };

    db.transactions.unshift(newTx);
    writeDb(db);

    console.log(`[API] New deposit submitted across devices: Rs ${amountPKR} by ${user.fullName}`);
    return res.json({ success: true, transaction: newTx });
  });

  // 6. Submit Withdrawal
  app.post('/api/withdrawals', (req, res) => {
    const { userId, amountPKR, method, recipientAccount, recipientTitle } = req.body;
    const amount = Number(amountPKR);

    const db = readDb();
    const user = db.users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.status === 'frozen') {
      return res.status(403).json({ success: false, message: 'Account is frozen.' });
    }

    if (amount > user.balancePKR) {
      return res.status(400).json({ success: false, message: 'Insufficient balance.' });
    }

    const minWithdraw = db.paymentSettings.minWithdrawPKR || 300;
    if (amount < minWithdraw) {
      return res.status(400).json({ success: false, message: `Minimum withdrawal is Rs ${minWithdraw}.` });
    }

    // Deduct user balance
    user.balancePKR -= amount;

    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 5)}`;

    const newTx: Transaction = {
      id: `tx-wth-${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      userPhone: user.phone,
      type: 'withdraw',
      amountPKR: amount,
      method: method as PaymentMethod,
      status: 'pending',
      date: dateStr,
      recipientAccount: recipientAccount?.trim(),
      recipientTitle: recipientTitle?.trim() || user.fullName,
      notes: `Payout request to ${recipientAccount} (${String(method).toUpperCase()})`
    };

    db.transactions.unshift(newTx);
    writeDb(db);

    return res.json({ success: true, transaction: newTx, user });
  });

  // 7. Admin: Toggle User Status
  app.post('/api/admin/users/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, reason } = req.body;

    const db = readDb();
    const user = db.users.find((u) => u.id === id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.status = status || (user.status === 'active' ? 'frozen' : 'active');
    user.freezeReason = user.status === 'frozen' ? reason || 'Compliance review' : undefined;

    writeDb(db);
    return res.json({ success: true, user });
  });

  // 8. Admin: Adjust Balance
  app.post('/api/admin/users/:id/balance', (req, res) => {
    const { id } = req.params;
    const { amountPKR, reason } = req.body;
    const adj = Number(amountPKR);

    const db = readDb();
    const user = db.users.find((u) => u.id === id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.balancePKR = Math.max(0, user.balancePKR + adj);
    if (adj > 0) user.totalEarnedPKR += adj;

    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 5)}`;

    const tx: Transaction = {
      id: `tx-adj-${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      userPhone: user.phone,
      type: 'admin_adjustment',
      amountPKR: adj,
      status: 'completed',
      date: dateStr,
      notes: `Admin adjustment: ${reason || 'Manual ledger balance update'}`
    };

    db.transactions.unshift(tx);
    writeDb(db);

    return res.json({ success: true, user, transaction: tx });
  });

  // 9. Admin: Approve Deposit
  app.post('/api/admin/deposits/:id/approve', (req, res) => {
    const { id } = req.params;

    const db = readDb();
    const tx = db.transactions.find((t) => t.id === id);

    if (!tx || tx.type !== 'deposit') {
      return res.status(404).json({ success: false, message: 'Deposit not found' });
    }

    tx.status = 'approved';

    const user = db.users.find((u) => u.id === tx.userId);
    if (user && tx.planId) {
      const plan = MEMBERSHIP_PLANS.find((p) => p.id === tx.planId);
      user.currentPlanId = tx.planId;

      const duration = plan ? plan.durationDays : 30;
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + duration);
      user.planExpiryDate = expiry.toISOString().split('T')[0];

      // 10% Instant Referral Commission to Direct Upline
      if (user.referredByCode) {
        const upline = db.users.find(
          (u) => u.referralCode.toUpperCase() === user.referredByCode?.toUpperCase()
        );

        if (upline) {
          const commissionPKR = Math.floor(tx.amountPKR * 0.1);
          upline.balancePKR += commissionPKR;
          upline.referralEarningsPKR += commissionPKR;
          upline.totalEarnedPKR += commissionPKR;

          const now = new Date();
          const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 5)}`;

          db.transactions.unshift({
            id: `tx-ref-${Date.now()}`,
            userId: upline.id,
            userName: upline.fullName,
            userPhone: upline.phone,
            type: 'referral_bonus',
            amountPKR: commissionPKR,
            status: 'completed',
            date: dateStr,
            notes: `10% Direct Commission from invited member ${user.fullName} (${tx.planId.toUpperCase()})`
          });
        }
      }
    }

    writeDb(db);
    return res.json({ success: true, transaction: tx, user });
  });

  // 10. Admin: Reject Deposit
  app.post('/api/admin/deposits/:id/reject', (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    const db = readDb();
    const tx = db.transactions.find((t) => t.id === id);

    if (!tx || tx.type !== 'deposit') {
      return res.status(404).json({ success: false, message: 'Deposit not found' });
    }

    tx.status = 'rejected';
    tx.rejectionReason = reason || 'Invalid TID or receipt not found in bank/wallet records.';

    writeDb(db);
    return res.json({ success: true, transaction: tx });
  });

  // 11. Admin: Approve Withdrawal
  app.post('/api/admin/withdrawals/:id/approve', (req, res) => {
    const { id } = req.params;
    const { trxId } = req.body;

    const db = readDb();
    const tx = db.transactions.find((t) => t.id === id);

    if (!tx || tx.type !== 'withdraw') {
      return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    }

    tx.status = 'approved';
    if (trxId) tx.trxId = trxId;

    const user = db.users.find((u) => u.id === tx.userId);
    if (user) {
      user.totalWithdrawnPKR += tx.amountPKR;
    }

    writeDb(db);
    return res.json({ success: true, transaction: tx });
  });

  // 12. Admin: Reject Withdrawal
  app.post('/api/admin/withdrawals/:id/reject', (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    const db = readDb();
    const tx = db.transactions.find((t) => t.id === id);

    if (!tx || tx.type !== 'withdraw') {
      return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    }

    tx.status = 'rejected';
    tx.rejectionReason = reason || 'Beneficiary title mismatch or invalid wallet number.';

    // Refund user balance
    const user = db.users.find((u) => u.id === tx.userId);
    if (user) {
      user.balancePKR += tx.amountPKR;
    }

    writeDb(db);
    return res.json({ success: true, transaction: tx, user });
  });

  // 13. Claim Task Profit
  app.post('/api/tasks/:id/claim', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    const db = readDb();
    const user = db.users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.status === 'frozen') {
      return res.status(403).json({ success: false, message: 'Account is frozen.' });
    }

    if (!user.currentPlanId) {
      return res.status(400).json({ success: false, message: 'No active plan.' });
    }

    const today = new Date().toISOString().split('T')[0];
    const completedToday = user.lastTaskDate === today ? user.completedTasksToday : [];

    if (completedToday.includes(id)) {
      return res.status(400).json({ success: false, message: 'Task already claimed today.' });
    }

    const plan = MEMBERSHIP_PLANS.find((p) => p.id === user.currentPlanId);
    if (!plan) {
      return res.status(400).json({ success: false, message: 'Invalid plan.' });
    }

    const reward = plan.rewardPerTaskPKR;
    user.balancePKR += reward;
    user.totalEarnedPKR += reward;
    user.lastTaskDate = today;
    user.completedTasksToday = [...completedToday, id];

    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 5)}`;

    const tx: Transaction = {
      id: `tx-task-${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      userPhone: user.phone,
      type: 'task_reward',
      amountPKR: reward,
      status: 'completed',
      date: dateStr,
      notes: `Daily Profit Claim: ${plan.name} (Rs ${reward})`
    };

    db.transactions.unshift(tx);
    writeDb(db);

    return res.json({ success: true, user, transaction: tx, rewardPKR: reward });
  });

  // 13b. Claim Active Plan Daily Profit Directly
  app.post('/api/tasks/claim-daily-profit', (req, res) => {
    try {
      const { userId } = req.body;
      const db = readDb();
      const user = db.users.find((u) => u.id === userId);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (user.status === 'frozen') {
        return res.status(403).json({ success: false, message: 'Account is frozen.' });
      }

      if (!user.currentPlanId) {
        return res.status(400).json({ success: false, message: 'No active payment plan.' });
      }

      const today = new Date().toISOString().split('T')[0];
      const completedToday = user.lastTaskDate === today ? (user.completedTasksToday || []) : [];

      if (completedToday.includes('daily_profit_claim')) {
        return res.status(400).json({ success: false, message: 'Daily profit already claimed for today.' });
      }

      const plan = MEMBERSHIP_PLANS.find((p) => p.id === user.currentPlanId);
      if (!plan) {
        return res.status(400).json({ success: false, message: 'Invalid membership plan.' });
      }

      const dailyProfit = plan.dailyProfitPKR || plan.maxDailyEarnPKR || plan.rewardPerTaskPKR;
      user.balancePKR += dailyProfit;
      user.totalEarnedPKR += dailyProfit;
      user.lastTaskDate = today;
      user.completedTasksToday = [...completedToday, 'daily_profit_claim'];

      const now = new Date();
      const dateStr = `${today} ${now.toTimeString().substring(0, 5)}`;

      const tx: Transaction = {
        id: `tx-profit-${Date.now()}`,
        userId: user.id,
        userName: user.fullName,
        userPhone: user.phone,
        type: 'task_reward',
        amountPKR: dailyProfit,
        status: 'completed',
        date: dateStr,
        notes: `Daily Current Profit Claim: ${plan.name} (+Rs ${dailyProfit.toLocaleString()})`
      };

      db.transactions.unshift(tx);
      writeDb(db);

      return res.json({ success: true, user, transaction: tx, amount: dailyProfit });
    } catch (err) {
      console.error('Error claiming daily profit:', err);
      return res.status(500).json({ success: false, message: 'Server error processing profit claim.' });
    }
  });

  // 14. Enroll Plan Directly with Account Balance
  app.post('/api/plans/enroll-direct', (req, res) => {
    const { userId, planId } = req.body;

    const db = readDb();
    const user = db.users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const plan = MEMBERSHIP_PLANS.find((p) => p.id === planId);
    if (!plan) {
      return res.status(400).json({ success: false, message: 'Plan not found.' });
    }

    if (user.balancePKR < plan.pricePKR) {
      return res.status(400).json({ success: false, message: 'Insufficient balance.' });
    }

    user.balancePKR -= plan.pricePKR;
    user.currentPlanId = plan.id;

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + plan.durationDays);
    user.planExpiryDate = expiry.toISOString().split('T')[0];

    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 5)}`;

    db.transactions.unshift({
      id: `tx-buy-${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      userPhone: user.phone,
      type: 'plan_purchase',
      amountPKR: plan.pricePKR,
      status: 'completed',
      date: dateStr,
      planId: plan.id,
      notes: `Enrolled into ${plan.name} using Account Balance`
    });

    // 10% Referral to upline
    if (user.referredByCode) {
      const upline = db.users.find(
        (u) => u.referralCode.toUpperCase() === user.referredByCode?.toUpperCase()
      );
      if (upline) {
        const comm = Math.floor(plan.pricePKR * 0.1);
        upline.balancePKR += comm;
        upline.referralEarningsPKR += comm;
        upline.totalEarnedPKR += comm;

        db.transactions.unshift({
          id: `tx-ref-${Date.now()}`,
          userId: upline.id,
          userName: upline.fullName,
          userPhone: upline.phone,
          type: 'referral_bonus',
          amountPKR: comm,
          status: 'completed',
          date: dateStr,
          notes: `10% Direct Commission from invited member ${user.fullName} (${plan.name})`
        });
      }
    }

    writeDb(db);
    return res.json({ success: true, user });
  });

  // 15. Admin: Update Payment Gateway Settings
  app.post('/api/admin/settings/payments', (req, res) => {
    const { paymentSettings } = req.body;

    const db = readDb();
    db.paymentSettings = paymentSettings;
    writeDb(db);

    return res.json({ success: true, paymentSettings: db.paymentSettings });
  });

  // 16. Admin: Update Task Reward
  app.post('/api/admin/tasks/:id/reward', (req, res) => {
    const { id } = req.params;
    const { rewardPKR } = req.body;

    const db = readDb();
    const task = db.tasks.find((t) => t.id === id);
    if (task) {
      task.rewardPKR = Number(rewardPKR);
      writeDb(db);
      return res.json({ success: true, task });
    }

    return res.status(404).json({ success: false, message: 'Task not found' });
  });

  // 17. Admin: Reset Data
  app.post('/api/admin/reset', (req, res) => {
    const initialDb: DatabaseSchema = {
      users: [],
      transactions: [],
      paymentSettings: INITIAL_PAYMENT_SETTINGS,
      tasks: INITIAL_TASKS,
      version: 1
    };

    writeDb(initialDb);
    return res.json({ success: true, message: 'Database reset to initial clean state.' });
  });

  // Attach Vite middleware in development or serve dist static in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduGold Fullstack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
