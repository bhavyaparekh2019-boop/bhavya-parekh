import React from 'react';
import { motion } from 'motion/react';
import { Layers, Zap, BarChart3, ShieldCheck, Info, ArrowRight, CheckCircle2, HelpCircle, Sparkles, Target } from 'lucide-react';
import BlurText from '@/src/components/BlurText';
import ChromaGrid from '@/src/components/ChromaGrid';

const fundTypes = [
  {
    title: 'Equity Funds',
    description: 'Invest primarily in stocks. High risk, high return potential.',
    subtypes: ['Large Cap', 'Mid Cap', 'Small Cap', 'Multi Cap', 'ELSS (Tax Saving)'],
    color: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Debt Funds',
    description: 'Invest in fixed-income securities like govt bonds and corporate debentures.',
    subtypes: ['Liquid Funds', 'Short Term', 'Corporate Bond', 'Gilt Funds'],
    color: 'bg-emerald-50 text-emerald-600'
  },
  {
    title: 'Hybrid Funds',
    description: 'A mix of equity and debt to balance risk and reward.',
    subtypes: ['Aggressive Hybrid', 'Balanced Advantage', 'Multi Asset Allocation'],
    color: 'bg-amber-50 text-amber-600'
  },
  {
    title: 'Index / Passive Funds',
    description: 'Mimic a market index like Nifty 50. Low cost and transparent.',
    subtypes: ['Nifty 50 Index', 'Nifty Next 50', 'Sectoral Indices'],
    color: 'bg-indigo-50 text-indigo-600'
  }
];

