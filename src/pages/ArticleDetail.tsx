import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, Share2, Bookmark, MessageSquare, Sparkles, Loader2, Info } from 'lucide-react';
import { ARTICLES } from '@/src/constants';
import Sidebar from '@/src/components/Sidebar';
import BlurText from '@/src/components/BlurText';
import { cn } from '@/src/lib/utils';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const article = ARTICLES.find((a) => a.id === id);
  
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

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

  const generateAiSummary = async () => {
    if (!article || isSummarizing) return;
    
    setIsSummarizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Summarize the following financial article titled "${article.title}". Provide 3-4 key actionable takeaways for an investor. Article content: ${article.content.replace(/<[^>]*>?/gm, '')}`,
        config: {
          systemInstruction: "You are a senior financial analyst. Provide a concise, professional summary with clear bullet points for key takeaways.",
        }
      });
      setAiSummary(response.text || "Could not generate summary.");
    } catch (error) {
      console.error('AI Summary Error:', error);
      setAiSummary("Error generating AI summary. Please try again.");
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
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-primary transition-colors mb-6 font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Insights
            </Link>
            <span className="inline-block bg-primary text-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded mb-4">
              {article.category}
            </span>
            <BlurText 
              text={article.title}
              centered={false}
              className="text-4xl md:text-6xl font-black text-white leading-tight max-w-4xl mb-6"
            />
            
            <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
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
                className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-slate-900 px-4 py-2 rounded-xl transition-all font-bold text-sm disabled:opacity-50"
              >
                {isSummarizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                AI Summary
              </button>
            </div>
          </div>

          {/* AI Summary Box */}
          <AnimatePresence>
            {aiSummary && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 p-8 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-24 h-24 text-primary" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-slate-900">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black text-primary uppercase tracking-widest">AI Executive Summary</h3>
                  </div>
                  <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
                    {aiSummary.split('\n').map((line, i) => (
                      <p key={i} className="mb-2">{line}</p>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                    <Info className="w-3 h-3" />
                    Powered by Gemini 3 Flash
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

          {/* Related Articles Suggestion */}
          <div className="mt-20">
            <h3 className="text-2xl font-black text-slate-900 mb-8">Related Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link 
                  key={related.id} 
                  to={`/article/${related.id}`}
                  className="group block bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="aspect-video overflow-hidden">
                    <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-4">
                    <span className="text-primary text-[10px] font-black uppercase tracking-widest">{related.category}</span>
                    <h4 className="text-base font-bold mt-2 text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight">{related.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
