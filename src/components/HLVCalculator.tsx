import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calculator, Shield, Heart, IndianRupee, Info, TrendingUp, Briefcase } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function HLVCalculator() {
  const [annualIncome, setAnnualIncome] = useState<number>(1000000);
  const [annualExpenses, setAnnualExpenses] = useState<number>(600000);
  const [liabilities, setLiabilities] = useState<number>(5000000);
  const [currentAssets, setCurrentAssets] = useState<number>(1000000);
  const [yearsToRetire, setYearsToRetire] = useState<number>(25);

  const results = useMemo(() => {
    // Basic HLV = (Annual Income - Annual Expenses) * Years to Retire + Liabilities - Assets
    // A more common thumb rule for term insurance is (Annual Income * 15) + Liabilities - Assets
    
    const incomeReplacement = (annualIncome - annualExpenses) * yearsToRetire;
    const totalRequired = incomeReplacement + liabilities - currentAssets;
    
    // Multiplier method (15x-20x income)
    const multiplierMethod = (annualIncome * 15) + liabilities - currentAssets;

    return {
      incomeReplacement,
      totalRequired: Math.max(totalRequired, multiplierMethod), // Take the higher for safety
      multiplierMethod
    };
  }, [annualIncome, annualExpenses, liabilities, currentAssets, yearsToRetire]);

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex items-center gap-3">
        <div className="p-2 bg-rose-50 rounded-lg">
          <Heart className="w-5 h-5 text-rose-600" />
        </div>
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Human Life Value (HLV) Calculator</h3>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Controls */}
        <div className="space-y-8">
          {/* Annual Income */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <IndianRupee className="w-3 h-3" />
                Annual Income
              </label>
              <span className="text-lg font-black text-primary">₹{(annualIncome / 100000).toFixed(1)}L</span>
            </div>
            <input
              type="range"
              min="200000"
              max="5000000"
              step="100000"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Annual Expenses */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="w-3 h-3" />
                Annual Personal Expenses
              </label>
              <span className="text-lg font-black text-rose-500">₹{(annualExpenses / 100000).toFixed(1)}L</span>
            </div>
            <input
              type="range"
              min="100000"
              max={annualIncome}
              step="50000"
              value={annualExpenses}
              onChange={(e) => setAnnualExpenses(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>

          {/* Liabilities */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-3 h-3" />
                Total Liabilities (Loans)
              </label>
              <span className="text-lg font-black text-slate-900">₹{(liabilities / 100000).toFixed(1)}L</span>
            </div>
            <input
              type="range"
              min="0"
              max="20000000"
              step="500000"
              value={liabilities}
              onChange={(e) => setLiabilities(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
          </div>

          {/* Current Assets */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-3 h-3" />
                Existing Assets (FD, MF, etc.)
              </label>
              <span className="text-lg font-black text-emerald-600">₹{(currentAssets / 100000).toFixed(1)}L</span>
            </div>
            <input
              type="range"
              min="0"
              max="10000000"
              step="100000"
              value={currentAssets}
              onChange={(e) => setCurrentAssets(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-50 rounded-[2rem] p-8 flex flex-col justify-center">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Income Replacement Needed</p>
              <p className="text-2xl font-black text-slate-900">₹{(results.incomeReplacement / 10000000).toFixed(2)} Cr</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Liability Coverage</p>
              <p className="text-2xl font-black text-rose-600">₹{(liabilities / 10000000).toFixed(2)} Cr</p>
            </div>
            <div className="pt-6 border-t border-slate-200">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Recommended Life Cover (Sum Assured)</p>
              <p className="text-4xl font-black text-slate-900">₹{(results.totalRequired / 10000000).toFixed(2)} Cr</p>
              <p className="text-[10px] text-slate-400 mt-2 font-bold italic">
                *This is the minimum Term Insurance you should have.
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white rounded-2xl border border-slate-200 flex items-start gap-3">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Human Life Value (HLV) is the present value of all future income you expect to earn. It ensures your family can maintain their lifestyle and pay off debts in your absence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
