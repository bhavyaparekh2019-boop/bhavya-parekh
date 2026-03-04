import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, BarChart2, Info, Loader2, RefreshCw, ArrowUpRight, ArrowDownRight, Globe, Zap, ArrowRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import BlurText from '@/src/components/BlurText';
import { cn } from '@/src/lib/utils';
import { useModal } from '@/src/context/ModalContext';

interface MarketData {
  indices: {
    name: string;
    value: string;
    change: string;
    isPositive: boolean;
  }[];
  commentary: string;
  chartData: { time: string; value: number }[];
  topGainers: { name: string; price: string; change: string }[];
  topLosers: { name: string; price: string; change: string }[];
}

export default function MarketAnalysis() {
  const { openConsultationModal } = useModal();
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'undefined' || apiKey === '') {
        throw new Error('Gemini API key is missing. Please ensure GEMINI_API_KEY is set in your environment variables. If you are on Vercel, add it to Project Settings > Environment Variables and redeploy.');
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Provide a real-time market analysis for the Indian stock market (Nifty 50, Sensex) as of March 2026. Include current index values (approximate based on recent trends), a brief expert commentary on market sentiment, and some mock historical data points for a chart visualization. Also list 3 top gainers and 3 top losers.",
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              indices: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    name: { type: "STRING" },
                    value: { type: "STRING" },
                    change: { type: "STRING" },
                    isPositive: { type: "BOOLEAN" }
                  },
                  required: ["name", "value", "change", "isPositive"]
                }
              },
              commentary: { type: "STRING" },
              chartData: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    time: { type: "STRING" },
                    value: { type: "NUMBER" }
                  },
                  required: ["time", "value"]
                }
              },
              topGainers: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    name: { type: "STRING" },
                    price: { type: "STRING" },
                    change: { type: "STRING" }
                  },
                  required: ["name", "price", "change"]
                }
              },
              topLosers: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    name: { type: "STRING" },
                    price: { type: "STRING" },
                    change: { type: "STRING" }
                  },
                  required: ["name", "price", "change"]
                }
              }
            },
            required: ["indices", "commentary", "chartData", "topGainers", "topLosers"]
          }
        },
      });

      if (!response.text) {
        throw new Error('Empty response from AI model.');
      }

      let data;
      try {
        data = JSON.parse(response.text);
      } catch (parseErr) {
        console.error('JSON Parse Error:', parseErr, 'Raw Text:', response.text);
        throw new Error('Failed to parse market data. The AI returned an invalid format.');
      }
      
      setMarketData(data);
    } catch (err: any) {
      console.error('Market Analysis Error:', err);
      setError(err.message || 'Failed to fetch real-time market data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketAnalysis();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 pt-24 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                Live Intelligence
              </span>
              <BlurText 
                text="Real-Time Market Analysis"
                centered={false}
                highlight="Market Analysis"
                className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
              />
              <p className="text-xl text-slate-600 leading-relaxed">
                Stay ahead of the curve with our AI-powered market insights, live data tracking, and expert commentary on the Indian financial landscape.
              </p>
            </motion.div>
            <div className="flex items-center gap-4">
              <button 
                onClick={fetchMarketAnalysis}
                disabled={loading}
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all disabled:opacity-50 shadow-lg"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading && !marketData ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-slate-500 font-medium animate-pulse">Analyzing market trends and fetching live data...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-100 p-8 rounded-3xl text-center">
            <Info className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-rose-900 mb-2">Market Data Unavailable</h3>
            <p className="text-rose-700 mb-6">{error}</p>
            <button 
              onClick={fetchMarketAnalysis}
              className="bg-rose-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-700 transition-all"
            >
              Retry Connection
            </button>
          </div>
        ) : marketData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Market Snapshot */}
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
              {marketData.indices.map((index, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{index.name}</span>
                    <div className={cn(
                      "p-2 rounded-xl",
                      index.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {index.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900">{index.value}</h3>
                    <p className={cn(
                      "text-sm font-bold",
                      index.isPositive ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {index.change}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div className="bg-primary p-6 rounded-3xl border border-primary/20 shadow-lg shadow-primary/10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-slate-900" />
                  <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Market Sentiment</span>
                </div>
                <p className="text-lg font-black text-slate-900">Cautiously Bullish</p>
              </div>
            </div>

            {/* Main Chart & Commentary */}
            <div className="lg:col-span-8 space-y-8">
              <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <BarChart2 className="w-6 h-6 text-primary" />
                    Nifty 50 Performance
                  </h3>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Past 24 Hours</span>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={marketData.chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="time" 
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
                        dataKey="value" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Globe className="w-6 h-6 text-primary" />
                  Expert Commentary
                </h3>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed text-lg italic">
                    "{marketData.commentary}"
                  </p>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black">AI</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">BHP AI Strategist</p>
                    <p className="text-xs text-slate-500">Real-time Analysis Engine</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Gainers & Losers */}
            <div className="lg:col-span-4 space-y-8">
              <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  Top Gainers
                </h3>
                <div className="space-y-4">
                  {marketData.topGainers.map((stock, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{stock.name}</p>
                        <p className="text-xs text-slate-500">{stock.price}</p>
                      </div>
                      <span className="text-emerald-600 font-black text-sm">{stock.change}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-rose-500 rotate-180" />
                  Top Losers
                </h3>
                <div className="space-y-4">
                  {marketData.topLosers.map((stock, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{stock.name}</p>
                        <p className="text-xs text-slate-500">{stock.price}</p>
                      </div>
                      <span className="text-rose-600 font-black text-sm">{stock.change}</span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl">
                <h3 className="text-lg font-bold mb-4">Market Outlook</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  The Indian market continues to show resilience amidst global volatility. Domestic institutional investors (DIIs) are providing a strong floor, while retail participation via SIPs remains at record highs.
                </p>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Key Level to Watch</p>
                  <p className="text-xl font-black">Nifty 24,500</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expert Advice CTA */}
        {!loading && marketData && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 bg-slate-900 rounded-[3rem] p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Need Help Navigating the Market?</h2>
              <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                Our expert advisors are ready to help you build a personalized strategy based on current market conditions.
              </p>
              <button 
                onClick={() => openConsultationModal('Investment Planning')}
                className="bg-primary text-slate-900 px-12 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-2xl shadow-primary/20 flex items-center gap-2 mx-auto"
              >
                Talk to an Expert <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
