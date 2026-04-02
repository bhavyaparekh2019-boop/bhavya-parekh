import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Heart, Car, Home, Lock, CheckCircle2, Info, Briefcase, ArrowRight, ShieldCheck, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import BlurText from '@/components/BlurText';
import ChromaGrid from '@/components/ChromaGrid';
import { useModal } from '@/context/ModalContext';

const insuranceTypes = [
  {
    title: 'Life Insurance',
    icon: Heart,
    description: 'Financial security for your family in your absence.',
    details: [
      'Term Insurance: Pure protection at low cost. Pro Tip: Buy early to lock in low premiums.',
      'Whole Life: Coverage for life with savings component. Ideal for legacy planning.',
      'Endowment: Fixed returns with life cover. Disciplined savings for long-term goals.',
      'ULIPs: Market-linked returns with insurance. Best for 10+ year horizons.',
      'Child Plans: Specifically designed for education and marriage milestones.',
      'Money Back: Periodic payouts during the policy term for liquidity.',
      'Retirement/Pension: Guaranteed income post-retirement.'
    ],
    color: 'bg-rose-50 text-rose-600'
  },
  {
    title: 'Health Insurance',
    icon: Shield,
    description: 'Coverage for medical expenses and hospitalizations.',
    details: [
      'Individual/Family Floater plans. Pro Tip: Opt for restoration benefits.',
      'Critical Illness coverage. Lump sum payment on life-threatening diagnosis.',
      'Super Top-up plans. High coverage at a fraction of base policy cost.',
      'Cashless hospitalization. Direct settlement with network hospitals.',
      'OPD Cover: Reimburses doctor visits and pharmacy bills.',
      'Maternity Cover: Expenses related to childbirth and newborn care.',
      'Senior Citizen Plans: Tailored for age-related health issues.'
    ],
    color: 'bg-sky-50 text-sky-600'
  },
  {
    title: 'Motor Insurance',
    icon: Car,
    description: 'Protection for your vehicles against damage and theft.',
    details: [
      'Third-party Liability (Mandatory). Covers damage to others.',
      'Comprehensive coverage. Protects your own vehicle too.',
      'Zero Depreciation add-ons. Pro Tip: Essential for cars under 5 years old.',
      'Roadside assistance. 24/7 help for towing, flat tires, and fuel.',
      'Engine Protection: Covers damage due to water ingression/oil leakage.',
      'Commercial Vehicle Insurance: For trucks, taxis, and buses.',
      'Two-Wheeler Insurance: Specific plans for bikes and scooters.'
    ],
    color: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Home Insurance',
    icon: Home,
    description: 'Safeguarding your property and its contents.',
    details: [
      'Fire and natural calamity protection. Earthquake, flood, and storm cover.',
      'Burglary and theft coverage. Protects jewelry, electronics, and furniture.',
      'Structure and content insurance. Comprehensive safety for your biggest asset.',
      'Public liability coverage. Protection if someone is injured on your property.',
      'Terrorism Cover: Protection against damage from extremist acts.',
      'Landlord Insurance: Protection for rental properties.',
      'Tenant Insurance: Covers personal belongings in a rented home.'
    ],
    color: 'bg-amber-50 text-amber-600'
  },
  {
    title: 'Travel Insurance',
    icon: ShieldCheck,
    description: 'Coverage for risks during domestic or international travel.',
    details: [
      'Medical Emergencies: Hospitalization costs abroad.',
      'Trip Cancellation: Reimbursement for non-refundable bookings.',
      'Baggage Loss: Compensation for lost or delayed luggage.',
      'Passport Loss: Assistance and cost coverage for duplicate passports.',
      'Flight Delay: Payouts for significant airline delays.',
      'Student Travel: Specialized plans for students studying abroad.',
      'Senior Citizen Travel: Coverage for pre-existing conditions during travel.'
    ],
    color: 'bg-emerald-50 text-emerald-600'
  },
  {
    title: 'Cyber Insurance',
    icon: Lock,
    description: 'Protection against digital threats and data breaches.',
    details: [
      'Identity theft protection. Covers legal costs to restore your identity.',
      'Data restoration costs. Professional help to recover lost digital assets.',
      'Cyber extortion coverage. Protection against ransomware attacks.',
      'Legal and forensic support. Expert investigation of digital breaches.',
      'Phishing Protection: Covers financial losses from fraudulent emails/sites.',
      'Social Media Liability: Protection against defamation or libel claims.',
      'E-reputation Cover: Costs to manage online reputation after a breach.'
    ],
    color: 'bg-indigo-50 text-indigo-600'
  },
  {
    title: 'Personal Accident',
    icon: Shield,
    description: 'Lump sum payment in case of accidental death or disability.',
    details: [
      'Accidental Death: 100% sum assured paid to nominee.',
      'Permanent Total Disability: Payout if unable to work again.',
      'Permanent Partial Disability: Payout for loss of limbs, sight, etc.',
      'Temporary Total Disability: Weekly payouts during recovery.',
      'Education Benefit: Payout for children\'s education after an accident.',
      'Ambulance Charges: Reimbursement for emergency transport.',
      'Global Coverage: Usually valid 24/7 anywhere in the world.'
    ],
    color: 'bg-orange-50 text-orange-600'
  },
  {
    title: 'Business Insurance',
    icon: Briefcase,
    description: 'Specialized protection for commercial entities and professionals.',
    details: [
      'Professional Indemnity: For Doctors, Lawyers, and Architects.',
      'Marine Insurance: Protects goods in transit via sea, air, or land.',
      'Public Liability: Protection against third-party injury claims at business sites.',
      'Workmen\'s Compensation: Legal liability for employee injuries at work.',
      'Fire & Burglary (Commercial): Protects office, factory, or warehouse.',
      'Group Health: Medical cover for employees and their families.',
      'D&O Liability: Protects directors against personal liability claims.'
    ],
    color: 'bg-slate-50 text-slate-600'
  },
  {
    title: 'Specialized Insurance',
    icon: Sparkles,
    description: 'Niche policies for specific assets and risks.',
    details: [
      'Pet Insurance: Veterinary bills and third-party liability for pets.',
      'Mobile/Gadget Insurance: Protection against screen damage and theft.',
      'Crop Insurance: Protects farmers against weather-related losses.',
      'Wedding Insurance: Covers cancellation or damage during events.',
      'Key Person Insurance: Protects business against loss of vital employees.',
      'Credit Insurance: Protects businesses against non-payment of debts.',
      'Title Insurance: Protects against defects in property titles.'
    ],
    color: 'bg-purple-50 text-purple-600'
  }
];

