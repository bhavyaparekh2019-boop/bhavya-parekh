import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calculator, Info, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import BlurText from '@/components/BlurText';
import { GoogleGenAI } from "@google/genai";
import { cn } from '@/lib/utils';

export default function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(5000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [loanTermMonths, setLoanTermMonths] = useState<number>(240);
  const [prepayment, setPrepayment] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalInterestSaved, setTotalInterestSaved] = useState<number>(0);
  const [monthsSaved, setMonthsSaved] = useState<number>(0);
  const [marketContext, setMarketContext] = useState<string>('');
  const [isLoadingContext, setIsLoadingContext] = useState(false);

  useEffect(() => {
    calculatePayment();
  }, [loanAmount, interestRate, loanTermMonths, prepayment]);

  const calculatePayment = () => {
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTermMonths;
    const emi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const calculatedEmi = isNaN(emi) ? 0 : emi;
    setMonthlyPayment(calculatedEmi);

    // Calculate savings with prepayment
    if (prepayment > 0 && calculatedEmi > 0) {
      let balance = loanAmount;
      let totalInterestWithPrepayment = 0;
      let monthCount = 0;
      const totalMonthlyPayment = calculatedEmi + prepayment;

      while (balance > 0 && monthCount < numberOfPayments) {
        const interest = balance * monthlyRate;
        totalInterestWithPrepayment += interest;
        const principal = Math.min(balance, totalMonthlyPayment - interest);
        balance -= principal;
        monthCount++;
      }

      const originalTotalInterest = (calculatedEmi * numberOfPayments) - loanAmount;
      setTotalInterestSaved(Math.max(0, originalTotalInterest - totalInterestWithPrepayment));
      setMonthsSaved(Math.max(0, numberOfPayments - monthCount));
    } else {
      setTotalInterestSaved(0);
      setMonthsSaved(0);
    }
  };

  const fetchMarketContext = async () => {
    setIsLoadingContext(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "What are the current average home loan interest rates in India (SBI, HDFC, ICICI) for 2024 and what is the brief market outlook for home buyers in Mumbai/India right now?",
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
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-primary p-8 md:p-12 text-slate-900">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                <Calculator className="w-6 h-6" />
              </div>
              <BlurText 
                text="Home Loan Calculator"
                centered={false}
                className="text-3xl font-black"
              />
            </div>
            <p className="text-slate-700 max-w-2xl leading-relaxed font-medium">
              Plan your home purchase in India with precision. Estimate your monthly EMIs based on current interest rates and loan terms.
            </p>
          </div>

          <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-black text-slate-900 uppercase tracking-widest mb-3">
                  Loan Amount (₹)
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-lg font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                />
                <input
                  type="range"
                  min="500000"
                  max="50000000"
                  step="100000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full mt-4 accent-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-slate-900 uppercase tracking-widest mb-3">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-lg font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                />
                <input
                  type="range"
                  min="5"
                  max="15"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full mt-4 accent-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-slate-900 uppercase tracking-widest mb-3">
                  Loan Tenure (Months)
                </label>
                <input
                  type="number"
                  value={loanTermMonths}
                  onChange={(e) => setLoanTermMonths(Number(e.target.value))}
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-lg font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                />
                <input
                  type="range"
                  min="12"
                  max="360"
                  step="1"
                  value={loanTermMonths}
                  onChange={(e) => setLoanTermMonths(Number(e.target.value))}
                  className="w-full mt-4 accent-primary"
                />
                <p className="mt-2 text-xs text-slate-500 font-medium italic">
                  {Math.floor(loanTermMonths / 12)} Years {loanTermMonths % 12} Months
                </p>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-900 uppercase tracking-widest mb-3">
                  Monthly Prepayment (₹)
                </label>
                <input
                  type="number"
                  value={prepayment}
                  onChange={(e) => setPrepayment(Number(e.target.value))}
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-lg font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                />
                <p className="mt-2 text-xs text-slate-500 font-medium italic">
                  Paying extra each month significantly reduces your interest and loan tenure.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-4">Estimated Monthly EMI</p>
              <motion.p
                key={monthlyPayment}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl md:text-6xl font-black text-slate-900 mb-6"
              >
                ₹{monthlyPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </motion.p>
              
              <div className="w-full h-px bg-slate-200 mb-6" />
              
              <div className="space-y-4 w-full text-sm font-medium text-slate-600">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Total Principal</span>
                  <span className="text-slate-900 font-black">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Total Interest Paid</span>
                  <span className="text-slate-900 font-black">
                    ₹{((monthlyPayment * loanTermMonths) - loanAmount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <span className="text-slate-900 font-black">Total Amount Paid</span>
                  <span className="text-primary font-black text-lg">
                    ₹{(monthlyPayment * loanTermMonths).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>

              {prepayment > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 w-full bg-sky-50 rounded-2xl p-6 border border-sky-100"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-sky-600" />
                    <p className="text-sky-800 font-black uppercase tracking-widest text-[10px]">Prepayment Benefits</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 text-left">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-sky-600 font-bold uppercase">Interest Saved</p>
                      <p className="text-lg font-black text-sky-900">₹{totalInterestSaved.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-sky-600 font-bold uppercase">Time Saved</p>
                      <p className="text-lg font-black text-sky-900">{Math.floor(monthsSaved / 12)}y {monthsSaved % 12}m</p>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-sky-200/50">
                      <p className="text-xs text-sky-600 font-bold uppercase">Total EMI Savings</p>
                      <p className="text-lg font-black text-emerald-600">₹{(monthsSaved * monthlyPayment).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-[9px] text-sky-600/70 font-bold uppercase tracking-widest text-center">
                    *Based on constant interest rate
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* AI BHP Finance Insights */}
          <div className="border-t border-slate-100 p-8 md:p-12 bg-primary/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-black text-slate-900">India BHP Finance Insights</h3>
              </div>
              <button
                onClick={fetchMarketContext}
                disabled={isLoadingContext}
                className="text-xs font-black uppercase tracking-widest bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                {isLoadingContext ? 'Fetching...' : 'Get Current Rates'}
              </button>
            </div>
            
            {marketContext ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-100 text-slate-600 leading-relaxed text-sm shadow-sm">
                {marketContext}
              </div>
            ) : (
              <div className="flex items-center gap-3 text-slate-500 text-sm italic">
                <Info className="w-4 h-4" />
                Click "Get Current Rates" to see live Indian mortgage data powered by Google Search.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
