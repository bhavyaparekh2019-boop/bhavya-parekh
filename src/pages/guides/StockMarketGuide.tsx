import React from 'react';
import { motion } from 'motion/react';
import { BarChart2, TrendingUp, Activity, BookOpen, Globe, ArrowRight, CheckCircle2, AlertTriangle, PieChart, Zap, Target, Coins, RefreshCcw } from 'lucide-react';
import BlurText from '@/src/components/BlurText';
import ChromaGrid from '@/src/components/ChromaGrid';
import { useModal } from '@/src/context/ModalContext';

const marketConcepts = [
  {
    title: 'What is a Stock?',
    icon: BookOpen,
    description: 'A share in the ownership of a company. When you buy a stock, you become a shareholder.',
    details: [
      'Ownership Stake: You own a piece of the company\'s future.',
      'Voting Rights: Participate in major corporate decisions. Pro Tip: Use your vote!',
      'Capital Appreciation: Profit from the rise in stock price over time.',
      'Dividends: A share of the company\'s profits paid out to you.',
      'Limited Liability: You are not personally responsible for the company\'s debts.'
    ],
    color: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Stock Exchanges',
    icon: Globe,
    description: 'Platforms where stocks are traded. In India, the main ones are NSE and BSE.',
    details: [
      'NSE (National Stock Exchange): Known for high-tech trading and Nifty 50.',
      'BSE (Bombay Stock Exchange): Asia\'s oldest exchange, home to Sensex.',
      'SEBI Regulation: Ensuring transparency and protecting retail investors.',
      'Price Discovery: Where buyers and sellers meet to determine fair value.',
      'Listing Requirements: Companies must meet strict criteria to be traded here.'
    ],
    color: 'bg-sky-50 text-sky-600'
  },
  {
    title: 'Market Indices',
    icon: Activity,
    description: 'Indicators of market performance. Nifty 50 and Sensex are the primary indices in India.',
    details: [
      'Nifty 50: Top 50 companies by market cap on the NSE. Pro Tip: Best for index investing.',
      'Sensex: Top 30 companies on the BSE. A barometer of the Indian economy.',
      'Sectoral Indices: Tracking specific industries like Bank Nifty or IT Index.',
      'Benchmark: Used to compare the performance of your mutual funds.',
      'Rebalancing: Indices are updated semi-annually to reflect market changes.'
    ],
    color: 'bg-amber-50 text-amber-600'
  },
  {
    title: 'Bull vs. Bear Market',
    icon: TrendingUp,
    description: 'Bull markets are characterized by rising prices, while bear markets see falling prices.',
    details: [
      'Bull Market: Optimism, high confidence, and rising stock prices. Pro Tip: Don\'t get over-leveraged.',
      'Bear Market: Pessimism, fear, and falling prices (usually 20% drop from peak).',
      'Market Cycles: Natural phases of growth and correction in every economy.',
      'Investor Sentiment: Driven by greed in bull markets and fear in bear markets.',
      'Correction: A short-term drop (10%) that is often a healthy part of a bull market.'
    ],
    color: 'bg-rose-50 text-rose-600'
  }
];

