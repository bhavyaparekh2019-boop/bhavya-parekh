import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calculator, TrendingUp, PieChart, ArrowRight, Info, RefreshCcw, Zap, Target, Coins } from 'lucide-react';
import BlurText from '@/components/BlurText';
import ChromaGrid from '@/components/ChromaGrid';
import { cn } from '@/lib/utils';

export default function LumpsumCalculator() {
  const [totalInvestment, setTotalInvestment] = useState(100000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [results, setResults] = useState({
    investedAmount: 0,
    estimatedReturns: 0,
    totalValue: 0
  });

  useEffect(() => {
    const P = totalInvestment;
    const r = expectedReturn / 100;
    const t = timePeriod;
    
    // Lumpsum Formula: A = P(1 + r)^t
    const totalValue = P * Math.pow(1 + r, t);
    const investedAmount = P;
    const estimatedReturns = totalValue - investedAmount;

    setResults({
      investedAmount: Math.round(investedAmount),
      estimatedReturns: Math.round(estimatedReturns),
      totalValue: Math.round(totalValue)
    });
  }, [totalInvestment, expectedReturn, timePeriod]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <BlurText 
            text="Lumpsum Calculator"
            centered={false}
            className="text-4xl font-bold text-slate-900 mb-4 tracking-tight"
          />
          <p className="text-lg text-slate-600">Calculate the future value of your one-time investment with our Lumpsum calculator.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Inputs */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="space-y-10">
                {/* Total Investment */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Total Investment</label>
                    <span className="text-2xl font-black text-primary">{formatCurrency(totalInvestment)}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="10000000"
                    step="5000"
                    value={totalInvestment}
                    onChange={(e) => setTotalInvestment(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>₹5,000</span>
                    <span>₹1,00,00,000</span>
                  </div>
                </div>

                {/* Expected Return Rate */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Expected Return Rate (p.a)</label>
                    <span className="text-2xl font-black text-primary">{expectedReturn}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="0.5"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>1%</span>
                    <span>30%</span>
                  </div>
                </div>

                {/* Time Period */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Time Period (Years)</label>
                    <span className="text-2xl font-black text-primary">{timePeriod} Yr</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>1 Yr</span>
                    <span>40 Yr</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Educational Content */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Info className="w-6 h-6 text-primary" />
                Lumpsum vs SIP
              </h2>
              <ChromaGrid 
                cols="grid-cols-1 md:grid-cols-2"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={[
                  {
                    title: 'One-Time Advantage',
                    description: 'Lumpsum investing allows you to put a large sum of money to work immediately, potentially capturing more market growth.',
                    icon: Coins,
                    details: [
                      'Ideal for bonuses or inheritance.',
                      'Full amount starts compounding immediately.',
                      'Better for undervalued markets.',
                      'Lower administrative overhead.'
                    ],
                    borderColor: '#3B82F6',
                    gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                  },
                  {
                    title: 'Market Timing',
                    description: 'While SIPs average out costs, Lumpsum investments benefit most when made during market corrections or dips.',
                    icon: Target,
                    details: [
                      'Requires more careful market entry.',
                      'Higher potential for short-term volatility.',
                      'Significant long-term wealth potential.',
                      'Best for surplus idle cash.'
                    ],
                    borderColor: '#0EA5E9',
                    gradient: 'linear-gradient(180deg, #0EA5E9, #000)'
                  }
                ]}
              />
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="space-y-8">
            <div className="bg-primary text-slate-900 p-10 rounded-[2.5rem] shadow-2xl sticky top-32">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-slate-900" />
                Investment Summary
              </h3>
              
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1">Invested Amount</p>
                  <p className="text-2xl font-bold">{formatCurrency(results.investedAmount)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1">Est. Returns</p>
                  <p className="text-2xl font-bold text-sky-700">+{formatCurrency(results.estimatedReturns)}</p>
                </div>
                <div className="pt-8 border-t border-slate-900/10">
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1">Total Value</p>
                  <p className="text-4xl font-black text-slate-900">{formatCurrency(results.totalValue)}</p>
                </div>
              </div>

              <button className="w-full bg-primary text-slate-900 font-black py-5 rounded-2xl text-sm uppercase tracking-widest mt-12 hover:brightness-110 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                Invest Lumpsum Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Wealth Tip
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                If you are worried about market volatility, consider a Systematic Transfer Plan (STP) to move your lumpsum from debt to equity gradually.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
