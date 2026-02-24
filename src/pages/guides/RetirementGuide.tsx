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
