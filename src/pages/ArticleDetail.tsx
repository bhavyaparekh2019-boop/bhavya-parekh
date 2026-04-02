import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, Share2, Bookmark, MessageSquare, Sparkles, Loader2, Info, ChevronDown, ChevronUp, RefreshCcw } from 'lucide-react';
import { ARTICLES } from '@/constants';
import Sidebar from '@/components/Sidebar';
import BlurText from '@/components/BlurText';
import { cn } from '@/lib/utils';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { useSmartImage } from '@/lib/hooks';
import Markdown from 'react-markdown';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const article = ARTICLES.find((a) => a.id === id);
  
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const { src, isLoading, refreshImage } = useSmartImage(article?.image || '', article?.title || '', article?.category || '');
  const isAiGenerated = src.startsWith('data:image');
  const isPlaceholder = article?.image.includes('picsum.photos') || !article?.image;

  const relatedArticles = React.useMemo(() => {
    if (!article) return [];
    
    return ARTICLES
      .filter(a => a.id !== article.id)
      .map(a => {
        let score = 0;
        if (a.category === article.category) score += 5;
        
        // Calculate keyword overlap
        const commonKeywords = a.keywords.filter(k => article.keywords.includes(k));
        score += commonKeywords.length * 2;
        
        return { ...a, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [article]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setAiSummary(null); // Reset summary when article changes
  }, [id]);

  const RelatedCard = ({ article: related, index }: { article: any; index: number }) => {
    const { src, isLoading } = useSmartImage(related.image, related.title, related.category);
    const isAiGenerated = src.startsWith('data:image');

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
      >
        <Link 
          to={`/article/${related.id}`}
          className="group block bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border border-slate-100 h-full"
        >
          <div className="aspect-[4/3] overflow-hidden relative bg-slate-50">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <img 
                  src={src} 
                  alt={related.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  referrerPolicy="no-referrer" 
                />
                {isAiGenerated && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-lg shadow-sm">
                      <Sparkles className="w-3 h-3 text-primary" />
                    </div>
                  </div>
                )}
              </>
            )}
            <div className="absolute top-4 right-4">
              <span className="bg-white/90 backdrop-blur-md text-primary text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg shadow-sm">
                {related.category}
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">
              <Calendar className="w-3 h-3" />
              {related.date}
            </div>
            <h4 className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-4">
              {related.title}
            </h4>
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all mt-auto">
              Read Article <ArrowLeft className="w-3 h-3 rotate-180" />
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  const generateAiSummary = async () => {
    if (!article || isSummarizing) return;
    
    if (aiSummary) {
      setIsSummaryOpen(!isSummaryOpen);
      return;
    }

    setIsSummarizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Summarize the following financial article titled "${article.title}". Provide 3-4 key actionable takeaways for an investor. Use markdown formatting with bullet points. Article content: ${article.content.replace(/<[^>]*>?/gm, '')}`,
        config: {
          systemInstruction: "You are a senior financial analyst. Provide a concise, professional summary with clear bullet points for key takeaways. Use markdown.",
        }
      });
      setAiSummary(response.text || "Could not generate summary.");
      setIsSummaryOpen(true);
    } catch (error: any) {
      console.error('AI Summary Error:', error);
      if (error.message?.includes('quota') || error.message?.includes('429')) {
        setAiSummary("I've reached my free usage limit for the moment. Please try again in a few minutes.");
      } else {
        setAiSummary("Error generating AI summary. Please try again.");
      }
      setIsSummaryOpen(true);
    } finally {
      setIsSummarizing(false);
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Article Not Found</h2>
        <p className="text-slate-600 mb-8 text-center max-w-md">
          The article you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="bg-primary text-slate-900 px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Article Header */}
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden bg-slate-100">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-primary">
            <Loader2 className="w-12 h-12 animate-spin" />
            <p className="text-sm font-black uppercase tracking-widest">Generating relevant image...</p>
          </div>
        ) : (
          <>
            <img
              src={src}
              alt={article.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {isAiGenerated && (
              <div className="absolute top-8 left-8 z-20 bg-white/20 backdrop-blur-md p-2 rounded-xl border border-white/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent" />
        
        {(isAiGenerated || isPlaceholder) && !isLoading && (
          <div className="absolute top-8 right-8 z-20">
            <button
              onClick={refreshImage}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/30 transition-all border border-white/20"
              title="Regenerate AI Image"
            >
              <RefreshCcw className="w-3 h-3" />
              Regenerate
            </button>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors mb-6 font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <span className="inline-block bg-white text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded mb-4">
              {article.category}
            </span>
            <BlurText 
              text={article.title}
              centered={false}
              className="text-4xl md:text-6xl font-black text-white leading-tight max-w-4xl mb-6"
            />
            
            <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-white" />
                <span className="font-semibold text-white">{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8">
          {/* Social Actions Bar */}
          <div className="flex items-center justify-between py-6 border-y border-slate-100 mb-12">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm">
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm">
                <Bookmark className="w-4 h-4" /> Save
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={generateAiSummary}
                disabled={isSummarizing}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm disabled:opacity-50",
                  aiSummary 
                    ? "bg-slate-100 text-slate-900 hover:bg-slate-200" 
                    : "bg-primary/10 text-primary hover:bg-primary hover:text-slate-900"
                )}
              >
                {isSummarizing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  aiSummary ? (isSummaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />) : <Sparkles className="w-4 h-4" />
                )}
                {aiSummary ? (isSummaryOpen ? 'Hide Summary' : 'Show Summary') : 'AI Summary'}
              </button>
            </div>
          </div>

          {/* AI Summary Box */}
          <AnimatePresence>
            {aiSummary && isSummaryOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-12 overflow-hidden"
              >
                <div className="p-8 bg-primary/10 text-slate-900 rounded-3xl border border-primary/20 relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles className="w-24 h-24 text-primary" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">AI Executive Summary</h3>
                      </div>
                      <button 
                        onClick={() => setIsSummaryOpen(false)}
                        className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
                      >
                        <ChevronUp className="w-5 h-5 text-slate-500" />
                      </button>
                    </div>
                    <div className="markdown-body prose prose-slate max-w-none text-slate-800 leading-relaxed">
                      <Markdown>{aiSummary}</Markdown>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
                      <Info className="w-3 h-3" />
                      Powered by Gemini 3 Flash • Actionable Insights
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Article Content */}
          <div 
            className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-primary prose-strong:text-slate-900"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Author Bio */}
          <div className="mt-20 p-8 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden shrink-0 shadow-xl border-4 border-white">
              <img src={`https://i.pravatar.cc/150?u=${article.author}`} alt={article.author} />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-900 mb-2">{article.author}</h4>
              <p className="text-slate-500 text-sm mb-4 font-medium uppercase tracking-wider">Senior Financial Analyst at BHP Finance</p>
              <p className="text-slate-600 leading-relaxed">
                Expert in global market trends and wealth management strategies. With over 15 years of experience in the financial sector, providing actionable insights for high-net-worth individuals and institutional investors.
              </p>
            </div>
          </div>

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <div className="mt-24 pt-16 border-t border-slate-100">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Related Articles</h3>
                  <p className="text-slate-500 mt-2 font-medium">Hand-picked insights based on your interests</p>
                </div>
                <Link to="/" className="text-primary font-black text-xs uppercase tracking-widest hover:underline underline-offset-8">
                  View All Insights
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedArticles.map((related, index) => (
                  <RelatedCard key={related.id} article={related} index={index} />
                ))}
              </div>
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
