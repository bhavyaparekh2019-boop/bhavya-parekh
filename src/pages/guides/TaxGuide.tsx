import React from 'react';
import { motion } from 'motion/react';
import { FileText, Calculator, Landmark, Shield, Briefcase, ArrowRight, CheckCircle2, Info, Home } from 'lucide-react';
import BlurText from '@/components/BlurText';
import ChromaGrid from '@/components/ChromaGrid';
import { useModal } from '@/context/ModalContext';

const taxSections = [
  {
    title: 'Section 80C',
    limit: '₹1.5 Lakh',
    items: ['EPF/VPF', 'PPF', 'ELSS Mutual Funds', 'Life Insurance Premium', 'Home Loan Principal'],
    details: [
      'EPF/VPF: Employee Provident Fund. Pro Tip: Maximize VPF if you want safe, tax-free returns.',
      'PPF: Public Provident Fund (15 yr lock-in). Best for long-term debt allocation.',
      'ELSS: Tax-saving mutual funds (3 yr lock-in). Shortest lock-in with equity growth potential.',
      'Life Insurance: Term or endowment premiums. Pro Tip: Stick to Term Insurance for higher cover.',
      'Home Loan: Principal repayment portion. Includes stamp duty and registration fees (one-time).'
    ],
    color: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Section 80D',
    limit: 'Up to ₹75k',
    items: ['Health Insurance (Self/Family)', 'Health Insurance (Parents)', 'Preventive Health Checkups'],
    details: [
      'Self/Family: Up to ₹25,000 deduction for premiums paid for self, spouse, and children.',
      'Parents (<60): Additional ₹25,000 deduction. Pro Tip: Pay for parents to maximize savings.',
      'Parents (>60): Additional ₹50,000 deduction if they are senior citizens.',
      'Health Checkups: Up to ₹5,000 included within the overall limits of 80D.',
      'Medical Expenditure: For senior citizens without insurance, actual medical bills are deductible.'
    ],
    color: 'bg-sky-50 text-sky-600'
  },
  {
    title: 'Section 24(b)',
    limit: '₹2 Lakh',
    items: ['Home Loan Interest (Self-occupied)', 'No limit for let-out property'],
    details: [
      'Interest on home loan for self-occupied house. Maximum deduction of ₹2 Lakh.',
      'Let-out Property: No upper limit on interest deduction (but loss set-off is capped at ₹2L).',
      'Pre-construction Interest: Claimable in 5 equal installments after construction is complete.',
      'Construction Timeline: Pro Tip: Construction must be completed within 5 years to get full ₹2L benefit.',
      'Joint Loan: Both co-owners can claim ₹2L each if they are co-borrowers.'
    ],
    color: 'bg-amber-50 text-amber-600'
  },
  {
    title: 'Section 80CCD(1B)',
    limit: '₹50,000',
    items: ['Additional NPS Contribution', 'Over and above 80C limit'],
    details: [
      'Additional NPS Deduction: Exclusively for Tier-1 NPS account contributions.',
      'Over and Above 80C: This ₹50k is in addition to the ₹1.5L limit of Section 80C.',
      'Retirement Corpus: Helps in building a market-linked pension fund with low costs.',
      'Tax-Free Maturity: 60% of the corpus is tax-free at age 60. Pro Tip: Use for long-term goals.',
      'Employer Contribution: Up to 10% of salary is also deductible under 80CCD(2).'
    ],
    color: 'bg-indigo-50 text-indigo-600'
  }
];

