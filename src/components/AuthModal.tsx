import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Lock,
  Phone,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  Sparkles,
  Crown,
  CheckCircle2,
  AlertCircle,
  Share2,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  KeyRound,
  RotateCcw
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalTab,
    closeAuthModal,
    login,
    register,
    users,
    openAdminLoginModal
  } = useApp();

  // Tab: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(authModalTab);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3-Step Registration form state
  const [regStep, setRegStep] = useState<1 | 2 | 3>(1);
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regReferralCode, setRegReferralCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [regError, setRegError] = useState('');

  // Step 3: SMS OTP state
  const [enteredOtp, setEnteredOtp] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('4821');
  const [otpTimer, setOtpTimer] = useState(45);

  // Sync tab with context
  useEffect(() => {
    setActiveTab(authModalTab);
    setRegError('');
    setLoginError('');
    setRegStep(1);
  }, [authModalTab, isAuthModalOpen]);

  // Check URL query param ?ref=CODE on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');
    if (refParam) {
      setRegReferralCode(refParam.toUpperCase());
    }
  }, []);

  // OTP Countdown timer
  useEffect(() => {
    let interval: any;
    if (regStep === 3 && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [regStep, otpTimer]);

  if (!isAuthModalOpen) return null;

  // Sponsor validation lookup
  const matchedSponsor = regReferralCode.trim()
    ? users.find((u) => u.referralCode.toLowerCase() === regReferralCode.trim().toLowerCase())
    : null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your mobile phone number or email.');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError('Please enter your account password.');
      return;
    }
    setLoginError('');
    setIsSubmitting(true);
    try {
      const res = await login(loginIdentifier, loginPassword);
      if (!res.success) {
        setLoginError(res.message || 'Invalid mobile number/email or password.');
      }
    } catch {
      setLoginError('Could not connect to authentication server. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 1 -> Step 2 validation
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regFullName.trim()) {
      setRegError('Please provide your full legal name.');
      return;
    }

    if (!regPhone.trim()) {
      setRegError('Please enter your mobile phone number.');
      return;
    }

    const cleanDigits = regPhone.replace(/[^0-9]/g, '');
    if (cleanDigits.length < 10) {
      setRegError('Please enter a valid 11-digit Pakistani phone number (e.g. 0300-1234567).');
      return;
    }

    setRegStep(2);
  };

  // Step 2 -> Step 3 (Send OTP)
  const handleProceedToStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setRegError('Please agree to the Academy Terms & Educational Learn-to-Earn Policy.');
      return;
    }

    // Generate random 4-digit OTP
    const genOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedOtp(genOtp);
    setOtpTimer(45);
    setEnteredOtp('');
    setRegStep(3);
  };

  // Step 3 -> Final Register Execution
  const handleVerifyOtpAndRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (enteredOtp.trim() !== simulatedOtp) {
      setRegError(`Incorrect verification code. Please enter ${simulatedOtp} or use 1-click Auto-Fill.`);
      return;
    }

    executeRegistration();
  };

  // Final register
  const executeRegistration = async () => {
    setRegError('');
    setIsSubmitting(true);
    try {
      const res = await register({
        fullName: regFullName,
        phone: regPhone,
        email: regEmail || `${regFullName.toLowerCase().replace(/\s+/g, '')}@learntoearngold.pk`,
        password: regPassword,
        referralCode: regReferralCode.trim() || undefined
      });

      if (res.success) {
        setRegFullName('');
        setRegPhone('');
        setRegEmail('');
        setRegPassword('');
        setRegConfirmPassword('');
        setRegReferralCode('');
        setRegStep(1);
      } else {
        setRegError(res.message);
      }
    } catch {
      setRegError('Server error while registering account. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[94vh] flex flex-col rounded-3xl bg-[#0f111a] border border-amber-500/40 shadow-2xl overflow-hidden">
        {/* Subtle decorative gold ambient glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-[#0a0b12]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-[1px] shadow-md shadow-amber-500/20">
              <div className="w-full h-full bg-[#0a0b12] rounded-xl flex items-center justify-center">
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-display tracking-wider">
                LEARN TO EARN GOLD
              </h3>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">
                Member Authentication Portal
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers: Sign In vs Register */}
        <div className="grid grid-cols-2 p-1.5 bg-[#0b0d14] border-b border-zinc-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setRegError('');
            }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md font-extrabold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In / لاگ ان</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setRegError('');
              setRegStep(1);
            }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md font-extrabold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Register / نیا اکاؤنٹ</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* TAB 1: SIGN IN */}
          {activeTab === 'login' && (
            <div className="space-y-5">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-300 block mb-1 font-medium">
                    Mobile Phone or Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. 0300-9876543 or ahmed.raza@gmail.com"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                    <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-zinc-300 font-medium">Password *</label>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your account password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-zinc-900 border-zinc-700 text-amber-500 focus:ring-0"
                    />
                    <span>Remember login</span>
                  </label>
                  <span className="text-[11px] text-amber-400/80 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 flex items-start gap-2.5 text-xs text-red-300 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 disabled:opacity-60 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Account...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Sign In to Gold Academy</span>
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-2 space-y-3">
                <p className="text-xs text-zinc-400">
                  New to Learn to Earn Gold?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('register');
                      setRegStep(1);
                    }}
                    className="text-amber-400 font-bold hover:underline"
                  >
                    Register New Account
                  </button>
                </p>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      closeAuthModal();
                      openAdminLoginModal();
                    }}
                    className="text-[11px] font-mono text-zinc-400 hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                    <span>Administrator Console Login</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REGISTER (3-STEP ONBOARDING) */}
          {activeTab === 'register' && (
            <div className="space-y-4">
              {/* 3-Step Breadcrumbs */}
              <div className="flex items-center justify-between px-1">
                <div className={`flex items-center gap-1.5 text-xs font-mono font-bold ${regStep === 1 ? 'text-amber-400' : 'text-zinc-500'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${regStep === 1 ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                    1
                  </span>
                  <span>Profile</span>
                </div>
                <div className="w-8 h-[1px] bg-zinc-800" />
                <div className={`flex items-center gap-1.5 text-xs font-mono font-bold ${regStep === 2 ? 'text-amber-400' : 'text-zinc-500'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${regStep === 2 ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                    2
                  </span>
                  <span>Security</span>
                </div>
                <div className="w-8 h-[1px] bg-zinc-800" />
                <div className={`flex items-center gap-1.5 text-xs font-mono font-bold ${regStep === 3 ? 'text-amber-400' : 'text-zinc-500'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${regStep === 3 ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                    3
                  </span>
                  <span>SMS OTP</span>
                </div>
              </div>

              {regError && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500 text-xs text-red-200 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              {/* STEP 1: PERSONAL INFORMATION */}
              {regStep === 1 && (
                <form onSubmit={handleProceedToStep2} className="space-y-3.5">
                  <div>
                    <label className="text-xs text-zinc-300 block mb-1 font-medium">
                      Full Legal Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Muhammad Hamza"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                      />
                      <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-300 block mb-1 font-medium">
                      Mobile Number (Pakistan WhatsApp / SMS) *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="0300-1234567"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                      />
                      <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-300 block mb-1 font-medium">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="hamza@gmail.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                      />
                      <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all"
                  >
                    <span>Proceed to Step 2 (Security)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* STEP 2: PASSWORD & SPONSOR CODE */}
              {regStep === 2 && (
                <form onSubmit={handleProceedToStep3} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-zinc-300 block mb-1 font-medium">
                        Create Password (min 6 chars) *
                      </label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          placeholder="Password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                        />
                        <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                        >
                          {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-zinc-300 block mb-1 font-medium">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          placeholder="Repeat password"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                        />
                        <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>

                  {/* Referral Sponsor Code */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-zinc-300 font-medium flex items-center gap-1.5">
                        <Share2 className="w-3.5 h-3.5 text-amber-400" />
                        Referral / Sponsor Code (Optional)
                      </label>
                      <span className="text-[10px] text-zinc-400 font-mono">3-Tier Team Bonus</span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. GOLD-AHMED1"
                      value={regReferralCode}
                      onChange={(e) => setRegReferralCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-amber-300 font-mono font-bold placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                    {matchedSponsor ? (
                      <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified Sponsor: {matchedSponsor.fullName} ({matchedSponsor.phone})
                      </p>
                    ) : regReferralCode.trim() ? (
                      <p className="text-[10px] text-zinc-500 mt-1">
                        No sponsor found; your account will be registered under platform root.
                      </p>
                    ) : null}
                  </div>

                  {/* Terms agreement */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="rounded bg-zinc-900 border-zinc-700 text-amber-500 focus:ring-0 mt-0.5"
                      />
                      <span className="text-[11px] leading-relaxed text-zinc-400">
                        I agree to the Learn to Earn Gold Academy Terms and 3-tier affiliate program rules.
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setRegStep(1)}
                      className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all"
                    >
                      <span>Proceed to Step 3 (SMS Verification)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: MOBILE PHONE SMS OTP VERIFICATION */}
              {regStep === 3 && (
                <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4">
                  {/* Simulated Pakistani SMS Banner */}
                  <div className="p-3.5 rounded-2xl bg-[#090a10] border border-amber-500/40 text-xs text-zinc-300 space-y-1.5 animate-pulse">
                    <div className="flex items-center justify-between text-amber-400 font-mono text-[11px]">
                      <span className="flex items-center gap-1 font-bold">
                        <Smartphone className="w-3.5 h-3.5" />
                        SMS from 8558 (Learn to Earn Gold):
                      </span>
                      <span className="bg-amber-500/20 px-2 py-0.5 rounded text-amber-300 font-bold">
                        CODE: {simulatedOtp}
                      </span>
                    </div>
                    <p className="text-zinc-200 text-xs">
                      "Your EduGold verification code is <strong className="text-amber-300 font-mono font-extrabold">{simulatedOtp}</strong>. Do not share with anyone."
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-zinc-300 font-medium">
                        Enter 4-Digit SMS OTP Code *
                      </label>
                      <button
                        type="button"
                        onClick={() => setEnteredOtp(simulatedOtp)}
                        className="text-[11px] text-amber-400 font-bold hover:underline font-mono"
                      >
                        ⚡ 1-Click Auto-Fill ({simulatedOtp})
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        maxLength={4}
                        required
                        placeholder="e.g. 4821"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        className="w-full text-center tracking-widest text-lg font-mono font-extrabold py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-amber-300 focus:outline-none focus:border-amber-400"
                      />
                      <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>Mobile: {regPhone}</span>
                    <span>Resend in: {otpTimer}s</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRegStep(2)}
                      className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 disabled:opacity-60 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verify &amp; Create Gold Account</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              <div className="text-center pt-2">
                <p className="text-xs text-zinc-400">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-amber-400 font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
