import React from 'react';
import { motion } from 'motion/react';
import { BarChart2, TrendingUp, Activity, BookOpen, Globe, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

const marketConcepts = [
  {
    title: 'What is a Stock?',
    icon: BookOpen,
    description: 'A share in the ownership of a company. When you buy a stock, you become a shareholder.',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Stock Exchanges',
    icon: Globe,
    description: 'Platforms where stocks are traded. In India, the main ones are NSE and BSE.',
    color: 'bg-emerald-50 text-emerald-600'
  },
  {
    title: 'Market Indices',
    icon: Activity,
    description: 'Indicators of market performance. Nifty 50 and Sensex are the primary indices in India.',
    color: 'bg-amber-50 text-amber-600'
  },
  {
    title: 'Bull vs. Bear Market',
    icon: TrendingUp,
    description: 'Bull markets are characterized by rising prices, while bear markets see falling prices.',
    color: 'bg-rose-50 text-rose-600'
  }
];

export default function StockMarketGuide() {
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
              Stock Market <span className="text-primary">Fundamentals</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Demystifying the stock market. Learn how it works, why companies go public, and how you can start your journey as a savvy investor.
            </p>
          </motion.div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {marketConcepts.map((concept, idx) => (
                  <motion.div 
                    key={concept.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${concept.color} flex items-center justify-center mb-6`}>
                      <concept.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{concept.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{concept.description}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Analysis Section */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-primary" />
                How to Analyze Stocks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-3">Fundamental Analysis</h4>
                  <p className="text-sm text-slate-600 mb-4">Focuses on the company's financial health, management, and industry position to find its "intrinsic value".</p>
                  <ul className="text-xs text-slate-500 space-y-2">
                    <li>• P/E Ratio (Price to Earnings)</li>
                    <li>• Debt to Equity Ratio</li>
                    <li>• Revenue & Profit Growth</li>
                  </ul>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-3">Technical Analysis</h4>
                  <p className="text-sm text-slate-600 mb-4">Focuses on price patterns and trading volume to predict future price movements.</p>
                  <ul className="text-xs text-slate-500 space-y-2">
                    <li>• Moving Averages</li>
                    <li>• RSI (Relative Strength Index)</li>
                    <li>• Support & Resistance Levels</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4">Dividend Investing: Passive Income</h4>
                <p className="text-sm text-slate-600 mb-4">
                  Dividends are a portion of a company's profit paid out to shareholders. Dividend-paying stocks can provide a steady stream of passive income.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <h5 className="font-bold text-emerald-900 text-xs mb-1">Dividend Yield</h5>
                    <p className="text-[10px] text-emerald-700">Annual dividend per share divided by the share price. A higher yield means more income relative to price.</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <h5 className="font-bold text-emerald-900 text-xs mb-1">Dividend Payout Ratio</h5>
                    <p className="text-[10px] text-emerald-700">The percentage of earnings paid out as dividends. A sustainable ratio is usually below 60-70%.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Market Cap Section */}
            <section className="bg-slate-900 text-white p-10 rounded-[2.5rem]">
              <h2 className="text-2xl font-bold mb-6">Understanding Market Capitalization</h2>
              <p className="text-slate-400 mb-8">Market cap is the total value of all a company's shares of stock.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-white/10 p-5 rounded-2xl">
                  <h4 className="font-bold text-primary mb-2">Large Cap</h4>
                  <p className="text-xs text-slate-400">Top 100 companies. Stable, lower risk, steady dividends. (e.g., Reliance, TCS)</p>
                </div>
                <div className="border border-white/10 p-5 rounded-2xl">
                  <h4 className="font-bold text-primary mb-2">Mid Cap</h4>
                  <p className="text-xs text-slate-400">101st to 250th companies. Higher growth potential but more volatile.</p>
                </div>
                <div className="border border-white/10 p-5 rounded-2xl">
                  <h4 className="font-bold text-primary mb-2">Small Cap</h4>
                  <p className="text-xs text-slate-400">251st company onwards. High risk, high reward potential. Can be very volatile.</p>
                </div>
              </div>
              <div className="mt-10 pt-10 border-t border-white/10">
                <h4 className="font-bold text-primary mb-6">Corporate Actions: What They Mean for You</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-primary font-bold text-xs shrink-0">B</div>
                      <div>
                        <h5 className="text-sm font-bold">Bonus Issue</h5>
                        <p className="text-[10px] text-slate-400">Free additional shares given to existing shareholders. Increases liquidity but doesn't change the company's value.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-primary font-bold text-xs shrink-0">S</div>
                      <div>
                        <h5 className="text-sm font-bold">Stock Split</h5>
                        <p className="text-[10px] text-slate-400">Dividing existing shares into multiple ones. Makes the stock more affordable for retail investors.</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-primary font-bold text-xs shrink-0">R</div>
                      <div>
                        <h5 className="text-sm font-bold">Rights Issue</h5>
                        <p className="text-[10px] text-slate-400">Offering existing shareholders the right to buy more shares at a discounted price to raise capital.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-primary font-bold text-xs shrink-0">B</div>
                      <div>
                        <h5 className="text-sm font-bold">Buyback</h5>
                        <p className="text-[10px] text-slate-400">Company buying back its own shares from the market. Usually signals that management believes the stock is undervalued.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">The 4 Stages of Market Cycles</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 font-bold shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Accumulation Phase</h4>
                    <p className="text-sm text-slate-600">Occurs after the market has bottomed. Institutional investors start buying quietly. Sentiment is still negative.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 font-bold shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Markup Phase (Bull Market)</h4>
                    <p className="text-sm text-slate-600">Prices start rising steadily. Media coverage increases, and retail investors join in. Sentiment becomes euphoric.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 font-bold shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Distribution Phase</h4>
                    <p className="text-sm text-slate-600">Prices flatten out as "smart money" starts selling to retail investors. Volatility increases.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 font-bold shrink-0">4</div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Markdown Phase (Bear Market)</h4>
                    <p className="text-sm text-slate-600">Prices fall rapidly. Panic selling ensues. The cycle eventually returns to accumulation.</p>
                  </div>
                </div>
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
            <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Getting Started</h3>
              <ul className="space-y-5">
                {[
                  'Open a Demat and Trading Account.',
                  'Complete your KYC process.',
                  'Start with Blue-chip companies or Index Funds.',
                  'Never invest money you need in the next 3 years.',
                  'Keep learning and stay updated with BHP Insights.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
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
              <button className="w-full bg-primary text-slate-900 font-bold py-4 rounded-2xl text-sm hover:brightness-105 transition-all flex items-center justify-center gap-2">
                Consult an Advisor <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
