import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, User, ChevronDown, Loader2, Info, ArrowRight, Globe, Sparkles, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useModal } from '@/src/context/ModalContext';
import { GoogleGenAI } from "@google/genai";

import Logo from './Logo';

export default function Navbar() {
  const { openConsultationModal } = useModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [aiResponse, setAiResponse] = useState<{ concise: string; full: string; sources?: { uri: string; title: string }[] } | null>(null);
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

  const handleGlobalSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setAiResponse(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `The user is asking: "${searchQuery}". Provide a professional, up-to-date financial answer tailored to the Indian market context. Use Google Search to ensure the information is current (March 2026).`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              concise: { type: "STRING", description: "A one-sentence direct answer." },
              full: { type: "STRING", description: "A detailed explanation with data and context." }
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

      setAiResponse({ ...data, sources });
    } catch (error: any) {
      console.error('Global Search Error:', error);
      let concise = "I encountered an error while searching.";
      let full = "Please try again in a moment. I'm having trouble connecting to my financial intelligence engine.";
      
      if (error.message?.includes('quota') || error.message?.includes('429')) {
        concise = "Free usage limit reached.";
        full = "I've reached my free usage limit for the moment. Please try again in a few minutes or check back later.";
      }
      
      setAiResponse({ concise, full });
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
    { name: 'Stocks', href: '/guides/stocks' },
    { name: 'Market Analysis', href: '/market-analysis' },
    { name: 'Blogs', href: '/insights' },
  ];

  const toolLinks = [
    { name: 'SIP Calculator', href: '/tools/sip' },
    { name: 'Home Loan EMI', href: '/tools/mortgage' },
    { name: 'Retirement Planner', href: '/tools/retirement' },
    { name: 'Insurance Needs', href: '/tools/insurance' },
    { name: 'Investment ROI', href: '/tools/roi' },
  ];

  const mainLinks = [
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
            className="fixed inset-0 z-[100] bg-primary/95 backdrop-blur-sm flex flex-col"
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

              <form onSubmit={handleGlobalSearch} className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask anything about Indian finance, markets, or taxes..."
                  className="w-full bg-white/10 border-2 border-white/10 rounded-3xl py-6 pl-16 pr-32 text-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 transition-all"
                />
                <button 
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                </button>
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
                    <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                      <div className="flex items-center gap-3 mb-6">
                        <Info className="w-5 h-5 text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">AI Summary</span>
                      </div>
                      <p className="text-2xl font-bold text-white leading-tight mb-6">{aiResponse.concise}</p>
                      <div className="h-px bg-white/10 mb-6" />
                      <p className="text-slate-300 leading-relaxed text-lg">{aiResponse.full}</p>
                    </div>

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
                        onClick={() => {
                          setSearchQuery(topic);
                          // Trigger search manually would be better but let's just set it
                        }}
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

