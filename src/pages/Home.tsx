import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Info, Loader2, TrendingUp, Shield, Sparkles, BarChart2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ARTICLES, CATEGORIES } from '@/src/constants';
import ArticleCard from '@/src/components/ArticleCard';
import Sidebar from '@/src/components/Sidebar';
import ChromaGrid from '@/src/components/ChromaGrid';
import { cn } from '@/src/lib/utils';
import { GoogleGenAI } from "@google/genai";
import BlurText from '@/src/components/BlurText';

export default function Home() {
  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [aiResponse, setAiResponse] = useState<{ concise: string; full: string; sources?: { uri: string; title: string }[] } | null>(null);
  const [showFullAiResponse, setShowFullAiResponse] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ARTICLES_PER_PAGE = 6;

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All Topics' || article.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  // Reset to first page when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  const featuredArticle = useMemo(() => filteredArticles.find((a) => a.featured), [filteredArticles]);
  
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ARTICLES_PER_PAGE;
    return filteredArticles.slice(start, start + ARTICLES_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const displayFeatured = useMemo(() => {
    return currentPage === 1 && paginatedArticles.some(a => a.id === featuredArticle?.id);
  }, [currentPage, paginatedArticles, featuredArticle]);

  const gridArticles = useMemo(() => {
    if (displayFeatured) {
      return paginatedArticles.filter(a => a.id !== featuredArticle?.id);
    }
    return paginatedArticles;
  }, [displayFeatured, paginatedArticles, featuredArticle]);

  const handleSmartSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setAiResponse(null);
    setShowFullAiResponse(false);

    try {
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
            ]
          });
          setIsSearching(false);
        }, 1500);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `The user is searching for "${searchQuery}" on an Indian financial insights blog. Provide a concise, expert financial summary or answer related to this query, specifically tailored to the Indian context (Rupees, Indian tax laws, market conditions). Use Google Search to ensure the information is current as of March 2026.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              concise: { type: "STRING", description: "A one-sentence, direct, and perfect answer to the query." },
              full: { type: "STRING", description: "A detailed explanation with context, data, and trends for 2026." }
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
        setAiResponse({ ...data, sources });
      } else {
        setAiResponse({ 
          concise: "I couldn't find a direct answer for that.", 
          full: "Please try a more specific financial query or check our latest articles." 
        });
      }
    } catch (error: any) {
      console.error('Smart Search Error:', error);
      setAiResponse({ 
        concise: "Search error occurred.", 
        full: error.message || "Sorry, I encountered an error while processing your request. Please try again." 
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
                BHP Insights: Expert Market Analysis, Professional Guidance, and the tools you need to build long-term wealth in the Indian market.
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
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=900" 
                  alt="Financial Growth" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 max-w-[200px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
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
      <div className="bg-slate-900 overflow-hidden py-4 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
            <Link to="/market-analysis" className="flex items-center gap-2 hover:text-primary transition-colors group">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-primary">Nifty 50</span>
              <span className="text-sm font-bold text-white">24,320.45</span>
              <span className="text-xs font-bold text-emerald-500">+1.24%</span>
            </Link>
            <Link to="/market-analysis" className="flex items-center gap-2 hover:text-primary transition-colors group">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-primary">Sensex</span>
              <span className="text-sm font-bold text-white">79,850.12</span>
              <span className="text-xs font-bold text-emerald-500">+0.98%</span>
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
              <span className="text-xs font-bold text-emerald-500">+0.45%</span>
            </Link>
            {/* Duplicate for seamless loop */}
            <Link to="/market-analysis" className="flex items-center gap-2 hover:text-primary transition-colors group">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-primary">Nifty 50</span>
              <span className="text-sm font-bold text-white">24,320.45</span>
              <span className="text-xs font-bold text-emerald-500">+1.24%</span>
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
            className="bg-slate-900 text-white overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-12">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-slate-900 shrink-0 shadow-lg shadow-primary/20">
                  <Info className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-black text-primary uppercase tracking-widest">AI Smart Insight</h3>
                    <button 
                      onClick={() => setAiResponse(null)}
                      className="text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                    >
                      Close
                    </button>
                  </div>
                  <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-p:leading-relaxed text-lg">
                    <p className="font-bold text-white mb-4">{aiResponse.concise}</p>
                    
                    {showFullAiResponse ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 pt-6 border-t border-slate-800"
                      >
                        <p className="text-slate-300">{aiResponse.full}</p>
                        
                        {aiResponse.sources && aiResponse.sources.length > 0 && (
                          <div className="mt-8 pt-8 border-t border-slate-800">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Verified Sources</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {aiResponse.sources.map((source, idx) => (
                                <a 
                                  key={idx}
                                  href={source.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
                                >
                                  <span className="text-xs font-bold text-slate-400 truncate pr-4">{source.title}</span>
                                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-primary transition-colors shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        <button 
                          onClick={() => setShowFullAiResponse(false)}
                          className="mt-6 text-primary text-sm font-bold hover:underline uppercase tracking-widest"
                        >
                          Show Less
                        </button>
                      </motion.div>
                    ) : (
                      <button 
                        onClick={() => setShowFullAiResponse(true)}
                        className="mt-2 text-primary text-sm font-bold hover:underline uppercase tracking-widest"
                      >
                        See Whole Result
                      </button>
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
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Why Choose BHP Finance?</h2>
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
                  src="https://images.unsplash.com/photo-1611974717483-3600997e5b47?auto=format&fit=crop&q=80&w=800&h=1000" 
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

      {/* Knowledge Center Section */}
      <section className="bg-slate-50 py-16 border-b border-slate-200">
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
            items={[
              {
                title: 'Investment',
                icon: TrendingUp,
                description: 'Build a resilient portfolio and leverage compounding in India.',
                url: '/guides/investment',
                borderColor: '#3B82F6',
                gradient: 'linear-gradient(145deg, #3B82F6, #000)'
              },
              {
                title: 'Insurance',
                icon: Shield,
                description: 'Complete walkthrough of life and health insurance for Indian families.',
                url: '/guides/insurance',
                borderColor: '#10B981',
                gradient: 'linear-gradient(180deg, #10B981, #000)'
              },
              {
                title: 'Retirement',
                icon: Loader2,
                description: 'Build a bulletproof corpus for a worry-free post-work life.',
                url: '/guides/retirement',
                borderColor: '#F59E0B',
                gradient: 'linear-gradient(135deg, #F59E0B, #000)'
              },
              {
                title: 'Tax Planning',
                icon: Info,
                description: 'Minimize liability and maximize take-home pay legally.',
                url: '/guides/tax',
                borderColor: '#6366F1',
                gradient: 'linear-gradient(145deg, #6366F1, #000)'
              },
              {
                title: 'Mutual Funds',
                icon: Sparkles,
                description: 'Master SIPs, ELSS, and professional wealth management.',
                url: '/guides/mutual-funds',
                borderColor: '#F43F5E',
                gradient: 'linear-gradient(160deg, #F43F5E, #000)'
              },
              {
                title: 'Stock Market',
                icon: BarChart2,
                description: 'Demystifying the stock market for beginners in India.',
                url: '/guides/stocks',
                borderColor: '#64748B',
                gradient: 'linear-gradient(180deg, #64748B, #000)'
              },
              {
                title: 'Market Analysis',
                icon: TrendingUp,
                description: 'Real-time data and AI-powered expert commentary on Indian markets.',
                url: '/market-analysis',
                borderColor: '#19d4e6',
                gradient: 'linear-gradient(145deg, #19d4e6, #000)'
              }
            ]}
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
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-20">
          {paginatedArticles.length > 0 ? (
            <>
              {/* Featured Article */}
              {displayFeatured && featuredArticle && (
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-slate-200" />
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                      {searchQuery ? 'Search Result' : 'Latest Market Update'}
                    </h2>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                  <ArticleCard article={featuredArticle} featured />
                </section>
              )}

              {/* Insights Grid */}
              <section className="space-y-12">
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
                    borderColor: '#3B82F6',
                    gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                  }))}
                />
              </section>
            </>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center pt-10">
              <nav className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="w-12 h-12 rounded-xl flex items-center justify-center border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
                  const isVisible = n === 1 || n === totalPages || (n >= currentPage - 1 && n <= currentPage + 1);
                  
                  if (isVisible) {
                    return (
                      <button
                        key={n}
                        onClick={() => {
                          setCurrentPage(n);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all',
                          n === currentPage 
                            ? 'bg-primary text-slate-900 shadow-lg shadow-primary/20' 
                            : 'border border-slate-200 hover:bg-slate-50'
                        )}
                      >
                        {n}
                      </button>
                    );
                  }
                  
                  if (n === currentPage - 2 || n === currentPage + 2) {
                    return <span key={n} className="px-2 text-slate-400 font-bold">...</span>;
                  }
                  
                  return null;
                })}

                <button 
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="w-12 h-12 rounded-xl flex items-center justify-center border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </nav>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
