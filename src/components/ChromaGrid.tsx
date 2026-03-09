import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, ArrowRight } from 'lucide-react';
import gsap from 'gsap';

interface ChromaItem {
  image?: string;
  title: string;
  subtitle?: string;
  handle?: string;
  borderColor?: string;
  gradient?: string;
  url?: string;
  icon?: React.ElementType;
  description?: string;
  details?: string[];
  category?: string;
  readTime?: string;
  author?: string;
  date?: string;
}

interface ChromaGridProps {
  items: ChromaItem[];
  radius?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
  className?: string;
  cols?: string;
}

export default function ChromaGrid({
  items,
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out',
  className = '',
  cols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
}: ChromaGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<ChromaItem | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll('.chroma-card-inner');
    const glowEffects = container.querySelectorAll('.chroma-glow');
    
    // Pre-create setters for better performance
    const opacitySetters = Array.from(glowEffects).map(glow => gsap.quickSetter(glow, "opacity"));
    const backgroundSetters = Array.from(glowEffects).map(glow => gsap.quickSetter(glow, "background"));

    // Cache card positions to avoid layout thrashing
    let cardRects: DOMRect[] = [];
    let containerRect: DOMRect;

    const updateRects = () => {
      containerRect = container.getBoundingClientRect();
      cardRects = Array.from(cards).map(card => card.getBoundingClientRect());
    };

    // Initial update
    updateRects();

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRect) return;
      
      const mouseX = e.clientX - containerRect.left;
      const mouseY = e.clientY - containerRect.top;

      glowEffects.forEach((glow, index) => {
        const cardRect = cardRects[index];
        if (!cardRect) return;

        const cardCenterX = cardRect.left + cardRect.width / 2 - containerRect.left;
        const cardCenterY = cardRect.top + cardRect.height / 2 - containerRect.top;

        const dist = Math.sqrt(
          Math.pow(mouseX - cardCenterX, 2) + 
          Math.pow(mouseY - cardCenterY, 2)
        );

        const opacity = Math.max(0, 1 - dist / radius) * fadeOut;
        opacitySetters[index](opacity);
        
        if (opacity > 0) {
          const localX = mouseX - (cardRect.left - containerRect.left);
          const localY = mouseY - (cardRect.top - containerRect.top);
          backgroundSetters[index](`radial-gradient(circle at ${localX}px ${localY}px, ${items[index].borderColor || '#3B82F6'} 0%, transparent 70%)`);
        }
      });
    };

    const handleMouseLeave = () => {
      opacitySetters.forEach(setter => setter(0));
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', updateRects);
    window.addEventListener('scroll', updateRects, { passive: true });
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', updateRects);
      window.removeEventListener('scroll', updateRects);
    };
  }, [items, radius, fadeOut]);

  return (
    <>
      <div 
        ref={containerRef}
        className={`grid ${cols} gap-8 ${className}`}
      >
        {items.map((item, index) => (
          <ChromaCard 
            key={index} 
            item={item} 
            onViewDetails={() => setSelectedItem(item)}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 sm:p-12">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-6 mb-8">
                  {selectedItem.icon && (
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <selectedItem.icon className="w-8 h-8" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-1">{selectedItem.title}</h2>
                    {selectedItem.subtitle && <p className="text-primary font-bold uppercase tracking-widest text-xs">{selectedItem.subtitle}</p>}
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Overview</h3>
                    <p className="text-slate-600 leading-relaxed text-lg">{selectedItem.description}</p>
                  </div>

                  {selectedItem.details && selectedItem.details.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Key Details</h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedItem.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold shrink-0 mt-0.5">
                              {idx + 1}
                            </div>
                            <span className="text-sm text-slate-700 font-medium">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedItem.url && (
                    <button 
                      onClick={() => {
                        if (selectedItem.url?.startsWith('http')) {
                          window.open(selectedItem.url, '_blank');
                        } else {
                          window.location.href = selectedItem.url || '#';
                        }
                      }}
                      className="w-full bg-primary text-slate-900 font-black py-5 rounded-2xl text-sm uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    >
                      Explore More <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function ChromaCard({ 
  item, 
  onViewDetails
}: { 
  item: ChromaItem; 
  onViewDetails: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = item.icon;
  const isArticle = !!item.category;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative group cursor-pointer h-full chroma-card-inner"
      onClick={(e) => {
        if (item.url) {
          if (item.url.startsWith('http')) {
            window.open(item.url, '_blank');
          } else {
            window.location.href = item.url;
          }
        } else if (!isArticle) {
          onViewDetails();
        }
      }}
    >
      {/* Glow Effect */}
      <div 
        className="chroma-glow absolute -inset-px rounded-[2.5rem] opacity-0 pointer-events-none z-0"
      />

      <div className="relative bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col z-10 overflow-hidden">
        {item.image && (
          <div className={isArticle ? "h-48 -mx-8 -mt-8 mb-6 overflow-hidden" : "w-16 h-16 rounded-2xl overflow-hidden mb-6 border-2"} style={!isArticle ? { borderColor: item.borderColor || '#3B82F6' } : {}}>
            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
          </div>
        )}
        
        {!item.image && Icon && (
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 transition-colors group-hover:bg-primary/10">
            <Icon className="w-8 h-8 text-slate-600 group-hover:text-primary transition-colors" />
          </div>
        )}

        <div className="flex-1">
          {isArticle && (
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">
                {item.category}
              </span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{item.readTime}</span>
            </div>
          )}

          <h3 className={isArticle ? "text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-primary transition-colors" : "text-xl font-bold text-slate-900 mb-1"}>
            {item.title}
          </h3>
          
          {item.subtitle && <p className="text-sm font-medium text-primary mb-2">{item.subtitle}</p>}
          {item.handle && <p className="text-xs text-slate-400 font-mono mb-4">{item.handle}</p>}
          {item.description && <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">{item.description}</p>}
        </div>

        {isArticle ? (
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                <img src={`https://i.pravatar.cc/100?u=${item.author}`} alt={item.author} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-900 uppercase">{item.author}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">{item.date}</span>
              </div>
            </div>
            <div className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
              Read <span className="hidden sm:inline">More</span> →
            </div>
          </div>
        ) : (
          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">
              View Details
            </span>
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1"
              style={{ backgroundColor: `${item.borderColor || '#3B82F6'}10`, color: item.borderColor || '#3B82F6' }}
            >
              →
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
