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
            </section>

            <section className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Critical Health Insurance Terms</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    <span className="font-bold text-primary">01</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Waiting Period</h4>
                    <p className="text-sm text-slate-600">The time you must wait before certain diseases or pre-existing conditions are covered (usually 2-4 years).</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    <span className="font-bold text-primary">02</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Co-payment</h4>
                    <p className="text-sm text-slate-600">A fixed percentage of the claim amount that the policyholder must pay from their own pocket.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    <span className="font-bold text-primary">03</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">No Claim Bonus (NCB)</h4>
                    <p className="text-sm text-slate-600">A reward for not making any claims during the policy year, usually in the form of increased sum insured.</p>
                  </div>
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
