import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calculator, Info, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '@/src/lib/utils';

export default function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(5000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [loanTerm, setLoanTerm] = useState<number>(20);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [marketContext, setMarketContext] = useState<string>('');
  const [isLoadingContext, setIsLoadingContext] = useState(false);

  useEffect(() => {
    calculatePayment();
  }, [loanAmount, interestRate, loanTerm]);

  const calculatePayment = () => {
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const payment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    setMonthlyPayment(isNaN(payment) ? 0 : payment);
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
          <ArrowLeft className="w-4 h-4" /> Back to Insights
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-slate-900 p-8 md:p-12 text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-slate-900">
                <Calculator className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-black">Home Loan Calculator</h1>
            </div>
            <p className="text-slate-400 max-w-2xl leading-relaxed">
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
                  Loan Term (Years)
                </label>
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-lg font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none"
                >
                  <option value={5}>5 Years</option>
                  <option value={10}>10 Years</option>
                  <option value={15}>15 Years</option>
                  <option value={20}>20 Years</option>
                  <option value={25}>25 Years</option>
                  <option value={30}>30 Years</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-4">Estimated Monthly EMI</p>
              <motion.p
                key={monthlyPayment}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl md:text-6xl font-black text-slate-900 mb-6"
              >
                ₹{monthlyPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </motion.p>
              <div className="w-full h-px bg-slate-200 mb-6" />
              <div className="space-y-3 w-full text-sm font-medium text-slate-600">
                <div className="flex justify-between">
                  <span>Total Principal</span>
                  <span className="text-slate-900 font-bold">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Interest</span>
                  <span className="text-slate-900 font-bold">
                    ₹{((monthlyPayment * loanTerm * 12) - loanAmount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Cost</span>
                  <span className="text-slate-900 font-bold">
                    ₹{(monthlyPayment * loanTerm * 12).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
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
                <h3 className="text-xl font-black text-slate-900">India Market Insights</h3>
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
