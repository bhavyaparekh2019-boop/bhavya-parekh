import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calculator, TrendingUp, PieChart, ArrowRight, Info, RefreshCcw, Zap, Target, Coins, BarChart2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import BlurText from '@/components/BlurText';
import ChromaGrid from '@/components/ChromaGrid';
import { cn } from '@/lib/utils';

export default function LumpsumCalculator() {
  const [totalInvestment, setTotalInvestment] = useState(100000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [inflationRate, setInflationRate] = useState(6);
  const [results, setResults] = useState({
    investedAmount: 0,
    estimatedReturns: 0,
    totalValue: 0,
    realValue: 0
  });

  useEffect(() => {
    const P = totalInvestment;
    const r = expectedReturn / 100;
    const i = inflationRate / 100;
    const t = timePeriod;
    
    // Lumpsum Formula: A = P(1 + r)^t
    const totalValue = P * Math.pow(1 + r, t);
    const investedAmount = P;
    const estimatedReturns = totalValue - investedAmount;

    // Real Value (Inflation Adjusted): RV = A / (1 + i)^t
    const realValue = totalValue / Math.pow(1 + i, t);

    setResults({
      investedAmount: Math.round(investedAmount),
      estimatedReturns: Math.round(estimatedReturns),
      totalValue: Math.round(totalValue),
      realValue: Math.round(realValue)
    });
  }, [totalInvestment, expectedReturn, timePeriod, inflationRate]);

  const chartData = useMemo(() => {
    const data = [];
    const P = totalInvestment;
    const r = expectedReturn / 100;
    const i = inflationRate / 100;

    for (let year = 0; year <= timePeriod; year++) {
      const nominalValue = P * Math.pow(1 + r, year);
      const realValue = nominalValue / Math.pow(1 + i, year);
      data.push({
        year: `Yr ${year}`,
        nominal: Math.round(nominalValue),
        real: Math.round(realValue),
      });
    }
    return data;
  }, [totalInvestment, expectedReturn, timePeriod, inflationRate]);

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

                {/* Inflation Rate */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Inflation Rate (p.a)</label>
                    <span className="text-2xl font-black text-primary">{inflationRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>0%</span>
                    <span>15%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Chart */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-6 h-6 text-primary" />
                  Growth Projection
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nominal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-slate-300 rounded-full" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real (Inflation Adj.)</span>
                  </div>
                </div>
              </div>
              
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorNominal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="year" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis 
                      hide 
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), '']}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        borderRadius: '16px', 
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="nominal" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorNominal)" 
                      animationDuration={1500}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="real" 
                      stroke="#94a3b8" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorReal)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-6 text-[10px] text-slate-400 font-medium leading-relaxed italic text-center">
                The gap between the blue and grey lines represents the wealth eroded by inflation over {timePeriod} years.
              </p>
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
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1">Total Value (Nominal)</p>
                  <p className="text-4xl font-black text-slate-900">{formatCurrency(results.totalValue)}</p>
                </div>
                <div className="pt-4">
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1">Real Value (Inflation Adjusted)</p>
                  <p className="text-2xl font-bold text-slate-800">{formatCurrency(results.realValue)}</p>
                  <p className="text-[10px] text-slate-600 mt-1 font-medium italic">This is what your money will be worth in today's purchasing power.</p>
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
