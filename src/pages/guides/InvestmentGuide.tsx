import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, PieChart, Landmark, Coins, Building2, ArrowUpRight, Target, Zap, ArrowRight, CheckCircle2, HelpCircle, Sparkles, Trophy, RotateCcw, Info, X, Home, GraduationCap, Umbrella, Palmtree, Wallet } from 'lucide-react';
import BlurText from '@/src/components/BlurText';
import ChromaGrid from '@/src/components/ChromaGrid';
import { useModal } from '@/src/context/ModalContext';
import { cn } from '@/src/lib/utils';

const QUIZ_QUESTIONS = [
  {
    question: "Which of these best describes 'Asset Allocation'?",
    options: [
      "Picking the best performing stock of the year.",
      "Spreading investments across different classes like stocks, bonds, and gold.",
      "Keeping all your money in a savings account."
    ],
    correct: 1,
    explanation: "Asset allocation is the strategy of balancing risk and reward by apportioning a portfolio's assets according to an individual's goals, risk tolerance, and investment horizon."
  },
  {
    question: "Generally, if an investment offers a very high potential return, what is true about its risk?",
    options: [
      "The risk is likely very low.",
      "The risk is likely very high.",
      "Risk and reward are not related."
    ],
    correct: 1,
    explanation: "In finance, risk and return are directly correlated. Higher potential returns almost always come with higher potential for loss."
  },
  {
    question: "What is the main characteristic of Passive Investing (like Index Funds)?",
    options: [
      "Trying to beat the market by frequent trading.",
      "Matching the performance of a specific market index.",
      "Hiring a celebrity fund manager to pick stocks."
    ],
    correct: 1,
    explanation: "Passive investing aims to match the returns of a market index rather than trying to outperform it through active selection."
  },
  {
    question: "To maximize the power of compounding, what is the most important factor?",
    options: [
      "The amount of initial investment.",
      "The time duration the money stays invested.",
      "The frequency of checking your balance."
    ],
    correct: 1,
    explanation: "Time is the most critical element in compounding. The longer your money stays invested, the more 'interest on interest' it generates."
  },
  {
    question: "How does inflation affect your purchasing power over time?",
    options: [
      "It increases it.",
      "It decreases it.",
      "It has no effect."
    ],
    correct: 1,
    explanation: "Inflation is the rate at which the general level of prices for goods and services is rising. As inflation rises, every rupee you own buys a smaller percentage of a good or service."
  }
];

