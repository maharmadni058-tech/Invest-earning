import { MembershipPlan, PaymentGatewaySettings, DailyTask, CourseModule, User, Transaction } from '../types';

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'bronze',
    name: 'Bronze Membership',
    pricePKR: 500,
    durationDays: 30,
    dailyTasksCount: 1,
    dailyProfitPKR: 46,
    rewardPerTaskPKR: 46,
    maxDailyEarnPKR: 46,
    courseTitle: 'Digital Freelance & Micro-Tasks Kickstart',
    courseCategory: 'Freelancing Basics',
    color: '#cd7f32',
    badge: '🥉 Bronze Tier',
    features: [
      'Daily Current Profit: Rs 46 / Day',
      'Daily 1-Click Verification Task Claim',
      'Full Digital Freelance Kickstart Course',
      '10% Instant Referral Commission on direct invites',
      'Official Course Certificate of Completion',
      'Standard Community Support'
    ]
  },
  {
    id: 'silver',
    name: 'Silver Membership',
    pricePKR: 1500,
    durationDays: 45,
    dailyTasksCount: 1,
    dailyProfitPKR: 146,
    rewardPerTaskPKR: 146,
    maxDailyEarnPKR: 146,
    courseTitle: 'Social Media Growth & Content Creation',
    courseCategory: 'Digital Marketing',
    color: '#c0c0c0',
    badge: '🥈 Silver Tier',
    features: [
      'Daily Current Profit: Rs 146 / Day',
      'Daily 1-Click Verification Task Claim',
      'TikTok, Instagram & Reels Growth Mastery',
      '10% Instant Referral Commission on direct invites',
      'Free Canva Graphic Design Templates Pack',
      'Priority Telegram Channel Access'
    ]
  },
  {
    id: 'gold',
    name: 'Gold Membership',
    pricePKR: 3000,
    durationDays: 60,
    dailyTasksCount: 1,
    dailyProfitPKR: 270,
    rewardPerTaskPKR: 270,
    maxDailyEarnPKR: 270,
    courseTitle: 'E-Commerce & Pakistan Local Dropshipping',
    courseCategory: 'E-Commerce',
    color: '#e5b842',
    badge: '🥇 Gold Tier',
    popular: true,
    features: [
      'Daily Current Profit: Rs 270 / Day',
      'Daily 1-Click Verification Task Claim',
      'Daraz & Shopify Pakistan Dropshipping Blueprint',
      '10% Instant Referral Commission on direct invites',
      'Winning Products Weekly Spreadsheet Access',
      'Direct WhatsApp Mentor Q&A Support'
    ]
  },
  {
    id: 'platinum',
    name: 'Platinum Membership',
    pricePKR: 5000,
    durationDays: 75,
    dailyTasksCount: 1,
    dailyProfitPKR: 460,
    rewardPerTaskPKR: 460,
    maxDailyEarnPKR: 460,
    courseTitle: 'High-Ticket Graphic Design & Video Editing',
    courseCategory: 'Creative Media',
    color: '#e5e4e2',
    badge: '💎 Platinum Tier',
    features: [
      'Daily Current Profit: Rs 460 / Day',
      'Daily 1-Click Verification Task Claim',
      'Premiere Pro & After Effects Client Video Mastery',
      '10% Instant Referral Commission on direct invites',
      '100GB+ Premium Asset & Sound Effects Library',
      'Upwork & Fiverr Profile Optimization Review'
    ]
  },
  {
    id: 'diamond',
    name: 'Diamond Membership',
    pricePKR: 10000,
    durationDays: 90,
    dailyTasksCount: 1,
    dailyProfitPKR: 950,
    rewardPerTaskPKR: 950,
    maxDailyEarnPKR: 950,
    courseTitle: 'AI Tools & Full-Stack Web Development',
    courseCategory: 'Tech & AI',
    color: '#70d6ff',
    badge: '💠 Diamond Tier',
    features: [
      'Daily Current Profit: Rs 950 / Day',
      'Daily 1-Click Verification Task Claim',
      'AI Prompt Engineering, Claude & React Web Dev',
      '10% Instant Referral Commission on direct invites',
      'Ready-to-Deploy Client Website Templates',
      'Exclusive 1-on-1 Zoom Portfolio Review'
    ]
  },
  {
    id: 'executive',
    name: 'Executive Membership',
    pricePKR: 30000,
    durationDays: 120,
    dailyTasksCount: 1,
    dailyProfitPKR: 2850,
    rewardPerTaskPKR: 2850,
    maxDailyEarnPKR: 2850,
    courseTitle: 'International High-Ticket Client Acquisition',
    courseCategory: 'B2B Sales & Agency',
    color: '#a855f7',
    badge: '👑 Executive Tier',
    features: [
      'Daily Current Profit: Rs 2,850 / Day',
      'Daily 1-Click Verification Task Claim',
      'Cold Email, LinkedIn Outreach & US Client Closing',
      '10% Instant Referral Commission on direct invites',
      'Contracts, Invoicing & Stripe Setup Playbook',
      'Weekly Private VIP Mastermind Sessions'
    ]
  },
  {
    id: 'royal',
    name: 'Royal Elite Membership',
    pricePKR: 50000,
    durationDays: 180,
    dailyTasksCount: 1,
    dailyProfitPKR: 5000,
    rewardPerTaskPKR: 5000,
    maxDailyEarnPKR: 5000,
    courseTitle: 'Digital Agency Ownership & Web3 Ecosystems',
    courseCategory: 'Executive Leadership',
    color: '#f59e0b',
    badge: '⚡ Royal Elite',
    features: [
      'Daily Current Profit: Rs 5,000 / Day',
      'Daily 1-Click Verification Task Claim',
      'Complete Agency Scaling, Team Hiring & Web3 Tech',
      '10% Instant Referral Commission on direct invites',
      'Direct Access to Founder Advisory Circle',
      'Lifetime Access to All Future Academy Updates'
    ]
  }
];

