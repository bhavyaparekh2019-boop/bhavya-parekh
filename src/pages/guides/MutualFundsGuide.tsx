import React from 'react';
import { motion } from 'motion/react';
import { Layers, Zap, BarChart3, ShieldCheck, Info, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';

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
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Mutual Funds: <span className="text-primary">Wealth Simplified</span>
            </h1>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 text-lg">SIP (Systematic Investment Plan)</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Invest a fixed amount regularly (monthly/quarterly). It averages out the cost of purchase and instills financial discipline.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-500">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Rupee Cost Averaging</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Power of Compounding</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Start with as low as ₹500</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 text-lg">Lumpsum Investment</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Invest a large amount at once. Best suited when the market is undervalued or when you have a windfall (bonus/inheritance).
                  </p>
                  <ul className="space-y-2 text-xs text-slate-500">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-blue-500" /> High returns in bull markets</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-blue-500" /> No recurring commitment</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-blue-500" /> Requires market timing skills</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4">Advanced Strategies: STP & SWP</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <h5 className="font-bold text-slate-900 text-sm mb-2">STP (Systematic Transfer Plan)</h5>
                    <p className="text-xs text-slate-500">Transfer a fixed amount from one fund (usually Debt) to another (usually Equity). Ideal for investing a large lumpsum gradually to avoid market timing risk.</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <h5 className="font-bold text-slate-900 text-sm mb-2">SWP (Systematic Withdrawal Plan)</h5>
                    <p className="text-xs text-slate-500">Withdraw a fixed amount regularly from your fund. Ideal for generating a steady monthly income during retirement while the remaining capital stays invested.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Fund Types Grid */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Layers className="w-6 h-6 text-primary" />
                Categories of Mutual Funds
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fundTypes.map((fund, idx) => (
                  <motion.div 
                    key={fund.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-primary transition-colors group"
                  >
                    <div className={`w-12 h-12 rounded-xl ${fund.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{fund.title}</h3>
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">{fund.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {fund.subtypes.map(sub => (
                        <span key={sub} className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-md border border-slate-100 uppercase tracking-wider">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
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

            {/* Taxation Section */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-primary" />
                Taxation on Mutual Funds (India)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-3">Equity-Oriented Funds</h4>
                  <ul className="text-sm text-slate-600 space-y-3">
                    <li><span className="font-bold text-slate-900">STCG (held {'<'} 1 yr):</span> 15% flat tax.</li>
                    <li><span className="font-bold text-slate-900">LTCG (held {'>'} 1 yr):</span> 10% tax on gains above ₹1 Lakh.</li>
                  </ul>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-3">Debt-Oriented Funds</h4>
                  <ul className="text-sm text-slate-600 space-y-3">
                    <li><span className="font-bold text-slate-900">All Gains:</span> Taxed as per your income tax slab rate (as per latest 2023 rules).</li>
                    <li><span className="font-bold text-slate-900">Indexation:</span> No longer available for debt funds.</li>
                  </ul>
                </div>
              </div>
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
