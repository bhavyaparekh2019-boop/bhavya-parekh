import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Info, Loader2, TrendingUp, Shield, Sparkles, BarChart2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ARTICLES, CATEGORIES } from '@/constants';
import Fuse from 'fuse.js';
import Sidebar from '@/components/Sidebar';
import ChromaGrid from '@/components/ChromaGrid';
import { cn } from '@/lib/utils';
import { GoogleGenAI, Type } from "@google/genai";
import BlurText from '@/components/BlurText';

const KNOWLEDGE_CENTER_ITEMS = [
  {
    title: 'Investment',
    icon: TrendingUp,
    image: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&q=80&w=800&h=600',
    description: 'Build a resilient portfolio and leverage compounding in India.',
    url: '/guides/investment',
    borderColor: '#3B82F6',
    gradient: 'linear-gradient(145deg, #3B82F6, #000)'
  },
  {
    title: 'Insurance',
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800&h=600',
    description: 'Complete walkthrough of life and health insurance for Indian families.',
    url: '/guides/insurance',
    borderColor: '#0EA5E9',
    gradient: 'linear-gradient(180deg, #0EA5E9, #000)'
  },
  {
    title: 'Retirement',
    icon: Loader2,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800&h=600',
    description: 'Build a bulletproof corpus for a worry-free post-work life.',
    url: '/guides/retirement',
    borderColor: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B, #000)'
  },
  {
    title: 'Tax Planning',
    icon: Info,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800&h=600',
    description: 'Minimize liability and maximize take-home pay legally.',
    url: '/guides/tax',
    borderColor: '#6366F1',
    gradient: 'linear-gradient(145deg, #6366F1, #000)'
  },
  {
    title: 'Mutual Funds',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&q=80&w=800&h=600',
    description: 'Master SIPs, ELSS, and professional wealth management.',
    url: '/guides/mutual-funds',
    borderColor: '#F43F5E',
    gradient: 'linear-gradient(160deg, #F43F5E, #000)'
  },
  {
    title: 'Stock Market Investing Basics',
    icon: BarChart2,
    image: 'https://images.unsplash.com/photo-1611974717483-3600997e5b47?auto=format&fit=crop&q=80&w=800&h=600',
    description: 'Demystifying the stock market for beginners in India.',
    url: '/guides/stocks',
    borderColor: '#64748B',
    gradient: 'linear-gradient(180deg, #64748B, #000)'
  },
  {
    title: 'Market Analysis',
    icon: TrendingUp,
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800&h=600',
    description: 'Real-time data and AI-powered expert commentary on Indian markets.',
    url: '/market-analysis',
    borderColor: '#19d4e6',
    gradient: 'linear-gradient(145deg, #19d4e6, #000)'
  }
];

const MOCK_CANDLESTICK_DATA = [
  { time: '09:15', open: 24150, high: 24180, low: 24120, close: 24160 },
  { time: '10:00', open: 24160, high: 24200, low: 24150, close: 24190 },
  { time: '11:00', open: 24190, high: 24210, low: 24170, close: 24180 },
  { time: '12:00', open: 24180, high: 24220, low: 24160, close: 24210 },
  { time: '13:00', open: 24210, high: 24250, low: 24200, close: 24240 },
  { time: '14:00', open: 24240, high: 24260, low: 24220, close: 24230 },
  { time: '15:00', open: 24230, high: 24320, low: 24210, close: 24310 },
  { time: '15:30', open: 24310, high: 24330, low: 24300, close: 24320 },
];

