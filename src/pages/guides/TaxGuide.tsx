import React from 'react';
import { motion } from 'motion/react';
import { FileText, Calculator, Landmark, Shield, Briefcase, ArrowRight, CheckCircle2, Info } from 'lucide-react';

const taxSections = [
  {
    title: 'Section 80C',
    limit: '₹1.5 Lakh',
    items: ['EPF/VPF', 'PPF', 'ELSS Mutual Funds', 'Life Insurance Premium', 'Home Loan Principal'],
    color: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Section 80D',
    limit: 'Up to ₹75k',
    items: ['Health Insurance (Self/Family)', 'Health Insurance (Parents)', 'Preventive Health Checkups'],
    color: 'bg-emerald-50 text-emerald-600'
  },
  {
    title: 'Section 24(b)',
    limit: '₹2 Lakh',
    items: ['Home Loan Interest (Self-occupied)', 'No limit for let-out property'],
    color: 'bg-amber-50 text-amber-600'
  },
  {
    title: 'Section 80CCD(1B)',
    limit: '₹50,000',
    items: ['Additional NPS Contribution', 'Over and above 80C limit'],
    color: 'bg-indigo-50 text-indigo-600'
  }
];

export default function TaxGuide() {
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
              Smart <span className="text-primary">Tax Planning</span> for 2024
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Don't just pay taxes; plan them. Learn how to legally minimize your tax liability and maximize your take-home pay using the latest Indian tax laws.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Tax Sections */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Calculator className="w-6 h-6 text-primary" />
                Key Tax Saving Sections
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {taxSections.map((section, idx) => (
                  <motion.div 
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-xl font-bold text-slate-900">{section.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${section.color}`}>
                        {section.limit}
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Old vs New Regime */}
            <section className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Landmark className="w-6 h-6 text-primary" />
                Old vs. New Tax Regime
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-primary">Old Regime</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Allows all deductions (80C, 80D, HRA, LTA, etc.). Best for individuals with high investments and home loans.
                  </p>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-1">Verdict</p>
                    <p className="text-sm">Choose if deductions exceed ₹3.75 Lakh.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-emerald-400">New Regime (Default)</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Lower tax rates but no deductions (except Standard Deduction and NPS). Best for those who prefer simplicity and liquidity.
                  </p>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-1">Verdict</p>
                    <p className="text-sm">Choose if you have minimal investments.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Important Dates
              </h3>
              <div className="space-y-6">
                {[
                  { date: 'July 31', event: 'Deadline for ITR Filing (Individuals)' },
                  { date: 'March 31', event: 'Last day for Tax Saving Investments' },
                  { date: 'June 15', event: '1st Installment of Advance Tax' },
                  { date: 'Dec 31', event: 'Deadline for Belated ITR' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="text-primary font-black text-sm shrink-0 w-16">{item.date}</div>
                    <div className="text-sm text-slate-600">{item.event}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100">
              <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                ELSS: The Dual Benefit
              </h3>
              <p className="text-sm text-emerald-700 mb-6 leading-relaxed">
                Equity Linked Savings Schemes (ELSS) offer the shortest lock-in period (3 years) among all 80C options and the potential for high equity returns.
              </p>
              <button className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                View ELSS Funds <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
