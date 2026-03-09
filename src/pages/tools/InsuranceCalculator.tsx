import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Info, AlertCircle, CheckCircle2, ArrowRight, TrendingUp, Sparkles, Plus, Trash2, Scale, RefreshCcw, Loader2 } from 'lucide-react';
import BlurText from '@/src/components/BlurText';
import { cn } from '@/src/lib/utils';
import { GoogleGenAI } from "@google/genai";

interface PolicyComparison {
  id: string;
  provider: string;
  type: string;
  premium: number;
  coverage: number;
}

export default function InsuranceCalculator() {
  const [income, setIncome] = useState<number>(1200000);
  const [years, setYears] = useState<number>(20);
  const [mortgage, setMortgage] = useState<number>(5000000);
  const [otherDebts, setOtherDebts] = useState<number>(500000);
  const [education, setEducation] = useState<number>(2500000);
  const [savings, setSavings] = useState<number>(1000000);
  const [calculationMethod, setCalculationMethod] = useState<'DIME' | 'HLV'>('DIME');
  const [marketContext, setMarketContext] = useState<string>('');
  const [isLoadingContext, setIsLoadingContext] = useState(false);

  // Comparison State
  const [comparisons, setComparisons] = useState<PolicyComparison[]>([]);
  const [newProvider, setNewProvider] = useState('');
  const [newType, setNewType] = useState('Term Life');
  const [newPremium, setNewPremium] = useState<number>(0);
  const [newCoverage, setNewCoverage] = useState<number>(0);

  const fetchMarketContext = async () => {
    setIsLoadingContext(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "What are the current trends in the Indian insurance market for 2024? Mention term insurance rates, health insurance medical inflation in India, and any new IRDAI regulations that benefit policyholders.",
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      setMarketContext(response.text || "Market data currently unavailable.");
    } catch (error) {
      console.error('Market Context Error:', error);
      setMarketContext("Unable to fetch live market context.");
    } finally {
      setIsLoadingContext(false);
    }
  };

  useEffect(() => {
    fetchMarketContext();
  }, []);

  const addComparison = () => {
    if (!newProvider) return;
    const newItem: PolicyComparison = {
      id: Math.random().toString(36).substr(2, 9),
      provider: newProvider,
      type: newType,
      premium: newPremium,
      coverage: newCoverage,
    };
    setComparisons([...comparisons, newItem]);
    setNewProvider('');
    setNewPremium(0);
    setNewCoverage(0);
  };

  const removeComparison = (id: string) => {
    setComparisons(comparisons.filter(c => c.id !== id));
  };

  const dimeNeeds = (income * years) + mortgage + otherDebts + education - savings;
  const hlvNeeds = (income * 0.7) * years; // Simplified HLV: 70% of income for X years
  const recommendedCoverage = Math.max(0, calculationMethod === 'DIME' ? dimeNeeds : hlvNeeds);

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
          <div>
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <BlurText 
              text="Insurance Coverage Assessment"
              className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight"
            />
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              Protect what matters most. Use our advanced calculators to determine the ideal coverage for your family's security and peace of mind.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setCalculationMethod('DIME')}
                className={cn(
                  "px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                  calculationMethod === 'DIME' ? "bg-primary text-slate-900 shadow-lg shadow-primary/20" : "bg-slate-50 text-slate-400 border border-slate-200 hover:border-primary/50"
                )}
              >
                DIME Method
              </button>
              <button
                onClick={() => setCalculationMethod('HLV')}
                className={cn(
                  "px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                  calculationMethod === 'HLV' ? "bg-primary text-slate-900 shadow-lg shadow-primary/20" : "bg-slate-50 text-slate-400 border border-slate-200 hover:border-primary/50"
                )}
              >
                HLV Method
              </button>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1200&h=675" 
                alt="Insurance Protection" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {calculationMethod === 'DIME' 
              ? "Calculate needs based on Debt, Income, Mortgage, and Education."
              : "Human Life Value (HLV) estimates the economic value of a person's life to their family."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                Annual Income Replacement
                <Info className="w-3 h-3 text-slate-400" />
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-bold"
                />
              </div>
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Years of Replacement: {years}</label>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Home Loan Balance</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={mortgage}
                    onChange={(e) => setMortgage(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Other Debts</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={otherDebts}
                    onChange={(e) => setOtherDebts(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-bold"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Future Education Costs</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={education}
                  onChange={(e) => setEducation(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Existing Savings/Life Insurance</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={savings}
                  onChange={(e) => setSavings(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-bold"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <div className="bg-primary rounded-3xl p-8 text-slate-900 shadow-xl border border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Shield className="w-32 h-32 text-slate-900" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] mb-4">Recommended Coverage</h3>
                <div className="text-5xl font-black mb-2 tracking-tighter">
                  ₹{recommendedCoverage.toLocaleString('en-IN')}
                </div>
                <p className="text-slate-800 text-sm leading-relaxed">
                  This is the estimated total amount of life insurance coverage needed to protect your dependents and clear all major liabilities.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                {calculationMethod === 'DIME' ? 'Coverage Breakdown' : 'HLV Breakdown'}
              </h3>
              <div className="space-y-4">
                {calculationMethod === 'DIME' ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Income Replacement</span>
                      <span className="font-bold text-slate-900">₹{(income * years).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Debt & Home Loan</span>
                      <span className="font-bold text-slate-900">₹{(mortgage + otherDebts).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Education Fund</span>
                      <span className="font-bold text-slate-900">₹{education.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Less Existing Assets</span>
                      <span className="font-bold text-rose-500">-₹{savings.toLocaleString('en-IN')}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Annual Income</span>
                      <span className="font-bold text-slate-900">₹{income.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Personal Expenses (30%)</span>
                      <span className="font-bold text-rose-500">-₹{(income * 0.3).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Net Annual Contribution</span>
                      <span className="font-bold text-slate-900">₹{(income * 0.7).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Years of Protection</span>
                      <span className="font-bold text-slate-900">{years} Years</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-primary/10 rounded-3xl p-6 border border-primary/20 flex gap-4">
              <AlertCircle className="w-6 h-6 text-primary shrink-0" />
              <div>
                <p className="text-sm font-bold text-slate-900 mb-1">Expert Tip</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Consider Term Life insurance for high coverage at low cost during your peak earning years. Whole Life may be suitable for permanent needs and estate planning.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Provider & Policy Comparison Section */}
        <div className="mt-16 bg-white rounded-3xl p-10 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Provider & Policy Comparison</h2>
              <p className="text-slate-500 text-sm">Compare quotes and features from different insurance providers.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="md:col-span-1">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Provider</label>
              <input
                type="text"
                value={newProvider}
                onChange={(e) => setNewProvider(e.target.value)}
                placeholder="e.g. LIC or HDFC Life"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm font-bold"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Policy Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm font-bold bg-white"
              >
                <option>Term Life</option>
                <option>Whole Life</option>
                <option>Health (Base Plan)</option>
                <option>Health (Super Top-up)</option>
                <option>Disability</option>
                <option>Umbrella</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Monthly Premium</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                <input
                  type="number"
                  value={newPremium || ''}
                  onChange={(e) => setNewPremium(Number(e.target.value))}
                  placeholder="0"
                  className="w-full pl-7 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm font-bold"
                />
              </div>
            </div>
            <div className="md:col-span-1 flex items-end">
              <button
                onClick={addComparison}
                className="w-full bg-primary text-slate-900 font-black py-2 rounded-xl text-sm hover:brightness-110 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add to List
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Provider</th>
                  <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Monthly Cost</th>
                  <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence initial={false}>
                  {comparisons.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400 text-sm italic">
                        No policies added for comparison yet.
                      </td>
                    </tr>
                  ) : (
                    comparisons.map((item) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="group hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 font-bold text-slate-900">{item.provider}</td>
                        <td className="py-4">
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {item.type}
                          </span>
                        </td>
                        <td className="py-4 font-black text-slate-900">₹{item.premium.toLocaleString('en-IN')}</td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => removeComparison(item.id)}
                            className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Insurance Info Section */}
        <div className="mt-16 bg-white rounded-3xl p-10 border border-slate-200 shadow-sm">
          <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Understanding Insurance Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Life Insurance</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Protects your family's financial future. <strong>Term Life</strong> is affordable and lasts for a set period. <strong>Whole Life</strong> builds cash value and lasts forever.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Health Insurance</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Covers medical expenses. Look for <strong>HSA-compatible</strong> plans to save for future costs tax-free. High-deductible plans often have lower premiums.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Disability Insurance</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Replaces your income if you can't work due to illness or injury. Often called <strong>"Income Protection"</strong>, it's vital for anyone relying on a paycheck.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-slate-100">
            <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Term vs. Whole Life Comparison</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Term Life Insurance</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-sm text-slate-900">Lower Premiums</p>
                      <p className="text-xs text-slate-600">Most affordable way to get high coverage amounts.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-sm text-slate-900">Fixed Duration</p>
                      <p className="text-xs text-slate-600">Coverage lasts for 10, 20, or 30 years.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-sm text-slate-900">Pure Protection</p>
                      <p className="text-xs text-slate-600">No cash value component; focuses solely on death benefit.</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Best For</p>
                  <p className="text-sm text-blue-900 font-medium">Young families, mortgage protection, and income replacement during peak years.</p>
                </div>
              </div>

              <div className="bg-primary rounded-2xl p-8 text-slate-900 border border-primary/20 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-slate-900">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold">Whole Life Insurance</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-slate-900 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-sm">Lifetime Coverage</p>
                      <p className="text-xs text-slate-800">Guaranteed to last your entire life as long as premiums are paid.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-slate-900 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-sm">Cash Value Accumulation</p>
                      <p className="text-xs text-slate-800">A portion of your premium builds tax-deferred cash value.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-slate-900 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-sm">Fixed Premiums</p>
                      <p className="text-xs text-slate-800">Your monthly cost will never increase, regardless of age or health.</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-8 p-4 bg-white/10 rounded-xl border border-white/20">
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Best For</p>
                  <p className="text-sm text-slate-800 font-medium">Estate planning, final expenses, and high-net-worth wealth transfer.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Tax Benefits under Section 80D</h3>
            <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 mb-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-emerald-900 mb-4">Why Health Insurance is a Tax-Saving Tool</h4>
                  <p className="text-slate-700 text-sm leading-relaxed mb-4">
                    In India, premiums paid for health insurance policies are eligible for tax deductions under Section 80D of the Income Tax Act.
                  </p>
                  <ul className="space-y-3 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span><strong>Self & Family:</strong> Deduction up to ₹25,000 for self, spouse, and dependent children.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span><strong>Parents:</strong> Additional deduction up to ₹25,000 for parents (₹50,000 if they are senior citizens).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span><strong>Preventive Check-ups:</strong> Includes a sub-limit of ₹5,000 for preventive health check-ups.</span>
                    </li>
                  </ul>
                </div>
                <div className="w-full md:w-64 bg-white rounded-2xl p-6 shadow-sm border border-emerald-200">
                  <div className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2">Max Deduction Limits</div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase font-bold">Below 60 Years</div>
                      <div className="text-2xl font-black text-slate-900">₹25,000</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase font-bold">Senior Citizens</div>
                      <div className="text-2xl font-black text-slate-900">₹50,000</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Why Insurance Matters</h3>
            <div className="prose prose-slate max-w-none">
              <p>
                Insurance is the foundation of a solid financial plan. Without it, a single unexpected event—a medical emergency, a car accident, or the loss of a breadwinner—can wipe out years of savings and investment growth.
              </p>
              <p>
                At BHP Finance, we recommend a "Protection First" approach. Before aggressively investing in the market, ensure you have:
              </p>
              <ul>
                <li><strong>Adequate Life Insurance:</strong> To clear debts and provide for dependents.</li>
                <li><strong>Comprehensive Health Coverage:</strong> To prevent medical bankruptcy.</li>
                <li><strong>Disability Insurance:</strong> To protect your most valuable asset—your earning potential.</li>
                <li><strong>Umbrella Liability:</strong> For an extra layer of protection against lawsuits.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* AI Market Context */}
        <div className="mt-16 bg-primary rounded-3xl p-10 text-slate-900 border border-primary/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="w-32 h-32 text-slate-900" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-primary/20">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Live Market Context</h3>
                  <p className="text-slate-900 text-xs font-bold uppercase tracking-widest">India Insurance Outlook 2024</p>
                </div>
              </div>
              <button 
                onClick={fetchMarketContext}
                disabled={isLoadingContext}
                className="p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
              >
                <RefreshCcw className={cn("w-5 h-5 text-slate-900", isLoadingContext && "animate-spin")} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {isLoadingContext ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 flex flex-col items-center justify-center gap-4"
                >
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-slate-900 text-sm font-bold uppercase tracking-[0.2em]">Analyzing Market Data...</p>
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose max-w-none prose-p:text-slate-800 prose-p:leading-relaxed"
                >
                  <div className="bg-white/20 rounded-2xl p-6 border border-white/20">
                    <p className="text-sm md:text-base whitespace-pre-wrap">{marketContext}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 pt-8 border-t border-slate-900/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-800 uppercase tracking-widest">
                <Info className="w-3 h-3" />
                Data sourced via Google Search Grounding
              </div>
              <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                Updated Real-time
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
