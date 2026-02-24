import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Download, Mail, Home, PiggyBank, TrendingUp, ChevronRight, Sparkles, Loader2, RefreshCcw, Shield } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function Sidebar() {
  const [marketPulse, setMarketPulse] = useState<string | null>(null);
  const [isLoadingPulse, setIsLoadingPulse] = useState(false);

  const tools = [
    { name: 'Mortgage Calculator', desc: 'Estimate monthly payments', icon: Home, path: '/tools/mortgage' },
    { name: 'Retirement Planner', desc: 'Calculate future savings', icon: PiggyBank, path: '/tools/retirement' },
    { name: 'Insurance Coverage', desc: 'Assess your protection needs', icon: Shield, path: '/tools/insurance' },
    { name: 'Investment ROI', desc: 'Project portfolio growth', icon: TrendingUp, path: '/tools/roi' },
  ];

  const resources = [
    { type: 'PDF REPORT • 4.2 MB', name: '2024 Annual Market Report' },
    { type: 'CHECKLIST • 1.1 MB', name: 'Retirement Readiness Audit' },
  ];

  const fetchMarketPulse = async () => {
    setIsLoadingPulse(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Provide a 1-sentence real-time summary of the Indian stock market (Nifty/Sensex) and global market sentiment for today. Be concise and professional.",
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      setMarketPulse(response.text || "Market data currently unavailable.");
    } catch (error) {
      console.error('Market Pulse Error:', error);
      setMarketPulse("Unable to fetch live market pulse.");
    } finally {
      setIsLoadingPulse(false);
    }
  };

  useEffect(() => {
    fetchMarketPulse();
  }, []);

  return (
    <aside className="space-y-8">
      {/* AI Market Pulse */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <TrendingUp className="w-16 h-16 text-primary" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              Live Market Pulse
            </h3>
            <button 
              onClick={fetchMarketPulse}
              disabled={isLoadingPulse}
              className="text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCcw className={cn("w-3 h-3", isLoadingPulse && "animate-spin")} />
            </button>
          </div>
          
          <AnimatePresence mode="wait">
            {isLoadingPulse ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-12 flex items-center justify-center"
              >
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </motion.div>
            ) : (
              <motion.p 
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-slate-300 leading-relaxed font-medium"
              >
                {marketPulse}
              </motion.p>
            )}
          </AnimatePresence>
          
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span>Real-time Data</span>
            <span className="text-primary">Live</span>
          </div>
        </div>
      </div>

      {/* Knowledge Base */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Knowledge Base
        </h3>
        <div className="space-y-4">
          <Link 
            to="/guides/investment"
            className="block p-4 bg-slate-50 rounded-xl border border-transparent hover:border-primary transition-all group"
          >
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">Investment Masterclass</h4>
            <p className="text-xs text-slate-500 mt-1">Fundamentals of wealth creation.</p>
          </Link>
          <Link 
            to="/guides/insurance"
            className="block p-4 bg-slate-50 rounded-xl border border-transparent hover:border-primary transition-all group"
          >
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">Insurance Essentials</h4>
            <p className="text-xs text-slate-500 mt-1">Protecting your financial future.</p>
          </Link>
          <Link 
            to="/guides/retirement"
            className="block p-4 bg-slate-50 rounded-xl border border-transparent hover:border-primary transition-all group"
          >
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">Retirement Roadmap</h4>
            <p className="text-xs text-slate-500 mt-1">Planning for a golden future.</p>
          </Link>
          <Link 
            to="/guides/tax"
            className="block p-4 bg-slate-50 rounded-xl border border-transparent hover:border-primary transition-all group"
          >
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">Tax Strategy 2024</h4>
            <p className="text-xs text-slate-500 mt-1">Smart ways to save more.</p>
          </Link>
        </div>
      </div>

      {/* Financial Tools */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Financial Tools
        </h3>
        <div className="space-y-3">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              to={tool.path}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <tool.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">{tool.name}</p>
                <p className="text-xs text-slate-500">{tool.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Premium Resources */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Download className="w-5 h-5 text-primary" />
          Premium Resources
        </h3>
        <div className="space-y-6">
          {resources.map((res, i) => (
            <div key={res.name} className={i !== resources.length - 1 ? 'border-b border-slate-800 pb-4' : ''}>
              <p className="text-[10px] text-slate-400 font-bold tracking-wider mb-1 uppercase">{res.type}</p>
              <p className="text-sm font-semibold mb-3">{res.name}</p>
              <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                DOWNLOAD <Download className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20 text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">The BHP Weekly</h3>
        <p className="text-sm text-slate-600 mb-6">
          Get market insights and financial tips delivered to your inbox every Monday.
        </p>
        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
          <button className="w-full bg-primary text-slate-900 font-bold py-3 rounded-xl text-sm hover:brightness-110 transition-all shadow-md shadow-primary/20">
            Subscribe Now
          </button>
        </form>
        <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">
          No spam. Ever. Unsubscribe anytime.
        </p>
      </div>
    </aside>
  );
}
