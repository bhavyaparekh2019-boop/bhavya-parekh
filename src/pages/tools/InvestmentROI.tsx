import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Info, BarChart3, DollarSign, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { motion } from 'motion/react';
import BlurText from '@/components/BlurText';
import { GoogleGenAI } from "@google/genai";
import { getGeminiClient, getApiKey } from '@/lib/gemini';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function InvestmentROI() {
  const [initialInvestment, setInitialInvestment] = useState<number>(100000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(10000);
  const [timePeriod, setTimePeriod] = useState<number>(10);
  const [returnRate, setReturnRate] = useState<number>(12);
  const [stepUpPercent, setStepUpPercent] = useState<number>(10);
  const [marketContext, setMarketContext] = useState<string>('');
  const [isLoadingContext, setIsLoadingContext] = useState(false);

  const { chartData, finalValue, totalInvested } = useMemo(() => {
    const monthlyRate = returnRate / 100 / 12;
    const months = timePeriod * 12;
    const data = [];
    
    let currentBalance = initialInvestment;
    let currentMonthlyContribution = monthlyContribution;
    let invested = initialInvestment;

    // Initial state
    data.push({
      year: 0,
      value: Math.round(currentBalance),
      invested: Math.round(invested)
    });

    for (let month = 1; month <= months; month++) {
      currentBalance = currentBalance * (1 + monthlyRate);
      currentBalance += currentMonthlyContribution;
      invested += currentMonthlyContribution;

      if (month % 12 === 0) {
        data.push({
          year: month / 12,
          value: Math.round(currentBalance),
          invested: Math.round(invested)
        });
        currentMonthlyContribution = currentMonthlyContribution * (1 + (stepUpPercent / 100));
      }
    }

    return {
      chartData: data,
      finalValue: currentBalance,
      totalInvested: invested
    };
  }, [initialInvestment, monthlyContribution, timePeriod, returnRate, stepUpPercent]);

  const fetchMarketContext = async () => {
    setIsLoadingContext(true);
    try {
      const apiKey = getApiKey();
      if (!apiKey || apiKey === '') {
        setMarketContext('Please configure your Gemini API key in settings to get real-time market data.');
        setIsLoadingContext(false);
        return;
      }
      const ai = getGeminiClient();
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
      setMarketContext('Market data is currently unavailable. Please try again later.');
    } finally {
      setIsLoadingContext(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="bg-primary p-6 text-slate-900">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <h1 className="text-xl font-black tracking-tight">ROI Calculator</h1>
                </div>
                <p className="text-slate-700 text-xs font-medium leading-relaxed">
                  Project your wealth growth in India based on SIPs and market returns.
                </p>
              </div>

              <div className="p-6 space-y-6">
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
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Market Context</h3>
                </div>
                <button
                  onClick={fetchMarketContext}
                  disabled={isLoadingContext}
                  className="text-[10px] font-black uppercase tracking-widest bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all disabled:opacity-50"
                >
                  {isLoadingContext ? '...' : 'Refresh'}
                </button>
              </div>
              
              {marketContext ? (
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  {marketContext}
                </p>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Click refresh to get real-time Nifty 50 data and Indian market forecasts.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Visualization & Results */}
          <div className="lg:col-span-2 space-y-8">
            {/* Results Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Projected Value</p>
                <h3 className="text-2xl font-black text-primary">₹{finalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Invested</p>
                <h3 className="text-2xl font-black text-slate-900">₹{totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Gain</p>
                <h3 className="text-2xl font-black text-emerald-600">+₹{(finalValue - totalInvested).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl h-[450px]">
              <div className="flex items-center gap-3 mb-8">
                <LineChartIcon className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Growth Projection</h3>
              </div>
              
              <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="year" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                      label={{ value: 'Years', position: 'insideBottom', offset: -5, fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                      tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        borderRadius: '16px', 
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}
                      formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']}
                    />
                    <Legend verticalAlign="top" height={36}/>
                    <Area 
                      name="Total Value"
                      type="monotone" 
                      dataKey="value" 
                      stroke="#fbbf24" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                    <Area 
                      name="Invested Amount"
                      type="monotone" 
                      dataKey="invested" 
                      stroke="#94a3b8" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fillOpacity={1} 
                      fill="url(#colorInvested)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mt-4">
                * Projections are based on historical market averages and do not guarantee future returns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
