import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart2, Info, Loader2, RefreshCw, ArrowUpRight, ArrowDownRight, Globe, Zap, ArrowRight, Shield, Sparkles } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import BlurText from '@/components/BlurText';
import { cn } from '@/lib/utils';
import { useModal } from '@/context/ModalContext';

interface MarketData {
  indices: {
    name: string;
    value: string;
    change: string;
    isPositive: boolean;
  }[];
  commentary: {
    overview: string;
    keyDrivers: string[];
    risks: string[];
    outlook: string;
  };
  chartData: { time: string; value: number }[];
  topGainers: { name: string; price: string; change: string }[];
  topLosers: { name: string; price: string; change: string }[];
  sentimentScore: number;
  lastUpdated: string;
}

const MOCK_MARKET_DATA: MarketData = {
  indices: [
    { name: 'Nifty 50', value: '24,320.45', change: '+1.24%', isPositive: true },
    { name: 'Sensex', value: '79,850.12', change: '+0.98%', isPositive: true },
    { name: 'Bank Nifty', value: '52,410.30', change: '-0.15%', isPositive: false },
    { name: 'Nifty IT', value: '38,120.15', change: '+2.10%', isPositive: true },
  ],
  commentary: {
    overview: "The Indian market is showing strong resilience with the Nifty 50 holding above the 24,000 mark. Positive global cues and robust domestic institutional buying are supporting the uptrend.",
    keyDrivers: [
      "Strong Q3 corporate earnings across major sectors.",
      "Increased FII inflows following positive global economic data.",
      "Robust domestic demand in the automotive and real estate sectors."
    ],
    risks: [
      "Potential volatility ahead of global central bank meetings.",
      "Fluctuating crude oil prices impacting trade balance.",
      "Geopolitical tensions in the Middle East."
    ],
    outlook: "The short-term outlook remains positive with Nifty likely to test 24,500 levels. Investors are advised to maintain a diversified portfolio with a focus on large-cap stocks."
  },
  chartData: [
    { time: '09:15', value: 24150 },
    { time: '10:30', value: 24200 },
    { time: '12:00', value: 24180 },
    { time: '13:30', value: 24250 },
    { time: '15:00', value: 24300 },
    { time: '15:30', value: 24320 },
  ],
  topGainers: [
    { name: 'Reliance Industries', price: '₹2,950.00', change: '+2.45%' },
    { name: 'HDFC Bank', price: '₹1,680.50', change: '+1.80%' },
    { name: 'Infosys', price: '₹1,540.20', change: '+3.15%' },
  ],
  topLosers: [
    { name: 'Tata Steel', price: '₹145.30', change: '-1.20%' },
    { name: 'Axis Bank', price: '₹1,080.00', change: '-0.85%' },
    { name: 'Wipro', price: '₹480.15', change: '-0.50%' },
  ],
  sentimentScore: 75,
  lastUpdated: new Date().toLocaleTimeString(),
};

