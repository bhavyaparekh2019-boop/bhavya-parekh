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
