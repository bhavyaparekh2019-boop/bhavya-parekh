import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle, Settings } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { getGeminiClient, getApiKey } from '@/lib/gemini';
import { cn } from '@/lib/utils';

interface TickerItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
}

export default function StockTicker() {
  const [data, setData] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchTickerData = async () => {
    setLoading(true);
    setError(false);
    try {
      const apiKey = getApiKey();
      
      if (!apiKey || apiKey === '') {
        // Fallback to realistic mock data if no API key
        const mockData: TickerItem[] = [
          { symbol: '^NSEI', name: 'Nifty 50', price: '24,320.45', change: '+298.15', changePercent: '+1.24%', isPositive: true },
          { symbol: '^BSESN', name: 'Sensex', price: '79,850.12', change: '+775.40', changePercent: '+0.98%', isPositive: true },
          { symbol: '^NSEBANK', name: 'Bank Nifty', price: '52,410.30', change: '-78.60', changePercent: '-0.15%', isPositive: false },
          { symbol: 'RELIANCE.NS', name: 'Reliance', price: '2,950.00', change: '+70.50', changePercent: '+2.45%', isPositive: true },
          { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', price: '1,680.50', change: '+29.70', changePercent: '+1.80%', isPositive: true },
          { symbol: 'TCS.NS', name: 'TCS', price: '4,120.30', change: '+45.20', changePercent: '+1.11%', isPositive: true },
        ];
        setData(mockData);
        setLastUpdated(new Date().toLocaleTimeString());
        setLoading(false);
        return;
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: `Get the latest near-real-time stock market data for key Indian indices and top stocks: Nifty 50, Sensex, Bank Nifty, Reliance, HDFC Bank, and TCS. 
        Return the current price, absolute change, and percentage change for today.` }] }],
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                symbol: { type: Type.STRING },
                name: { type: Type.STRING },
                price: { type: Type.STRING },
                change: { type: Type.STRING },
                changePercent: { type: Type.STRING },
                isPositive: { type: Type.BOOLEAN }
              },
              required: ["symbol", "name", "price", "change", "changePercent", "isPositive"]
            }
          }
        },
      });

      if (response.text) {
        const parsedData = JSON.parse(response.text);
        setData(parsedData);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        throw new Error("No data returned");
      }
    } catch (err) {
      console.error("Ticker fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickerData();
    const interval = setInterval(fetchTickerData, 60000 * 5); // Refresh every 5 mins
    return () => clearInterval(interval);
  }, []);

  if (error && data.length === 0) return null;

  return (
    <div className="w-full bg-slate-900 border-y border-white/10 py-2 overflow-hidden relative group">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Live Market Pulse</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Last Updated: {lastUpdated}</span>
          <button 
            onClick={() => fetchTickerData()}
            className="text-white/40 hover:text-white transition-colors"
            disabled={loading}
          >
            <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center py-1">
          {[...data, ...data].map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-4 px-8 border-r border-white/5 last:border-r-0">
              <span className="text-xs font-black text-white/60 uppercase tracking-wider">{item.name}</span>
              <span className="text-sm font-black text-white tracking-tight">{item.price}</span>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full",
                item.isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
              )}>
                {item.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {item.change} ({item.changePercent})
              </div>
            </div>
          ))}
        </div>

        {/* Duplicate for seamless loop */}
        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center py-1">
          {[...data, ...data].map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-4 px-8 border-r border-white/5 last:border-r-0">
              <span className="text-xs font-black text-white/60 uppercase tracking-wider">{item.name}</span>
              <span className="text-sm font-black text-white tracking-tight">{item.price}</span>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full",
                item.isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
              )}>
                {item.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {item.change} ({item.changePercent})
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee2 {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee2 {
          animation: marquee2 40s linear infinite;
        }
        .group:hover .animate-marquee,
        .group:hover .animate-marquee2 {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
}