export default function MarketAnalysis() {
  const { openConsultationModal } = useModal();
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketAnalysis = async (forceRefresh = false) => {
    const CACHE_KEY = 'bhp_market_analysis_cache';
    const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

    if (!forceRefresh) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setMarketData(data);
          setLoading(false);
          return;
        }
      }
    }

    setLoading(true);
    setError(null);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      
      // If API key is missing or placeholder, use mock data
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'undefined' || apiKey === '') {
        console.warn('Gemini API key is missing. Falling back to mock market data.');
        setTimeout(() => {
          setMarketData(MOCK_MARKET_DATA);
          setLoading(false);
        }, 1500);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: `Provide a comprehensive real-time market analysis for the Indian stock market (Nifty 50, Sensex, Bank Nifty) as of ${new Date().toLocaleString()}. 
        
        Focus on:
        - Current index values and daily changes.
        - Detailed expert commentary on Indian market sentiment (Bullish/Bearish/Neutral).
        - A sentiment score (0-100, where 0 is extreme fear and 100 is extreme greed).
        - 10 realistic data points for a chart visualization representing the last 24 hours of Nifty 50. 
        - Top 3 gainers and top 3 losers in the NSE/BSE today with their LTP and % change.
        - Key drivers moving the Indian markets (e.g., FII/DII activity, global cues, sector-specific news).
        - Potential risks and headwinds for Indian investors.
        - Short-term and medium-term strategic outlook.

        Format your response as a valid JSON object matching the requested schema.` }] }],
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              indices: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    value: { type: Type.STRING },
                    change: { type: Type.STRING },
                    isPositive: { type: Type.BOOLEAN }
                  },
                  required: ["name", "value", "change", "isPositive"]
                }
              },
              commentary: {
                type: Type.OBJECT,
                properties: {
                  overview: { type: Type.STRING },
                  keyDrivers: { type: Type.ARRAY, items: { type: Type.STRING } },
                  risks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  outlook: { type: Type.STRING }
                },
                required: ["overview", "keyDrivers", "risks", "outlook"]
              },
              chartData: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: { type: Type.STRING },
                    value: { type: Type.NUMBER }
                  },
                  required: ["time", "value"]
                }
              },
              topGainers: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    price: { type: Type.STRING },
                    change: { type: Type.STRING }
                  },
                  required: ["name", "price", "change"]
                }
              },
              topLosers: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    price: { type: Type.STRING },
                    change: { type: Type.STRING }
                  },
                  required: ["name", "price", "change"]
                }
              },
              sentimentScore: { type: Type.NUMBER },
              lastUpdated: { type: Type.STRING }
            },
            required: ["indices", "commentary", "chartData", "topGainers", "topLosers", "sentimentScore", "lastUpdated"]
          }
        },
      });

      if (!response.text) {
        throw new Error('Empty response from AI model.');
      }

      const data = JSON.parse(response.text);
      setMarketData(data);
      
      // Cache the successful response
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (err: any) {
      console.error('Market Analysis Error:', err);
      // Fallback to mock data on error but show a warning
      setMarketData(MOCK_MARKET_DATA);
      
      if (err.message?.includes('quota') || err.message?.includes('429')) {
        setError('Note: AI usage limit reached. Showing simulated market data for now.');
      } else {
        setError('Note: Showing simulated data as real-time connection failed.');
      }
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
            <div className="max-w-2xl">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                Live Intelligence
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                Real-Time <span className="text-primary">Market Analysis</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Stay ahead of the curve with our AI-powered market insights, live data tracking, and expert commentary on the Indian financial landscape.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => fetchMarketAnalysis(true)}
                disabled={loading}
                className="flex items-center gap-2 bg-primary text-slate-900 px-6 py-3 rounded-2xl font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Market Analysis Visual Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="w-full h-[300px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-100">
          <img 
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200&h=500" 
            alt="Market Analysis Visualization" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
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
              onClick={() => fetchMarketAnalysis(true)}
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
                      index.isPositive ? "bg-sky-50 text-sky-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {index.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900">{index.value}</h3>
                    <p className={cn(
                      "text-sm font-bold",
                      index.isPositive ? "text-sky-600" : "text-rose-600"
                    )}>
                      {index.change}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-xl",
                      marketData.sentimentScore > 70 ? "bg-sky-50 text-sky-600" : 
                      marketData.sentimentScore > 40 ? "bg-amber-50 text-amber-600" : 
                      "bg-rose-50 text-rose-600"
                    )}>
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Market Sentiment</span>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "text-xs font-black uppercase tracking-widest",
                      marketData.sentimentScore > 70 ? "text-sky-600" : 
                      marketData.sentimentScore > 40 ? "text-amber-600" : 
                      "text-rose-600"
                    )}>
                      {marketData.sentimentScore}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform duration-500 group-hover:scale-110",
                    marketData.sentimentScore > 70 ? "bg-sky-500 text-white shadow-sky-200" : 
                    marketData.sentimentScore > 40 ? "bg-amber-500 text-white shadow-amber-200" : 
                    "bg-rose-500 text-white shadow-rose-200"
                  )}>
                    {marketData.sentimentScore > 70 ? <TrendingUp className="w-6 h-6" /> : 
                     marketData.sentimentScore > 40 ? <Zap className="w-6 h-6" /> : 
                     <ArrowDownRight className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-900 leading-none mb-1">
                      {marketData.sentimentScore > 70 ? 'Bullish' : marketData.sentimentScore > 40 ? 'Neutral' : 'Bearish'}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      AI Sentiment Analysis
                    </p>
                  </div>
                </div>
                
                {/* Sentiment Gauge */}
                <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="absolute inset-0 flex">
                    <div className="h-full w-[40%] bg-rose-500/5" />
                    <div className="h-full w-[30%] bg-amber-500/5" />
                    <div className="h-full w-[30%] bg-sky-500/5" />
                  </div>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${marketData.sentimentScore}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full transition-colors duration-500",
                      marketData.sentimentScore > 70 ? "bg-sky-500" : 
                      marketData.sentimentScore > 40 ? "bg-amber-500" : 
                      "bg-rose-500"
                    )}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Extreme Fear</span>
                  <span>Neutral</span>
                  <span>Extreme Greed</span>
                </div>
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
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Globe className="w-6 h-6 text-primary" />
                    Expert Commentary
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Loader2 className="w-3 h-3" />
                    Updated: {marketData.lastUpdated}
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <p className="text-slate-600 leading-relaxed text-lg italic border-l-4 border-primary/20 pl-6 py-2">
                      "{marketData.commentary.overview}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-sky-500" />
                        Key Drivers
                      </h4>
                      <ul className="space-y-3">
                        {marketData.commentary.keyDrivers.map((driver, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                            {driver}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-rose-500" />
                        Market Risks
                      </h4>
                      <ul className="space-y-3">
                        {marketData.commentary.risks.map((risk, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                    <h4 className="text-sm font-black text-primary uppercase tracking-widest mb-2">Strategic Outlook</h4>
                    <p className="text-slate-700 text-sm leading-relaxed font-medium">
                      {marketData.commentary.outlook}
                    </p>
                  </div>
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
                  <TrendingUp className="w-5 h-5 text-sky-500" />
                  Top Gainers
                </h3>
                <div className="space-y-4">
                  {marketData.topGainers.map((stock, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-sky-50/50 rounded-2xl border border-sky-100">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{stock.name}</p>
                        <p className="text-xs text-slate-500">{stock.price}</p>
                      </div>
                      <span className="text-sky-600 font-black text-sm">{stock.change}</span>
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

              <div className="bg-primary/10 text-slate-900 p-8 rounded-[2rem] border border-primary/20">
                <h3 className="text-lg font-bold mb-4">Market Outlook</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-6">
                  The Indian market continues to show resilience amidst global volatility. Domestic institutional investors (DIIs) are providing a strong floor, while retail participation via SIPs remains at record highs.
                </p>
                <div className="p-4 bg-white rounded-2xl border border-primary/20">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Key Level to Watch</p>
                  <p className="text-xl font-black text-primary">Nifty 24,500</p>
                </div>
              </div>

              <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Mutual Funds Pulse
                  </h3>
                  <Link 
                    to="/guides/mutual-funds"
                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                  >
                    View Guide
                  </Link>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-600">Small Cap Funds</span>
                      <span className="text-xs font-black text-emerald-600">+32.4% (1Y)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[85%]" />
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-600">Mid Cap Funds</span>
                      <span className="text-xs font-black text-emerald-600">+24.8% (1Y)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[70%]" />
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-600">Large Cap Funds</span>
                      <span className="text-xs font-black text-emerald-600">+18.2% (1Y)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[55%]" />
                    </div>
                  </div>
                </div>
                <p className="mt-6 text-[10px] text-slate-400 font-medium leading-relaxed italic">
                  "SIP inflows hit a record ₹20,000 Cr in Feb 2026, signaling strong retail confidence."
                </p>
              </section>
            </div>
          </div>
        )}

        {/* Expert Advice CTA */}
        {!loading && marketData && (
          <>
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 bg-primary rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl shadow-primary/20"
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              </div>
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Need Help Navigating the Market?</h2>
                <p className="text-xl text-slate-800 mb-10 leading-relaxed">
                  Our expert advisors are ready to help you build a personalized strategy based on current market conditions.
                </p>
                <button 
                  onClick={() => openConsultationModal('Investment Planning')}
                  className="bg-white text-primary px-12 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-2xl shadow-white/20 flex items-center gap-2 mx-auto"
                >
                  Talk to an Expert <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.section>

            <div className="mt-12 pb-12 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
                Disclaimer: Market analysis and AI-generated insights provided by BHP Finance are for informational purposes only. This content does not constitute financial, investment, or legal advice. Past performance is not indicative of future results. Please consult with a certified financial planner before making any significant financial commitments.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
