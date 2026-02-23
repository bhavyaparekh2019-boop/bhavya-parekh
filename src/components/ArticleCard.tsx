import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark } from 'lucide-react';
import { Article } from '@/src/constants';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  key?: React.Key;
}

export default function ArticleCard({ article, featured }: ArticleCardProps): React.JSX.Element {
  const [isHovered, setIsHovered] = useState(false);

  const Tooltip = () => (
    <AnimatePresence>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute z-50 bottom-full left-0 right-0 mb-4 p-6 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 pointer-events-none"
        >
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 rotate-45 border-r border-b border-slate-800" />
          <h4 className="text-primary font-black uppercase tracking-widest text-[10px] mb-2">Full Preview</h4>
          <h3 className="text-lg font-bold mb-2 leading-tight">{article.title}</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{article.excerpt}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (featured) {
    return (
      <div 
        className="group relative flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Tooltip />
        <Link to={`/article/${article.id}`} className="md:w-1/2 overflow-hidden block">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </Link>
        <div className="p-6 md:p-10 md:w-1/2 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              Expert Verified
            </span>
            <span className="text-slate-500 text-xs font-medium">{article.readTime}</span>
          </div>
          <Link to={`/article/${article.id}`}>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-4 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
          </Link>
          <p className="text-slate-600 mb-8 line-clamp-3 text-lg leading-relaxed">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${article.author}`} alt={article.author} />
              </div>
              <span className="text-sm font-semibold text-slate-700">{article.author}</span>
            </div>
            <Link
              to={`/article/${article.id}`}
              className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              Read Report <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article 
      className="relative bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-primary/50 transition-all group hover:shadow-2xl flex flex-col md:flex-row h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Tooltip />
      <Link to={`/article/${article.id}`} className="md:w-2/5 overflow-hidden block">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full min-h-[240px] object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      </Link>
      <div className="p-8 md:p-10 flex flex-col flex-grow md:w-3/5">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-primary text-xs font-black uppercase tracking-[0.2em]">
            {article.category}
          </span>
          <span className="w-1 h-1 bg-slate-300 rounded-full" />
          <span className="text-slate-500 text-xs font-medium">{article.readTime}</span>
        </div>
        <Link to={`/article/${article.id}`}>
          <h4 className="text-2xl md:text-3xl font-black mb-4 text-slate-900 group-hover:text-primary transition-colors leading-tight">
            {article.title}
          </h4>
        </Link>
        <p className="text-base md:text-lg text-slate-600 mb-8 line-clamp-3 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
              <img src={`https://i.pravatar.cc/150?u=${article.author}`} alt={article.author} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900">{article.author}</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">{article.date}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-primary transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
            <Link 
              to={`/article/${article.id}`} 
              className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-primary hover:text-slate-900 transition-all flex items-center gap-2"
            >
              Read Full <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
