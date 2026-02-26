import React from 'react';
import { motion } from 'motion/react';
import { Shield, Heart, Car, Home, Lock, CheckCircle2, Info } from 'lucide-react';

const insuranceTypes = [
  {
    title: 'Life Insurance',
    icon: Heart,
    description: 'Financial security for your family in your absence.',
    details: [
      'Term Insurance: Pure protection at low cost.',
      'Whole Life: Coverage for life with savings component.',
      'Endowment: Fixed returns with life cover.',
      'ULIPs: Market-linked returns with insurance.'
    ],
    color: 'bg-rose-50 text-rose-600'
  },
  {
    title: 'Health Insurance',
    icon: Shield,
    description: 'Coverage for medical expenses and hospitalizations.',
    details: [
      'Individual/Family Floater plans.',
      'Critical Illness coverage.',
      'Super Top-up plans for high coverage.',
      'Cashless hospitalization benefits.'
    ],
    color: 'bg-emerald-50 text-emerald-600'
  },
  {
    title: 'Motor Insurance',
    icon: Car,
    description: 'Protection for your vehicles against damage and theft.',
    details: [
      'Third-party Liability (Mandatory).',
      'Comprehensive coverage.',
      'Zero Depreciation add-ons.',
      'Roadside assistance.'
    ],
    color: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Home Insurance',
    icon: Home,
    description: 'Safeguarding your property and its contents.',
    details: [
      'Fire and natural calamity protection.',
      'Burglary and theft coverage.',
      'Structure and content insurance.',
      'Public liability coverage.'
    ],
    color: 'bg-amber-50 text-amber-600'
  },
  {
    title: 'Cyber Insurance',
    icon: Lock,
    description: 'Protection against digital threats and data breaches.',
    details: [
      'Identity theft protection.',
      'Data restoration costs.',
      'Cyber extortion coverage.',
      'Legal and forensic support.'
    ],
    color: 'bg-indigo-50 text-indigo-600'
  }
];