export const INITIAL_PAYMENT_SETTINGS: PaymentGatewaySettings = {
  jazzcash: {
    accountNumber: '03087348367',
    accountTitle: 'TASLEEM BIBI',
    instructions: 'Open JazzCash app or dial *786# -> Send Money -> To JazzCash -> Enter 03087348367 (TASLEEM BIBI) -> Enter exact amount -> Save receipt & enter TID.',
    isEnabled: true
  },
  easypaisa: {
    accountNumber: '03459876543',
    accountTitle: 'EduGold Official Merchant',
    instructions: 'Open Easypaisa app -> Send Money -> To Easypaisa Mobile Account -> Enter 03459876543 -> Enter exact amount -> Submit 11-digit Trx ID below.',
    isEnabled: true
  },
  bank: {
    bankName: 'Meezan Bank Ltd (Islamic Banking)',
    accountNumber: '01020304050607',
    iban: 'PK45MEZN0001020304050607',
    accountTitle: 'LEARN TO EARN GOLD PVT LTD',
    branchCode: '0102 (Clifton Karachi Branch)',
    instructions: 'Transfer via any Pakistani Banking App (Raast / IBFT). Enter IBAN or Account Number. Take a screenshot of the receipt.',
    isEnabled: true
  },
  usdt: {
    trc20Address: 'TYw8eZ4pDqx729LnmBkqX99A1m23RstV8x',
    bep20Address: '0x71C...B289e49F1269bA4762395726B1',
    exchangeRatePKR: 280, // 1 USDT = 280 PKR
    instructions: 'Send USDT (TRC-20 recommended for low network fees). Enter your Transaction Hash (TxID) after blockchain confirmation.',
    isEnabled: true
  },
  minDepositPKR: 500,
  minWithdrawPKR: 300,
  withdrawFeePercent: 0
};