const CandlestickChart = ({ data }: { data: any[] }) => {
  const minValue = Math.min(...data.map(d => d.low));
  const maxValue = Math.max(...data.map(d => d.high));
  const range = maxValue - minValue;
  const padding = range * 0.1;
  const displayMin = minValue - padding;
  const displayMax = maxValue + padding;
  const displayRange = displayMax - displayMin;

  return (
    <div className="h-48 w-full flex items-end gap-2 px-2">
      {data.map((d, i) => {
        const isPositive = d.close >= d.open;
        const color = isPositive ? 'bg-sky-500' : 'bg-rose-500';
        const wickColor = isPositive ? 'bg-sky-500/30' : 'bg-rose-500/30';
        
        const bodyTop = ((displayMax - Math.max(d.open, d.close)) / displayRange) * 100;
        const bodyBottom = ((displayMax - Math.min(d.open, d.close)) / displayRange) * 100;
        const bodyHeight = bodyBottom - bodyTop;
        
        const wickTop = ((displayMax - d.high) / displayRange) * 100;
        const wickBottom = ((displayMax - d.low) / displayRange) * 100;
        const wickHeight = wickBottom - wickTop;

        return (
          <div key={i} className="flex-1 relative h-full flex flex-col items-center">
            {/* Wick */}
            <div 
              className={cn("absolute w-px", wickColor)}
              style={{ top: `${wickTop}%`, height: `${wickHeight}%` }}
            />
            {/* Body */}
            <motion.div 
              initial={{ opacity: 0, scaleY: 0 }}
              whileInView={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className={cn("absolute w-full rounded-sm shadow-sm z-10", color)}
              style={{ top: `${bodyTop}%`, height: `${Math.max(bodyHeight, 2)}%`, transformOrigin: 'center' }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default function Home() {
  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [aiResponse, setAiResponse] = useState<{ 
    concise: string; 
    full: string; 
    sources?: { uri: string; title: string }[];
    relatedGuides?: typeof KNOWLEDGE_CENTER_ITEMS;
    relatedArticles?: typeof ARTICLES;
  } | null>(null);
  const [showFullAiResponse, setShowFullAiResponse] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const filteredArticles = useMemo(() => {
    let results = ARTICLES;

    if (searchQuery.trim()) {
      const fuse = new Fuse(ARTICLES, {
        keys: ['title', 'excerpt', 'keywords'],
        threshold: 0.4,
        distance: 100,
      });
      results = fuse.search(searchQuery).map(result => result.item);
    }

    return results.filter((article) => {
      const matchesCategory = activeCategory === 'All Topics' || article.category === activeCategory;
      return matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const gridArticles = useMemo(() => {
    return filteredArticles;
  }, [filteredArticles]);

  const handleSmartSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setAiResponse(null);
    setShowFullAiResponse(false);

    try {
      // Find related guides from Knowledge Center using fuzzy search
      const fuseGuides = new Fuse(KNOWLEDGE_CENTER_ITEMS, {
        keys: ['title', 'description'],
        threshold: 0.4,
      });
      const relatedGuides = fuseGuides.search(searchQuery).map(r => r.item).slice(0, 3);

      // Find related articles from Knowledge Center (ARTICLES) using fuzzy search
      const fuseArticles = new Fuse(ARTICLES, {
        keys: ['title', 'excerpt', 'keywords'],
        threshold: 0.4,
      });
      const relatedArticles = fuseArticles.search(searchQuery).map(r => r.item).slice(0, 3);

      const apiKey = process.env.GEMINI_API_KEY;
      
      // Fallback to mock data if API key is missing
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'undefined' || apiKey === '') {
        console.warn('Gemini API key is missing. Falling back to mock response.');
        setTimeout(() => {
          setAiResponse({
            concise: `For "${searchQuery}", the general financial consensus suggests careful planning and diversification.`,
            full: `Regarding your query about "${searchQuery}", it's important to consider your risk appetite and long-term goals. In the Indian context, this often involves looking at tax-saving instruments under Section 80C, balanced mutual funds, and maintaining an emergency fund. (Note: This is a demo response as no API key is configured).`,
            sources: [
              { title: "BHP Finance Guides", uri: "/guides/investment" },
              { title: "Market Analysis", uri: "/market-analysis" }
            ],
            relatedGuides,
            relatedArticles
          });
          setIsSearching(false);
        }, 1500);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: `The user is searching for "${searchQuery}" on an Indian financial insights blog. Provide a concise, expert financial summary or answer related to this query, specifically tailored to the Indian context (Rupees, Indian tax laws, market conditions). Use Google Search to ensure the information is current as of March 2026.` }] }],
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              concise: { type: Type.STRING, description: "A one-sentence, direct, and perfect answer to the query." },
              full: { type: Type.STRING, description: "A detailed explanation with context, data, and trends for 2026." }
            },
            required: ["concise", "full"]
          }
        },
      });
      
      if (!response.text) {
        throw new Error('Empty response from AI model.');
      }

      const data = JSON.parse(response.text);

      // Extract sources
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const sources = chunks?.map((chunk: any) => ({
        uri: chunk.web?.uri,
        title: chunk.web?.title
      })).filter((s: any) => s.uri && s.title);

      if (data.concise && data.full) {
        setAiResponse({ 
          ...data, 
          sources,
          relatedGuides,
          relatedArticles
        });
      } else {
        setAiResponse({ 
          concise: "I couldn't find a direct answer for that.", 
          full: "Please try a more specific financial query or check our latest articles.",
          relatedGuides,
          relatedArticles
        });
      }
    } catch (error: any) {
      console.error('Smart Search Error:', error);
      let concise = "Search error occurred.";
      let full = error.message || "Sorry, I encountered an error while processing your request. Please try again.";
      
      if (error.message?.includes('quota') || error.message?.includes('429')) {
        concise = "AI usage limit reached.";
        full = "I've reached my daily limit for real-time search grounding. You can still explore our pre-written guides and articles below, or try again later today.";
      }

      setAiResponse({ 
        concise, 
        full,
        relatedGuides: KNOWLEDGE_CENTER_ITEMS.filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 3),
        relatedArticles: ARTICLES.filter(article => 
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 3)
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white py-20 md:py-32 overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-24 w-64 h-64 bg-primary rounded-full blur-3xl opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <BlurText
                text="Financial Wisdom for Your Future"
                delay={150}
                animateBy="words"
                direction="top"
                highlight="Your Future"
                onAnimationComplete={handleAnimationComplete}
                className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight"
              />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-slate-600 mb-12 max-w-2xl leading-relaxed"
              >
                Expert Insights: Market Analysis, Professional Guidance, and the tools you need to build long-term wealth in the Indian market.
              </motion.p>

              {/* Hero Search */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl"
              >
                <form 
                  onSubmit={handleSmartSearch}
                  className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-4 focus-within:ring-primary/10 transition-all shadow-sm"
                >
                  <Search className="ml-4 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for financial topics..."
                    className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 text-base py-3 px-4"
                  />
                  <button 
                    type="submit"
                    disabled={isSearching}
                    className="bg-primary text-slate-900 px-8 py-3 rounded-xl font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                  </button>
                </form>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="hidden lg:block relative"
            >
              <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1200&h=900" 
                  alt="Financial Growth" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 max-w-[200px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Growth</span>
                </div>
                <p className="text-sm text-slate-500 font-medium">Consistent market outperformance since 2018.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Market Ticker */}
      <div className="bg-primary overflow-hidden py-4 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
            <Link to="/market-analysis" className="flex items-center gap-2 hover:text-white transition-colors group">
              <span className="text-[10px] font-black text-white/50 uppercase tracking-widest group-hover:text-white">Nifty 50</span>
              <span className="text-sm font-bold text-white">24,320.45</span>
              <span className="text-xs font-bold text-sky-300">+1.24%</span>
            </Link>
            <Link to="/market-analysis" className="flex items-center gap-2 hover:text-primary transition-colors group">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-primary">Sensex</span>
              <span className="text-sm font-bold text-white">79,850.12</span>
              <span className="text-xs font-bold text-sky-500">+0.98%</span>
            </Link>
            <Link to="/market-analysis" className="flex items-center gap-2 hover:text-primary transition-colors group">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-primary">Bank Nifty</span>
              <span className="text-sm font-bold text-white">52,410.30</span>
              <span className="text-xs font-bold text-rose-500">-0.15%</span>
            </Link>
            <Link to="/market-analysis" className="flex items-center gap-2 hover:text-primary transition-colors group">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-primary">USD/INR</span>
              <span className="text-sm font-bold text-white">83.45</span>
              <span className="text-xs font-bold text-slate-400">0.00%</span>
            </Link>
            <Link to="/market-analysis" className="flex items-center gap-2 hover:text-primary transition-colors group">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-primary">Gold</span>
              <span className="text-sm font-bold text-white">72,140</span>
              <span className="text-xs font-bold text-sky-500">+0.45%</span>
            </Link>
            {/* Duplicate for seamless loop */}
            <Link to="/market-analysis" className="flex items-center gap-2 hover:text-primary transition-colors group">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-primary">Nifty 50</span>
              <span className="text-sm font-bold text-white">24,320.45</span>
              <span className="text-xs font-bold text-sky-500">+1.24%</span>
            </Link>
          </div>
        </div>
      </div>

      {/* AI Smart Response */}
      <AnimatePresence>
        {aiResponse && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-primary text-slate-900 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-12">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-lg shadow-primary/20">
                  <Info className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">AI Smart Insight</h3>
                    <button 
                      onClick={() => setAiResponse(null)}
                      className="text-slate-900/70 hover:text-slate-900 transition-colors text-xs font-bold uppercase tracking-widest"
                    >
                      Close
                    </button>
                  </div>
                  <div className="prose prose-slate max-w-none prose-p:text-slate-800 prose-p:leading-relaxed text-lg">
                    <p className="font-bold text-slate-900 mb-4">{aiResponse.concise}</p>
                    
                    {showFullAiResponse ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 pt-6 border-t border-slate-900/10"
                      >
                        <p className="text-slate-800">{aiResponse.full}</p>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                          {/* Sources */}
                          {aiResponse.sources && aiResponse.sources.length > 0 && (
                            <div>
                              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Verified Sources</p>
                              <div className="space-y-2">
                                {aiResponse.sources.map((source, idx) => (
                                  <a 
                                    key={idx}
                                    href={source.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 bg-white/20 border border-slate-900/10 rounded-xl hover:bg-white/30 transition-all group"
                                  >
                                    <span className="text-xs font-bold text-slate-700 truncate pr-4">{source.title}</span>
                                    <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-slate-900 transition-colors shrink-0" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Related Guides */}
                          {aiResponse.relatedGuides && aiResponse.relatedGuides.length > 0 && (
                            <div>
                              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Related Guides</p>
                              <div className="space-y-2">
                                {aiResponse.relatedGuides.map((guide, idx) => (
                                  <Link 
                                    key={idx}
                                    to={guide.url}
                                    className="flex items-center gap-3 p-3 bg-white/20 border border-slate-900/10 rounded-xl hover:bg-white/30 transition-all group"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-slate-900 shrink-0">
                                      <guide.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-bold text-slate-900 truncate">{guide.title}</p>
                                      <p className="text-[10px] text-slate-700 truncate">{guide.description}</p>
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-slate-900 transition-colors shrink-0" />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Related Articles */}
                        {aiResponse.relatedArticles && aiResponse.relatedArticles.length > 0 && (
                          <div className="mt-8 pt-8 border-t border-slate-900/10">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Related Articles from Knowledge Center</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {aiResponse.relatedArticles.map((article) => (
                                <Link 
                                  key={article.id}
                                  to={`/article/${article.id}`}
                                  className="group block p-4 bg-white/20 border border-slate-900/10 rounded-2xl hover:bg-white/30 transition-all"
                                >
                                  <div className="aspect-video rounded-xl overflow-hidden mb-3">
                                    <img 
                                      src={article.image} 
                                      alt={article.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <h4 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-slate-900 transition-colors mb-2">{article.title}</h4>
                                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                                    <span>{article.category}</span>
                                    <span>{article.readTime}</span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-8 pt-8 border-t border-slate-900/10">
                          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center leading-relaxed max-w-2xl mx-auto opacity-70">
                            Disclaimer: AI-generated insights are for informational purposes only and do not constitute professional financial advice. Always consult with a qualified financial advisor before making investment decisions.
                          </p>
                        </div>

                        <button 
                          onClick={() => setShowFullAiResponse(false)}
                          className="mt-8 text-slate-900 text-sm font-bold hover:underline uppercase tracking-widest"
                        >
                          Show Less
                        </button>
                      </motion.div>
                    ) : (
                      <div className="mt-4">
                        <button 
                          onClick={() => setShowFullAiResponse(true)}
                          className="text-slate-900 text-sm font-bold hover:underline uppercase tracking-widest"
                        >
                          See Whole Result
                        </button>
                        <p className="mt-4 text-[9px] font-bold text-slate-600 uppercase tracking-widest opacity-60">
                          * AI insights are for informational purposes only.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Why Choose Us Section */}
      <section className="bg-white py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Why Choose Our Platform?</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              We combine deep market expertise with personalized strategies to help you navigate the complexities of the Indian financial landscape.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 shadow-xl border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800&h=1000" 
                  alt="Expert Advice" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Expert Financial Advice</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our team of certified advisors provides data-driven insights tailored to your specific goals.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 shadow-xl border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&q=80&w=800&h=1000" 
                  alt="Secure Future" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Secure Your Future</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Comprehensive insurance and retirement planning to ensure long-term stability for your family.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 shadow-xl border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=1000" 
                  alt="Market Growth" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Maximize Market Growth</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Strategic investment solutions in mutual funds and stocks to capitalize on the Indian growth story.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Market Analysis Preview Section */}
      <section className="bg-slate-50 py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full mb-4 uppercase tracking-[0.2em]">
                Live Intelligence
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">AI-Powered Market Analysis</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Stay ahead of the curve with real-time insights into the Indian stock market. Our AI engine analyzes thousands of data points to provide you with actionable intelligence.
              </p>
              <div className="space-y-4 mb-10">
                {[
                  "Real-time Nifty 50 & Sensex tracking",
                  "Expert AI commentary on market sentiment",
                  "Daily top gainers and losers analysis",
                  "Global macro-economic impact reports"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                      <TrendingUp className="w-3 h-3" />
                    </div>
                    <span className="text-slate-700 font-bold">{item}</span>
                  </div>
                ))}
              </div>
              <Link 
                to="/market-analysis"
                className="inline-flex items-center gap-2 bg-primary text-slate-900 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/20"
              >
                View Full Analysis <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <BarChart2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Nifty 50</h3>
                      <p className="text-[10px] font-bold text-slate-400">Live Snapshot</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900">24,320.45</p>
                    <p className="text-xs font-bold text-sky-500">+1.24%</p>
                  </div>
                </div>
                
                {/* Candlestick Chart Visualization */}
                <div className="bg-slate-50 rounded-2xl p-4 overflow-hidden">
                  <CandlestickChart data={MOCK_CANDLESTICK_DATA} />
                </div>
                
                <div className="mt-8 p-4 bg-primary/10 rounded-2xl text-slate-900">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-[8px] font-black text-primary uppercase tracking-widest">AI Pulse</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "Market sentiment remains cautiously bullish as domestic institutional buying offsets global volatility. Key resistance at 24,500."
                  </p>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sky-400/20 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Knowledge Center Section */}
      <section className="bg-slate-50 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Knowledge Center</h2>
              <p className="text-slate-500 mt-1">Master the fundamentals of finance with our comprehensive guides.</p>
            </div>
          </div>
          
          <ChromaGrid 
            radius={300}
            damping={0.45}
            fadeOut={0.6}
            ease="power3.out"
            items={KNOWLEDGE_CENTER_ITEMS}
          />
        </div>
      </section>

      {/* Category Filter Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto py-5 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all',
                  activeCategory === cat
                    ? 'bg-primary text-slate-900 shadow-md shadow-primary/20'
                    : 'text-slate-500 hover:bg-slate-100'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-12">
          {filteredArticles.length > 0 ? (
            <section className="space-y-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-slate-200" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                  {searchQuery ? 'Search Results' : 'Latest Financial Articles'}
                </h2>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              
              <div className="max-w-2xl mx-auto">
                <ChromaGrid 
                  cols="grid-cols-1"
                  radius={300}
                  damping={0.45}
                  fadeOut={0.6}
                  ease="power3.out"
                  items={gridArticles.map(article => ({
                    title: article.title,
                    description: article.excerpt,
                    image: article.image,
                    category: article.category,
                    readTime: article.readTime,
                    author: article.author,
                    date: article.date,
                    url: `/article/${article.id}`,
                    borderColor: article.featured ? '#A855F7' : '#3B82F6',
                    gradient: article.featured 
                      ? 'linear-gradient(145deg, #A855F7, #000)' 
                      : 'linear-gradient(145deg, #3B82F6, #000)'
                  }))}
                />
              </div>
            </section>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-slate-900 mb-2">No results found</h3>
              <p className="text-slate-500">Try adjusting your search or category filters.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory(CATEGORIES[0]); }}
                className="mt-6 text-primary font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination removed as per user request for single list */}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
