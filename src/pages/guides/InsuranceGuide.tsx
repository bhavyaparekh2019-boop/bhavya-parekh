import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Heart, Car, Home, Lock, CheckCircle2, Info, Briefcase, ArrowRight, Plane, Activity, UserCheck, Dog, Scale, Plus, X, Star, Loader2, Calculator } from 'lucide-react';
import BlurText from '@/src/components/BlurText';
import ChromaGrid from '@/src/components/ChromaGrid';
import Tooltip from '@/src/components/Tooltip';
import { useModal } from '@/src/context/ModalContext';
import HLVCalculator from '@/src/components/HLVCalculator';
import { getAllInsurancePlansFromFirestore, fetchRealInsurancePlans, saveInsurancePlansToFirestore, InsurancePlan } from '@/src/services/insuranceService';
import { cn } from '@/src/lib/utils';

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
      'Child Plans: Specifically designed for education and marriage milestones.'
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
      'OPD Cover: Reimburses doctor visits and pharmacy bills.'
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
      'Engine Protection: Covers damage due to water ingression/oil leakage.'
    ],
    color: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Travel Insurance',
    icon: Plane,
    description: 'Safety net for international and domestic trips.',
    details: [
      'Medical Emergencies: Covers hospitalization abroad.',
      'Trip Cancellation: Reimburses non-refundable bookings.',
      'Lost Baggage: Compensation for delayed or lost luggage.',
      'Passport Loss: Assistance in getting duplicate documents.',
      'Pro Tip: Buy as soon as you book your flights for maximum coverage.'
    ],
    color: 'bg-emerald-50 text-emerald-600'
  },
  {
    title: 'Personal Accident',
    icon: Activity,
    description: 'Compensation for accidental death or disability.',
    details: [
      'Accidental Death: Full sum assured paid to nominee.',
      'Permanent Disability: Lump sum for loss of limbs/sight.',
      'Temporary Disability: Weekly allowance for lost income.',
      'Education Benefit: Fund for children\'s education after accident.',
      'Pro Tip: Essential for those with high-risk commutes or jobs.'
    ],
    color: 'bg-orange-50 text-orange-600'
  },
  {
    title: 'Critical Illness',
    icon: UserCheck,
    description: 'Lump sum payout on diagnosis of major diseases.',
    details: [
      'Covers 30+ illnesses like Cancer, Stroke, Kidney failure.',
      'Lump Sum Payout: Use money for treatment or debt repayment.',
      'No Hospitalization Required: Payout based on diagnosis.',
      'Income Replacement: Helps when you can\'t work during recovery.',
      'Pro Tip: Buy a standalone policy for higher coverage than riders.'
    ],
    color: 'bg-violet-50 text-violet-600'
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
      'Terrorism Cover: Protection against damage from extremist acts.'
    ],
    color: 'bg-amber-50 text-amber-600'
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
      'Phishing Protection: Covers financial losses from fraudulent emails/sites.'
    ],
    color: 'bg-indigo-50 text-indigo-600'
  },
  {
    title: 'Pet Insurance',
    icon: Dog,
    description: 'Coverage for your furry family members.',
    details: [
      'Medical Expenses: Covers surgeries and hospitalizations.',
      'Accidental Injuries: Emergency care for accidents.',
      'Third-party Liability: If your pet causes damage to others.',
      'Mortality Benefit: Compensation in case of unfortunate death.',
      'Pro Tip: Insure pets early (before 4 years) for better coverage.'
    ],
    color: 'bg-stone-50 text-stone-600'
  }
];

const METRICS = [
  { key: 'csr', label: 'CSR', tooltip: 'Claim Settlement Ratio - Higher is better', better: 'high' },
  { key: 'premium', label: 'Premium', tooltip: 'Approximate annual cost', better: 'low' },
  { key: 'sumAssured', label: 'Coverage', tooltip: 'Typical sum assured offered', better: 'high' }
];

