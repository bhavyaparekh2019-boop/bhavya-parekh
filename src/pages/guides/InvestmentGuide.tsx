import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, PieChart, Landmark, Coins, Building2, ArrowUpRight, Target, Zap } from 'lucide-react';
import BlurText from '@/src/components/BlurText';
import ChromaGrid from '@/src/components/ChromaGrid';

const assetClasses = [
  {
    title: 'Equity (Stocks)',
    icon: TrendingUp,
    description: 'Ownership in companies. High growth potential over long term.',
    risk: 'High',
    returns: '12-15% (Historical)',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Debt (Fixed Income)',
    icon: Landmark,
    description: 'Lending to govt or corps. Stability and regular income.',
    risk: 'Low to Medium',
    returns: '6-8% (Historical)',
    color: 'bg-emerald-50 text-emerald-600'
  },
  {
    title: 'Gold',
    icon: Coins,
    description: 'A hedge against inflation and currency devaluation.',
    risk: 'Medium',
    returns: '8-10% (Historical)',
    color: 'bg-amber-50 text-amber-600'
  },
  {
    title: 'Real Estate',
    icon: Building2,
    description: 'Physical property or REITs. Rental income and appreciation.',
    risk: 'Medium to High',
    returns: '8-12% (Historical)',
    color: 'bg-indigo-50 text-indigo-600'
  }
];

export default function InvestmentGuide() {
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
              text="Mastering the Art of Investing"
              centered={false}
              highlight="Investing"
              className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
            />
            <p className="text-xl text-slate-600 leading-relaxed">
              Investing is the process of putting your money to work to build wealth over time. It's not about timing the market, but time in the market.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Asset Classes */}
          <div className="lg:col-span-2 space-y-12">
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
                  borderColor: asset.color.includes('blue') ? '#3B82F6' : asset.color.includes('emerald') ? '#10B981' : asset.color.includes('amber') ? '#F59E0B' : '#6366F1',
                  gradient: `linear-gradient(145deg, ${asset.color.includes('blue') ? '#3B82F6' : asset.color.includes('emerald') ? '#10B981' : asset.color.includes('amber') ? '#F59E0B' : '#6366F1'}, #000)`
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
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500" />
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Low Risk (FD/PPF)</span>
                  <span>Medium Risk (Hybrid)</span>
                  <span>High Risk (Small Cap)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <h4 className="font-bold text-emerald-900 text-sm mb-1">Capital Preservation</h4>
                    <p className="text-xs text-emerald-700">Focus on keeping your principal safe. Returns usually match inflation.</p>
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
                    borderColor: '#3B82F6',
                    gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                  },
                  {
                    title: 'Conservative (Age 50+)',
                    description: '30-40% Equity to beat inflation. 60-70% Debt for capital protection. Low risk tolerance, focus on income.',
                    borderColor: '#10B981',
                    gradient: 'linear-gradient(180deg, #10B981, #000)'
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
                    borderColor: '#3B82F6',
                    gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                  },
                  {
                    title: 'Passive Investing',
                    description: 'Aims to "match the market" by tracking an index like Nifty 50. Lower costs and consistent market returns.',
                    borderColor: '#10B981',
                    gradient: 'linear-gradient(180deg, #10B981, #000)'
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
                    borderColor: '#F43F5E',
                    gradient: 'linear-gradient(145deg, #F43F5E, #000)'
                  },
                  {
                    title: 'Herd Mentality',
                    description: 'Buying just because everyone else is buying (FOMO) often leads to buying at peaks.',
                    borderColor: '#F59E0B',
                    gradient: 'linear-gradient(145deg, #F59E0B, #000)'
                  },
                  {
                    title: 'Confirmation Bias',
                    description: 'Seeking information that only supports your existing beliefs about a stock.',
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
                    borderColor: '#3B82F6',
                    gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                  },
                  {
                    title: 'Private Equity & VC',
                    description: 'Investing in unlisted companies or startups. High risk but potential for exponential returns over a 7-10 year horizon.',
                    borderColor: '#10B981',
                    gradient: 'linear-gradient(180deg, #10B981, #000)'
                  },
                  {
                    title: 'Hedge Funds / AIFs',
                    description: 'Alternative Investment Funds use complex strategies like long-short, arbitrage, and leverage to generate alpha.',
                    borderColor: '#F59E0B',
                    gradient: 'linear-gradient(145deg, #F59E0B, #000)'
                  },
                  {
                    title: 'Structured Products',
                    description: 'Customized investment products linked to an underlying asset with built-in downside protection or enhanced upside.',
                    borderColor: '#6366F1',
                    gradient: 'linear-gradient(145deg, #6366F1, #000)'
                  }
                ]}
              />
            </section>

            <section className="bg-primary/10 p-8 rounded-3xl border border-primary/20">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                BHP's Core Portfolio Construction Model
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
                      borderColor: '#3B82F6',
                      gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                    },
                    {
                      title: 'The Satellite (20-30%)',
                      description: 'Tactical bets in Mid-cap, Small-cap, Sectoral funds, or Alternatives.',
                      borderColor: '#10B981',
                      gradient: 'linear-gradient(180deg, #10B981, #000)'
                    }
                  ]}
                />
              </div>
            </section>
            <section className="bg-slate-900 text-white p-8 rounded-3xl">
              <h2 className="text-2xl font-bold mb-6">Taxation on Investments (India)</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-l-2 border-primary pl-4">
                    <h4 className="font-bold text-primary mb-2">Equity LTCG</h4>
                    <p className="text-sm text-slate-300">10% tax on gains exceeding ₹1 Lakh in a financial year (if held {'>'} 1 year).</p>
                  </div>
                  <div className="border-l-2 border-primary pl-4">
                    <h4 className="font-bold text-primary mb-2">Equity STCG</h4>
                    <p className="text-sm text-slate-300">15% tax on gains if sold within 1 year of purchase.</p>
                  </div>
                  <div className="border-l-2 border-slate-500 pl-4">
                    <h4 className="font-bold text-slate-400 mb-2">Debt Taxation</h4>
                    <p className="text-sm text-slate-300">Gains are added to your income and taxed as per your applicable income tax slab.</p>
                  </div>
                  <div className="border-l-2 border-slate-500 pl-4">
                    <h4 className="font-bold text-slate-400 mb-2">Dividend Tax</h4>
                    <p className="text-sm text-slate-300">Dividends are taxed in the hands of the investor at their slab rate.</p>
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
                  { name: 'Mutual Funds', desc: 'Professionally managed pools of money investing in stocks or bonds. Ideal for SIPs.' },
                  { name: 'Public Provident Fund (PPF)', desc: 'Safe, long-term debt instrument with tax-free returns (Section 80C).' },
                  { name: 'National Pension System (NPS)', desc: 'Market-linked retirement product with additional tax benefits.' },
                  { name: 'Direct Equities', desc: 'Buying shares of companies directly. Requires research and active monitoring.' },
                  { name: 'Fixed Deposits (FD)', desc: 'Guaranteed returns from banks. Low risk but often barely beats inflation.' }
                ].map(item => ({
                  title: item.name,
                  description: item.desc,
                  borderColor: '#3B82F6',
                  gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                }))}
              />
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
                  <p className="text-sm font-bold">BHP Finance Advisory</p>
                  <p className="text-xs text-slate-700">Wealth Management Team</p>
                </div>
              </div>
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
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
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
