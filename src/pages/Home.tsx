import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Info, Loader2, TrendingUp, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ARTICLES, CATEGORIES } from '@/src/constants';
import ArticleCard from '@/src/components/ArticleCard';
import Sidebar from '@/src/components/Sidebar';
import { cn } from '@/src/lib/utils';
import { GoogleGenAI } from "@google/genai";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [aiResponse, setAiResponse] = useState<{ concise: string; full: string } | null>(null);
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
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `The user is searching for "${searchQuery}" on an Indian financial insights blog. Provide a concise, expert financial summary or answer related to this query, specifically tailored to the Indian context (Rupees, Indian tax laws, market conditions).`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              concise: { type: "STRING", description: "A one-sentence, direct, and perfect answer to the query." },
              full: { type: "STRING", description: "A detailed explanation with context, data, and trends for 2024." }
            },
            required: ["concise", "full"]
          }
        },
      });
      
      const data = JSON.parse(response.text || '{}');
      if (data.concise && data.full) {
        setAiResponse(data);
      } else {
        setAiResponse({ 
          concise: "I couldn't find a direct answer for that.", 
          full: "Please try a more specific financial query or check our latest articles." 
        });
      }
    } catch (error) {
      console.error('Smart Search Error:', error);
      setAiResponse({ 
        concise: "Search error occurred.", 
        full: "Sorry, I encountered an error while processing your request. Please try again." 
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

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight"
          >
            Financial Wisdom for <span className="text-primary">Your Future</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            BHP Insights: Expert Market Analysis, Professional Guidance, and the tools you need to build long-term wealth in the Indian market.
          </motion.p>

          {/* Hero Search */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
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
                placeholder="Search for financial topics, guides, or market reports..."
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
      </section>

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
                        <button 
                          onClick={() => setShowFullAiResponse(false)}
                          className="mt-4 text-primary text-sm font-bold hover:underline uppercase tracking-widest"
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

      {/* Knowledge Center Section */}
      <section className="bg-slate-50 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Knowledge Center</h2>
              <p className="text-slate-500 mt-1">Master the fundamentals of finance with our comprehensive guides.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Investment</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                Build a resilient portfolio and leverage compounding in India.
              </p>
              <Link 
                to="/guides/investment" 
                className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all text-sm"
              >
                Start Learning <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Insurance</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                Complete walkthrough of life and health insurance for Indian families.
              </p>
              <Link 
                to="/guides/insurance" 
                className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all text-sm"
              >
                Explore Guide <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Loader2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Retirement</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                Build a bulletproof corpus for a worry-free post-work life.
              </p>
              <Link 
                to="/guides/retirement" 
                className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all text-sm"
              >
                Plan Future <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Tax Planning</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                Minimize liability and maximize take-home pay legally.
              </p>
              <Link 
                to="/guides/tax" 
                className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all text-sm"
              >
                Save Tax <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
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
                {gridArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
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
