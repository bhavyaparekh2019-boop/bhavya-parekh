import React from 'react';
import { motion } from 'motion/react';
import { PiggyBank, Target, Clock, ShieldCheck, Wallet, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

const retirementSteps = [
  {
    title: 'Define Your Vision',
    icon: Target,
    description: 'What does retirement look like for you? Travel, hobbies, or a second career?',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Calculate the Corpus',
    icon: Wallet,
    description: 'Estimate your monthly expenses and factor in 6-7% annual inflation.',
    color: 'bg-emerald-50 text-emerald-600'
  },
  {
    title: 'Choose the Right Tools',
    icon: PiggyBank,
    description: 'Leverage EPF, NPS, PPF, and Equity Mutual Funds for long-term growth.',
    color: 'bg-amber-50 text-amber-600'
  },
  {
    title: 'Protect Your Health',
    icon: ShieldCheck,
    description: 'Ensure adequate health insurance to prevent medical bills from eating your savings.',
    color: 'bg-rose-50 text-rose-600'
  }
];

export default function RetirementGuide() {
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
              The Ultimate <span className="text-primary">Retirement</span> Roadmap
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Retirement is not an age; it's a financial status. Learn how to build a bulletproof corpus for a dignified and worry-free post-work life.
            </p>
          </motion.div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {retirementSteps.map((step, idx) => (
                  <motion.div 
                    key={step.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mb-6`}>
                      <step.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                  </motion.div>
                ))}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-2">Tax Efficiency</h4>
                    <p className="text-xs text-slate-500">Only the capital gains portion of the withdrawal is taxed, not the entire amount.</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-2">Flexibility</h4>
                    <p className="text-xs text-slate-500">You can increase, decrease, or stop the withdrawal amount at any time.</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4">The 3-Bucket Strategy for Withdrawals</h4>
                <p className="text-sm text-slate-600 mb-6">Managing your money during retirement is as important as saving for it. The 3-bucket strategy ensures you have cash for today and growth for tomorrow.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <h5 className="font-bold text-blue-900 text-xs mb-1">Bucket 1: Immediate Cash</h5>
                    <p className="text-[10px] text-blue-700">2-3 years of expenses in Liquid Funds/FDs. No market risk.</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <h5 className="font-bold text-emerald-900 text-xs mb-1">Bucket 2: Stability</h5>
                    <p className="text-[10px] text-emerald-700">5-7 years of expenses in Debt Funds/Bonds. Low to medium risk.</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <h5 className="font-bold text-amber-900 text-xs mb-1">Bucket 3: Growth</h5>
                    <p className="text-[10px] text-amber-700">Remaining corpus in Equity Funds. High risk, high long-term growth.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Age-based Allocation */}
            <section className="bg-slate-900 text-white p-10 rounded-[2.5rem]">
              <h2 className="text-2xl font-bold mb-8">Asset Allocation by Life Stage</h2>
              <div className="space-y-8">
                <div className="flex gap-6 items-center">
                  <div className="w-24 text-primary font-bold text-xl">Age 25</div>
                  <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden flex">
                    <div className="w-[80%] bg-primary h-full" title="Equity" />
                    <div className="w-[20%] bg-slate-500 h-full" title="Debt" />
                  </div>
                  <div className="text-xs text-slate-400">80% Equity / 20% Debt</div>
                </div>
                <div className="flex gap-6 items-center">
                  <div className="w-24 text-primary font-bold text-xl">Age 45</div>
                  <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden flex">
                    <div className="w-[50%] bg-primary h-full" title="Equity" />
                    <div className="w-[50%] bg-slate-500 h-full" title="Debt" />
                  </div>
                  <div className="text-xs text-slate-400">50% Equity / 50% Debt</div>
                </div>
                <div className="flex gap-6 items-center">
                  <div className="w-24 text-primary font-bold text-xl">Age 65</div>
                  <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden flex">
                    <div className="w-[20%] bg-primary h-full" title="Equity" />
                    <div className="w-[80%] bg-slate-500 h-full" title="Debt" />
                  </div>
                  <div className="text-xs text-slate-400">20% Equity / 80% Debt</div>
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
                  <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <h4 className="font-bold text-emerald-900 mb-2">The 4% Rule</h4>
                    <p className="text-xs text-emerald-700">You can safely withdraw 4% of your portfolio annually without running out of money.</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">Wills & Nominations</h4>
                  <p className="text-xs text-slate-600 mb-4">A nominee is only a "custodian." A Will is the legal document that determines who actually inherits your assets.</p>
                  <ul className="text-[10px] text-slate-500 space-y-1">
                    <li>• Register your Will for better legal standing.</li>
                    <li>• Ensure all bank accounts and folios have nominees.</li>
                  </ul>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">Succession Planning</h4>
                  <p className="text-xs text-slate-600 mb-4">For business owners, planning the transition of leadership and ownership is critical for continuity.</p>
                  <ul className="text-[10px] text-slate-500 space-y-1">
                    <li>• Create a family trust for complex estates.</li>
                    <li>• Clearly define roles for the next generation.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Inflation Section */}
            <section className="bg-rose-50 p-10 rounded-[2.5rem] border border-rose-100">
              <h2 className="text-2xl font-bold text-rose-900 mb-6 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-rose-600" />
                The Silent Killer: Inflation
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-rose-800 mb-6">
                  Inflation erodes the purchasing power of your money. What costs ₹1 Lakh today will cost ₹4.3 Lakh in 25 years at 6% inflation.
                </p>
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-4">Impact of 6% Inflation</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Today</span>
                      <span className="font-bold text-slate-900">₹1,00,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">In 10 Years</span>
                      <span className="font-bold text-slate-900">₹1,79,085</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">In 20 Years</span>
                      <span className="font-bold text-slate-900">₹3,20,714</span>
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
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
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
            <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl">
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
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
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
              <button className="w-full bg-primary text-slate-900 font-bold py-4 rounded-2xl text-sm hover:brightness-105 transition-all flex items-center justify-center gap-2">
                Talk to an Expert <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
