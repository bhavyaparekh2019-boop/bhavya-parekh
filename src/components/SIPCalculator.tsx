import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calculator, TrendingUp, Calendar, IndianRupee, Info } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [timePeriod, setTimePeriod] = useState<number>(10);

  const results = useMemo(() => {
    const i = expectedReturn / 100 / 12;
    const n = timePeriod * 12;
    const totalInvested = monthlyInvestment * n;
    
    // SIP Formula: M = P × ({[1 + i]^n – 1} / i) × (1 + i)
    const maturityValue = monthlyInvestment * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalGains = maturityValue - totalInvested;

    return {
      totalInvested,
      maturityValue,
      totalGains
    };
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Calculator className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">SIP Calculator</h3>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Controls */}
        <div className="space-y-8">
          {/* Monthly Investment */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <IndianRupee className="w-3 h-3" />
                Monthly Investment
              </label>
              <span className="text-lg font-black text-primary">₹{monthlyInvestment.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="500"
              max="100000"
              step="500"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between mt-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
              <span>₹500</span>
              <span>₹1,00,000</span>
            </div>
          </div>

          {/* Expected Return */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-3 h-3" />
                Expected Return (p.a)
              </label>
              <span className="text-lg font-black text-primary">{expectedReturn}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="0.5"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between mt-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Time Period */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                Time Period (Years)
              </label>
              <span className="text-lg font-black text-primary">{timePeriod}Y</span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={timePeriod}
              onChange={(e) => setTimePeriod(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between mt-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
              <span>1Y</span>
              <span>40Y</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-50 rounded-[2rem] p-8 flex flex-col justify-center">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Invested</p>
              <p className="text-2xl font-black text-slate-900">₹{results.totalInvested.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Returns</p>
              <p className="text-2xl font-black text-emerald-600">₹{Math.round(results.totalGains).toLocaleString('en-IN')}</p>
            </div>
            <div className="pt-6 border-t border-slate-200">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Total Value</p>
              <p className="text-4xl font-black text-slate-900">₹{Math.round(results.maturityValue).toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white rounded-2xl border border-slate-200 flex items-start gap-3">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Based on historical data, equity mutual funds in India have delivered 12-15% returns over long periods. However, past performance is not a guarantee of future results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
