import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PiggyBank, Info, TrendingUp, Target } from 'lucide-react';
import { motion } from 'motion/react';
import BlurText from '@/src/components/BlurText';
import { GoogleGenAI } from "@google/genai";
import { cn } from '@/src/lib/utils';

export default function RetirementPlanner() {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [currentSavings, setCurrentSavings] = useState<number>(500000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(20000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [adjustForInflation, setAdjustForInflation] = useState<boolean>(true);
  const [projectedSavings, setProjectedSavings] = useState<number>(0);
  const [inflationAdjustedValue, setInflationAdjustedValue] = useState<number>(0);
  const [marketContext, setMarketContext] = useState<string>('');
  const [isLoadingContext, setIsLoadingContext] = useState(false);

  useEffect(() => {
    calculateRetirement();
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn, inflationRate, adjustForInflation]);

  const calculateRetirement = () => {
    const yearsToRetire = retirementAge - currentAge;
    if (yearsToRetire <= 0) {
      setProjectedSavings(currentSavings);
      setInflationAdjustedValue(currentSavings);
      return;
    }

    const monthlyRate = expectedReturn / 100 / 12;
    const months = yearsToRetire * 12;
    
    // Future value of current savings
    const fvCurrent = currentSavings * Math.pow(1 + monthlyRate, months);
    
    // Future value of monthly contributions
    const fvContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    const totalFV = fvCurrent + fvContributions;
    setProjectedSavings(totalFV);

    // Inflation adjustment: FV / (1 + inflation)^years
    const adjusted = totalFV / Math.pow(1 + (inflationRate / 100), yearsToRetire);
    setInflationAdjustedValue(adjusted);
  };

  const fetchMarketContext = async () => {
    setIsLoadingContext(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "What are the current NPS and EPF interest rates in India for 2024? Mention recommended retirement savings targets for Indian professionals and inflation expectations.",
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      setMarketContext(response.text || 'Unable to fetch current market data.');
    } catch (error) {
      console.error('Error fetching market context:', error);
      setMarketContext('Error loading market data. Please try again later.');
    } finally {
      setIsLoadingContext(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Insights
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-primary p-8 md:p-12 text-slate-900">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                <PiggyBank className="w-6 h-6" />
              </div>
              <BlurText 
                text="Retirement Planner"
                centered={false}
                className="text-3xl font-black"
              />
            </div>
            <p className="text-slate-700 max-w-2xl leading-relaxed font-medium">
              Visualize your financial future in India. See how your EPF, NPS, and personal savings grow over time to meet your retirement goals.
            </p>
          </div>

          <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">
                    Current Age
                  </label>
                  <input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">
                    Retirement Age
                  </label>
                  <input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">
                  Current Savings (₹)
                </label>
                <input
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">
                  Monthly Contribution (₹)
                </label>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">
                  Expected Return (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">
                    Inflation Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={adjustForInflation}
                      onChange={(e) => setAdjustForInflation(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-900 transition-colors">
                      Adjust for Inflation
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center bg-primary/5 rounded-3xl p-8 border border-primary/10 text-center">
              <Target className="w-8 h-8 text-primary mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2">Projected Corpus at Age {retirementAge}</p>
              <motion.p
                key={adjustForInflation ? inflationAdjustedValue : projectedSavings}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl md:text-5xl font-black text-slate-900 mb-2"
              >
                ₹{(adjustForInflation ? inflationAdjustedValue : projectedSavings).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </motion.p>
              {adjustForInflation && (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                  In Today's Purchasing Power (₹{projectedSavings.toLocaleString('en-IN', { maximumFractionDigits: 0 })} actual)
                </p>
              )}
              {!adjustForInflation && <div className="mb-6" />}
              <div className="w-full h-px bg-primary/20 mb-6" />
              <div className="space-y-3 w-full text-xs font-bold text-slate-600 uppercase tracking-wider">
                <div className="flex justify-between">
                  <span>Total Contributed</span>
                  <span className="text-slate-900">₹{(currentSavings + (monthlyContribution * (retirementAge - currentAge) * 12)).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Earned</span>
                  <span className="text-primary">
                    ₹{(projectedSavings - (currentSavings + (monthlyContribution * (retirementAge - currentAge) * 12))).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI BHP Finance Insights */}
          <div className="border-t border-slate-100 p-8 md:p-12 bg-slate-50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-black text-slate-900">Retirement Context (India)</h3>
              </div>
              <button
                onClick={fetchMarketContext}
                disabled={isLoadingContext}
                className="text-xs font-black uppercase tracking-widest bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                {isLoadingContext ? 'Fetching...' : 'Get 2024 Benchmarks'}
              </button>
            </div>
            
            {marketContext ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-100 text-slate-600 leading-relaxed text-sm shadow-sm">
                {marketContext}
              </div>
            ) : (
              <div className="flex items-center gap-3 text-slate-500 text-sm italic">
                <Info className="w-4 h-4" />
                Get the latest 2024 Indian retirement benchmarks and rates powered by Google Search.
              </div>
            )}
          </div>

          {/* Recommended Resources */}
          <div className="border-t border-slate-100 p-8 md:p-12">
            <h3 className="text-xl font-black text-slate-900 mb-6">Explore Retirement Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link 
                to="/articles/26"
                className="group p-6 rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all bg-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">NPS Focus</span>
                  <TrendingUp className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">NPS & APY Optimization</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Learn how to maximize your retirement benefits through the National Pension System and Atal Pension Yojana.</p>
              </Link>

              <Link 
                to="/articles/2"
                className="group p-6 rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all bg-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-sky-50 text-sky-600 text-[10px] font-black uppercase tracking-widest rounded-full">PPF & EPF</span>
                  <PiggyBank className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">NPS vs EPF vs PPF Guide</h4>
                <p className="text-xs text-slate-500 leading-relaxed">A deep dive into India's most popular retirement vehicles, comparing tax efficiency and long-term potential.</p>
              </Link>
            </div>
            
            <div className="mt-8 text-center">
              <Link 
                to="/guides/retirement"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
              >
                View Full Retirement Roadmap <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