export const INITIAL_TASKS: DailyTask[] = [
  {
    id: 'task-1',
    title: 'Digital Marketing: Ad Copy Hook Evaluation',
    category: 'Marketing',
    requiredPlan: 'bronze',
    rewardPKR: 15,
    estimatedMinutes: 2,
    learningSnippet: 'A high-converting ad copy hook must grab immediate attention within the first 3 seconds and address a specific pain point rather than making vague promises.',
    practicalQuestion: 'Which of the following ad headlines has the highest click-through conversion rate for Pakistani freelancers?',
    options: [
      '"Make millions without doing any work"',
      '"Struggling to find Upwork clients? Here is how 3 students landed $500 orders this week"',
      '"Click here now for best money secret"',
      '"Freelancing is good"'
    ],
    correctOptionIndex: 1,
    explanation: 'Option 2 targets a real pain point ("struggling to find Upwork clients") with specific proof and relevance.'
  },
  {
    id: 'task-2',
    title: 'Customer Service: Handling Refund Inquiries',
    category: 'Freelancing',
    requiredPlan: 'bronze',
    rewardPKR: 15,
    estimatedMinutes: 2,
    learningSnippet: 'When a client asks for a modification, never respond aggressively. Empathize first, reconfirm the exact scope, and offer a clear revision path.',
    practicalQuestion: 'What is the professional freelance response to an unsatisfied client revision request?',
    options: [
      '"Cancel the order immediately"',
      '"I am sorry the initial draft did not hit the mark. Let me refine section 2 per your notes today"',
      '"It is not my fault, you gave bad instructions"',
      '"Pay extra $50 before I speak with you"'
    ],
    correctOptionIndex: 1,
    explanation: 'Professionalism and proactive resolution protect your 5-star rating on freelance marketplaces.'
  },
  {
    id: 'task-3',
    title: 'Cybersecurity: Spotting Phishing & Fake Payment Slips',
    category: 'Security',
    requiredPlan: 'bronze',
    rewardPKR: 15,
    estimatedMinutes: 2,
    learningSnippet: 'Authentic JazzCash and Easypaisa SMS confirmations always arrive from official sender codes (8558 for JazzCash, 3737 for Easypaisa), never from standard 11-digit personal phone numbers.',
    practicalQuestion: 'You receive an SMS from 0300-1234567 claiming "Rs 5,000 received via JazzCash". Is this legitimate?',
    options: [
      'Yes, it is 100% verified',
      'No, official JazzCash alerts come exclusively from 8558; personal numbers indicate a fake SMS scam',
      'It depends on the time of day',
      'Call the sender and give them your MPIN'
    ],
    correctOptionIndex: 1,
    explanation: 'Official SMS comes only from branded shortcodes (8558 / 3737). Never trust personal number SMS.'
  },
  {
    id: 'task-4',
    title: 'Social Media: TikTok Algorithm Watch-Time Optimization',
    category: 'Content Creation',
    requiredPlan: 'silver',
    rewardPKR: 25,
    estimatedMinutes: 3,
    learningSnippet: 'TikTok values completion rate and watch loop frequency higher than simple likes. Short, dense 15-second educational videos outperform 3-minute rambling clips.',
    practicalQuestion: 'Which technique best improves video completion rate on TikTok and Instagram Reels?',
    options: [
      'A 10-second silent intro with your logo',
      'Delivering the key takeaway immediately in the first 2 seconds, followed by quick dynamic visual cuts',
      'Asking users to like and subscribe in the first sentence',
      'Using low resolution 480p clips'
    ],
    correctOptionIndex: 1,
    explanation: 'Immediate hook + fast pacing prevents drop-offs and pushes the video to the For You Page (FYP).'
  },
  {
    id: 'task-5',
    title: 'Canva Design: High Contrast Social Media Thumbnails',
    category: 'Design',
    requiredPlan: 'silver',
    rewardPKR: 25,
    estimatedMinutes: 2,
    learningSnippet: 'Mobile screen users scroll fast. Use complementary contrasting colors (e.g. bold yellow/gold on dark obsidian or deep navy) with maximum 4-6 words on the thumbnail.',
    practicalQuestion: 'Why should YouTube and Reels thumbnails avoid placing text in the bottom right corner?',
    options: [
      'Because YouTube disallows it',
      'Because the video duration badge overlay covers that exact area on mobile screens',
      'Because colors look washed out there',
      'Because it looks too aesthetic'
    ],
    correctOptionIndex: 1,
    explanation: 'The video timestamp badge (e.g. 0:45) is overlaid at the bottom right corner, obscuring any text underneath.'
  },
  {
    id: 'task-6',
    title: 'E-Commerce: Winning Product Selection Criteria',
    category: 'E-Commerce',
    requiredPlan: 'gold',
    rewardPKR: 40,
    estimatedMinutes: 3,
    learningSnippet: 'In Pakistani dropshipping, successful products have a "Wow Factor", solve a real daily pain point, are lightweight (under 1kg to minimize courier TCS/Leopard charges), and have at least 3x markup margin.',
    practicalQuestion: 'Which product fits ideal Pakistani local dropshipping criteria best?',
    options: [
      'A 15kg heavy iron dumbbell with Rs 100 profit margin',
      'A rechargeable mini lint remover solving clothes fuzz with 3x markup and low shipping weight',
      'Counterfeit branded luxury watches with legal risks',
      'Expired liquid cosmetics'
    ],
    correctOptionIndex: 1,
    explanation: 'High perceived value, lightweight delivery, and strong problem-solving attributes minimize return-to-origin (RTO) rates.'
  },
  {
    id: 'task-7',
    title: 'Graphic Design: Vector vs Raster for Client Logos',
    category: 'Design Mastery',
    requiredPlan: 'platinum',
    rewardPKR: 65,
    estimatedMinutes: 3,
    learningSnippet: 'Client logos must be created in vector format (.AI, .EPS, .SVG) so they can be infinitely scaled from an app icon to a billboard without pixelation.',
    practicalQuestion: 'A client requests their company logo for a 20-foot outdoor highway billboard. What format should you deliver?',
    options: [
      'A 72 DPI JPEG screenshot from WhatsApp',
      'A vector SVG / EPS / AI file built in Adobe Illustrator or vector software',
      'A Microsoft Word document with pasted image',
      'A low-res GIF'
    ],
    correctOptionIndex: 1,
    explanation: 'Vector graphics are resolution-independent and scale seamlessly to any size without loss of fidelity.'
  },
  {
    id: 'task-8',
    title: 'AI Engineering: Few-Shot Prompting Technique',
    category: 'AI & Web',
    requiredPlan: 'diamond',
    rewardPKR: 120,
    estimatedMinutes: 4,
    learningSnippet: 'Few-shot prompting provides 2 to 3 exemplary input-output pairs inside the prompt before asking the AI model to perform the task. This drastically increases output accuracy and schema adherence.',
    practicalQuestion: 'How does few-shot prompting differ from zero-shot prompting in Gemini and GPT models?',
    options: [
      'Few-shot takes 10 hours to respond',
      'Few-shot provides concrete examples of the desired format inside the prompt, while zero-shot gives no prior examples',
      'Zero-shot uses multiple GPUs while few-shot uses one',
      'Few-shot is only for translation'
    ],
    correctOptionIndex: 1,
    explanation: 'Demonstrations anchor model tone, formatting, and structural constraints with exceptional consistency.'
  },
  {
    id: 'task-9',
    title: 'High-Ticket Sales: Discovery Call Qualification Framework',
    category: 'Agency Growth',
    requiredPlan: 'executive',
    rewardPKR: 300,
    estimatedMinutes: 4,
    learningSnippet: 'Use the BANT framework (Budget, Authority, Need, Timeline) before spending days preparing customized proposals for international clients.',
    practicalQuestion: 'When an overseas prospect asks for your price on minute 2 of an introductory call, what is the best executive response?',
    options: [
      '"I can do it for $10 please hire me"',
      '"Our custom solutions range based on your exact scale. Let us first spend 5 minutes clarifying your desired revenue goals so I quote accurately"',
      '"Hang up the call immediately"',
      '"Send me $1,000 first"'
    ],
    correctOptionIndex: 1,
    explanation: 'Anchoring price to business objectives and scope prevents commoditization and positions you as an expert consultant.'
  },
  {
    id: 'task-10',
    title: 'Agency Scale: Delegation and SOP Documentation',
    category: 'Leadership',
    requiredPlan: 'royal',
    rewardPKR: 500,
    estimatedMinutes: 5,
    learningSnippet: 'To scale a digital agency past $10k/month, founders must transition from working IN the business to ON the business by building Standard Operating Procedures (SOPs) and hiring junior execution specialists.',
    practicalQuestion: 'What is the primary function of a Standard Operating Procedure (SOP) in an agency?',
    options: [
      'To increase office electricity consumption',
      'To provide step-by-step repeatable guidelines ensuring consistent delivery quality independent of who executes it',
      'To impress bank loan officers only',
      'To confuse new interns'
    ],
    correctOptionIndex: 1,
    explanation: 'Clear SOPs allow consistent quality, rapid onboarding, and leverage that enables founders to focus on strategic growth.'
  }
];

