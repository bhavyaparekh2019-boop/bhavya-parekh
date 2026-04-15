import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark, Sparkles, RefreshCcw } from 'lucide-react';
import { Article } from '@/constants';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useSmartImage } from '@/lib/hooks';
import { Loader2 } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  layout?: 'horizontal' | 'vertical';
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

export default function ArticleCard({ article, featured, layout = 'horizontal' }: ArticleCardProps): React.JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const { src, isLoading, refreshImage } = useSmartImage(article.image, article.title, article.category);
  const [hasError, setHasError] = useState(false);
  const isAiGenerated = src.startsWith('data:image');
  const isPlaceholder = article.image.includes('picsum.photos') || article.image.includes('placeholder.com') || !article.image;

  const isVertical = layout === 'vertical';

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      refreshImage();
    }
  };

  return (
    <article 
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] flex flex-col",
        !isVertical && "md:flex-row",
        featured ? "min-h-[250px]" : "min-h-[180px]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Tooltip isHovered={isHovered} article={article} />
      <div className={cn(
        "overflow-hidden block relative bg-slate-100",
        isVertical ? "aspect-video w-full" : "md:w-2/5"
      )}>
        <Link to={`/article/${article.id}`} className="block h-full w-full">
          {isLoading ? (
            <div className="absolute inset-0 bg-slate-200 animate-pulse flex flex-col items-center justify-center gap-4 text-slate-400 p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/50 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">AI Visualizer</p>
                <p className="text-[8px] font-bold uppercase tracking-widest opacity-60">Crafting unique illustration...</p>
              </div>
            </div>
          ) : (
            <>
              {hasError && !isAiGenerated ? (
                <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center gap-2 text-slate-400 p-4 text-center">
                  <Sparkles className="w-6 h-6 opacity-20" />
                  <p className="text-[8px] font-black uppercase tracking-widest">Image Unavailable</p>
                </div>
              ) : (
                <img
                  src={src}
                  alt={article.title}
                  onError={handleImageError}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              )}
              {isAiGenerated && (
                <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md p-1 rounded-lg shadow-sm z-10 border border-white/50">
                  <Sparkles className="w-2.5 h-2.5 text-primary" />
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
            className="absolute top-3 right-3 z-20 bg-white/20 backdrop-blur-md text-white p-1.5 rounded-xl hover:bg-white/40 transition-all border border-white/20 opacity-0 group-hover:opacity-100"
            title="Regenerate AI Image"
          >
            <RefreshCcw className="w-2.5 h-2.5" />
          </button>
        )}
      </div>
      <div className={cn(
        "p-3 md:p-4 flex flex-col justify-center",
        !isVertical && "md:w-3/5"
      )}>
        <Link to={`/article/${article.id}`}>
          <h3 className={cn(
            "font-black text-slate-900 leading-[1.1] mb-1 group-hover:text-primary transition-colors tracking-tight",
            featured ? "text-xl md:text-2xl" : "text-lg md:text-xl"
          )}>
            {article.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-primary/10 text-primary text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-[0.2em]">
            {article.category}
          </span>
          <span className="text-slate-400 text-[8px] font-bold uppercase tracking-widest">{article.readTime}</span>
        </div>
        <p className="text-slate-600 mb-3 line-clamp-2 text-xs md:text-sm leading-relaxed font-medium">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
              <img src={`https://i.pravatar.cc/150?u=${article.author}`} alt={article.author} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-900 uppercase tracking-tight">{article.author}</span>
              <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">{article.date}</span>
            </div>
          </div>
          <Link
            to={`/article/${article.id}`}
            className="group/btn flex items-center gap-1 text-slate-900 font-black text-[9px] uppercase tracking-widest hover:text-primary transition-colors"
          >
            Read <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