const topInsurers = [
  {
    name: 'LIC of India',
    type: 'Life Insurance',
    description: 'The largest and oldest state-owned insurance provider in India.',
    policies: [
      { name: 'Jeevan Anand', detail: 'A combination of protection and savings. Provides financial support for the family of the deceased and a lump sum for the surviving policyholder.' },
      { name: 'Tech Term', detail: 'A pure risk premium plan which provides financial protection to the insured\'s family in case of unfortunate death.' },
      { name: 'Jeevan Umang', detail: 'Provides for annual survival benefits from the end of the premium paying term till maturity and a lump sum amount at the time of maturity.' },
      { name: 'Jeevan Akshay VII', detail: 'An immediate annuity plan where the policyholder pays a lump sum and receives regular pension for life.' }
    ],
    color: 'border-blue-500'
  },
  {
    name: 'HDFC Life',
    type: 'Life Insurance',
    description: 'A leading long-term life insurance solutions provider.',
    policies: [
      { name: 'Click 2 Protect Life', detail: 'A term insurance plan that provides comprehensive protection at an affordable price, with options for return of premium.' },
      { name: 'Sanchay Plus', detail: 'A non-participating savings insurance plan that offers guaranteed benefits for you and your family.' },
      { name: 'Pension Guaranteed Plan', detail: 'Offers a guaranteed regular income for life to ensure a worry-free retirement.' },
      { name: 'YoungStar Super Premium', detail: 'A unit-linked insurance plan designed to secure your child\'s future even in your absence.' }
    ],
    color: 'border-red-500'
  },
  {
    name: 'Max Life Insurance',
    type: 'Life Insurance',
    description: 'Known for high claim settlement ratios and customer-centricity.',
    policies: [
      { name: 'Smart Secure Plus', detail: 'Highly flexible term plan with options like terminal illness cover, joint life cover, and premium break.' },
      { name: 'Smart Wealth Plan', detail: 'A comprehensive life insurance savings plan that offers guaranteed returns and life cover.' },
      { name: 'Platinum Wealth Plan', detail: 'A unit-linked non-participating individual life insurance plan that offers wealth creation and protection.' },
      { name: 'Guaranteed Lifetime Income', detail: 'Ensures a steady stream of income for the rest of your life after retirement.' }
    ],
    color: 'border-blue-600'
  },
  {
    name: 'ICICI Lombard',
    type: 'General Insurance',
    description: 'One of the largest private sector non-life insurers.',
    policies: [
      { name: 'Complete Health Insurance', detail: 'Comprehensive health cover including OPD, maternity, and wellness benefits with a wide network of hospitals.' },
      { name: 'Car Shield', detail: 'Comprehensive car insurance with unique add-ons like zero depreciation, engine protect, and roadside assistance.' },
      { name: 'International Travel', detail: 'Covers medical emergencies, trip cancellations, and loss of baggage during international trips.' },
      { name: 'Home Insurance', detail: 'Protects your home and its contents against fire, theft, and natural calamities.' }
    ],
    color: 'border-orange-500'
  },
  {
    name: 'HDFC ERGO',
    type: 'General Insurance',
    description: 'A joint venture offering a wide range of general insurance products.',
    policies: [
      { name: 'Optima Secure', detail: 'A health insurance plan that offers "Secure, Plus, Protect, and Restore" benefits, doubling your coverage automatically.' },
      { name: 'Cyber Sachet', detail: 'Protects individuals against financial losses due to identity theft, malware attacks, and phishing.' },
      { name: 'My:Health Suraksha', detail: 'A flexible health insurance plan with options for critical illness and hospital cash.' },
      { name: 'Home Shield', detail: 'Comprehensive protection for your house building and its contents against various risks.' }
    ],
    color: 'border-red-600'
  },
  {
    name: 'Bajaj Allianz',
    type: 'General & Life',
    description: 'A global leader in insurance and asset management.',
    policies: [
      { name: 'Health Guard', detail: 'A comprehensive health insurance policy with options for individual and family floater covers.' },
      { name: 'Global Health Care', detail: 'Offers seamless access to healthcare facilities worldwide, including planned treatments abroad.' },
      { name: 'Pet Dog Insurance', detail: 'A unique policy covering veterinary expenses, theft, and third-party liability for your pet dog.' },
      { name: 'eTouch Online Term', detail: 'A simple and affordable online term plan that provides high life cover at low premiums.' }
    ],
    color: 'border-blue-700'
  },
  {
    name: 'Tata AIG',
    type: 'General Insurance',
    description: 'A joint venture between Tata Group and AIG.',
    policies: [
      { name: 'Medicare Premier', detail: 'High-end health insurance with global cover, maternity benefits, and air ambulance services.' },
      { name: 'Auto Secure', detail: 'Car insurance with a wide range of add-on covers like return to invoice and consumables cover.' },
      { name: 'Travel Guard', detail: 'Comprehensive travel insurance for individuals, families, and students traveling abroad.' },
      { name: 'Home Guard', detail: 'Protects your home structure and contents against fire, burglary, and natural disasters.' }
    ],
    color: 'border-blue-400'
  },
  {
    name: 'Royal Sundaram',
    type: 'General Insurance',
    description: 'First private sector general insurer licensed in India.',
    policies: [
      { name: 'Lifeline Health', detail: 'Offers comprehensive health cover with unique features like "Reload" of sum insured and wellness rewards.' },
      { name: 'Car Shield', detail: 'Comprehensive car insurance with 24x7 roadside assistance and quick claim settlement.' },
      { name: 'Bike Shield', detail: 'Protects your two-wheeler against accidents, theft, and third-party liabilities.' },
      { name: 'Home Shield', detail: 'A comprehensive policy for homeowners and tenants to protect their property and belongings.' }
    ],
    color: 'border-emerald-600'
  },
  {
    name: 'SBI Life',
    type: 'Life Insurance',
    description: 'Leveraging the vast network of State Bank of India.',
    policies: [
      { name: 'eShield Next', detail: 'A new-age term insurance plan that adapts to your changing life stages and needs.' },
      { name: 'Smart Platina Plus', detail: 'An individual, non-linked, non-participating life insurance savings product with guaranteed additions.' },
      { name: 'Retire Smart', detail: 'A unit-linked pension plan that helps you build a corpus for your retirement years.' },
      { name: 'Smart Wealth Builder', detail: 'A unit-linked insurance plan that offers life cover and market-linked returns.' }
    ],
    color: 'border-blue-800'
  },
  {
    name: 'Star Health',
    type: 'Health Insurance',
    description: 'India\'s first standalone health insurance company.',
    policies: [
      { name: 'Family Health Optima', detail: 'A popular family floater plan that covers the entire family under a single sum insured.' },
      { name: 'Senior Citizens Red Carpet', detail: 'Specifically designed for people aged 60 and above, covering pre-existing diseases from the second year.' },
      { name: 'Star Diabetes Safe', detail: 'A specialized plan for people with Type 1 and Type 2 diabetes, covering complications related to diabetes.' },
      { name: 'Star Cardiac Care', detail: 'Provides coverage for people who have undergone cardiac procedures or surgeries.' }
    ],
    color: 'border-blue-300'
  }
];

