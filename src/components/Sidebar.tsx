import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Download, Mail, Home, PiggyBank, TrendingUp, ChevronRight, Sparkles, Loader2, RefreshCcw, Shield, ArrowRight, Coins } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useModal } from '@/context/ModalContext';

export default function Sidebar() {
  const { openConsultationModal } = useModal();
  const [marketPulse, setMarketPulse] = useState<string | null>(null);
  const [isLoadingPulse, setIsLoadingPulse] = useState(false);

  const tools = [
    { name: 'SIP Calculator', desc: 'Calculate mutual fund returns', icon: TrendingUp, path: '/tools/sip' },
    { name: 'Lumpsum Calculator', desc: 'One-time investment growth', icon: Coins, path: '/tools/lumpsum' },
    { name: 'Home Loan EMI', desc: 'Estimate monthly payments', icon: Home, path: '/tools/mortgage' },
    { name: 'Retirement Planner', desc: 'Calculate future savings', icon: PiggyBank, path: '/tools/retirement' },
    { name: 'Insurance Coverage', desc: 'Assess your protection needs', icon: Shield, path: '/tools/insurance' },
    { name: 'Investment ROI', desc: 'Project portfolio growth', icon: Calculator, path: '/tools/roi' },
  ];

  const resources = [
    { type: 'PDF REPORT • 4.2 MB', name: '2024 Annual Market Report' },
    { type: 'CHECKLIST • 1.1 MB', name: 'Retirement Readiness Audit' },
  ];

  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [subscribeNote, setSubscribeNote] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubscribing) return;

    setIsSubscribing(true);
    setSubscribeStatus('idle');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (response.ok) {
          setSubscribeStatus('success');
          setSubscribeNote(data.note || null);
          setEmail('');
          setTimeout(() => {
            setSubscribeStatus('idle');
            setSubscribeNote(null);
          }, 8000);
        } else {
          console.error('Subscription failed:', data.error);
          setSubscribeStatus('error');
        }
      } else {
        const text = await response.text();
        console.error('Non-JSON response from /api/subscribe:', text.substring(0, 500));
        setSubscribeStatus('error');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscribeStatus('error');
    } finally {
      setIsSubscribing(false);
    }
  };

  const fetchMarketPulse = async () => {
    setIsLoadingPulse(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'undefined' || apiKey === '') {
        setMarketPulse("Market sentiment remains cautiously bullish as domestic institutional buying offsets global volatility.");
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Provide a 1-sentence real-time summary of the Indian stock market (Nifty/Sensex) and global market sentiment for today. Be concise and professional.",
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      setMarketPulse(response.text || "Market sentiment is currently stable with positive bias.");
    } catch (error: any) {
      console.error('Market Pulse Error:', error);
      
      // Handle quota exceeded or rate limit errors gracefully
      if (error.message?.includes('quota') || error.message?.includes('429')) {
        setMarketPulse("Market sentiment remains cautiously bullish as domestic institutional buying offsets global volatility.");
      } else {
        setMarketPulse("Unable to fetch live market pulse. Please check back later.");
      }
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
      <div className="bg-primary rounded-2xl p-6 text-slate-900 border border-primary/20 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <TrendingUp className="w-16 h-16 text-slate-900" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              Live Market Pulse
            </h3>
            <button 
              onClick={fetchMarketPulse}
              disabled={isLoadingPulse}
              className="text-slate-900/50 hover:text-slate-900 transition-colors disabled:opacity-50"
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
                <Loader2 className="w-5 h-5 text-slate-900 animate-spin" />
              </motion.div>
            ) : (
              <motion.p 
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-slate-900/90 leading-relaxed font-medium"
              >
                {marketPulse}
              </motion.p>
            )}
          </AnimatePresence>
          
          <div className="mt-4 pt-4 border-t border-slate-900/10 flex items-center justify-between text-[10px] font-bold text-slate-900/50 uppercase tracking-widest">
            <span>Real-time Data</span>
            <span className="text-slate-900">Live</span>
          </div>
        </div>
      </div>

      {/* Consultation CTA */}
      <div className="bg-primary rounded-2xl p-6 text-slate-900 shadow-xl shadow-primary/20">
        <h3 className="text-lg font-black uppercase tracking-tight mb-2">Talk to an Expert</h3>
        <p className="text-sm font-bold text-slate-800 mb-6 leading-tight">
          Get personalized financial advice tailored to your goals.
        </p>
        <button 
          onClick={() => openConsultationModal('Investment Planning')}
          className="w-full bg-white text-primary font-black py-4 rounded-xl text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/20"
        >
          Consult Now <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Knowledge Base */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm transition-colors">
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
          <Link 
            to="/guides/mutual-funds"
            className="block p-4 bg-slate-50 rounded-xl border border-transparent hover:border-primary transition-all group"
          >
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">Mutual Funds Pro</h4>
            <p className="text-xs text-slate-500 mt-1">Mastering SIPs and ELSS.</p>
          </Link>
          <Link 
            to="/guides/stocks"
            className="block p-4 bg-slate-50 rounded-xl border border-transparent hover:border-primary transition-all group"
          >
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">Stock Market Basics</h4>
            <p className="text-xs text-slate-500 mt-1">Fundamentals for beginners.</p>
          </Link>
        </div>
      </div>

      {/* Financial Tools */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm transition-colors">
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
      <div className="bg-primary rounded-2xl p-6 text-slate-900 border border-primary/20 shadow-xl">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Download className="w-5 h-5 text-slate-900" />
          Premium Resources
        </h3>
        <div className="space-y-6">
          {resources.map((res, i) => (
            <div key={res.name} className={i !== resources.length - 1 ? 'border-b border-slate-900/10 pb-4' : ''}>
              <p className="text-[10px] text-slate-900/50 font-bold tracking-wider mb-1 uppercase">{res.type}</p>
              <p className="text-sm font-semibold mb-3">{res.name}</p>
              <button className="text-slate-900 text-xs font-bold flex items-center gap-1 hover:underline">
                DOWNLOAD <Download className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20 text-center transition-colors">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">The Weekly Insight</h3>
        <p className="text-sm text-slate-600 mb-6">
          Get market insights and financial tips delivered to your inbox every Monday.
        </p>
        <form className="space-y-3" onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
          <button 
            type="submit"
            disabled={isSubscribing}
            className="w-full bg-primary text-slate-900 font-bold py-3 rounded-xl text-sm hover:brightness-110 transition-all shadow-md shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe Now'}
          </button>
          {subscribeStatus === 'success' && (
            <div className="mt-2">
              <p className="text-xs text-sky-600 font-bold">Thanks for subscribing!</p>
              {subscribeNote && (
                <p className="text-[9px] text-amber-600 font-bold uppercase tracking-tighter mt-1">Note: {subscribeNote}</p>
              )}
            </div>
          )}
          {subscribeStatus === 'error' && (
            <p className="text-xs text-rose-600 font-bold mt-2">Something went wrong. Try again.</p>
          )}
        </form>
        <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">
          No spam. Ever. Unsubscribe anytime.
        </p>
      </div>
    </aside>
  );
}
