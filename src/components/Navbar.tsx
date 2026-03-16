import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, User, ChevronDown, Loader2, Info, ArrowRight, Globe, Sparkles, Sun, Moon, BookOpen, Filter, Calendar, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useModal } from '@/src/context/ModalContext';
import { GoogleGenAI } from "@google/genai";
import { ARTICLES, Article } from '@/src/constants';
import Fuse from 'fuse.js';

import Logo from './Logo';

// Extract unique categories and authors for filters
const UNIQUE_CATEGORIES = Array.from(new Set(ARTICLES.map(a => a.category))).sort();
const UNIQUE_AUTHORS = Array.from(new Set(ARTICLES.map(a => a.author))).sort();

export default function Navbar() {
  const { openConsultationModal } = useModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    author: '',
    startDate: '',
    endDate: ''
  });

  const [aiResponse, setAiResponse] = useState<{ 
    concise: string; 
    full: string; 
    sources?: { uri: string; title: string }[];
    relevantArticles?: Article[];
    stockData?: {
      symbol: string;
      price: string;
      change: string;
      changePercent: string;
      isPositive: boolean;
    };
  } | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleGlobalSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const query = overrideQuery || searchQuery;
    if (!query.trim()) return;

    setIsSearching(true);
    setAiResponse(null);
    if (!overrideQuery) setSearchQuery(query);

    // Local search for articles using fuzzy search
    let filteredArticles = [...ARTICLES];

    // Apply filters
    if (filters.category) {
      filteredArticles = filteredArticles.filter(a => a.category === filters.category);
    }
    if (filters.author) {
      filteredArticles = filteredArticles.filter(a => a.author === filters.author);
    }
    if (filters.startDate || filters.endDate) {
      filteredArticles = filteredArticles.filter(a => {
        const articleDate = new Date(a.date);
        if (filters.startDate && articleDate < new Date(filters.startDate)) return false;
        if (filters.endDate && articleDate > new Date(filters.endDate)) return false;
        return true;
      });
    }

    const fuse = new Fuse(filteredArticles, {
      keys: ['title', 'excerpt', 'keywords', 'category', 'author'],
      threshold: 0.4,
      distance: 100,
    });
    
    const localResults = query.trim() 
      ? fuse.search(query).map(result => result.item).slice(0, 3)
      : filteredArticles.slice(0, 3);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `The user is asking: "${query}". 
        
        Provide a professional, authoritative financial answer tailored to the Indian market context. 
        Use Google Search to ensure the information is accurate as of March 2026.
        
        If the query is about specific stocks, mutual funds, or tax laws (like Section 80C), provide the most recent data available.
        
        If the user is searching for a specific stock symbol (e.g., RELIANCE, TCS, AAPL), you MUST include the "stockData" object in your JSON response with the current price, change, and percentage change.
        
        Format your response as JSON with:
        - "concise": A punchy, one-sentence direct answer that summarizes the core fact.
        - "full": A detailed, multi-paragraph explanation with context, data points, and actionable advice.
        - "stockData": (Optional) An object containing symbol, price, change, changePercent, and isPositive (boolean).`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              concise: { type: "STRING" },
              full: { type: "STRING" },
              stockData: {
                type: "OBJECT",
                properties: {
                  symbol: { type: "STRING" },
                  price: { type: "STRING" },
                  change: { type: "STRING" },
                  changePercent: { type: "STRING" },
                  isPositive: { type: "BOOLEAN" }
                },
                required: ["symbol", "price", "change", "changePercent", "isPositive"]
              }
            },
            required: ["concise", "full"]
          }
        },
      });
      
      const data = JSON.parse(response.text || '{}');
      
      // Extract sources if available
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const sources = chunks?.map((chunk: any) => ({
        uri: chunk.web?.uri,
        title: chunk.web?.title
      })).filter((s: any) => s.uri && s.title);

      setAiResponse({ ...data, sources, relevantArticles: localResults });
    } catch (error: any) {
      console.error('Global Search Error:', error);
      let concise = "I encountered an error while searching.";
      let full = "Please try again in a moment. I'm having trouble connecting to my financial intelligence engine.";
      
      if (error.message?.includes('quota') || error.message?.includes('429')) {
        concise = "Free usage limit reached.";
        full = "I've reached my free usage limit for the moment. Please try again in a few minutes or check your plan for higher limits.";
      } else if (error.message?.includes('API key not valid')) {
        concise = "AI configuration error.";
        full = "The Gemini API key is invalid or missing. Please check your environment configuration in the settings menu.";
      }
      
      setAiResponse({ concise, full, relevantArticles: localResults });
    } finally {
      setIsSearching(false);
    }
  };

  const knowledgeLinks = [
    { name: 'Investment', href: '/guides/investment' },
    { name: 'Insurance', href: '/guides/insurance' },
    { name: 'Retirement', href: '/guides/retirement' },
    { name: 'Tax', href: '/guides/tax' },
    { name: 'Mutual Funds', href: '/guides/mutual-funds' },
    { name: 'Stock Market Basics', href: '/guides/stocks' },
    { name: 'Market Analysis', href: '/market-analysis' },
    { name: 'Blogs', href: '/insights' },
  ];

  const toolLinks = [
    { name: 'SIP Calculator', href: '/tools/sip' },
    { name: 'Lumpsum Calculator', href: '/tools/lumpsum' },
    { name: 'Home Loan EMI', href: '/tools/mortgage' },
    { name: 'Retirement Planner', href: '/tools/retirement' },
    { name: 'Insurance Needs', href: '/tools/insurance' },
    { name: 'Investment ROI', href: '/tools/roi' },
  ];

  const mainLinks = [
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'About Us', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 transition-colors">
      {/* Top Row: Logo & Knowledge Center & Insights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <Link to="/">
            <Logo size="lg" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {knowledgeLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'text-sm font-bold transition-colors hover:text-primary whitespace-nowrap',
                  location.pathname === link.href ? 'text-primary' : 'text-slate-600'
                )}
              >
                {link.name}
              </Link>
            ))}

            {/* Financial Tools Dropdown */}
            <div className="relative group">
              <button
                className={cn(
                  'flex items-center gap-1 text-sm font-bold transition-colors hover:text-primary whitespace-nowrap',
                  location.pathname.startsWith('/tools') ? 'text-primary' : 'text-slate-600'
                )}
              >
                Financial Tools <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-2">
                {toolLinks.map((tool) => (
                  <Link
                    key={tool.name}
                    to={tool.href}
                    className="block px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-slate-500 hover:text-primary transition-colors"
            >
              <Search className="w-6 h-6" />
            </button>
            <button
              className="lg:hidden p-2 text-slate-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Tools & Main Navigation */}
      <div className="bg-slate-50 border-t border-slate-100 hidden lg:block transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <nav className="flex items-center gap-10">
              {mainLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    'text-xs font-black uppercase tracking-widest transition-all hover:text-primary',
                    location.pathname === link.href ? 'text-primary' : 'text-slate-500'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <button
              onClick={() => openConsultationModal('Investment Planning')}
              className="bg-primary text-slate-900 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/20"
            >
              Get Started &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Global Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex flex-col"
          >
            <div className="max-w-4xl mx-auto w-full px-4 pt-20">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-widest">Smart Search</h2>
                </div>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-3 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleGlobalSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask anything about Indian finance, markets, or taxes..."
                    className="w-full bg-white/10 border-2 border-white/10 rounded-3xl py-6 pl-16 pr-44 text-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowFilters(!showFilters)}
                      className={cn(
                        "p-3 rounded-2xl transition-all flex items-center gap-2",
                        showFilters ? "bg-primary text-slate-900" : "bg-white/5 text-slate-400 hover:text-white"
                      )}
                    >
                      <Filter className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Filters</span>
                    </button>
                    <button 
                      type="submit"
                      disabled={isSearching}
                      className="bg-primary text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50"
                    >
                      {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white/5 border border-white/10 rounded-[2rem]">
                        <div>
                          <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Category</label>
                          <select
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
                          >
                            <option value="" className="bg-slate-900">All Categories</option>
                            {UNIQUE_CATEGORIES.map(cat => (
                              <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Author</label>
                          <select
                            value={filters.author}
                            onChange={(e) => setFilters({ ...filters, author: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
                          >
                            <option value="" className="bg-slate-900">All Authors</option>
                            {UNIQUE_AUTHORS.map(author => (
                              <option key={author} value={author} className="bg-slate-900">{author}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">From Date</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                            <input
                              type="date"
                              value={filters.startDate}
                              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 [color-scheme:dark]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">To Date</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                            <input
                              type="date"
                              value={filters.endDate}
                              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 [color-scheme:dark]"
                            />
                          </div>
                        </div>
                        <div className="md:col-span-4 flex justify-end gap-4 mt-2">
                          <button
                            type="button"
                            onClick={() => setFilters({ category: '', author: '', startDate: '', endDate: '' })}
                            className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                          >
                            Reset Filters
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              <div className="mt-12 overflow-y-auto max-h-[60vh] pr-4 no-scrollbar">
                {isSearching ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Consulting AI & Google Search...</p>
                  </div>
                ) : aiResponse ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8 pb-20"
                  >
                    {aiResponse.stockData && (
                      <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Activity className="w-32 h-32 text-primary" />
                        </div>
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-6">
                            <Activity className="w-5 h-5 text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Real-Time Market Data</span>
                          </div>
                          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                              <h3 className="text-4xl font-black text-white mb-2 tracking-tighter">{aiResponse.stockData.symbol}</h3>
                              <div className="flex items-center gap-4">
                                <span className="text-5xl font-black text-white tracking-tighter">{aiResponse.stockData.price}</span>
                                <div className={cn(
                                  "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-black uppercase tracking-widest",
                                  aiResponse.stockData.isPositive ? "bg-sky-500/20 text-sky-400 border border-sky-500/20" : "bg-rose-500/20 text-rose-400 border border-rose-500/20"
                                )}>
                                  {aiResponse.stockData.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                  {aiResponse.stockData.change} ({aiResponse.stockData.changePercent})
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Market Status</p>
                              <div className="flex items-center gap-2 justify-end">
                                <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                                <span className="text-xs font-bold text-sky-500 uppercase tracking-widest">Live from Exchange</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <Info className="w-5 h-5 text-primary" />
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">AI Summary</span>
                        </div>
                        <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-primary/20">
                          Quick Answer
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-white leading-tight mb-6">{aiResponse.concise}</p>
                      <div className="h-px bg-white/10 mb-6" />
                      <p className="text-slate-300 leading-relaxed text-lg">{aiResponse.full}</p>
                    </div>

                    {aiResponse.relevantArticles && aiResponse.relevantArticles.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-primary" />
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">Relevant Articles from BHP Finance</span>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          {aiResponse.relevantArticles.map((article) => (
                            <Link 
                              key={article.id}
                              to={`/article/${article.id}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="flex flex-col md:flex-row gap-6 p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all group"
                            >
                              <div className="md:w-32 h-24 rounded-2xl overflow-hidden shrink-0">
                                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              </div>
                              <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-[8px] font-black text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/10 rounded-full">{article.category}</span>
                                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{article.readTime}</span>
                                </div>
                                <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{article.title}</h4>
                                <p className="text-sm text-slate-400 line-clamp-2 mt-1">{article.excerpt}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {aiResponse.sources && aiResponse.sources.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-slate-500" />
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verified Sources</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {aiResponse.sources.map((source, idx) => (
                            <a 
                              key={idx}
                              href={source.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                            >
                              <span className="text-sm font-bold text-slate-300 truncate pr-4">{source.title}</span>
                              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-10 flex flex-col items-center justify-center gap-4">
                      <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                        <Sparkles className="w-3 h-3" />
                        Powered by Gemini 3 Flash • Real-time Financial Intelligence
                      </div>
                      <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest text-center max-w-md opacity-60 leading-relaxed">
                        Disclaimer: AI insights are for informational purposes and not financial advice. Consult a professional before investing.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <p className="col-span-full text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Suggested Topics</p>
                    {[
                      "Latest Nifty 50 trends",
                      "Tax saving options under 80C",
                      "Best mutual funds for 2024",
                      "How to start SIP in India",
                      "Home loan interest rates today",
                      "Retirement planning for NRIs"
                    ].map((topic) => (
                      <button
                        key={topic}
                        onClick={() => handleGlobalSearch(undefined, topic)}
                        className="text-left p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all group"
                      >
                        <p className="text-slate-300 font-bold group-hover:text-white transition-colors">{topic}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-8 space-y-8 max-h-[85vh] overflow-y-auto shadow-2xl transition-colors">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Knowledge & Insights</p>
            <div className="grid grid-cols-1 gap-y-4">
              {knowledgeLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-lg font-bold text-slate-900 hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Financial Tools</p>
            <div className="grid grid-cols-1 gap-y-4">
              {toolLinks.map((tool) => (
                <Link
                  key={tool.name}
                  to={tool.href}
                  className="text-lg font-bold text-slate-900 hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Explore BHP Finance</p>
            <div className="space-y-6">
              {mainLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-2xl font-bold text-slate-900 hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <button
            className="block w-full bg-primary text-slate-900 text-center py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20"
            onClick={() => {
              setIsMobileMenuOpen(false);
              openConsultationModal('Investment Planning');
            }}
          >
            Get Started
          </button>
        </div>
      )}
    </header>
  );
}