export default function TaxGuide() {
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
                text="Smart Tax Planning for 2024"
                centered={false}
                highlight="Tax Planning"
                className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
              />
              <p className="text-xl text-slate-600 leading-relaxed">
                Don't just pay taxes; plan them. Learn how to legally minimize your tax liability and maximize your take-home pay using the latest Indian tax laws.
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
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200&h=675" 
                  alt="Tax Planning" 
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
            {/* Tax Sections */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Calculator className="w-6 h-6 text-primary" />
                Key Tax Saving Sections
              </h2>
            <ChromaGrid 
              cols="grid-cols-1 md:grid-cols-2"
              radius={300}
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
              items={taxSections.map(section => ({
                title: section.title,
                description: `Limit: ${section.limit}`,
                icon: section.title.includes('80C') ? Landmark : section.title.includes('80D') ? Shield : section.title.includes('24') ? Calculator : FileText,
                details: section.details,
                borderColor: section.color.includes('blue') ? '#3B82F6' : section.color.includes('sky') ? '#0EA5E9' : section.color.includes('amber') ? '#F59E0B' : '#6366F1',
                gradient: `linear-gradient(145deg, ${section.color.includes('blue') ? '#3B82F6' : section.color.includes('sky') ? '#0EA5E9' : section.color.includes('amber') ? '#F59E0B' : '#6366F1'}, #000)`
              }))}
            />
              <div className="mt-8 bg-white p-8 rounded-3xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-4">Other Important Deductions</h4>
                <ChromaGrid 
                  cols="grid-cols-1 md:grid-cols-2"
                  radius={300}
                  damping={0.45}
                  fadeOut={0.6}
                  ease="power3.out"
                  items={[
                    {
                      title: 'Section 80G: Donations',
                      description: 'Donations to certain relief funds and charitable institutions can be claimed as a deduction.',
                      details: [
                        'Eligible Donations: To PM Relief Fund, NGOs with 80G registration, etc.',
                        'Deduction Limit: Either 50% or 100% of the donation depending on the fund.',
                        'Documentation: Pro Tip: Always collect a stamped 80G receipt and certificate.',
                        'Cash Limit: Donations above ₹2,000 must be made via digital/cheque for tax benefit.',
                        'PAN of Donee: Mandatory to mention the NGO\'s PAN in your ITR.'
                      ],
                      borderColor: '#3B82F6',
                      gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                    },
                    {
                      title: 'Standard Deduction',
                      description: 'A flat deduction of ₹50,000 (₹75,000 in New Regime) available to salaried individuals.',
                      details: [
                        'Salaried & Pensioners: Automatically applied to your taxable income.',
                        'No Proof Required: You don\'t need to submit any bills or declarations.',
                        'Both Regimes: Available in both Old and New tax regimes (increased in 2024).',
                        'Reduces Taxable Salary: Directly lowers the base on which tax is calculated.',
                        'Pro Tip: This is over and above all other 80C/80D deductions.'
                      ],
                      borderColor: '#0EA5E9',
                      gradient: 'linear-gradient(180deg, #0EA5E9, #000)'
                    }
                  ]}
                />
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
                <div className="bg-sky-50 p-4 rounded-xl text-xs text-sky-700 italic">
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

            <section className="bg-primary/10 p-10 rounded-[2.5rem] border border-primary/20">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Advance Tax: Pay as You Earn</h2>
              <p className="text-slate-600 mb-8">If your total tax liability for the year exceeds ₹10,000, you must pay tax in installments during the year.</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white/50 rounded-xl border border-primary/20">
                  <h5 className="text-primary font-bold text-xs mb-1">June 15</h5>
                  <p className="text-[10px] text-slate-500">15% of total tax</p>
                </div>
                <div className="p-4 bg-white/50 rounded-xl border border-primary/20">
                  <h5 className="text-primary font-bold text-xs mb-1">Sept 15</h5>
                  <p className="text-[10px] text-slate-500">45% of total tax</p>
                </div>
                <div className="p-4 bg-white/50 rounded-xl border border-primary/20">
                  <h5 className="text-primary font-bold text-xs mb-1">Dec 15</h5>
                  <p className="text-[10px] text-slate-500">75% of total tax</p>
                </div>
                <div className="p-4 bg-white/50 rounded-xl border border-primary/20">
                  <h5 className="text-primary font-bold text-xs mb-1">Mar 15</h5>
                  <p className="text-[10px] text-slate-500">100% of total tax</p>
                </div>
              </div>
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-primary" />
                Taxation for Freelancers & Small Businesses
              </h2>
              <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                If you are a freelancer or run a small business, you are taxed on your net income (Revenue minus Expenses).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">Presumptive Taxation (Sec 44AD/44ADA)</h4>
                  <p className="text-xs text-slate-600 mb-4">Small businesses and professionals can declare a fixed percentage of their turnover as profit without maintaining detailed books.</p>
                  <ul className="text-[10px] text-slate-500 space-y-1">
                    <li>• Professionals: 50% of gross receipts.</li>
                    <li>• Businesses: 6% or 8% of turnover.</li>
                  </ul>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">Deductible Expenses</h4>
                  <p className="text-xs text-slate-600 mb-4">You can deduct expenses incurred for business purposes, such as rent, internet, travel, and equipment depreciation.</p>
                </div>
              </div>
            </section>

            <section className="bg-primary/5 p-10 rounded-[2.5rem] border border-primary/20 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Home className="w-6 h-6 text-primary" />
                Saving Tax on Property Sales (Section 54)
              </h2>
              <div className="space-y-6">
                <p className="text-sm text-slate-600">
                  If you sell a residential property and make a capital gain, you can avoid paying tax if you reinvest the gain in another residential property.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-white rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-primary mb-2">Section 54</h4>
                    <p className="text-xs text-slate-500">Reinvest in another house within 1 year before or 2 years after the sale (3 years for construction).</p>
                  </div>
                  <div className="p-5 bg-white rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-primary mb-2">Section 54EC</h4>
                    <p className="text-xs text-slate-500">Invest the capital gains in specified bonds (NHAI/REC) within 6 months of sale. Max limit: ₹50 Lakh.</p>
                  </div>
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
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-sky-500" /> Declare investments to employer</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-sky-500" /> Start SIPs in ELSS funds</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-sky-500" /> Review previous year's tax return</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900">Year End (Jan - March)</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-sky-500" /> Submit investment proofs</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-sky-500" /> Top up PPF and NPS accounts</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-sky-500" /> Check for any pending tax savings</li>
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
            <section className="bg-primary p-10 rounded-[2.5rem] shadow-xl text-slate-900">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Landmark className="w-6 h-6 text-white" />
                Old vs. New Tax Regime
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-white">Old Regime</h4>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    Allows all deductions (80C, 80D, HRA, LTA, etc.). Best for individuals with high investments and home loans.
                  </p>
                  <div className="p-4 bg-white/30 rounded-xl border border-white/20">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-1">Verdict</p>
                    <p className="text-sm font-bold">Choose if deductions exceed ₹3.75 Lakh.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-white">New Regime (Default)</h4>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    Lower tax rates but no deductions (except Standard Deduction and NPS). Best for those who prefer simplicity and liquidity.
                  </p>
                  <div className="p-4 bg-white/30 rounded-xl border border-white/20">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-1">Verdict</p>
                    <p className="text-sm font-bold">Choose if you have minimal investments.</p>
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

            <div className="bg-sky-50 p-8 rounded-[2rem] border border-sky-100">
              <h3 className="text-lg font-bold text-sky-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-sky-600" />
                ELSS: The Dual Benefit
              </h3>
              <p className="text-sm text-sky-700 mb-6 leading-relaxed">
                Equity Linked Savings Schemes (ELSS) offer the shortest lock-in period (3 years) among all 80C options and the potential for high equity returns.
              </p>
              <button className="w-full bg-sky-600 text-white font-bold py-4 rounded-2xl text-sm hover:bg-sky-700 transition-all flex items-center justify-center gap-2">
                View ELSS Funds <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Need Tax Help?</h3>
              <p className="text-sm text-slate-600 mb-6">
                Our tax experts can help you optimize your investments and file your returns accurately.
              </p>
              <button 
                onClick={() => openConsultationModal('Tax Saving')}
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
