import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calculator, TrendingUp, PieChart, ArrowRight, Info, RefreshCcw, Zap, Target } from 'lucide-react';
import BlurText from '@/src/components/BlurText';
import ChromaGrid from '@/src/components/ChromaGrid';
import { cn } from '@/src/lib/utils';

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [results, setResults] = useState({
    investedAmount: 0,
    estimatedReturns: 0,
    totalValue: 0
  });

  useEffect(() => {
    const P = monthlyInvestment;
    const i = expectedReturn / 100 / 12;
    const n = timePeriod * 12;
    
    // SIP Formula: M = P × ({[1 + i]^n – 1} / i) × (1 + i)
    const totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const investedAmount = P * n;
    const estimatedReturns = totalValue - investedAmount;

    setResults({
      investedAmount: Math.round(investedAmount),
      estimatedReturns: Math.round(estimatedReturns),
      totalValue: Math.round(totalValue)
    });
  }, [monthlyInvestment, expectedReturn, timePeriod]);

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
            text="SIP Calculator"
            centered={false}
            className="text-4xl font-bold text-slate-900 mb-4 tracking-tight"
          />
          <p className="text-lg text-slate-600">Plan your wealth creation journey with our Systematic Investment Plan calculator.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Inputs */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="space-y-10">
                {/* Monthly Investment */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Monthly Investment</label>
                    <span className="text-2xl font-black text-primary">{formatCurrency(monthlyInvestment)}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="100000"
                    step="500"
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>₹500</span>
                    <span>₹1,00,000</span>
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
                Why Start a SIP?
              </h2>
              <ChromaGrid 
                cols="grid-cols-1 md:grid-cols-2"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={[
                  {
                    title: 'Rupee Cost Averaging',
                    description: 'When markets are low, your SIP buys more units. When markets are high, it buys fewer. Over time, this averages out the cost of your investment.',
                    icon: RefreshCcw,
                    details: [
                      'Eliminates the need to time the market.',
                      'Lowers the average cost per unit.',
                      'Disciplined approach to investing.',
                      'Beneficial during market volatility.'
                    ],
                    borderColor: '#3B82F6',
                    gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                  },
                  {
                    title: 'Power of Compounding',
                    description: 'The returns you earn also start earning returns. The longer you stay invested, the more dramatic this effect becomes.',
                    icon: Zap,
                    details: [
                      'Exponential growth over long periods.',
                      'Earnings on your earnings.',
                      'Small amounts grow into large corpuses.',
                      'Time is the most important factor.'
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
                Start Investing Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <RefreshCcw className="w-5 h-5 text-primary" />
                Pro Tip
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Increase your SIP amount by just 10% every year (Step-up SIP) to reach your financial goals significantly faster.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