export default function InsuranceGuide() {
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
              Comprehensive Guide to <span className="text-primary">Insurance</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Insurance is not just an expense; it's a critical safety net that protects your financial future from life's uncertainties.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Types */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm">01</span>
                Types of Insurance in India
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {insuranceTypes.map((type, idx) => (
                  <motion.div 
                    key={type.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className={`w-12 h-12 rounded-xl ${type.color} flex items-center justify-center mb-4`}>
                      <type.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{type.title}</h3>
                    <p className="text-slate-600 text-sm mb-4">{type.description}</p>
                    <ul className="space-y-2">
                      {type.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Evaluating Insurers: CSR & ICR</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900">Claim Settlement Ratio (CSR)</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    The percentage of claims settled by the insurer against the total claims received. A CSR above 95% is generally considered good for life insurance.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900">Incurred Claim Ratio (ICR)</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    The ratio of total claims paid to the total premium collected. An ICR between 70% and 90% indicates a healthy health insurance company.
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4">How Much Life Cover Do You Need? (HLV)</h4>
                <p className="text-sm text-slate-600 mb-4">
                  Human Life Value (HLV) is a method to calculate the amount of life insurance you need based on your income, expenses, liabilities, and future goals.
                </p>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-900 mb-2">The Thumb Rule:</p>
                  <p className="text-sm text-primary font-bold mb-4">Life Cover = (Annual Income × 15) + Outstanding Debts - Existing Assets</p>
                  <p className="text-xs text-slate-500">Example: If you earn ₹10 Lakh/year and have a ₹50 Lakh home loan, you should ideally have a cover of at least ₹2 Crore.</p>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Term Insurance vs. Endowment Plans</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                    <tr>
                      <th className="pb-4">Feature</th>
                      <th className="pb-4">Term Insurance</th>
                      <th className="pb-4">Endowment Plan</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600">
                    <tr className="border-b border-slate-50">
                      <td className="py-4 font-bold text-slate-900">Purpose</td>
                      <td className="py-4">Pure Protection</td>
                      <td className="py-4">Protection + Savings</td>
                    </tr>
                    <tr className="border-b border-slate-50">
                      <td className="py-4 font-bold text-slate-900">Premium</td>
                      <td className="py-4 text-emerald-600 font-bold">Very Low</td>
                      <td className="py-4 text-rose-600 font-bold">High</td>
                    </tr>
                    <tr className="border-b border-slate-50">
                      <td className="py-4 font-bold text-slate-900">Maturity Benefit</td>
                      <td className="py-4">None (Usually)</td>
                      <td className="py-4">Sum Assured + Bonus</td>
                    </tr>
                    <tr>
                      <td className="py-4 font-bold text-slate-900">Ideal For</td>
                      <td className="py-4">High Life Cover at low cost</td>
                      <td className="py-4">Disciplined long-term saving</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-primary/5 p-8 rounded-3xl border border-primary/20">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Essential Insurance Riders</h2>
              <p className="text-sm text-slate-600 mb-6">Riders are add-ons that provide extra protection for a small additional premium.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Accidental Death Benefit</h4>
                  <p className="text-xs text-slate-500">Additional sum assured paid if death occurs due to an accident.</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Critical Illness Rider</h4>
                  <p className="text-xs text-slate-500">Lump sum payment on diagnosis of specified major illnesses (Cancer, Heart Attack, etc.).</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Waiver of Premium</h4>
                  <p className="text-xs text-slate-500">Future premiums are waived if the policyholder becomes permanently disabled.</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Hospital Cash Rider</h4>
                  <p className="text-xs text-slate-500">Daily allowance for each day of hospitalization to cover non-medical expenses.</p>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Common Insurance Exclusions</h2>
              <p className="text-sm text-slate-600 mb-6">It's equally important to know what your policy does NOT cover to avoid surprises during claims.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100">
                  <h4 className="font-bold text-rose-900 text-sm mb-2">Health Insurance</h4>
                  <ul className="text-xs text-rose-700 space-y-1">
                    <li>• Cosmetic surgery or obesity treatment</li>
                    <li>• Injuries due to war or nuclear perils</li>
                    <li>• Self-inflicted injuries or suicide attempts</li>
                    <li>• Non-medical expenses (consumables)</li>
                  </ul>
                </div>
                <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100">
                  <h4 className="font-bold text-rose-900 text-sm mb-2">Life Insurance</h4>
                  <ul className="text-xs text-rose-700 space-y-1">
                    <li>• Suicide within the first year of policy</li>
                    <li>• Death due to participation in illegal acts</li>
                    <li>• Death due to hazardous sports (unless declared)</li>
                    <li>• Misstatement of age or lifestyle habits</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Group vs. Individual Health Insurance</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-sm text-slate-600 mb-6">
                  While your company's group insurance is a great perk, relying solely on it is risky. Here's why you need an individual plan:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 text-sm mb-2">Continuity Risk</h4>
                    <p className="text-xs text-slate-500">If you lose your job or change companies, you lose your coverage. An individual plan stays with you for life.</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 text-sm mb-2">Customization</h4>
                    <p className="text-xs text-slate-500">Group plans are "one size fits all." Individual plans allow you to choose riders and coverage limits that suit your family.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-slate-900 text-white p-8 rounded-3xl">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                The Claim Settlement Process
              </h2>
              <div className="space-y-8">
                <div className="relative pl-8 border-l border-white/20">
                  <div className="absolute -left-3 top-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-slate-900 text-xs font-bold">1</div>
                  <h4 className="font-bold mb-1">Intimation</h4>
                  <p className="text-sm text-slate-400">Notify the insurer immediately (within 24-48 hours) about the event (hospitalization or death).</p>
                </div>
                <div className="relative pl-8 border-l border-white/20">
                  <div className="absolute -left-3 top-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-slate-900 text-xs font-bold">2</div>
                  <h4 className="font-bold mb-1">Documentation</h4>
                  <p className="text-sm text-slate-400">Submit all required documents (medical reports, bills, death certificate, etc.) to the TPA or insurer.</p>
                </div>
                <div className="relative pl-8 border-l border-white/20">
                  <div className="absolute -left-3 top-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-slate-900 text-xs font-bold">3</div>
                  <h4 className="font-bold mb-1">Verification</h4>
                  <p className="text-sm text-slate-400">The insurer verifies the documents and may conduct an investigation if necessary.</p>
                </div>
                <div className="relative pl-8">
                  <div className="absolute -left-3 top-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-slate-900 text-xs font-bold">4</div>
                  <h4 className="font-bold mb-1">Settlement</h4>
                  <p className="text-sm text-slate-400">Once approved, the claim amount is paid directly to the hospital (cashless) or reimbursed to the policyholder.</p>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Why Insurance is Essential</h2>
              <div className="prose prose-slate max-w-none">
                <p>
                  In the Indian context, where medical inflation is rising at 14-15% annually, a single hospitalization can derail your entire financial plan. Insurance serves three primary purposes:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h4 className="font-bold text-slate-900 mb-2">Risk Transfer</h4>
                    <p className="text-sm text-slate-600">Transfer the financial burden of large, unexpected expenses to the insurer.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h4 className="font-bold text-slate-900 mb-2">Peace of Mind</h4>
                    <p className="text-sm text-slate-600">Focus on recovery or growth knowing your family's future is secured.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h4 className="font-bold text-slate-900 mb-2">Tax Benefits</h4>
                    <p className="text-sm text-slate-600">Save up to ₹75,000 in taxes annually under Section 80C and 80D.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Tips & Sidebar */}
          <div className="space-y-8">
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
              <h3 className="text-xl font-bold mb-4">Expert Tip</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                "Always keep your insurance and investments separate. Pure term insurance and low-cost mutual funds usually offer better value than combined products like endowment plans."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">B</div>
                <div>
                  <p className="text-sm font-bold">BHP Finance Advisory</p>
                  <p className="text-xs text-slate-400">Strategic Planning Team</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Key Tax Benefits
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Section 80C</h4>
                  <p className="text-xs text-slate-500">Deduction up to ₹1.5 Lakh for Life Insurance premiums.</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Section 80D</h4>
                  <p className="text-xs text-slate-500">Deduction up to ₹25,000 (Self/Family) + ₹50,000 (Senior Citizen Parents) for Health Insurance.</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Section 10(10D)</h4>
                  <p className="text-xs text-slate-500">Maturity proceeds of life insurance are tax-free (subject to conditions).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
