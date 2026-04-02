import React from 'react';
import { motion } from 'motion/react';
import { PiggyBank, Target, Clock, ShieldCheck, Wallet, ArrowRight, CheckCircle2, AlertCircle, Landmark, Shield, Briefcase, Info, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import BlurText from '@/components/BlurText';
import ChromaGrid from '@/components/ChromaGrid';
import { useModal } from '@/context/ModalContext';
import { AnimatePresence } from 'motion/react';

const retirementSchemes = [
  {
    name: 'National Pension System (NPS)',
    type: 'Market-Linked Pension',
    description: 'A voluntary, defined contribution retirement savings scheme.',
    benefits: [
      'Extra ₹50,000 tax deduction under Section 80CCD(1B).',
      'Choose between Active Choice (you decide allocation) or Auto Choice (age-based).',
      'Equity exposure up to 75% for higher long-term growth.',
      '60% of corpus is tax-free at age 60; 40% must be used for annuity.',
      'Lowest fund management charges globally (0.01% to 0.09%).'
    ],
    color: 'bg-blue-500',
    icon: Landmark
  },
  {
    name: 'Senior Citizens Savings Scheme (SCSS)',
    type: 'Guaranteed Income',
    description: 'A government-backed savings instrument for individuals aged 60+.',
    benefits: [
      'High interest rate (currently 8.2% p.a.) paid quarterly.',
      'Maximum investment limit of ₹30 Lakh per individual.',
      '5-year tenure, extendable by another 3 years.',
      'Tax deduction under Section 80C up to ₹1.5 Lakh.',
      'Highest safety as it is backed by the Government of India.'
    ],
    color: 'bg-emerald-500',
    icon: ShieldCheck
  },
  {
    name: 'Public Provident Fund (PPF)',
    type: 'Tax-Free Savings',
    description: 'A long-term savings scheme with guaranteed returns and tax benefits.',
    benefits: [
      'EEE Status: Exempt-Exempt-Exempt (Investment, Interest, and Maturity are all tax-free).',
      '15-year lock-in period, ideal for long-term retirement corpus.',
      'Partial withdrawals allowed after 6 years for specific needs.',
      'Loan facility available against the PPF balance.',
      'Current interest rate is 7.1% p.a., compounded annually.'
    ],
    color: 'bg-amber-500',
    icon: PiggyBank
  },
  {
    name: 'Employee Provident Fund (EPF)',
    type: 'Mandatory Savings',
    description: 'A retirement benefit scheme for salaried employees.',
    benefits: [
      'Employer matches your 12% contribution (part goes to EPS).',
      'Interest rate usually higher than other debt instruments (8.25% for FY24).',
      'Tax-free interest if continuous service is more than 5 years.',
      'Option for Voluntary Provident Fund (VPF) to increase contributions.',
      'Partial withdrawals for home purchase, marriage, or medical emergencies.'
    ],
    color: 'bg-sky-500',
    icon: Briefcase
  },
  {
    name: 'Atal Pension Yojana (APY)',
    type: 'Social Security',
    description: 'A pension scheme focused on the unorganized sector.',
    benefits: [
      'Guaranteed minimum pension of ₹1,000 to ₹5,000 per month.',
      'Pension starts after age 60 based on contributions.',
      'In case of death, spouse receives the same pension amount.',
      'If both die, the entire corpus is returned to the nominee.',
      'Ideal for low-income individuals seeking basic social security.'
    ],
    color: 'bg-indigo-500',
    icon: Shield
  }
];

const retirementSteps = [
  {
    title: 'Define Your Vision',
    icon: Target,
    description: 'What does retirement look like for you? Travel, hobbies, or a second career?',
    details: [
      'Identify post-retirement lifestyle goals. Pro Tip: Be specific about travel and hobbies.',
      'Estimate monthly living expenses in today\'s value.',
      'Plan for healthcare and medical costs. These usually rise with age.',
      'Consider legacy and inheritance goals for your children or charity.',
      'Decide on your retirement age. Earlier retirement requires a larger corpus.'
    ],
    color: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Calculate the Corpus',
    icon: Wallet,
    description: 'Estimate your monthly expenses and factor in 6-7% annual inflation.',
    details: [
      'Use retirement calculators for accuracy. Factor in all income sources.',
      'Factor in life expectancy (85-90 years). Pro Tip: It\'s better to over-estimate than under-estimate.',
      'Account for rising healthcare inflation (usually 14-15% in India).',
      'Include a buffer for emergencies and one-time large expenses.',
      'Understand the "Real Rate of Return" after inflation and taxes.'
    ],
    color: 'bg-sky-50 text-sky-600'
  },
  {
    title: 'Choose the Right Tools',
    icon: PiggyBank,
    description: 'Leverage EPF, NPS, PPF, and Equity Mutual Funds for long-term growth.',
    details: [
      'NPS for market-linked pension. Pro Tip: Use the 50k extra deduction under 80CCD(1B).',
      'PPF for tax-free guaranteed returns. Best for the debt portion of your portfolio.',
      'Equity MFs for beating inflation over the long term (10+ years).',
      'EPF/VPF for safe debt accumulation through your employer.',
      'Annuities: For guaranteed monthly income, though returns are usually lower.'
    ],
    color: 'bg-amber-50 text-amber-600'
  },
  {
    title: 'Protect Your Health',
    icon: ShieldCheck,
    description: 'Ensure adequate health insurance to prevent medical bills from eating your savings.',
    details: [
      'Buy a dedicated senior citizen cover. Pro Tip: Buy while you are healthy to avoid exclusions.',
      'Consider a super top-up plan for high coverage at low cost.',
      'Build a separate medical emergency fund for non-covered expenses.',
      'Review coverage every 3-5 years to adjust for rising medical costs.',
      'Critical Illness Cover: For lump sum payment on major diagnosis.'
    ],
    color: 'bg-rose-50 text-rose-600'
  }
];

export default function RetirementGuide() {
  const { openConsultationModal } = useModal();
  const [expandedSchemes, setExpandedSchemes] = React.useState<number[]>([]);

  const toggleScheme = (idx: number) => {
    setExpandedSchemes(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 pt-24 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                Knowledge Base
              </span>
              <BlurText 
                text="The Ultimate Retirement Roadmap"
                centered={false}
                highlight="Retirement"
                className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
              />
              <p className="text-xl text-slate-600 leading-relaxed">
                Retirement is not an age; it's a financial status. Learn how to build a bulletproof corpus for a dignified and worry-free post-work life.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="hidden lg:block"
            >
              <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1200&h=675" 
                  alt="Retirement Planning" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Steps Section */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Clock className="w-6 h-6 text-primary" />
                4 Pillars of Retirement Planning
              </h2>
              <ChromaGrid 
                cols="grid-cols-1 md:grid-cols-2"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={retirementSteps.map(step => ({
                  title: step.title,
                  description: step.description,
                  icon: step.icon,
                  details: step.details,
                  borderColor: step.color.includes('blue') ? '#3B82F6' : step.color.includes('sky') ? '#0EA5E9' : step.color.includes('amber') ? '#F59E0B' : '#6366F1',
                  gradient: `linear-gradient(145deg, ${step.color.includes('blue') ? '#3B82F6' : step.color.includes('sky') ? '#0EA5E9' : step.color.includes('amber') ? '#F59E0B' : '#6366F1'}, #000)`
                }))}
              />
            </section>

            {/* Retirement Schemes Section */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm">02</span>
                Top Retirement Schemes in India
              </h2>
              <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                India offers several government-backed and market-linked schemes to help you build a secure retirement corpus. Here is a detailed breakdown of the most popular options.
              </p>
              <div className="grid grid-cols-1 gap-6">
                {retirementSchemes.map((scheme, idx) => {
                  const isExpanded = expandedSchemes.includes(idx);
                  const Icon = scheme.icon;
                  return (
                    <div key={idx} className={`rounded-3xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-lg ring-1 ring-primary/10' : 'hover:shadow-md'}`}>
                      <button 
                        onClick={() => toggleScheme(idx)}
                        className={`w-full text-left p-6 flex flex-wrap justify-between items-center gap-4 transition-colors ${isExpanded ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl ${scheme.color} bg-opacity-10 flex items-center justify-center text-primary`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">{scheme.name}</h4>
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm mt-1 inline-block">
                              {scheme.type}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-primary">
                            {isExpanded ? 'Hide Details' : 'View More Details'}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/30">
                              <p className="text-sm text-slate-600 mb-6 leading-relaxed italic">
                                "{scheme.description}"
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {scheme.benefits.map((benefit, bIdx) => (
                                  <div key={bIdx} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                      <CheckCircle2 className="w-3 h-3 text-primary" />
                                    </div>
                                    <span className="text-xs text-slate-600 leading-relaxed font-medium">{benefit}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-6 flex justify-end">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openConsultationModal(`Planning with ${scheme.name}`);
                                  }}
                                  className="flex items-center gap-2 text-xs font-bold text-primary hover:gap-3 transition-all uppercase tracking-widest"
                                >
                                  Get Expert Advice <ArrowRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SWP Section */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Wallet className="w-6 h-6 text-primary" />
                SWP: The Pension Alternative
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-6">
                  A Systematic Withdrawal Plan (SWP) allows you to withdraw a fixed amount from your mutual fund investments regularly. It is often more tax-efficient than traditional pensions or FDs.
                </p>
                <ChromaGrid 
                  cols="grid-cols-1 md:grid-cols-2"
                  radius={300}
                  damping={0.45}
                  fadeOut={0.6}
                  ease="power3.out"
                  items={[
                    {
                      title: 'Tax Efficiency',
                      description: 'Only the capital gains portion of the withdrawal is taxed, not the entire amount.',
                      details: [
                        'LTCG on equity is 10% above ₹1L. Pro Tip: Withdraw up to ₹1L gain tax-free annually.',
                        'Debt SWP is taxed as per slab. Better than FDs for high-bracket investors.',
                        'No TDS on SWP for resident Indians.',
                        'Principal portion is never taxed twice.'
                      ],
                      borderColor: '#3B82F6',
                      gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                    },
                    {
                      title: 'Flexibility',
                      description: 'You can increase, decrease, or stop the withdrawal amount at any time.',
                      details: [
                        'No lock-in periods for SWP. You control your money.',
                        'Change frequency (monthly/quarterly) to suit your needs.',
                        'Stop SWP during market crashes to avoid "Sequence of Returns Risk".',
                        'Withdraw lump sums for unplanned expenses like weddings or travel.'
                      ],
                      borderColor: '#0EA5E9',
                      gradient: 'linear-gradient(180deg, #0EA5E9, #000)'
                    }
                  ]}
                />
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4">The 3-Bucket Strategy for Withdrawals</h4>
                <p className="text-sm text-slate-600 mb-6">Managing your money during retirement is as important as saving for it. The 3-bucket strategy ensures you have cash for today and growth for tomorrow.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <h5 className="font-bold text-blue-900 text-xs mb-1">Bucket 1: Immediate Cash</h5>
                    <p className="text-[10px] text-blue-700">2-3 years of expenses in Liquid Funds/FDs. No market risk.</p>
                  </div>
                  <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
                    <h5 className="font-bold text-sky-900 text-xs mb-1">Bucket 2: Stability</h5>
                    <p className="text-[10px] text-sky-700">5-7 years of expenses in Debt Funds/Bonds. Low to medium risk.</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <h5 className="font-bold text-amber-900 text-xs mb-1">Bucket 3: Growth</h5>
                    <p className="text-[10px] text-amber-700">Remaining corpus in Equity Funds. High risk, high long-term growth.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Age-based Allocation */}
            <section className="bg-primary/10 p-10 rounded-[2.5rem] border border-primary/20">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Asset Allocation by Life Stage</h2>
              <div className="space-y-8">
                <div className="flex gap-6 items-center">
                  <div className="w-24 text-primary font-bold text-xl">Age 25</div>
                  <div className="flex-1 h-4 bg-primary/20 rounded-full overflow-hidden flex">
                    <div className="w-[80%] bg-primary h-full" title="Equity" />
                    <div className="w-[20%] bg-slate-400 h-full" title="Debt" />
                  </div>
                  <div className="text-xs text-slate-500">80% Equity / 20% Debt</div>
                </div>
                <div className="flex gap-6 items-center">
                  <div className="w-24 text-primary font-bold text-xl">Age 45</div>
                  <div className="flex-1 h-4 bg-primary/20 rounded-full overflow-hidden flex">
                    <div className="w-[50%] bg-primary h-full" title="Equity" />
                    <div className="w-[50%] bg-slate-400 h-full" title="Debt" />
                  </div>
                  <div className="text-xs text-slate-500">50% Equity / 50% Debt</div>
                </div>
                <div className="flex gap-6 items-center">
                  <div className="w-24 text-primary font-bold text-xl">Age 65</div>
                  <div className="flex-1 h-4 bg-primary/20 rounded-full overflow-hidden flex">
                    <div className="w-[20%] bg-primary h-full" title="Equity" />
                    <div className="w-[80%] bg-slate-400 h-full" title="Debt" />
                  </div>
                  <div className="text-xs text-slate-500">20% Equity / 80% Debt</div>
                </div>
              </div>
            </section>

            {/* FIRE Section */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                The FIRE Movement
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-6">
                  FIRE stands for **Financial Independence, Retire Early**. It's a lifestyle movement with the goal of gaining financial independence and retiring much earlier than traditional budgets and retirement plans allow.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                    <h4 className="font-bold text-blue-900 mb-2">The 25x Rule</h4>
                    <p className="text-xs text-blue-700">You need to save 25 times your annual expenses to be considered financially independent.</p>
                  </div>
                  <div className="p-5 bg-sky-50 rounded-2xl border border-sky-100">
                    <h4 className="font-bold text-sky-900 mb-2">The 4% Rule</h4>
                    <p className="text-xs text-sky-700">You can safely withdraw 4% of your portfolio annually without running out of money.</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4">Reverse Mortgage: An Option for Seniors</h4>
                <p className="text-sm text-slate-600 mb-4">
                  For senior citizens who own a home but have limited cash flow, a reverse mortgage allows them to receive a regular stream of income from the bank against the value of their property.
                </p>
                <ul className="text-xs text-slate-500 space-y-2">
                  <li>• You continue to live in the house.</li>
                  <li>• No monthly repayments required during your lifetime.</li>
                  <li>• The loan is settled by selling the house after the owner's demise or by the heirs.</li>
                </ul>
              </div>
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Estate Planning: Securing Your Legacy</h2>
              <ChromaGrid 
                cols="grid-cols-1 md:grid-cols-2"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={[
                  {
                    title: 'Wills & Nominations',
                    description: 'A nominee is only a "custodian." A Will is the legal document that determines who actually inherits your assets.',
                    details: [
                      'Registered Will: Ensures legal validity and reduces chances of dispute.',
                      'Updating Nominees: Pro Tip: Ensure nominees are updated in all bank accounts and insurance.',
                      'Joint Holding: Simplifies the transfer of assets to the surviving spouse.',
                      'Specific Bequests: Clearly mention who gets what to avoid family conflicts.'
                    ],
                    borderColor: '#3B82F6',
                    gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                  },
                  {
                    title: 'Succession Planning',
                    description: 'For business owners, planning the transition of leadership and ownership is critical for continuity.',
                    details: [
                      'Identifying Future Leaders: Training the next generation early.',
                      'Buy-Sell Agreements: Legal framework for transfer of business interest.',
                      'Tax-Efficient Transfer: Using trusts or gifts to transfer shares.',
                      'Ensuring Business Stability: Protecting the livelihood of employees and partners.'
                    ],
                    borderColor: '#0EA5E9',
                    gradient: 'linear-gradient(180deg, #0EA5E9, #000)'
                  }
                ]}
              />
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Legacy Planning: Beyond the Will</h2>
              <ChromaGrid 
                cols="grid-cols-1 md:grid-cols-2"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={[
                  {
                    title: 'Private Family Trusts',
                    description: 'A trust allows you to pass on assets without probate. It provides protection against creditors and disputes.',
                    details: [
                      'Asset Protection: Safeguarding wealth from lawsuits and creditors.',
                      'Avoiding Probate: Faster transfer of assets compared to a Will.',
                      'Conditional Distribution: Pro Tip: Set age or milestone-based distribution for heirs.',
                      'Confidentiality: Unlike a Will, a Trust deed is not a public document.'
                    ],
                    borderColor: '#3B82F6',
                    gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                  },
                  {
                    title: 'Digital Asset Planning',
                    description: 'Your legacy includes digital assets like social media, crypto-wallets, and online subscriptions.',
                    details: [
                      'Digital Inventory: List of all online accounts and subscriptions.',
                      'Password Management: Using a secure vault with an "emergency kit".',
                      'Social Media Legacy: Instructions for memorializing or deleting accounts.',
                      'Crypto Keys: Pro Tip: Ensure private keys are securely stored and accessible to heirs.'
                    ],
                    borderColor: '#0EA5E9',
                    gradient: 'linear-gradient(180deg, #0EA5E9, #000)'
                  }
                ]}
              />
            </section>

            <section className="bg-rose-50 p-10 rounded-[2.5rem] border border-rose-100">
              <h2 className="text-2xl font-bold text-rose-900 mb-6 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-rose-600" />
                The Silent Killer: Inflation & Healthcare
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-rose-800 mb-6">
                  While general inflation is ~6%, medical inflation in India is rising at 14-15% annually. A retirement corpus that ignores this will be exhausted much sooner than expected.
                </p>
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-4">Projected Cost of Surgery (₹5 Lakh today)</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">In 10 Years (14% infl.)</span>
                      <span className="font-bold text-rose-600">₹18.5 Lakh</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">In 20 Years (14% infl.)</span>
                      <span className="font-bold text-rose-600">₹68.7 Lakh</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Deep Dive Section */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">The Magic of NPS (National Pension System)</h2>
              <div className="prose prose-slate max-w-none">
                <p>
                  For Indian professionals, the NPS is one of the most powerful retirement tools. It offers a unique combination of equity exposure, low costs, and additional tax benefits.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-sky-500" />
                      Key Advantages
                    </h4>
                    <ul className="space-y-3 text-sm text-slate-600">
                      <li>Extra ₹50,000 tax deduction under 80CCD(1B).</li>
                      <li>Market-linked returns with equity exposure up to 75%.</li>
                      <li>Lowest fund management fees in the world.</li>
                      <li>60% of the corpus is tax-free at maturity.</li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                      Things to Note
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      40% of the maturity corpus must be used to purchase an annuity (pension). The annuity income is taxable as per your income slab.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-primary text-slate-900 p-8 rounded-[2rem] shadow-xl">
              <h3 className="text-xl font-bold mb-6">Retirement Checklist</h3>
              <ul className="space-y-5">
                {[
                  'Calculate your inflation-adjusted monthly needs.',
                  'Maximize your EPF/VPF contributions.',
                  'Start an NPS account for extra tax savings.',
                  'Increase SIPs annually with salary hikes.',
                  'Buy a dedicated health cover for parents.',
                  'Nominate heirs for all financial assets.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-800 font-medium">
                    <div className="w-5 h-5 rounded-full bg-white/30 text-slate-900 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-primary/10 p-8 rounded-[2rem] border border-primary/20">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Need a Custom Plan?</h3>
              <p className="text-sm text-slate-600 mb-6">
                Our retirement specialists can help you calculate your exact "FIRE" number and build a personalized investment strategy.
              </p>
              <button 
                onClick={() => openConsultationModal('Retirement Planning')}
                className="w-full bg-primary text-slate-900 font-bold py-4 rounded-2xl text-sm hover:brightness-105 transition-all flex items-center justify-center gap-2"
              >
                Talk to an Expert <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