export const INITIAL_COURSES: CourseModule[] = [
  {
    id: 'course-1',
    title: 'Digital Freelance Kickstart: From Zero to First $100',
    tier: 'bronze',
    duration: '4.5 Hours',
    totalLessons: 8,
    instructor: 'Hamza Farooq (Top Rated Upwork Freelancer)',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
    description: 'Learn the exact roadmap to set up profitable profiles on Fiverr & Upwork, write winning proposals, communicate with US/UK clients, and withdraw your earnings directly into JazzCash and Pakistani Bank accounts.',
    lessons: [
      { id: 'l1', title: '1. Introduction to the Pakistani Freelance Economy', duration: '18 min', isCompleted: true },
      { id: 'l2', title: '2. Niche Selection: Identifying High-Demand Micro-Skills', duration: '24 min', isCompleted: true },
      { id: 'l3', title: '3. Crafting a 100% Verified Profile on Upwork & Fiverr', duration: '35 min', isCompleted: false },
      { id: 'l4', title: '4. The Golden Proposal Template: Winning Your First Job', duration: '40 min', isCompleted: false },
      { id: 'l5', title: '5. Client Communication & Overcoming Language Barriers', duration: '30 min', isCompleted: false },
      { id: 'l6', title: '6. Receiving Payments: Payoneer to JazzCash Setup', duration: '22 min', isCompleted: false },
      { id: 'l7', title: '7. Avoiding Scams & Chargebacks on Freelance Platforms', duration: '28 min', isCompleted: false },
      { id: 'l8', title: '8. Graduation & First Project Launch Checklist', duration: '20 min', isCompleted: false }
    ]
  },
  {
    id: 'course-2',
    title: 'Social Media Growth & Affiliate Marketing Mastery',
    tier: 'silver',
    duration: '6.2 Hours',
    totalLessons: 10,
    instructor: 'Ayesha Siddiqui (Growth Lead & Influencer)',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
    description: 'Master the viral TikTok algorithm, Instagram Reels production, building organic niche audiences, and monetizing with local affiliate programs and digital product sales.',
    lessons: [
      { id: 'l201', title: '1. Understanding Viral Algorithmic Triggers in 2026', duration: '28 min', isCompleted: true },
      { id: 'l202', title: '2. 3-Second Visual Hooks That Stop the Scroll', duration: '32 min', isCompleted: false },
      { id: 'l203', title: '3. Rapid CapCut Mobile Video Editing Secrets', duration: '45 min', isCompleted: false },
      { id: 'l204', title: '4. Setting Up Affiliate Links & Tracking Commissions', duration: '35 min', isCompleted: false },
      { id: 'l205', title: '5. Automated DM Funnels for High Conversion', duration: '40 min', isCompleted: false }
    ]
  },
  {
    id: 'course-3',
    title: 'Pakistan Local Dropshipping & Daraz Mastery',
    tier: 'gold',
    duration: '8.5 Hours',
    totalLessons: 12,
    instructor: 'Bilal Tariq (7-Figure Local Dropshipper)',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=600&q=80',
    description: 'Build a profitable Cash-On-Delivery (COD) e-commerce store in Pakistan. Source products in Shah Alam Market Lahore or Raja Bazar Rawalpindi, set up courier accounts (TCS, Trax, CallCourier), and run profitable Meta Ads.',
    lessons: [
      { id: 'l301', title: '1. Local Dropshipping Landscape in Pakistan', duration: '30 min', isCompleted: true },
      { id: 'l302', title: '2. Finding Reliable Wholesale Suppliers & COD Couriers', duration: '50 min', isCompleted: false },
      { id: 'l303', title: '3. Building High-Converting Shopify Landing Pages', duration: '65 min', isCompleted: false },
      { id: 'l304', title: '4. Facebook & Instagram Ads for Pakistani Audiences', duration: '75 min', isCompleted: false },
      { id: 'l305', title: '5. Slashing Return-to-Origin (RTO) Confirmation Scripts', duration: '45 min', isCompleted: false }
    ]
  },
  {
    id: 'course-4',
    title: 'AI Prompt Engineering & Modern Full-Stack Solutions',
    tier: 'diamond',
    duration: '11.0 Hours',
    totalLessons: 15,
    instructor: 'Daniyal Qureshi (Senior AI Solutions Architect)',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    description: 'Leverage cutting-edge LLMs, Claude, Gemini, React, and serverless stacks to build custom AI tools, client chatbots, automated scrapers, and digital micro-SaaS products.',
    lessons: [
      { id: 'l401', title: '1. Foundations of LLMs and Structured Outputs', duration: '45 min', isCompleted: false },
      { id: 'l402', title: '2. Building React Frontends with Modern Frameworks', duration: '60 min', isCompleted: false },
      { id: 'l403', title: '3. Integrating Gemini & OpenAI APIs with Webhooks', duration: '80 min', isCompleted: false },
      { id: 'l404', title: '4. Deploying Cloud Apps & Monetizing Custom SaaS', duration: '90 min', isCompleted: false }
    ]
  }
];

export const MASTER_ADMIN_USER: User = {
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

export const INITIAL_USERS: User[] = [MASTER_ADMIN_USER];

export const INITIAL_TRANSACTIONS: Transaction[] = [];