export default function StockMarketGuide() {
  const { openConsultationModal } = useModal();
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
                text="Stock Market Investing Basics"
                centered={false}
                highlight="Investing Basics"
                className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
              />
              <p className="text-xl text-slate-600 leading-relaxed">
                Demystifying the stock market. Learn how it works, why companies go public, and how you can start your journey as a savvy investor.
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
                  src="https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&q=80&w=1200&h=675" 
                  alt="Stock Market Trading" 
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
            {/* Concepts Grid */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <BarChart2 className="w-6 h-6 text-primary" />
                Core Market Concepts
              </h2>
              <ChromaGrid 
                cols="grid-cols-1 md:grid-cols-2"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={marketConcepts.map(concept => ({
                  title: concept.title,
                  description: concept.description,
                  icon: concept.icon,
                  details: concept.details,
                  borderColor: concept.color.includes('blue') ? '#3B82F6' : concept.color.includes('sky') ? '#0EA5E9' : concept.color.includes('amber') ? '#F59E0B' : '#6366F1',
                  gradient: `linear-gradient(145deg, ${concept.color.includes('blue') ? '#3B82F6' : concept.color.includes('sky') ? '#0EA5E9' : concept.color.includes('amber') ? '#F59E0B' : '#6366F1'}, #000)`
                }))}
              />
            </section>

            {/* Investment Strategies Section */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                Popular Investment Strategies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900">Systematic Investment Plan (SIP)</h4>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">Investing a fixed amount at regular intervals (monthly/quarterly). Best for long-term wealth creation and salaried individuals.</p>
                  <ul className="text-xs text-slate-500 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 text-sky-500 mt-0.5 shrink-0" />
                      <span>Rupee Cost Averaging: Buy more when prices are low.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 text-sky-500 mt-0.5 shrink-0" />
                      <span>Disciplined Investing: Automates your savings.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 text-sky-500 mt-0.5 shrink-0" />
                      <span>Power of Compounding: Small amounts grow significantly.</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Coins className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900">Lumpsum Investing</h4>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">Investing a large sum of money at once. Ideal when you have surplus cash or during market corrections.</p>
                  <ul className="text-xs text-slate-500 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 text-sky-500 mt-0.5 shrink-0" />
                      <span>Immediate Market Exposure: Full amount starts earning.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 text-sky-500 mt-0.5 shrink-0" />
                      <span>Lower Transaction Costs: Fewer buy orders.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 text-sky-500 mt-0.5 shrink-0" />
                      <span>High Potential: Best for undervalued markets.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Analysis Section */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-primary" />
                Fundamental Analysis: The Bedrock of Investing
              </h2>
              <div className="prose prose-slate max-w-none mb-8">
                <p className="text-slate-600">
                  Fundamental analysis is the process of evaluating a security's intrinsic value by examining related economic and financial factors. The goal is to determine if a stock is undervalued or overvalued.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Quantitative Factors
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">P/E Ratio:</span>
                      Price to Earnings. Tells you how much the market is willing to pay for every ₹1 of profit.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">EPS:</span>
                      Earnings Per Share. Indicates the company's profitability on a per-share basis.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">ROE:</span>
                      Return on Equity. Measures how effectively management is using investors' money to generate profit.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">Debt-to-Equity:</span>
                      A measure of financial leverage. High debt can be risky during economic downturns.
                    </li>
                  </ul>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Qualitative Factors
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">Management Quality:</span>
                      Experience, integrity, and track record of the leadership team.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">Moat:</span>
                      A competitive advantage (like brand, patents, or network effects) that protects the company from rivals.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">Industry Outlook:</span>
                      Is the sector growing? Are there regulatory tailwinds or headwinds?
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">Corporate Governance:</span>
                      Transparency and fairness in dealing with all stakeholders.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Investment Strategies Section */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Zap className="w-6 h-6 text-primary" />
                Popular Investment Strategies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="p-8 bg-primary/5 rounded-[2rem] border border-primary/10">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                    <RefreshCcw className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">SIP (Systematic Investment Plan)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Investing a fixed amount at regular intervals (monthly/quarterly). Best for salaried individuals and long-term wealth creation.
                  </p>
                  <ul className="space-y-3">
                    {['Rupee Cost Averaging', 'Disciplined Investing', 'Power of Compounding', 'No need to time the market'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <CheckCircle2 className="w-3 h-3 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 bg-sky-50 rounded-[2rem] border border-sky-100">
                  <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 mb-6">
                    <Coins className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Lumpsum Investing</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Investing a large sum of money at once. Ideal when you have surplus cash or when the market is significantly undervalued.
                  </p>
                  <ul className="space-y-3">
                    {['Immediate market exposure', 'Lower transaction costs', 'Captures full market recovery', 'Ideal for idle cash'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <CheckCircle2 className="w-3 h-3 text-sky-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="p-6 bg-slate-900 text-white rounded-2xl">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-primary" />
                  Expert Verdict: Which one is for you?
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  For most retail investors, **SIP is the gold standard**. It removes emotion from investing. Lumpsum is powerful during market crashes (like March 2020), but requires more conviction and patience.
                </p>
              </div>
            </section>

            {/* Market Cap Section */}
            <section className="bg-primary/10 p-10 rounded-[2.5rem] border border-primary/20">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Understanding Market Capitalization</h2>
              <p className="text-slate-600 mb-8">Market cap is the total value of all a company's shares of stock.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-primary/20 p-5 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-primary mb-2">Large Cap</h4>
                  <p className="text-xs text-slate-600">Top 100 companies. Stable, lower risk, steady dividends. (e.g., Reliance, TCS)</p>
                </div>
                <div className="bg-white border border-primary/20 p-5 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-primary mb-2">Mid Cap</h4>
                  <p className="text-xs text-slate-600">101st to 250th companies. Higher growth potential but more volatile.</p>
                </div>
                <div className="bg-white border border-primary/20 p-5 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-primary mb-2">Small Cap</h4>
                  <p className="text-xs text-slate-600">251st company onwards. High risk, high reward potential. Can be very volatile.</p>
                </div>
              </div>
              <div className="mt-10 pt-10 border-t border-primary/20">
                <h4 className="font-bold text-slate-900 mb-6">Corporate Actions: What They Mean for You</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">B</div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">Bonus Issue</h5>
                        <p className="text-[10px] text-slate-500">Free additional shares given to existing shareholders. Increases liquidity but doesn't change the company's value.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">S</div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">Stock Split</h5>
                        <p className="text-[10px] text-slate-500">Dividing existing shares into multiple ones. Makes the stock more affordable for retail investors.</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">R</div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">Rights Issue</h5>
                        <p className="text-[10px] text-slate-500">Offering existing shareholders the right to buy more shares at a discounted price to raise capital.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">B</div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">Buyback</h5>
                        <p className="text-[10px] text-slate-500">Company buying back its own shares from the market. Usually signals that management believes the stock is undervalued.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">The 4 Stages of Market Cycles</h2>
              <ChromaGrid 
                cols="grid-cols-1 md:grid-cols-2"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={[
                  {
                    title: 'Accumulation Phase',
                    description: 'Occurs after the market has bottomed. Institutional investors start buying quietly. Sentiment is still negative.',
                    details: [
                      'Smart Money Entry: Experienced investors buy when others are fearful.',
                      'Low Valuations: Stocks are often undervalued and "cheap".',
                      'Boring Markets: Prices move sideways for long periods.',
                      'Pro Tip: This is the best time for long-term wealth creation.'
                    ],
                    borderColor: '#3B82F6',
                    gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                  },
                  {
                    title: 'Markup Phase (Bull)',
                    description: 'Prices start rising steadily. Media coverage increases, and retail investors join in. Sentiment becomes euphoric.',
                    details: [
                      'Trend Confirmation: Higher highs and higher lows in stock prices.',
                      'Mainstream Media: Stock market becomes a dinner table conversation.',
                      'IPO Boom: Many companies go public to capitalize on the euphoria.',
                      'Pro Tip: Stay disciplined; don\'t chase stocks at all-time highs.'
                    ],
                    borderColor: '#0EA5E9',
                    gradient: 'linear-gradient(180deg, #0EA5E9, #000)'
                  },
                  {
                    title: 'Distribution Phase',
                    description: 'Prices flatten out as "smart money" starts selling to retail investors. Volatility increases.',
                    details: [
                      'Profit Booking: Large investors start exiting their positions.',
                      'Churning: High trading volume but no significant price gain.',
                      'Over-optimism: Retail investors are most bullish at the very top.',
                      'Pro Tip: Review your portfolio and consider taking some profits.'
                    ],
                    borderColor: '#F59E0B',
                    gradient: 'linear-gradient(145deg, #F59E0B, #000)'
                  },
                  {
                    title: 'Markdown Phase (Bear)',
                    description: 'Prices fall rapidly. Panic selling ensues. The cycle eventually returns to accumulation.',
                    details: [
                      'Fear & Panic: Investors sell at any price to "save" what\'s left.',
                      'Negative News: Economic data and earnings start looking bad.',
                      'Capitulation: The final stage of selling where even long-term holders give up.',
                      'Pro Tip: Keep your SIPs running; this is where you buy units at a discount.'
                    ],
                    borderColor: '#F43F5E',
                    gradient: 'linear-gradient(145deg, #F43F5E, #000)'
                  }
                ]}
              />
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                Derivatives: Futures & Options (F&O)
              </h2>
              <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                Derivatives are financial contracts that derive their value from an underlying asset. While they offer high leverage, they are extremely risky for retail investors.
              </p>
              <ChromaGrid 
                cols="grid-cols-1 md:grid-cols-2"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={[
                  {
                    title: 'Futures',
                    description: 'Agreement to buy or sell an asset at a predetermined price on a specified future date.',
                    details: [
                      'Leverage: Control a large position with a small amount of margin.',
                      'Hedging: Pro Tip: Use futures to protect your stock portfolio from a market drop.',
                      'Expiry: Contracts have a fixed end date (usually the last Thursday of the month).',
                      'Mark-to-Market: Profits/losses are settled daily in your trading account.'
                    ],
                    borderColor: '#3B82F6',
                    gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                  },
                  {
                    title: 'Options',
                    description: 'Right (but not obligation) to buy (Call) or sell (Put) an asset. Sellers take on significant risk.',
                    details: [
                      'Call Options: Profit when you expect the market to go up.',
                      'Put Options: Profit when you expect the market to go down.',
                      'Option Premium: The price you pay to buy an option (your maximum loss).',
                      'Time Decay: Options lose value as they get closer to expiry. Pro Tip: Don\'t hold OTM options till expiry.'
                    ],
                    borderColor: '#0EA5E9',
                    gradient: 'linear-gradient(180deg, #0EA5E9, #000)'
                  }
                ]}
              />
              <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100">
                <h4 className="font-bold text-amber-900 text-sm mb-2">Expert Warning on F&O</h4>
                <p className="text-xs text-amber-800">
                  SEBI data shows that 9 out of 10 individual traders in the equity F&O segment incur losses. We recommend derivatives only for hedging purposes for sophisticated portfolios.
                </p>
              </div>
            </section>

            {/* Why Companies Go Public */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Why do Companies Issue Stocks?</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-6">
                  Companies issue stocks primarily to raise capital for expansion, research, or paying off debt. This process is called an **Initial Public Offering (IPO)**.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Growth</h4>
                    <p className="text-xs text-slate-500">Funding new projects, factories, or acquisitions.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Visibility</h4>
                    <p className="text-xs text-slate-500">Being listed on an exchange increases brand awareness.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Liquidity</h4>
                    <p className="text-xs text-slate-500">Allows early investors and employees to sell their shares.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Risk Warning */}
            <section className="bg-amber-50 p-10 rounded-[2.5rem] border border-amber-100">
              <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                Understanding Market Volatility
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-amber-800 mb-6">
                  Stock prices fluctuate daily based on news, earnings, and economic data. This is called volatility. While it can be scary, it's also where the opportunity for high returns comes from.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-amber-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    Diversification is your best defense against volatility.
                  </li>
                  <li className="flex items-start gap-3 text-sm text-amber-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    Invest for the long term to ride out short-term dips.
                  </li>
                </ul>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-primary text-slate-900 p-8 rounded-[2rem] shadow-xl">
              <h3 className="text-xl font-bold mb-6">Getting Started</h3>
              <ul className="space-y-5">
                {[
                  'Open a Demat and Trading Account.',
                  'Complete your KYC process.',
                  'Start with Blue-chip companies or Index Funds.',
                  'Never invest money you need in the next 3 years.',
                  'Keep learning and stay updated with Market Insights.'
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

            <div className="bg-white p-8 rounded-[2rem] border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Ready to Invest?</h3>
              <p className="text-sm text-slate-600 mb-6">
                Our advisors can help you pick the right stocks or funds based on your risk profile and goals.
              </p>
              <button 
                onClick={() => openConsultationModal('Stock Market Guidance')}
                className="w-full bg-primary text-slate-900 font-bold py-4 rounded-2xl text-sm hover:brightness-105 transition-all flex items-center justify-center gap-2"
              >
                Consult an Advisor <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