export default function InsuranceGuide() {
  const { openConsultationModal } = useModal();
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('bhp_insurance_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; mode: 'best' | 'worst' } | null>(null);

  // Load plans
  useEffect(() => {
    const loadPlans = async () => {
      try {
        let data = await getAllInsurancePlansFromFirestore();
        if (data.length === 0) {
          data = await fetchRealInsurancePlans();
          await saveInsurancePlansToFirestore(data);
        }
        setPlans(data);
      } catch (error) {
        console.error("Error loading insurance plans:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPlans();
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem('bhp_insurance_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const togglePlan = (id: string) => {
    setSelectedPlanIds(prev => 
      prev.includes(id) 
        ? prev.filter(pid => pid !== id) 
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const handleSort = (key: string) => {
    if (!key) {
      setSortConfig(null);
      return;
    }
    setSortConfig(prev => {
      if (prev?.key === key) {
        if (prev.mode === 'best') return { key, mode: 'worst' };
        return null;
      }
      return { key, mode: 'best' };
    });
  };

  const selectedPlans = plans.filter(p => selectedPlanIds.includes(p.id || ''));

  const parseValue = (val: any) => {
    if (typeof val === 'number') return val;
    if (typeof val !== 'string') return 0;
    return parseFloat(val.replace(/[^\d.-]/g, '')) || 0;
  };

  const sortedPlans = [...selectedPlans].sort((a, b) => {
    if (!sortConfig) return 0;
    const metric = METRICS.find(m => m.key === sortConfig.key);
    if (!metric) return 0;

    const aValue = parseValue(a[sortConfig.key as keyof typeof a]);
    const bValue = parseValue(b[sortConfig.key as keyof typeof b]);
    
    const isBestMode = sortConfig.mode === 'best';
    const isBetterLow = metric.better === 'low';
    
    const shouldBeAscending = (isBestMode && isBetterLow) || (!isBestMode && !isBetterLow);
    return shouldBeAscending ? aValue - bValue : bValue - aValue;
  });

  const getIsBestInRow = (planId: string, metricKey: string) => {
    if (selectedPlans.length < 2) return false;
    const metric = METRICS.find(m => m.key === metricKey);
    if (!metric) return false;

    const values = selectedPlans.map(p => ({ id: p.id, val: parseValue(p[metricKey as keyof typeof p]) }));
    const bestVal = metric.better === 'low' 
      ? Math.min(...values.map(v => v.val)) 
      : Math.max(...values.map(v => v.val));
    
    const planVal = parseValue(selectedPlans.find(p => p.id === planId)?.[metricKey as keyof typeof selectedPlans[0]] || 0);
    return planVal === bestVal;
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
            {/* Insurance Comparison Tool */}
            <section id="plan-comparison" className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden scroll-mt-24">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Scale className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 leading-tight">Compare Insurance Plans</h2>
                    <p className="text-sm text-slate-500">Select up to 3 plans to compare side-by-side</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {selectedPlanIds.length > 0 && (
                    <button 
                      onClick={() => {
                        setSelectedPlanIds([]);
                        setSortConfig(null);
                      }}
                      className="text-xs font-bold text-rose-500 hover:text-rose-600 uppercase tracking-widest whitespace-nowrap"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {plans.map(plan => (
                  <div key={plan.id} className="relative group">
                    <button
                      onClick={() => togglePlan(plan.id || '')}
                      className={cn(
                        "w-full p-4 rounded-2xl border-2 transition-all text-left relative",
                        selectedPlanIds.includes(plan.id || '') 
                          ? "border-primary bg-primary/5" 
                          : "border-slate-100 bg-slate-50 hover:border-slate-200"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{plan.category}</span>
                        {selectedPlanIds.includes(plan.id || '') ? (
                          <X className="w-4 h-4 text-primary" />
                        ) : (
                          <Plus className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                        )}
                      </div>
                      <p className="text-sm font-bold text-slate-900 leading-tight pr-6">{plan.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">{plan.company}</p>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(plan.id || '');
                      }}
                      className={cn(
                        "absolute bottom-4 right-4 p-1.5 rounded-lg transition-all duration-300 z-10",
                        favorites.includes(plan.id || '') 
                          ? "bg-amber-50 text-amber-500" 
                          : "bg-transparent text-slate-200 hover:text-slate-400 opacity-0 group-hover:opacity-100"
                      )}
                    >
                      <Star className={cn("w-3.5 h-3.5", favorites.includes(plan.id || '') && "fill-current")} />
                    </button>
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-slate-500 font-medium">Loading insurance plans...</p>
                  </div>
                ) : selectedPlanIds.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="overflow-x-auto"
                  >
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr>
                          <th className="py-5 px-6 bg-slate-50/50 border-b border-slate-100 min-w-[200px]">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Comparison Metric</span>
                          </th>
                          {sortedPlans.map(plan => (
                            <th key={plan.id} className="py-5 px-6 bg-slate-50/50 border-b border-slate-100 min-w-[250px]">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{plan.company}</span>
                                <span className="text-lg font-black text-slate-900 leading-tight">{plan.name}</span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {METRICS.map((metric) => (
                          <tr key={metric.key} className="group hover:bg-slate-50/30 transition-colors">
                            <td className="py-5 px-6">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{metric.label}</span>
                                <Tooltip content={metric.tooltip}>
                                  <Info className="w-3.5 h-3.5 text-slate-300 cursor-help" />
                                </Tooltip>
                              </div>
                            </td>
                            {sortedPlans.map(plan => {
                              const isBest = getIsBestInRow(plan.id || '', metric.key);
                              return (
                                <td key={plan.id} className="py-5 px-6">
                                  <div className="flex items-center gap-3">
                                    <span className={cn(
                                      "text-lg font-black tracking-tight",
                                      isBest ? "text-emerald-600" : "text-slate-900"
                                    )}>
                                      {plan[metric.key as keyof InsurancePlan] as string}
                                    </span>
                                    {isBest && (
                                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase tracking-widest rounded-md">Best</span>
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                        <tr>
                          <td className="py-5 px-6">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Features</span>
                          </td>
                          {sortedPlans.map(plan => (
                            <td key={plan.id} className="py-5 px-6">
                              <ul className="space-y-2">
                                {plan.keyFeatures.map((feature, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </motion.div>
                ) : (
                  <div className="bg-slate-50 rounded-[2rem] p-12 text-center border border-dashed border-slate-200">
                    <Shield className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No Plans Selected</h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">Select up to 3 insurance plans from the grid above to compare their features and premiums.</p>
                  </div>
                )}
              </AnimatePresence>
            </section>

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
                items={insuranceTypes.map(type => ({
                  title: type.title,
                  description: type.description,
                  icon: type.icon,
                  details: type.details,
                  borderColor: type.color.includes('rose') ? '#F43F5E' : type.color.includes('sky') ? '#0EA5E9' : type.color.includes('blue') ? '#3B82F6' : '#F59E0B',
                  gradient: `linear-gradient(145deg, ${type.color.includes('rose') ? '#F43F5E' : type.color.includes('sky') ? '#0EA5E9' : type.color.includes('blue') ? '#3B82F6' : '#F59E0B'}, #000)`
                }))}
              />
            </section>

            {/* HLV Calculator Section */}
            <section id="hlv-calculator" className="scroll-mt-24">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Human Life Value Calculator</h2>
                <p className="text-slate-500 mt-1">Determine the ideal life cover required to secure your family's future.</p>
              </div>
              <HLVCalculator />
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-200">
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
                <Calculator className="w-5 h-5 text-primary" />
                Quick Tools
              </h3>
              <div className="space-y-4">
                <a 
                  href="#hlv-calculator"
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-primary transition-colors">
                      <Heart className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">HLV Calculator</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </a>
                <a 
                  href="#plan-comparison"
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-primary transition-colors">
                      <Scale className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">Plan Comparison</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </a>
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
