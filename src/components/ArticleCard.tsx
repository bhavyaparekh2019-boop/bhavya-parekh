import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark, Sparkles, RefreshCcw } from 'lucide-react';
import { Article } from '@/src/constants';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useSmartImage } from '@/src/lib/hooks';
import { Loader2 } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  key?: React.Key;
}

const Tooltip = ({ isHovered, article }: { isHovered: boolean; article: Article }) => (
  <AnimatePresence>
    {isHovered && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="absolute z-50 bottom-full left-4 right-4 mb-[10px] p-6 bg-primary text-slate-900 rounded-2xl shadow-2xl border border-primary/20 pointer-events-none"
      >
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rotate-45 border-r border-b border-primary/20" />
        <div className="relative z-10">
          <h4 className="text-slate-900 font-black uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-slate-900 animate-pulse" />
            Quick Preview
          </h4>
          <h3 className="text-lg font-bold mb-2 leading-tight text-slate-900">{article.title}</h3>
          <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">{article.excerpt}</p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function ArticleCard({ article, featured }: ArticleCardProps): React.JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const { src, isLoading, refreshImage } = useSmartImage(article.image, article.title, article.category);
  const isAiGenerated = src.startsWith('data:image');
  const isPlaceholder = article.image.includes('picsum.photos') || !article.image;

  return (
    <article 
      className={cn(
        "group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex flex-col md:flex-row",
        featured ? "min-h-[500px]" : "min-h-[400px]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Tooltip isHovered={isHovered} article={article} />
      <div className="md:w-1/2 overflow-hidden block relative bg-slate-100">
        <Link to={`/article/${article.id}`} className="block h-full w-full">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-primary p-8 text-center">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="text-xs font-black uppercase tracking-widest">Generating relevant image...</p>
            </div>
          ) : (
            <>
              <img
                src={src}
                alt={article.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              {isAiGenerated && (
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md p-1.5 rounded-lg shadow-sm z-10">
                  <Sparkles className="w-3 h-3 text-primary" />
                </div>
              )}
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>
        
        {(isAiGenerated || isPlaceholder) && !isLoading && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              refreshImage();
            }}
            className="absolute top-4 right-4 z-20 bg-white/20 backdrop-blur-md text-white p-2 rounded-xl hover:bg-white/40 transition-all border border-white/20 opacity-0 group-hover:opacity-100"
            title="Regenerate AI Image"
          >
            <RefreshCcw className="w-3 h-3" />
          </button>
        )}
      </div>
      <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">
            {article.category}
          </span>
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{article.readTime}</span>
        </div>
        <Link to={`/article/${article.id}`}>
          <h3 className={cn(
            "font-black text-slate-900 leading-[1.1] mb-6 group-hover:text-primary transition-colors tracking-tight",
            featured ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"
          )}>
            {article.title}
          </h3>
        </Link>
        <p className="text-slate-600 mb-10 line-clamp-3 text-lg md:text-xl leading-relaxed font-medium">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between mt-auto pt-8 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
              <img src={`https://i.pravatar.cc/150?u=${article.author}`} alt={article.author} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{article.author}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{article.date}</span>
            </div>
          </div>
          <Link
            to={`/article/${article.id}`}
            className="group/btn flex items-center gap-2 text-slate-900 font-black text-sm uppercase tracking-widest hover:text-primary transition-colors"
          >
            Read Full <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