export default function MutualFundsGuide() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
              Knowledge Base
            </span>
            <BlurText 
              text="Mutual Funds: Wealth Simplified"
              centered={false}
              highlight="Wealth Simplified"
              className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
            />
            <p className="text-xl text-slate-600 leading-relaxed">
              Mutual funds allow you to pool your money with other investors to be managed by professionals. It's the most efficient way for retail investors to participate in the Indian growth story.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* SIP vs Lumpsum */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Zap className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">SIP vs. Lumpsum</h2>
              </div>
              <ChromaGrid 
                cols="grid-cols-1 md:grid-cols-2"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={[
                  {
                    title: 'SIP (Systematic Investment Plan)',
                    description: 'Invest a fixed amount regularly. It averages out the cost of purchase and instills financial discipline.',
                    borderColor: '#3B82F6',
                    gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                  },
                  {
                    title: 'Lumpsum Investment',
                    description: 'Invest a large amount at once. Best suited when the market is undervalued or when you have a windfall.',
                    borderColor: '#10B981',
                    gradient: 'linear-gradient(180deg, #10B981, #000)'
                  }
                ]}
              />
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4">Advanced Strategies: STP & SWP</h4>
                <ChromaGrid 
                  cols="grid-cols-1 md:grid-cols-2"
                  radius={300}
                  damping={0.45}
                  fadeOut={0.6}
                  ease="power3.out"
                  items={[
                    {
                      title: 'STP (Systematic Transfer Plan)',
                      description: 'Transfer a fixed amount from one fund to another. Ideal for investing a large lumpsum gradually.',
                      borderColor: '#3B82F6',
                      gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                    },
                    {
                      title: 'SWP (Systematic Withdrawal Plan)',
                      description: 'Withdraw a fixed amount regularly from your fund. Ideal for generating a steady monthly income.',
                      borderColor: '#10B981',
                      gradient: 'linear-gradient(180deg, #10B981, #000)'
                    }
                  ]}
                />
              </div>
            </section>

            {/* Fund Types Grid */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Layers className="w-6 h-6 text-primary" />
                Categories of Mutual Funds
              </h2>
            <ChromaGrid 
              cols="grid-cols-1 md:grid-cols-2"
              radius={300}
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
              items={fundTypes.map(fund => ({
                title: fund.title,
                description: fund.description,
                icon: BarChart3,
                borderColor: fund.color.includes('blue') ? '#3B82F6' : fund.color.includes('emerald') ? '#10B981' : fund.color.includes('amber') ? '#F59E0B' : '#6366F1',
                gradient: `linear-gradient(145deg, ${fund.color.includes('blue') ? '#3B82F6' : fund.color.includes('emerald') ? '#10B981' : fund.color.includes('amber') ? '#F59E0B' : '#6366F1'}, #000)`
              }))}
            />
              <div className="mt-8 bg-white p-8 rounded-3xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-6">How to Read a Fund Factsheet</h4>
                <p className="text-sm text-slate-600 mb-6">The monthly factsheet is the most important document for an investor. Here's what to look for:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h5 className="font-bold text-slate-900 text-xs mb-1">Portfolio Disclosure</h5>
                    <p className="text-[10px] text-slate-500">Check the top 10 stocks and sector allocation to understand where your money is going.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h5 className="font-bold text-slate-900 text-xs mb-1">Standard Deviation</h5>
                    <p className="text-[10px] text-slate-500">Measures volatility. A lower SD means the fund's returns are more stable.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h5 className="font-bold text-slate-900 text-xs mb-1">Sharpe Ratio</h5>
                    <p className="text-[10px] text-slate-500">Measures risk-adjusted returns. A higher Sharpe ratio is better.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-primary" />
                Understanding Risk Ratios
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 font-bold text-primary">α</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Alpha</h4>
                    <p className="text-xs text-slate-600">The excess return of a fund relative to the return of its benchmark index. A positive alpha means the fund manager has outperformed the market.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 font-bold text-primary">β</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Beta</h4>
                    <p className="text-xs text-slate-600">Measures the fund's sensitivity to market movements. A beta of 1 means the fund moves with the market. {'>'}1 means it's more volatile, {'<'}1 means it's less volatile.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-primary" />
                Advanced Mutual Fund Categories
              </h2>
              <ChromaGrid 
                cols="grid-cols-1 md:grid-cols-2"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={[
                  {
                    title: 'Arbitrage Funds',
                    description: 'Exploit price difference between cash and derivatives market. Low-risk and taxed as equity funds.',
                    borderColor: '#3B82F6',
                    gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                  },
                  {
                    title: 'Quant Funds',
                    description: 'Investment decisions are made by mathematical models and algorithms. Removes emotional bias.',
                    borderColor: '#10B981',
                    gradient: 'linear-gradient(180deg, #10B981, #000)'
                  },
                  {
                    title: 'ESG Funds',
                    description: 'Focus on companies with high Environmental, Social, and Governance standards.',
                    borderColor: '#F59E0B',
                    gradient: 'linear-gradient(145deg, #F59E0B, #000)'
                  },
                  {
                    title: 'International Funds',
                    description: 'Invest in global markets like US or Europe. Provides geographical diversification.',
                    borderColor: '#6366F1',
                    gradient: 'linear-gradient(145deg, #6366F1, #000)'
                  }
                ]}
              />
            </section>

            <section className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                BHP's 5-Step Fund Selection Process
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-slate-900 font-bold shrink-0">1</div>
                  <div>
                    <h4 className="font-bold">Rolling Returns Analysis</h4>
                    <p className="text-sm text-slate-400">We don't look at point-to-point returns. We analyze performance over multiple 3-year and 5-year periods to check consistency.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-slate-900 font-bold shrink-0">2</div>
                  <div>
                    <h4 className="font-bold">Fund Manager Track Record</h4>
                    <p className="text-sm text-slate-400">We evaluate the manager's experience, investment philosophy, and performance across different market cycles.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-slate-900 font-bold shrink-0">3</div>
                  <div>
                    <h4 className="font-bold">Portfolio Quality Check</h4>
                    <p className="text-sm text-slate-400">Deep dive into the underlying stocks/bonds. We look for high-quality companies with strong balance sheets.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-slate-900 font-bold shrink-0">4</div>
                  <div>
                    <h4 className="font-bold">Risk-Adjusted Returns</h4>
                    <p className="text-sm text-slate-400">Using ratios like Sharpe and Sortino to ensure the fund isn't taking excessive risk for the returns generated.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-slate-900 font-bold shrink-0">5</div>
                  <div>
                    <h4 className="font-bold">Expense Ratio & Exit Load</h4>
                    <p className="text-sm text-slate-400">Ensuring the costs are reasonable and aligned with the fund's strategy.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Taxation Section */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-primary" />
                Taxation on Mutual Funds (India)
              </h2>
              <ChromaGrid 
                cols="grid-cols-1 md:grid-cols-2"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={[
                  {
                    title: 'Equity-Oriented Funds',
                    description: 'STCG (< 1 yr): 15% flat tax. LTCG (> 1 yr): 10% tax on gains above ₹1 Lakh.',
                    borderColor: '#3B82F6',
                    gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                  },
                  {
                    title: 'Debt-Oriented Funds',
                    description: 'All Gains: Taxed as per your income tax slab rate. Indexation is no longer available.',
                    borderColor: '#10B981',
                    gradient: 'linear-gradient(180deg, #10B981, #000)'
                  }
                ]}
              />
            </section>

            {/* Common Mistakes */}
            <section className="bg-rose-50 p-10 rounded-[2.5rem] border border-rose-100">
              <h2 className="text-2xl font-bold text-rose-900 mb-8 flex items-center gap-3">
                <Info className="w-6 h-6 text-rose-600" />
                Common Investing Mistakes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: 'Chasing Past Performance', desc: 'Investing in last year\'s top performer without understanding the strategy.' },
                  { title: 'Stopping SIPs in Bear Markets', desc: 'The best time to buy is when markets are low. Stopping SIPs kills rupee cost averaging.' },
                  { title: 'Ignoring Expense Ratios', desc: 'High expense ratios can eat up a significant portion of your wealth over 20 years.' },
                  { title: 'Over-diversification', desc: 'Holding 20+ funds doesn\'t reduce risk; it just makes tracking difficult and dilutes returns.' }
                ].map((m, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-rose-200">
                    <h4 className="font-bold text-rose-900 mb-1">{m.title}</h4>
                    <p className="text-xs text-rose-700 leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Direct vs Regular */}
            <section className="bg-indigo-900 text-white p-10 rounded-[2.5rem] shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold">Direct vs. Regular Plans</h2>
              </div>
              <p className="text-indigo-100 mb-8 leading-relaxed">
                Every mutual fund has two versions. Choosing the right one can save you lakhs of rupees over 20 years.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <h4 className="font-bold mb-2 text-primary">Direct Plan</h4>
                  <p className="text-sm text-indigo-200">Bought directly from the AMC. No commissions paid to brokers. Lower expense ratio = Higher returns.</p>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <h4 className="font-bold mb-2 text-slate-300">Regular Plan</h4>
                  <p className="text-sm text-indigo-200">Bought through a distributor. Includes commission. Higher expense ratio = Slightly lower returns.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Key Terminologies
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">NAV (Net Asset Value)</h4>
                  <p className="text-xs text-slate-500">The price of one unit of a mutual fund scheme.</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Expense Ratio</h4>
                  <p className="text-xs text-slate-500">The annual fee charged by the AMC to manage your money.</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Exit Load</h4>
                  <p className="text-xs text-slate-500">A fee charged if you withdraw your money before a certain period.</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">AUM (Assets Under Management)</h4>
                  <p className="text-xs text-slate-500">The total market value of investments managed by the fund.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-[2rem]">
              <HelpCircle className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-bold mb-4">How to Choose?</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Selecting a fund based on past returns alone is a mistake. Look at the fund manager's track record, risk ratios (Alpha/Beta), and consistency across market cycles.
              </p>
              <button className="w-full bg-primary text-slate-900 font-bold py-4 rounded-2xl text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2">
                Get Personalized Advice <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
