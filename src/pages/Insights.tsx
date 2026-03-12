import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Loader2, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ARTICLES, CATEGORIES } from '@/src/constants';
import Fuse from 'fuse.js';
import ArticleCard from '@/src/components/ArticleCard';
import Sidebar from '@/src/components/Sidebar';
import BlurText from '@/src/components/BlurText';
import ChromaGrid from '@/src/components/ChromaGrid';
import { cn } from '@/src/lib/utils';

export default function Blogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

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

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 py-16 mb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <BlurText 
                text="Financial Blogs & Insights" 
                centered={false}
                className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight"
              />
              <p className="text-xl text-slate-600 leading-relaxed">
                Expert analysis, market trends, and financial wisdom for the modern Indian investor. Stay ahead with our latest market updates.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="hidden lg:block"
            >
              <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=675" 
                  alt="Financial Insights" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <main className="flex-1">
            {/* Search & Categories */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-12">
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={cn(
                        "px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all",
                        activeCategory === category
                          ? "bg-primary text-slate-900 shadow-md shadow-primary/20"
                          : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Article Grid */}
            <ChromaGrid 
              cols="grid-cols-1 md:grid-cols-2"
              radius={300}
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
              items={filteredArticles.map(article => ({
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

            {filteredArticles.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No results found</h3>
                <p className="text-slate-500">Try adjusting your search or category filters.</p>
              </div>
            )}

            {/* Pagination */}
            {filteredArticles.length > 0 && (
              <div className="mt-16 flex items-center justify-center gap-4">
                <button className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all disabled:opacity-50" disabled>
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <button className="w-12 h-12 rounded-2xl bg-primary text-slate-900 font-bold shadow-lg shadow-primary/20">1</button>
                  <button className="w-12 h-12 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:border-primary hover:text-primary transition-all">2</button>
                  <button className="w-12 h-12 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:border-primary hover:text-primary transition-all">3</button>
                </div>
                <button className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-600 hover:border-primary hover:text-primary transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <div className="lg:w-80 shrink-0">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
