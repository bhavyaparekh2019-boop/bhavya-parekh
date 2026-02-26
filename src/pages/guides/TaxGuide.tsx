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
              <div className="mt-8 bg-white p-8 rounded-3xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-4">Other Important Deductions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <h5 className="font-bold text-slate-900 text-sm mb-1">Section 80G: Donations</h5>
                    <p className="text-[10px] text-slate-500">Donations to certain relief funds and charitable institutions can be claimed as a deduction (50% or 100% depending on the institution).</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <h5 className="font-bold text-slate-900 text-sm mb-1">Standard Deduction</h5>
                    <p className="text-[10px] text-slate-500">A flat deduction of ₹50,000 (increased to ₹75,000 in 2024 for New Regime) available to all salaried individuals and pensioners.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Capital Gains Summary */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Calculator className="w-6 h-6 text-primary" />
                Capital Gains Tax Summary
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                    <tr>
                      <th className="pb-4">Asset Type</th>
                      <th className="pb-4">Short Term (STCG)</th>
                      <th className="pb-4">Long Term (LTCG)</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600">
                    <tr className="border-b border-slate-50">
                      <td className="py-4 font-bold text-slate-900">Listed Stocks/Equity MF</td>
                      <td className="py-4">15% (held {'<'} 1 yr)</td>
                      <td className="py-4">10% (held {'>'} 1 yr, gains {'>'} ₹1L)</td>
                    </tr>
                    <tr className="border-b border-slate-50">
                      <td className="py-4 font-bold text-slate-900">Debt Mutual Funds</td>
                      <td className="py-4">As per Slab Rate</td>
                      <td className="py-4">As per Slab Rate (No Indexation)</td>
                    </tr>
                    <tr className="border-b border-slate-50">
                      <td className="py-4 font-bold text-slate-900">Real Estate</td>
                      <td className="py-4">As per Slab Rate</td>
                      <td className="py-4">20% with Indexation (held {'>'} 2 yrs)</td>
                    </tr>
                    <tr>
                      <td className="py-4 font-bold text-slate-900">Gold</td>
                      <td className="py-4">As per Slab Rate</td>
                      <td className="py-4">20% with Indexation (held {'>'} 3 yrs)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4">Tax Loss Harvesting</h4>
                <p className="text-sm text-slate-600 mb-4">
                  A strategy to reduce your tax liability by selling stocks or mutual funds that are currently at a loss to offset the capital gains from other investments.
                </p>
                <div className="bg-emerald-50 p-4 rounded-xl text-xs text-emerald-700 italic">
                  Example: If you have ₹50,000 in gains and ₹20,000 in losses, you can sell the loss-making asset to bring your taxable gain down to ₹30,000.
                </div>
              </div>
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">HRA & LTA: Salaried Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">HRA (House Rent Allowance)</h4>
                  <p className="text-xs text-slate-600 mb-4">Exemption is the minimum of:</p>
                  <ul className="text-[10px] text-slate-500 space-y-1">
                    <li>• Actual HRA received</li>
                    <li>• Rent paid minus 10% of basic salary</li>
                    <li>• 50% of basic (Metro) or 40% (Non-metro)</li>
                  </ul>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">LTA (Leave Travel Allowance)</h4>
                  <p className="text-xs text-slate-600 mb-4">Exemption for travel expenses within India for self and family.</p>
                  <ul className="text-[10px] text-slate-500 space-y-1">
                    <li>• Available for 2 journeys in a block of 4 years.</li>
                    <li>• Only travel cost (air/rail/bus) is exempt, not stay.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-slate-900 text-white p-10 rounded-[2.5rem]">
              <h2 className="text-2xl font-bold mb-6">Advance Tax: Pay as You Earn</h2>
              <p className="text-slate-400 mb-8">If your total tax liability for the year exceeds ₹10,000, you must pay tax in installments during the year.</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <h5 className="text-primary font-bold text-xs mb-1">June 15</h5>
                  <p className="text-[10px] text-slate-400">15% of total tax</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <h5 className="text-primary font-bold text-xs mb-1">Sept 15</h5>
                  <p className="text-[10px] text-slate-400">45% of total tax</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <h5 className="text-primary font-bold text-xs mb-1">Dec 15</h5>
                  <p className="text-[10px] text-slate-400">75% of total tax</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <h5 className="text-primary font-bold text-xs mb-1">Mar 15</h5>
                  <p className="text-[10px] text-slate-400">100% of total tax</p>
                </div>
              </div>
            </section>

            {/* NRI Taxation Section */}
            <section className="bg-primary/5 p-10 rounded-[2.5rem] border border-primary/20">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Tax Planning for NRIs</h2>
              <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                Non-Resident Indians (NRIs) have different tax rules. Income earned in India is taxable, but global income is not (subject to DTAA).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">NRE vs NRO Accounts</h4>
                  <p className="text-xs text-slate-500">NRE interest is tax-free in India. NRO interest is taxable at 30% (plus surcharge/cess).</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">DTAA Benefits</h4>
                  <p className="text-xs text-slate-500">Double Taxation Avoidance Agreement prevents you from paying tax on the same income in two countries.</p>
                </div>
              </div>
            </section>

            {/* Tax Planning Checklist */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                Tax Planning Checklist
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900">Early Year (April - June)</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Declare investments to employer</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Start SIPs in ELSS funds</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Review previous year's tax return</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900">Year End (Jan - March)</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Submit investment proofs</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Top up PPF and NPS accounts</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Check for any pending tax savings</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Common Mistakes Section */}
            <section className="bg-rose-50 p-10 rounded-[2.5rem] border border-rose-100">
              <h2 className="text-2xl font-bold text-rose-900 mb-6 flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-rose-600" />
                Common Tax Planning Mistakes
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0 mt-1">
                    <span className="text-rose-600 font-bold">!</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Waiting until March</h4>
                    <p className="text-sm text-slate-600">Last-minute decisions often lead to poor investment choices. Start in April.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0 mt-1">
                    <span className="text-rose-600 font-bold">!</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Ignoring the New Regime</h4>
                    <p className="text-sm text-slate-600">The new regime is now the default and often better for those with fewer deductions.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0 mt-1">
                    <span className="text-rose-600 font-bold">!</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Mixing Insurance and Investment</h4>
                    <p className="text-sm text-slate-600">Endowment plans often offer low returns and low life cover. Keep them separate.</p>
                  </div>
                </div>
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