const assetClasses = [
  {
    title: 'Equity (Stocks)',
    icon: TrendingUp,
    description: 'Ownership in companies. High growth potential over long term.',
    risk: 'High',
    returns: '12-15% (Historical)',
    details: [
      'Large Cap Funds: Investing in top 100 companies. Pro Tip: Best for stable long-term growth and core portfolio stability.',
      'Mid Cap Funds: High growth potential in mid-sized firms. Pro Tip: Ideal for investors with a 5-7 year horizon seeking higher alpha.',
      'Small Cap Funds: Exponential growth potential in small firms. Pro Tip: Use SIPs to navigate high volatility; limit exposure to 10-15%.',
      'ELSS: Tax-saving equity funds (Section 80C). Pro Tip: Shortest lock-in (3 yrs) among tax-savers; great for wealth + tax saving.',
      'Sectoral Funds: Focused on specific industries like IT/Banking. Pro Tip: High risk; use only for tactical bets, not for core portfolio.'
    ],
    color: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Debt (Fixed Income)',
    icon: Landmark,
    description: 'Lending to govt or corps. Stability and regular income.',
    risk: 'Low to Medium',
    returns: '6-8% (Historical)',
    details: [
      'Fixed Deposits (FD): Guaranteed bank returns. Pro Tip: Use for short-term goals (<3 years).',
      'Public Provident Fund (PPF): Tax-free govt savings. 15-year lock-in for long-term safety.',
      'Debt Mutual Funds: Investing in bonds and T-bills. More tax-efficient than FDs for long term.',
      'Corporate Bonds: Higher interest than FDs but with credit risk. Stick to AAA-rated bonds.',
      'Liquid Funds: Ideal for parking emergency funds with easy withdrawal.'
    ],
    color: 'bg-sky-50 text-sky-600'
  },
  {
    title: 'Gold',
    icon: Coins,
    description: 'A hedge against inflation and currency devaluation.',
    risk: 'Medium',
    returns: '8-10% (Historical)',
    details: [
      'Physical Gold: Jewelry, coins, and bars. High making charges and storage risks.',
      'Sovereign Gold Bonds (SGB): Govt-backed with 2.5% interest. Pro Tip: Best way to own gold.',
      'Gold ETFs: Digital gold tracking market prices. Highly liquid and easy to trade.',
      'Digital Gold: Buying gold through apps in small amounts. Convenient but check for storage fees.',
      'Gold Mutual Funds: Investing in gold mining companies or ETFs.'
    ],
    color: 'bg-amber-50 text-amber-600'
  },
  {
    title: 'Real Estate',
    icon: Building2,
    description: 'Physical property or REITs. Rental income and appreciation.',
    risk: 'Medium to High',
    returns: '8-12% (Historical)',
    details: [
      'Residential Property: Apartments and villas. High maintenance and low rental yield (2-3%).',
      'Commercial Property: Offices and retail spaces. Higher rental yields (7-9%) but higher entry cost.',
      'REITs: Real Estate Investment Trusts. Pro Tip: Best for liquid exposure to commercial real estate.',
      'Fractional Ownership: Co-investing in high-value assets. Access to Grade-A properties.',
      'Land/Plots: High appreciation potential but high risk of encroachment and litigation.'
    ],
    color: 'bg-indigo-50 text-indigo-600'
  }
];

const INVESTMENT_GOALS = [
  { id: 'retirement', label: 'Retirement', icon: Landmark, description: 'Building a corpus for post-work life.' },
  { id: 'education', label: 'Child Education', icon: GraduationCap, description: 'Saving for your child\'s future studies.' },
  { id: 'wealth', label: 'Wealth Creation', icon: Trophy, description: 'Long-term growth and financial freedom.' },
  { id: 'home', label: 'Home Purchase', icon: Home, description: 'Saving for a down payment or full purchase.' },
  { id: 'emergency', label: 'Emergency Fund', icon: Umbrella, description: 'Safety net for unexpected expenses.' },
  { id: 'vacation', label: 'Dream Vacation', icon: Palmtree, description: 'Saving for that special trip.' },
];

