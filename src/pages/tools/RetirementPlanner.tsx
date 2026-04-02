import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  PiggyBank, 
  Info, 
  TrendingUp, 
  Target, 
  Calculator, 
  Wallet, 
  TrendingDown,
  Sparkles,
  RefreshCcw,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BlurText from '@/components/BlurText';
import { GoogleGenAI } from "@google/genai";
import { cn } from '@/lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

export default function RetirementPlanner() {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [currentSavings, setCurrentSavings] = useState<number>(1000000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(25000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [adjustForInflation, setAdjustForInflation] = useState<boolean>(true);
  
  const [marketContext, setMarketContext] = useState<string>('');
  const [isLoadingContext, setIsLoadingContext] = useState(false);

  // Calculate chart data and final results
  const { chartData, projectedSavings, inflationAdjustedValue, totalInvested } = useMemo(() => {
    const yearsToRetire = retirementAge - currentAge;
    const data = [];
    let currentCorpus = currentSavings;
    let currentInvested = currentSavings;
    
    const monthlyRate = expectedReturn / 100 / 12;

    // Initial point
    data.push({
      age: currentAge,
      corpus: Math.round(currentCorpus),
      invested: Math.round(currentInvested),
      realValue: Math.round(currentCorpus)
    });

    if (yearsToRetire > 0) {
      for (let year = 1; year <= yearsToRetire; year++) {
        for (let month = 1; month <= 12; month++) {
          currentCorpus = (currentCorpus + monthlyContribution) * (1 + monthlyRate);
          currentInvested += monthlyContribution;
        }
        
        // Inflation adjustment for this specific year
        const realValue = currentCorpus / Math.pow(1 + (inflationRate / 100), year);

        data.push({
          age: currentAge + year,
          corpus: Math.round(currentCorpus),
          invested: Math.round(currentInvested),
          realValue: Math.round(realValue)
        });
      }
    }

    return {
      chartData: data,
      projectedSavings: currentCorpus,
      inflationAdjustedValue: currentCorpus / Math.pow(1 + (inflationRate / 100), Math.max(0, yearsToRetire)),
      totalInvested: currentInvested
    };
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn, inflationRate]);

  const fetchMarketContext = async () => {
    setIsLoadingContext(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'undefined') {
        setMarketContext("Current NPS Tier-1 returns average 9-12% over 10 years. EPF rate for 2023-24 is 8.25%. Long-term inflation in India is expected to hover around 5-6%.");
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "What are the latest NPS and EPF interest rates in India for 2024-2025? Also mention the current inflation rate and recommended retirement corpus for a middle-class professional in a Tier-1 city.",
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      setMarketContext(response.text || 'Unable to fetch current market data.');
    } catch (error) {
      console.error('Error fetching market context:', error);
      setMarketContext('Current NPS Tier-1 returns average 9-12% over 10 years. EPF rate for 2023-24 is 8.25%. Long-term inflation in India is expected to hover around 5-6%.');
    } finally {
      setIsLoadingContext(false);
    }
  };

  useEffect(() => {
    fetchMarketContext();
  }, []);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 md:p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <PiggyBank className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Retirement Planner</h1>
              </div>

              <div className="space-y-8">
                {/* Age Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Age</label>
                    <input
                      type="number"
                      value={currentAge}
                      onChange={(e) => setCurrentAge(Math.max(18, Math.min(retirementAge - 1, Number(e.target.value))))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retirement Age</label>
                    <input
                      type="number"
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(Math.max(currentAge + 1, Math.min(100, Number(e.target.value))))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>

                {/* Current Savings */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Savings</label>
                    <span className="text-sm font-black text-primary">{formatCurrency(currentSavings)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50000000"
                    step="100000"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Monthly Contribution */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Contribution</label>
                    <span className="text-sm font-black text-primary">{formatCurrency(monthlyContribution)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="5000"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Expected Return */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected Return (p.a)</label>
                    <span className="text-sm font-black text-primary">{expectedReturn}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="0.5"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Inflation Rate */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inflation Rate</label>
                    <span className="text-sm font-black text-slate-400">{inflationRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.1"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-300"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setAdjustForInflation(!adjustForInflation)}
                    className={cn(
                      "w-full flex items-center justify-between px-6 py-4 rounded-2xl border transition-all font-bold text-xs uppercase tracking-widest",
                      adjustForInflation 
                        ? "bg-primary/10 border-primary text-primary" 
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    )}
                  >
                    Adjust for Inflation
                    <div className={cn(
                      "w-10 h-5 rounded-full relative transition-colors",
                      adjustForInflation ? "bg-primary" : "bg-slate-300"
                    )}>
                      <div className={cn(
                        "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                        adjustForInflation ? "right-1" : "left-1"
                      )} />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* AI Context Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="w-20 h-20 text-primary" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Market Context
                  </h3>
                  <button 
                    onClick={fetchMarketContext}
                    disabled={isLoadingContext}
                    className="text-white/50 hover:text-white transition-colors disabled:opacity-50"
                  >
                    <RefreshCcw className={cn("w-3 h-3", isLoadingContext && "animate-spin")} />
                  </button>
                </div>
                <AnimatePresence mode="wait">
                  {isLoadingContext ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-24 flex items-center justify-center"
                    >
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.p 
                      key="content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-slate-300 leading-relaxed font-medium"
                    >
                      {marketContext}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column: Visualization */}
          <div className="lg:col-span-8 space-y-8">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Projected Corpus</p>
                <h2 className="text-3xl font-black text-slate-900">{formatCurrency(projectedSavings)}</h2>
                <div className="mt-4 flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                  <TrendingUp className="w-3 h-3" />
                  At Age {retirementAge}
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Real Value (Today)</p>
                <h2 className="text-3xl font-black text-sky-600">{formatCurrency(inflationAdjustedValue)}</h2>
                <div className="mt-4 flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <TrendingDown className="w-3 h-3" />
                  Inflation Adjusted
                </div>
              </div>

              <div className="bg-primary p-8 rounded-[2.5rem] shadow-xl shadow-primary/20">
                <p className="text-[10px] font-black text-slate-900/50 uppercase tracking-widest mb-2">Total Invested</p>
                <h2 className="text-3xl font-black text-slate-900">{formatCurrency(totalInvested)}</h2>
                <div className="mt-4 flex items-center gap-2 text-slate-900/50 text-[10px] font-black uppercase tracking-widest">
                  <Wallet className="w-3 h-3" />
                  Principal Amount
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Corpus Growth Projection</h3>
                  <p className="text-sm text-slate-500 mt-1">Wealth accumulation over {retirementAge - currentAge} years</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Corpus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Invested</span>
                  </div>
                </div>
              </div>

              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCorpus" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e2e8f0" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#e2e8f0" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="age" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                      dy={10}
                    />
                    <YAxis 
                      hide 
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900 p-4 rounded-2xl shadow-2xl border border-white/10">
                              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Age {payload[0].payload.age}</p>
                              <div className="space-y-1">
                                <p className="text-sm font-black text-white">Corpus: {formatCurrency(payload[0].value as number)}</p>
                                <p className="text-xs font-bold text-slate-400">Invested: {formatCurrency(payload[1].value as number)}</p>
                                {adjustForInflation && (
                                  <p className="text-xs font-bold text-sky-400 mt-2 pt-2 border-t border-white/5">
                                    Real Value: {formatCurrency(payload[0].payload.realValue)}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="corpus" 
                      stroke="#fbbf24" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorCorpus)" 
                      animationDuration={1500}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="invested" 
                      stroke="#e2e8f0" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorInvested)" 
                      animationDuration={1500}
                    />
                    {adjustForInflation && (
                      <Area 
                        type="monotone" 
                        dataKey="realValue" 
                        stroke="#0ea5e9" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fill="transparent"
                        animationDuration={1500}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-start gap-6">
                <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 shrink-0">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">Step-Up Strategy</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Increasing your monthly contribution by just 10% every year can potentially double your final corpus.
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-start gap-6">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">Tax Efficiency</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Utilize Section 80C (EPF/ELSS) and 80CCD (NPS) to save up to ₹2 Lakhs in taxes annually while building wealth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
