import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Info, BarChart3, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';
import BlurText from '@/src/components/BlurText';
import { GoogleGenAI } from "@google/genai";
import { cn } from '@/src/lib/utils';

export default function InvestmentROI() {
  const [initialInvestment, setInitialInvestment] = useState<number>(100000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(10000);
  const [timePeriod, setTimePeriod] = useState<number>(10);
  const [returnRate, setReturnRate] = useState<number>(12);
  const [stepUpPercent, setStepUpPercent] = useState<number>(10);
  const [finalValue, setFinalValue] = useState<number>(0);
  const [totalInvested, setTotalInvested] = useState<number>(0);
  const [marketContext, setMarketContext] = useState<string>('');
  const [isLoadingContext, setIsLoadingContext] = useState(false);

  useEffect(() => {
    calculateROI();
  }, [initialInvestment, monthlyContribution, timePeriod, returnRate, stepUpPercent]);

  const calculateROI = () => {
    const monthlyRate = returnRate / 100 / 12;
    const months = timePeriod * 12;
    
    let currentBalance = initialInvestment;
    let currentMonthlyContribution = monthlyContribution;
    let invested = initialInvestment;

    for (let month = 1; month <= months; month++) {
      // Add interest to current balance
      currentBalance = currentBalance * (1 + monthlyRate);
      
      // Add contribution
      currentBalance += currentMonthlyContribution;
      invested += currentMonthlyContribution;

      // Annual step-up
      if (month % 12 === 0 && month < months) {
        currentMonthlyContribution = currentMonthlyContribution * (1 + (stepUpPercent / 100));
      }
    }
    
    setFinalValue(currentBalance);
    setTotalInvested(invested);
  };

  const fetchMarketContext = async () => {
    setIsLoadingContext(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "What are the current Nifty 50 year-to-date returns and what is the consensus forecast for the Indian stock market for the remainder of 2024?",
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
          <div className="bg-slate-900 p-8 md:p-12 text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-slate-900">
                <BarChart3 className="w-6 h-6" />
              </div>
              <BlurText 
                text="Investment ROI Calculator"
                centered={false}
                className="text-3xl font-black"
              />
            </div>
            <p className="text-slate-400 max-w-2xl leading-relaxed">
              Project your wealth growth in India. Calculate the potential return on your investments based on initial capital, recurring SIPs, and market performance.
            </p>
          </div>

          <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">
                  Initial Investment (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">
                  Monthly SIP (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">
                    Years
                  </label>
                  <input
                    type="number"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">
                    Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={returnRate}
                    onChange={(e) => setReturnRate(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">
                  Annual SIP Step-up (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={stepUpPercent}
                    onChange={(e) => setStepUpPercent(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                </div>
                <p className="mt-2 text-[10px] text-slate-500 font-medium italic">
                  Increasing your SIP amount every year as your income grows is the fastest way to build wealth.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center bg-slate-900 rounded-3xl p-8 text-center text-white">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Projected Portfolio Value</p>
              <motion.p
                key={finalValue}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl md:text-5xl font-black text-primary mb-6"
              >
                ₹{finalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </motion.p>
              <div className="w-full h-px bg-slate-800 mb-6" />
              <div className="space-y-3 w-full text-xs font-bold uppercase tracking-wider">
                <div className="flex justify-between text-slate-400">
                  <span>Total Invested</span>
                  <span className="text-white">₹{totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Gain</span>
                  <span className="text-emerald-400">
                    +₹{(finalValue - totalInvested).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Market Insights */}
          <div className="border-t border-slate-100 p-8 md:p-12 bg-primary/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-black text-slate-900">Indian Market Performance</h3>
              </div>
              <button
                onClick={fetchMarketContext}
                disabled={isLoadingContext}
                className="text-xs font-black uppercase tracking-widest bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                {isLoadingContext ? 'Fetching...' : 'Get Nifty 50 Data'}
              </button>
            </div>
            
            {marketContext ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-100 text-slate-600 leading-relaxed text-sm shadow-sm">
                {marketContext}
              </div>
            ) : (
              <div className="flex items-center gap-3 text-slate-500 text-sm italic">
                <Info className="w-4 h-4" />
                Get real-time Nifty 50 data and Indian market forecasts powered by Google Search.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