const ASSET_OPTIONS = [
  { id: 'equity', label: 'Equity', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'debt', label: 'Debt', icon: Landmark, color: 'text-sky-600', bg: 'bg-sky-50' },
  { id: 'gold', label: 'Gold', icon: Coins, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'realestate', label: 'Real Estate', icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

export default function InvestmentGuide() {
  const { openConsultationModal } = useModal();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const toggleAsset = (id: string) => {
    setSelectedAssets(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleOptionSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedOption(index);
    setShowFeedback(true);
    if (index === QUIZ_QUESTIONS[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setScore(0);
    setQuizComplete(false);
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
                text="Mastering the Art of Investing"
                centered={false}
                highlight="Investing"
                className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
              />
              <p className="text-xl text-slate-600 leading-relaxed">
                Investing is the process of putting your money to work to build wealth over time. It's not about timing the market, but time in the market.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="hidden lg:block"
            >
              <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1200&h=675" 
                  alt="Investing" 
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
          {/* Left Column: Asset Classes */}
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 leading-tight">Investment Goal Planner</h2>
                  <p className="text-sm text-slate-500">Define your goals and interests to personalize your strategy</p>
                </div>
              </div>

              <div className="space-y-10">
                {/* Goals Selection */}
                <div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">1. Select Your Investment Goals</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {INVESTMENT_GOALS.map((goal) => {
                      const Icon = goal.icon;
                      const isSelected = selectedGoals.includes(goal.id);
                      return (
                        <button
                          key={goal.id}
                          onClick={() => toggleGoal(goal.id)}
                          className={cn(
                            "p-5 rounded-2xl border-2 transition-all text-left group relative",
                            isSelected 
                              ? "border-primary bg-primary/5" 
                              : "border-slate-100 bg-slate-50 hover:border-slate-200"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors",
                            isSelected ? "bg-primary text-slate-900" : "bg-white text-slate-400 group-hover:text-primary"
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <p className="text-sm font-bold text-slate-900 mb-1">{goal.label}</p>
                          <p className="text-[10px] text-slate-500 leading-tight">{goal.description}</p>
                          {isSelected && (
                            <div className="absolute top-4 right-4">
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Asset Class Selection */}
                <div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">2. Asset Classes of Interest</h3>
                  <div className="flex flex-wrap gap-3">
                    {ASSET_OPTIONS.map((asset) => {
                      const Icon = asset.icon;
                      const isSelected = selectedAssets.includes(asset.id);
                      return (
                        <button
                          key={asset.id}
                          onClick={() => toggleAsset(asset.id)}
                          className={cn(
                            "flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all font-bold text-sm",
                            isSelected 
                              ? "border-primary bg-primary/5 text-slate-900" 
                              : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                          )}
                        >
                          <Icon className={cn("w-5 h-5", isSelected ? "text-primary" : asset.color)} />
                          {asset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Summary / Call to Action */}
                {(selectedGoals.length > 0 || selectedAssets.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-[2rem] bg-slate-900 text-white"
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-slate-900 shrink-0">
                        <Sparkles className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold mb-2">Personalized Strategy Insight</h4>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                          Based on your interest in {selectedGoals.map(id => INVESTMENT_GOALS.find(g => g.id === id)?.label).join(', ')} 
                          {selectedAssets.length > 0 && ` and ${selectedAssets.map(id => ASSET_OPTIONS.find(a => a.id === id)?.label).join(', ')}`}, 
                          we recommend a diversified approach focusing on {selectedGoals.includes('retirement') || selectedGoals.includes('wealth') ? 'long-term compounding' : 'balanced growth'}.
                        </p>
                        <button 
                          onClick={() => openConsultationModal('Goal-Based Planning')}
                          className="bg-primary text-slate-900 px-8 py-3 rounded-xl font-bold text-sm hover:brightness-105 transition-all inline-flex items-center gap-2"
                        >
                          Discuss My Plan <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <PieChart className="w-6 h-6 text-primary" />
                Understanding Asset Classes
              </h2>
              <ChromaGrid 
                cols="grid-cols-1 md:grid-cols-2"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={assetClasses.map(asset => ({
                  title: asset.title,
                  description: asset.description,
                  icon: asset.icon,
                  subtitle: `Returns: ${asset.returns}`,
                  handle: `Risk: ${asset.risk}`,
                  details: asset.details,
                  borderColor: asset.color.includes('blue') ? '#3B82F6' : asset.color.includes('sky') ? '#0EA5E9' : asset.color.includes('amber') ? '#F59E0B' : '#6366F1',
                  gradient: `linear-gradient(145deg, ${asset.color.includes('blue') ? '#3B82F6' : asset.color.includes('sky') ? '#0EA5E9' : asset.color.includes('amber') ? '#F59E0B' : '#6366F1'}, #000)`
                }))}
              />
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-primary" />
                The Power of Compounding
              </h2>
              <div className="prose prose-slate max-w-none">
                <p>
                  Albert Einstein famously called compounding the "eighth wonder of the world." In investing, compounding happens when you earn returns on your initial investment plus the returns that have already accumulated.
                </p>
                <div className="bg-slate-50 p-6 rounded-2xl mt-6 border border-slate-100">
                  <h4 className="text-slate-900 font-bold mb-2">The Rule of 72</h4>
                  <p className="text-sm text-slate-600">
                    To find out how many years it will take to double your money, divide 72 by your annual rate of return. 
                    <br />
                    <span className="font-mono text-primary font-bold">Example: 72 / 12% = 6 years to double.</span>
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-rose-50 p-8 rounded-3xl border border-rose-100">
              <h2 className="text-2xl font-bold text-rose-900 mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-rose-600" />
                Inflation: The Silent Wealth Eroder
              </h2>
              <div className="prose prose-slate max-w-none text-rose-900">
                <p>
                  Inflation is the rate at which the general level of prices for goods and services is rising. If your investments don't grow faster than inflation, you are effectively losing money.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-rose-100">
                    <h4 className="font-bold mb-2">Real Rate of Return</h4>
                    <p className="text-sm text-slate-600">
                      Real Return = Nominal Return - Inflation Rate. 
                      If your FD gives 7% and inflation is 6%, your real growth is only 1%.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-rose-100">
                    <h4 className="font-bold mb-2">Purchasing Power</h4>
                    <p className="text-sm text-slate-600">
                      ₹1 Lakh today will only be worth ₹54,000 in 10 years if inflation stays at 6%. You must invest in assets that beat inflation.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                Risk vs. Reward Spectrum
              </h2>
              <div className="space-y-6">
                <p className="text-slate-600 text-sm leading-relaxed">
                  In the world of finance, risk and reward are two sides of the same coin. Generally, the higher the potential return, the higher the risk of losing capital.
                </p>
                <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500" />
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Low Risk (FD/PPF)</span>
                  <span>Medium Risk (Hybrid)</span>
                  <span>High Risk (Small Cap)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
                    <h4 className="font-bold text-sky-900 text-sm mb-1">Capital Preservation</h4>
                    <p className="text-xs text-sky-700">Focus on keeping your principal safe. Returns usually match inflation.</p>
                  </div>
                  <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                    <h4 className="font-bold text-rose-900 text-sm mb-1">Wealth Creation</h4>
                    <p className="text-xs text-rose-700">Focus on growing capital over time. Subject to market volatility.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                Strategic Asset Allocation
              </h2>
              <ChromaGrid 
                cols="grid-cols-1 md:grid-cols-2"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={[
                  {
                    title: 'Aggressive (Age 20-35)',
                    description: '70-80% Equity for long-term growth. 20-30% Debt for stability. High risk tolerance, long horizon.',
                    details: [
                      'High Equity Exposure: Capitalizing on the power of time.',
                      'Small & Mid Cap Focus: Capturing high-growth potential.',
                      'Regular SIPs: Averaging out market volatility.',
                      'Pro Tip: Don\'t panic during market corrections; they are buying opportunities.'
                    ],
                    borderColor: '#3B82F6',
                    gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                  },
                  {
                    title: 'Conservative (Age 50+)',
                    description: '30-40% Equity to beat inflation. 60-70% Debt for capital protection. Low risk tolerance, focus on income.',
                    details: [
                      'Capital Protection: Ensuring the corpus is safe for retirement.',
                      'Debt Dominance: Steady income through FDs and Debt Funds.',
                      'Equity for Inflation: Small exposure to prevent wealth erosion.',
                      'Pro Tip: Shift to SWP (Systematic Withdrawal Plan) for regular monthly income.'
                    ],
                    borderColor: '#0EA5E9',
                    gradient: 'linear-gradient(180deg, #0EA5E9, #000)'
                  }
                ]}
              />
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4">Portfolio Rebalancing</h4>
                <p className="text-sm text-slate-600 mb-4">
                  Over time, some assets grow faster than others, changing your risk profile. Rebalancing is the process of selling high-performing assets and buying underperforming ones to bring your portfolio back to its target allocation.
                </p>
                <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-500 italic">
                  Tip: Rebalance your portfolio at least once a year or whenever an asset class deviates by more than 5-10% from its target.
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Landmark className="w-6 h-6 text-primary" />
                Active vs. Passive Investing
              </h2>
              <ChromaGrid 
                cols="grid-cols-1 md:grid-cols-2"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={[
                  {
                    title: 'Active Investing',
                    description: 'Aims to "beat the market" through research, timing, and individual stock picking. Higher potential returns but higher costs.',
                    details: [
                      'Stock Selection: Picking individual winners.',
                      'Market Timing: Entering and exiting based on trends.',
                      'Higher Fees: Professional management costs more.',
                      'Pro Tip: Best for those with time to research or access to top advisors.'
                    ],
                    borderColor: '#3B82F6',
                    gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                  },
                  {
                    title: 'Passive Investing',
                    description: 'Aims to "match the market" by tracking an index like Nifty 50. Lower costs and consistent market returns.',
                    details: [
                      'Index Tracking: Mimicking market performance.',
                      'Low Expense Ratio: Minimal management fees.',
                      'No Human Bias: Rules-based investment approach.',
                      'Pro Tip: Ideal for long-term wealth creation with minimal effort.'
                    ],
                    borderColor: '#0EA5E9',
                    gradient: 'linear-gradient(180deg, #0EA5E9, #000)'
                  }
                ]}
              />
            </section>

            <section className="bg-amber-50 p-8 rounded-3xl border border-amber-100">
              <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-amber-600" />
                Behavioral Finance: The Mind Game
              </h2>
              <p className="text-sm text-amber-800 mb-6">
                Investing is 20% knowledge and 80% behavior. Your own psychology is often your biggest enemy.
              </p>
              <ChromaGrid 
                cols="grid-cols-1 md:grid-cols-3"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={[
                  {
                    title: 'Loss Aversion',
                    description: 'The pain of losing ₹10,000 is twice as powerful as the joy of gaining ₹10,000.',
                    details: [
                      'Emotional Pain: Losses hurt more than gains feel good.',
                      'Holding Losers: Investors often hold bad stocks hoping they recover.',
                      'Fear of Regret: Avoiding decisions to prevent potential mistakes.',
                      'Pro Tip: Set stop-losses to remove emotion from selling decisions.'
                    ],
                    borderColor: '#F43F5E',
                    gradient: 'linear-gradient(145deg, #F43F5E, #000)'
                  },
                  {
                    title: 'Herd Mentality',
                    description: 'Buying just because everyone else is buying (FOMO) often leads to buying at peaks.',
                    details: [
                      'Social Proof: Following the crowd feels safer.',
                      'FOMO: Fear of missing out on the "next big thing".',
                      'Market Bubbles: Driven by collective irrationality.',
                      'Pro Tip: Be greedy when others are fearful, and fearful when others are greedy.'
                    ],
                    borderColor: '#F59E0B',
                    gradient: 'linear-gradient(145deg, #F59E0B, #000)'
                  },
                  {
                    title: 'Confirmation Bias',
                    description: 'Seeking information that only supports your existing beliefs about a stock.',
                    details: [
                      'Selective Attention: Ignoring negative news about your stocks.',
                      'Echo Chambers: Following only bullish analysts.',
                      'Overconfidence: Believing you know more than the market.',
                      'Pro Tip: Actively look for reasons why your investment thesis might be wrong.'
                    ],
                    borderColor: '#3B82F6',
                    gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                  }
                ]}
              />
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Building2 className="w-6 h-6 text-primary" />
                Alternative Investments: Beyond Stocks & Bonds
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                For high-net-worth individuals and sophisticated investors, alternative assets provide diversification and non-correlated returns.
              </p>
              <ChromaGrid 
                cols="grid-cols-1 md:grid-cols-2"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={[
                  {
                    title: 'REITs & InvITs',
                    description: 'Real Estate Investment Trusts and Infrastructure Investment Trusts allow you to invest in large-scale projects with small amounts.',
                    details: [
                      'Liquid Real Estate: Trade like stocks on the exchange.',
                      'Regular Income: Mandated to pay 90% of cash flows as dividends.',
                      'Diversification: Access to Grade-A office and retail spaces.',
                      'Pro Tip: Ideal for those who want rental income without property management.'
                    ],
                    borderColor: '#3B82F6',
                    gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                  },
                  {
                    title: 'Private Equity & VC',
                    description: 'Investing in unlisted companies or startups. High risk but potential for exponential returns over a 7-10 year horizon.',
                    details: [
                      'Early Stage Growth: Investing in the next big thing.',
                      'Illiquidity: Money is locked for several years.',
                      'High Minimums: Usually requires significant capital.',
                      'Pro Tip: Only for high-net-worth individuals with high risk tolerance.'
                    ],
                    borderColor: '#0EA5E9',
                    gradient: 'linear-gradient(180deg, #0EA5E9, #000)'
                  },
                  {
                    title: 'Hedge Funds / AIFs',
                    description: 'Alternative Investment Funds use complex strategies like long-short, arbitrage, and leverage to generate alpha.',
                    details: [
                      'Sophisticated Strategies: Using derivatives and leverage.',
                      'Non-Correlated Returns: Performance independent of market trends.',
                      'Higher Fees: Performance-based fee structures.',
                      'Pro Tip: Best for diversifying a large portfolio beyond traditional assets.'
                    ],
                    borderColor: '#F59E0B',
                    gradient: 'linear-gradient(145deg, #F59E0B, #000)'
                  },
                  {
                    title: 'Structured Products',
                    description: 'Customized investment products linked to an underlying asset with built-in downside protection or enhanced upside.',
                    details: [
                      'Capital Protection: Built-in safety nets for principal.',
                      'Customized Payoffs: Tailored to specific market views.',
                      'Complex Risks: Requires deep understanding of derivatives.',
                      'Pro Tip: Use these to express a specific tactical view on the market.'
                    ],
                    borderColor: '#6366F1',
                    gradient: 'linear-gradient(145deg, #6366F1, #000)'
                  }
                ]}
              />
            </section>

            <section className="bg-primary/10 p-8 rounded-3xl border border-primary/20">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                The Core & Satellite Portfolio Model
              </h2>
              <div className="space-y-6">
                <p className="text-sm text-slate-700">
                  We follow a "Core & Satellite" approach to portfolio construction, ensuring stability while capturing high-growth opportunities.
                </p>
                <ChromaGrid 
                  cols="grid-cols-1 md:grid-cols-2"
                  radius={300}
                  damping={0.45}
                  fadeOut={0.6}
                  ease="power3.out"
                  items={[
                    {
                      title: 'The Core (70-80%)',
                      description: 'Stable, long-term investments like Large-cap Index funds, PPF, and High-grade Bonds.',
                      details: [
                        'Foundation: Providing stability and consistent growth.',
                        'Low Volatility: Resilient during market downturns.',
                        'Tax Efficiency: Long-term compounding focus.',
                        'Pro Tip: Never compromise the core for speculative gains.'
                      ],
                      borderColor: '#3B82F6',
                      gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                    },
                    {
                      title: 'The Satellite (20-30%)',
                      description: 'Tactical bets in Mid-cap, Small-cap, Sectoral funds, or Alternatives.',
                      details: [
                        'Alpha Generation: Aiming for market-beating returns.',
                        'Higher Risk: Subject to higher volatility.',
                        'Tactical Entry: Capitalizing on specific market themes.',
                        'Pro Tip: Review satellite positions more frequently than the core.'
                      ],
                      borderColor: '#0EA5E9',
                      gradient: 'linear-gradient(180deg, #0EA5E9, #000)'
                    }
                  ]}
                />
              </div>
            </section>
            <section className="bg-primary/10 p-8 rounded-3xl border border-primary/20">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Taxation on Investments (India)</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-l-2 border-primary pl-4">
                    <h4 className="font-bold text-primary mb-2">Equity LTCG</h4>
                    <p className="text-sm text-slate-700">10% tax on gains exceeding ₹1 Lakh in a financial year (if held {'>'} 1 year).</p>
                  </div>
                  <div className="border-l-2 border-primary pl-4">
                    <h4 className="font-bold text-primary mb-2">Equity STCG</h4>
                    <p className="text-sm text-slate-700">15% tax on gains if sold within 1 year of purchase.</p>
                  </div>
                  <div className="border-l-2 border-slate-400 pl-4">
                    <h4 className="font-bold text-slate-500 mb-2">Debt Taxation</h4>
                    <p className="text-sm text-slate-700">Gains are added to your income and taxed as per your applicable income tax slab.</p>
                  </div>
                  <div className="border-l-2 border-slate-400 pl-4">
                    <h4 className="font-bold text-slate-500 mb-2">Dividend Tax</h4>
                    <p className="text-sm text-slate-700">Dividends are taxed in the hands of the investor at their slab rate.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                Investment Vehicles in India
              </h2>
              <ChromaGrid 
                cols="grid-cols-1"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={[
                  { name: 'Mutual Funds', desc: 'Professionally managed pools of money investing in stocks or bonds. Ideal for SIPs.', details: ['Equity, Debt, and Hybrid options.', 'Professional fund management.', 'Highly regulated and transparent.', 'Pro Tip: Use SIPs for long-term wealth creation.'] },
                  { name: 'Public Provident Fund (PPF)', desc: 'Safe, long-term debt instrument with tax-free returns (Section 80C).', details: ['Govt-backed safety.', 'Tax-free interest and maturity.', '15-year lock-in period.', 'Pro Tip: Best for risk-averse long-term goals.'] },
                  { name: 'National Pension System (NPS)', desc: 'Market-linked retirement product with additional tax benefits.', details: ['Retirement-focused savings.', 'Additional ₹50k tax deduction.', 'Low-cost fund management.', 'Pro Tip: Opt for Active Choice for higher equity exposure.'] },
                  { name: 'Direct Equities', desc: 'Buying shares of companies directly. Requires research and active monitoring.', details: ['Direct ownership in companies.', 'Potential for multi-bagger returns.', 'Requires deep research and time.', 'Pro Tip: Start with blue-chip companies.'] },
                  { name: 'Fixed Deposits (FD)', desc: 'Guaranteed returns from banks. Low risk but often barely beats inflation.', details: ['Guaranteed principal and interest.', 'Highly liquid with premature withdrawal.', 'Taxable interest income.', 'Pro Tip: Use for short-term emergency funds.'] }
                ].map(item => ({
                  title: item.name,
                  description: item.desc,
                  details: item.details,
                  borderColor: '#3B82F6',
                  gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                }))}
              />
            </section>

            {/* Interactive Quiz Section */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <HelpCircle className="w-32 h-32" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 leading-tight">Test Your Knowledge</h2>
                    <p className="text-sm text-slate-500">Quick quiz on investment basics</p>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {!quizComplete ? (
                    <motion.div
                      key="quiz-content"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</span>
                        <div className="flex gap-1">
                          {QUIZ_QUESTIONS.map((_, i) => (
                            <div 
                              key={i} 
                              className={cn(
                                "h-1 w-8 rounded-full transition-all duration-500",
                                i === currentQuestion ? "bg-primary" : i < currentQuestion ? "bg-primary/30" : "bg-slate-100"
                              )} 
                            />
                          ))}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 leading-snug">
                        {QUIZ_QUESTIONS[currentQuestion].question}
                      </h3>

                      <div className="space-y-3">
                        {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            disabled={showFeedback}
                            className={cn(
                              "w-full p-5 rounded-2xl text-left text-sm font-medium transition-all border-2",
                              !showFeedback 
                                ? "border-slate-100 bg-slate-50 hover:border-primary/30 hover:bg-white" 
                                : idx === QUIZ_QUESTIONS[currentQuestion].correct
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                                  : selectedOption === idx
                                    ? "border-rose-500 bg-rose-50 text-rose-900"
                                    : "border-slate-100 bg-slate-50 opacity-50"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {showFeedback && idx === QUIZ_QUESTIONS[currentQuestion].correct && (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              )}
                              {showFeedback && selectedOption === idx && idx !== QUIZ_QUESTIONS[currentQuestion].correct && (
                                <X className="w-5 h-5 text-rose-500" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>

                      {showFeedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-6 rounded-2xl bg-slate-50 border border-slate-100"
                        >
                          <div className="flex gap-3">
                            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-bold text-slate-900 mb-1 uppercase tracking-wider">Explanation</p>
                              <p className="text-sm text-slate-600 leading-relaxed">
                                {QUIZ_QUESTIONS[currentQuestion].explanation}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={nextQuestion}
                            className="mt-6 w-full bg-slate-900 text-white font-bold py-4 rounded-xl text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                          >
                            {currentQuestion < QUIZ_QUESTIONS.length - 1 ? "Next Question" : "See Results"} <ArrowRight className="w-4 h-4" />
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="quiz-results"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
                        <Trophy className="w-12 h-12" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 mb-2">Quiz Complete!</h3>
                      <p className="text-slate-500 mb-8">You scored <span className="text-primary font-bold">{score} out of {QUIZ_QUESTIONS.length}</span></p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
                          <p className="text-xl font-bold text-slate-900">{(score / QUIZ_QUESTIONS.length) * 100}%</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                          <p className="text-xl font-bold text-slate-900">
                            {score === QUIZ_QUESTIONS.length ? "Expert" : score >= 3 ? "Knowledgeable" : "Beginner"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={resetQuiz}
                          className="flex-1 bg-slate-100 text-slate-900 font-bold py-4 rounded-xl text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" /> Try Again
                        </button>
                        <button
                          onClick={() => openConsultationModal('Investment Strategy')}
                          className="flex-1 bg-primary text-slate-900 font-bold py-4 rounded-xl text-sm hover:brightness-105 transition-all flex items-center justify-center gap-2"
                        >
                          Get Expert Advice <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-primary text-slate-900 p-8 rounded-3xl shadow-xl">
              <h3 className="text-xl font-bold mb-4">Golden Rule</h3>
              <p className="text-slate-800 text-sm leading-relaxed mb-6 font-medium">
                "Don't put all your eggs in one basket. Diversification across asset classes is the only free lunch in finance."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-slate-900 font-bold">B</div>
                <div>
                  <p className="text-sm font-bold">Professional Financial Advisory</p>
                  <p className="text-xs text-slate-700">Wealth Management Team</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Ready to Invest?</h3>
              <p className="text-sm text-slate-600 mb-6">
                Our advisors can help you pick the right stocks or funds based on your risk profile and goals.
              </p>
              <button 
                onClick={() => openConsultationModal('Investment Planning')}
                className="w-full bg-primary text-slate-900 font-bold py-4 rounded-2xl text-sm hover:brightness-105 transition-all flex items-center justify-center gap-2"
              >
                Consult an Advisor <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Investment Checklist</h3>
              <ul className="space-y-4">
                {[
                  'Define your financial goals (Short/Long term)',
                  'Assess your risk tolerance',
                  'Build an emergency fund (6 months expenses)',
                  'Get adequate life and health insurance',
                  'Start early to leverage compounding',
                  'Review and rebalance annually'
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