export default function InsuranceGuide() {
  const { openConsultationModal } = useModal();
  const [expandedInsurers, setExpandedInsurers] = useState<number[]>([]);

  const toggleInsurer = (idx: number) => {
    setExpandedInsurers(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

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
                text="Comprehensive Guide to Insurance"
                centered={false}
                highlight="Insurance"
                className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
              />
              <p className="text-xl text-slate-600 leading-relaxed">
                Insurance is not just an expense; it's a critical safety net that protects your financial future from life's uncertainties.
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
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200&h=675" 
                  alt="Insurance Protection" 
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
          {/* Left Column: Types */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm">01</span>
                Types of Insurance in India
              </h2>
              <ChromaGrid 
                cols="grid-cols-1 md:grid-cols-2"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={insuranceTypes.map(type => {
                  const getColor = (colorStr: string) => {
                    if (colorStr.includes('rose')) return '#F43F5E';
                    if (colorStr.includes('sky')) return '#0EA5E9';
                    if (colorStr.includes('blue')) return '#3B82F6';
                    if (colorStr.includes('amber')) return '#F59E0B';
                    if (colorStr.includes('emerald')) return '#10B981';
                    if (colorStr.includes('indigo')) return '#6366F1';
                    if (colorStr.includes('orange')) return '#F97316';
                    if (colorStr.includes('slate')) return '#64748B';
                    if (colorStr.includes('purple')) return '#A855F7';
                    return '#F59E0B';
                  };
                  const color = getColor(type.color);
                  return {
                    title: type.title,
                    description: type.description,
                    icon: type.icon,
                    details: type.details,
                    borderColor: color,
                    gradient: `linear-gradient(145deg, ${color}, #000)`
                  };
                })}
              />
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm">02</span>
                Top Insurance Companies & Their Offerings
              </h2>
              <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                Choosing the right insurer is as important as choosing the right policy. Here is a breakdown of India's top insurance providers and their flagship products with detailed policy benefits.
              </p>
              <div className="grid grid-cols-1 gap-6">
                {topInsurers.map((insurer, idx) => {
                  const isExpanded = expandedInsurers.includes(idx);
                  return (
                    <div key={idx} className={`rounded-3xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-lg ring-1 ring-primary/10' : 'hover:shadow-md'}`}>
                      <button 
                        onClick={() => toggleInsurer(idx)}
                        className={`w-full text-left p-6 flex flex-wrap justify-between items-center gap-4 transition-colors ${isExpanded ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-10 rounded-full ${insurer.color.replace('border-', 'bg-')}`} />
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">{insurer.name}</h4>
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm mt-1 inline-block">
                              {insurer.type}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-primary">
                            {isExpanded ? 'Hide Details' : 'View More Details'}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                          >
                            <div className="p-8 pt-0 border-t border-slate-100 bg-slate-50/30">
                              <p className="text-sm text-slate-500 italic mb-8 mt-6 border-l-2 border-primary/20 pl-4">
                                {insurer.description}
                              </p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {insurer.policies.map((policy, pIdx) => (
                                  <div key={pIdx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-primary/20 transition-all duration-300 group">
                                    <h5 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 group-hover:text-primary transition-colors">
                                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                      {policy.name}
                                    </h5>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                      {policy.detail}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
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
                  <p className="text-sm text-primary font-bold mb-4">Life Cover = (Annual Income × 15) + Total Debts - Existing Assets</p>
                  <p className="text-xs text-slate-500">Note: Total Debts should include home loans, personal loans, credit card balances, and any other liabilities.</p>
                  <p className="text-xs text-slate-500 mt-2">Example: If you earn ₹10 Lakh/year and have a ₹50 Lakh home loan + ₹5 Lakh in other loans, you should ideally have a cover of at least ₹2.05 Crore.</p>
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
                      <td className="py-4 text-sky-600 font-bold">Very Low</td>
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
              <ChromaGrid 
                cols="grid-cols-1 md:grid-cols-2"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={[
                  {
                    title: 'Accidental Death Benefit',
                    description: 'Additional sum assured paid if death occurs due to an accident.',
                    details: [
                      'Double Indemnity: Often doubles the base sum assured.',
                      'Low Cost: Very affordable compared to base life cover.',
                      'Global Coverage: Usually valid worldwide.',
                      'Pro Tip: Essential for frequent travelers and high-risk jobs.'
                    ],
                    borderColor: '#3B82F6',
                    gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                  },
                  {
                    title: 'Critical Illness Rider',
                    description: 'Lump sum payment on diagnosis of specified major illnesses.',
                    details: [
                      'Covers Cancer, Heart Attack, Stroke, and more.',
                      'Survival Period: Usually requires 30 days survival post-diagnosis.',
                      'No Bills Required: Payment is made on diagnosis, not expenses.',
                      'Pro Tip: Use this to cover lifestyle changes and lost income.'
                    ],
                    borderColor: '#0EA5E9',
                    gradient: 'linear-gradient(180deg, #0EA5E9, #000)'
                  },
                  {
                    title: 'Waiver of Premium',
                    description: 'Future premiums are waived if the policyholder becomes permanently disabled.',
                    details: [
                      'Policy Continuity: Ensures the policy stays active without payment.',
                      'Total Disability: Usually triggered by loss of limbs or sight.',
                      'Peace of Mind: Family remains protected even without income.',
                      'Pro Tip: A must-have for all long-term life insurance policies.'
                    ],
                    borderColor: '#F59E0B',
                    gradient: 'linear-gradient(145deg, #F59E0B, #000)'
                  },
                  {
                    title: 'Hospital Cash Rider',
                    description: 'Daily allowance for each day of hospitalization for non-medical expenses.',
                    details: [
                      'Fixed Daily Amount: Pre-defined sum regardless of actual bills.',
                      'Covers Indirect Costs: Food, travel, and attendant expenses.',
                      'ICU Double Benefit: Often pays double for ICU stays.',
                      'Pro Tip: Good for covering "non-medical" items not paid by health insurance.'
                    ],
                    borderColor: '#6366F1',
                    gradient: 'linear-gradient(145deg, #6366F1, #000)'
                  }
                ]}
              />
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Common Insurance Exclusions</h2>
              <p className="text-sm text-slate-600 mb-6">It's equally important to know what your policy does NOT cover to avoid surprises during claims.</p>
              <ChromaGrid 
                cols="grid-cols-1 md:grid-cols-2"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={[
                  {
                    title: 'Health Insurance',
                    description: 'Cosmetic surgery, obesity treatment, injuries due to war, self-inflicted injuries, non-medical expenses.',
                    details: [
                      'Waiting Periods: Pre-existing diseases usually covered after 2-4 years.',
                      'Cosmetic Surgery: Not covered unless due to an accident.',
                      'Alternative Medicine: Limited coverage for AYUSH treatments.',
                      'Pro Tip: Always disclose pre-existing conditions to avoid claim rejection.'
                    ],
                    borderColor: '#F43F5E',
                    gradient: 'linear-gradient(145deg, #F43F5E, #000)'
                  },
                  {
                    title: 'Life Insurance',
                    description: 'Suicide within first year, death due to illegal acts, hazardous sports, misstatement of age.',
                    details: [
                      'Suicide Clause: Usually excluded for the first 12 months.',
                      'Illegal Acts: Death while committing a crime is not covered.',
                      'Hazardous Sports: Racing, skydiving, etc., often need special riders.',
                      'Pro Tip: Ensure your nominee knows where the policy documents are kept.'
                    ],
                    borderColor: '#F43F5E',
                    gradient: 'linear-gradient(145deg, #F43F5E, #000)'
                  }
                ]}
              />
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Group vs. Individual Health Insurance</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-sm text-slate-600 mb-6">
                  While your company's group insurance is a great perk, relying solely on it is risky. Here's why you need an individual plan:
                </p>
                <ChromaGrid 
                  cols="grid-cols-1 md:grid-cols-2"
                  radius={300}
                  damping={0.45}
                  fadeOut={0.6}
                  ease="power3.out"
                  items={[
                    {
                      title: 'Continuity Risk',
                      description: 'If you lose your job, you lose your coverage. An individual plan stays with you for life.',
                      borderColor: '#3B82F6',
                      gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                    },
                    {
                      title: 'Customization',
                      description: 'Individual plans allow you to choose riders and coverage limits that suit your family.',
                      borderColor: '#0EA5E9',
                      gradient: 'linear-gradient(180deg, #0EA5E9, #000)'
                    }
                  ]}
                />
              </div>
            </section>

            <section className="bg-primary/10 p-8 rounded-3xl border border-primary/20">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                The Claim Settlement Process
              </h2>
              <div className="space-y-8">
                <div className="relative pl-8 border-l border-primary/20">
                  <div className="absolute -left-3 top-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                  <h4 className="font-bold text-slate-900 mb-1">Intimation</h4>
                  <p className="text-sm text-slate-600">Notify the insurer immediately (within 24-48 hours) about the event (hospitalization or death).</p>
                </div>
                <div className="relative pl-8 border-l border-primary/20">
                  <div className="absolute -left-3 top-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                  <h4 className="font-bold text-slate-900 mb-1">Documentation</h4>
                  <p className="text-sm text-slate-600">Submit all required documents (medical reports, bills, death certificate, etc.) to the TPA or insurer.</p>
                </div>
                <div className="relative pl-8 border-l border-primary/20">
                  <div className="absolute -left-3 top-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                  <h4 className="font-bold text-slate-900 mb-1">Verification</h4>
                  <p className="text-sm text-slate-600">The insurer verifies the documents and may conduct an investigation if necessary.</p>
                </div>
                <div className="relative pl-8">
                  <div className="absolute -left-3 top-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                  <h4 className="font-bold text-slate-900 mb-1">Settlement</h4>
                  <p className="text-sm text-slate-600">Once approved, the claim amount is paid directly to the hospital (cashless) or reimbursed to the policyholder.</p>
                </div>
              </div>
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-primary" />
                Insurance for Business Owners & Professionals
              </h2>
              <p className="text-sm text-slate-600 mb-8">
                If you run a business or are a practicing professional (Doctor, Lawyer, Architect), standard personal insurance is not enough. You need specialized protection.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">Key Person Insurance</h4>
                  <p className="text-xs text-slate-600 mb-4">A life insurance policy taken by a business on the life of a crucial employee. The business is the beneficiary.</p>
                  <ul className="text-[10px] text-slate-500 space-y-1">
                    <li>• Protects against loss of profits due to the death of a key person.</li>
                    <li>• Premiums are deductible as business expenses.</li>
                  </ul>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">Professional Indemnity</h4>
                  <p className="text-xs text-slate-600 mb-4">Protects professionals against legal liability for errors, omissions, or negligence in their services.</p>
                  <ul className="text-[10px] text-slate-500 space-y-1">
                    <li>• Essential for Doctors (Medical Malpractice).</li>
                    <li>• Covers legal defense costs and settlements.</li>
                  </ul>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">Director's & Officer's (D&O)</h4>
                  <p className="text-xs text-slate-600 mb-4">Covers personal liability of directors and officers for claims made against them while serving on a board.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">Cyber Liability</h4>
                  <p className="text-xs text-slate-600 mb-4">Protects businesses against data breaches, ransomware, and other digital threats.</p>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
                Travel Insurance: Your Global Safety Net
              </h2>
              <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                Whether you're traveling for business or leisure, international travel comes with its own set of risks. Travel insurance ensures that an unexpected event doesn't turn into a financial catastrophe while you're away from home.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:bg-emerald-50 transition-colors">
                  <h4 className="font-bold text-emerald-900 mb-3 text-sm">Medical Emergencies Abroad</h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">Covers expensive hospitalization and outpatient costs in foreign countries where medical care can be prohibitively high for non-residents.</p>
                </div>
                <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:bg-emerald-50 transition-colors">
                  <h4 className="font-bold text-emerald-900 mb-3 text-sm">Trip Cancellation</h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">Reimburses non-refundable expenses like flight tickets and hotel bookings if you have to cancel your trip due to unforeseen medical or personal reasons.</p>
                </div>
                <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:bg-emerald-50 transition-colors">
                  <h4 className="font-bold text-emerald-900 mb-3 text-sm">Baggage Loss</h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">Provides financial compensation for lost, stolen, or damaged baggage, ensuring you can replace essentials and continue your journey.</p>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Lock className="w-6 h-6 text-primary" />
                Cyber Insurance: Protecting Your Digital Life
              </h2>
              <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                In an increasingly digital world, your online presence and data are as valuable as your physical assets. Cyber insurance provides a robust shield against the growing and evolving threat of cybercrime.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 hover:bg-indigo-50 transition-colors">
                  <h4 className="font-bold text-indigo-900 mb-3 text-sm">Identity Theft Protection</h4>
                  <p className="text-xs text-indigo-700 leading-relaxed">Covers legal fees, lost wages, and other expenses incurred to restore your identity and credit standing after a theft or fraudulent use of your data.</p>
                </div>
                <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 hover:bg-indigo-50 transition-colors">
                  <h4 className="font-bold text-indigo-900 mb-3 text-sm">Data Breach Coverage</h4>
                  <p className="text-xs text-indigo-700 leading-relaxed">Protects against the loss or theft of sensitive personal or business data, covering restoration costs, notification expenses, and legal liabilities.</p>
                </div>
                <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 hover:bg-indigo-50 transition-colors">
                  <h4 className="font-bold text-indigo-900 mb-3 text-sm">Ransomware Protection</h4>
                  <p className="text-xs text-indigo-700 leading-relaxed">Provides expert assistance and financial coverage for cyber extortion attempts, helping you navigate and recover from malicious ransomware attacks.</p>
                </div>
              </div>
            </section>

            <section className="bg-primary/5 p-10 rounded-[2.5rem] border border-primary/20">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">BHP's "Insurance First" Philosophy</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700">
                  At BHP Finance, we believe insurance is the foundation of any financial plan. You cannot build a skyscraper on a swamp. Insurance is the "piling" that ensures your family's lifestyle remains intact even if the primary earner is no longer there.
                </p>
                <div className="mt-6 p-6 bg-white rounded-2xl border border-primary/10 italic text-sm text-slate-600">
                  "The best time to buy insurance was yesterday. The second best time is today. The worst time is when you actually need it."
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
            <div className="bg-primary text-slate-900 p-8 rounded-3xl shadow-xl">
              <h3 className="text-xl font-bold mb-4">Expert Tip</h3>
              <p className="text-slate-800 text-sm leading-relaxed mb-6 font-medium">
                "Always keep your insurance and investments separate. Pure term insurance and low-cost mutual funds usually offer better value than combined products like endowment plans."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-slate-900 font-bold">B</div>
                <div>
                  <p className="text-sm font-bold">BHP Finance Advisory</p>
                  <p className="text-xs text-slate-700">Strategic Planning Team</p>
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

            <div className="bg-white p-8 rounded-3xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Need Expert Advice?</h3>
              <p className="text-sm text-slate-600 mb-6">
                Insurance can be complex. Our specialists can help you compare plans and find the best coverage for your family.
              </p>
              <button 
                onClick={() => openConsultationModal('Insurance Advisory')}
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
