import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User, Minimize2, Maximize2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '@/src/lib/utils';
import Markdown from 'react-markdown';

interface Message {
  role: 'user' | 'model' | 'error';
  text: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your BHP Finance assistant. How can I help you with your financial planning today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      
      // Fallback to mock response if API key is missing
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'undefined' || apiKey === '') {
        console.warn('Gemini API key is missing. Falling back to mock chat response.');
        setTimeout(() => {
          const mockResponses: { [key: string]: string } = {
            "default": "I'm here to help with your financial queries! Since I'm currently in demo mode (no API key configured), I can provide general information about investments, insurance, and tax planning in India.",
            "hello": "Hello! How can I assist you with your financial planning today?",
            "investment": "Investment planning is key to wealth creation. We recommend looking at a mix of Equity Mutual Funds, PPF, and potentially direct stocks depending on your risk appetite.",
            "tax": "For tax saving in India, Section 80C is the most popular, allowing deductions up to ₹1.5 Lakhs through instruments like ELSS, PPF, and LIC.",
            "insurance": "Insurance is a vital part of financial security. We suggest having a Term Life Insurance and a comprehensive Health Insurance policy for you and your family."
          };

          const lowerMsg = userMessage.toLowerCase();
          let responseText = mockResponses["default"];
          
          if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) responseText = mockResponses["hello"];
          else if (lowerMsg.includes("invest")) responseText = mockResponses["investment"];
          else if (lowerMsg.includes("tax")) responseText = mockResponses["tax"];
          else if (lowerMsg.includes("insur")) responseText = mockResponses["insurance"];

          setMessages(prev => [...prev, { role: 'model', text: responseText }]);
          setIsLoading(false);
        }, 1000);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Initialize chat if not already done
      if (!chatRef.current) {
        chatRef.current = ai.chats.create({
          model: "gemini-3-flash-preview",
          config: {
            systemInstruction: `You are the BHP Finance AI Assistant. You are an expert in financial planning, investment strategies, insurance (life, health, general), and market analysis. 
            Your goal is to provide helpful, accurate, and professional financial advice tailored to the Indian context (Rupees, Indian tax laws like Section 80C/80D, Indian retirement schemes like EPF/PPF/NPS).
            Always maintain a professional yet approachable tone. 
            If asked about specific tools on the site, mention the Home Loan Calculator, Retirement Planner, Investment ROI Calculator, and Insurance Planner.
            Keep responses concise but informative. Use markdown for formatting where appropriate.
            If the user asks for specific Indian market data, use your internal knowledge or suggest they use the search tools on the home page which have real-time search capabilities.`,
          },
        });
      }

      const response = await chatRef.current.sendMessage({ message: userMessage });
      const modelText = response.text || "I'm sorry, I couldn't process that request.";
      
      setMessages(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (error: any) {
      console.error('Chat Error:', error);
      let errorMessage = "Sorry, I'm having trouble connecting right now. Please check your internet connection.";
      
      if (error.message?.includes('quota') || error.message?.includes('429')) {
        errorMessage = "I've reached my free usage limit for the moment. Please try again in a few minutes.";
      } else if (error.message?.includes('API key not valid')) {
        errorMessage = "The AI service is currently misconfigured. Please contact support.";
      } else if (error.name === 'AbortError' || error.message?.includes('fetch')) {
        errorMessage = "Network error: Unable to reach the AI service. Please check your connection.";
      }
      
      setMessages(prev => [...prev, { role: 'error', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 w-16 h-16 bg-primary text-slate-900 rounded-2xl shadow-2xl flex items-center justify-center z-50 transition-transform",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <MessageCircle className="w-8 h-8" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '64px' : '600px',
              width: '400px'
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-200 z-50 flex flex-col overflow-hidden transition-colors"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between text-slate-900 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest">BHP Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-slate-700 font-bold">ONLINE</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                  {messages.map((msg, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: msg.role === 'user' ? 20 : (msg.role === 'error' ? 0 : -20), y: msg.role === 'error' ? 10 : 0 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      key={i}
                      className={cn(
                        "flex gap-3",
                        msg.role === 'user' ? "ml-auto flex-row-reverse max-w-[85%]" : (msg.role === 'error' ? "w-full" : "mr-auto max-w-[85%]")
                      )}
                    >
                      {msg.role === 'error' ? (
                        <div className="w-full bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-3 text-rose-700 shadow-sm">
                          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs font-bold mb-2 uppercase tracking-tight">Connection Issue</p>
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            <button 
                              onClick={() => {
                                // Remove the error message and retry the last user message
                                const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.text;
                                if (lastUserMsg) {
                                  setMessages(prev => prev.filter((_, idx) => idx !== i));
                                  setInput(lastUserMsg);
                                  // We can't easily call handleSend directly here without refactoring, 
                                  // but setting input lets the user just click send again.
                                  // Actually, let's try to trigger it.
                                }
                              }}
                              className="mt-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-rose-800 hover:text-rose-900 transition-colors"
                            >
                              <RefreshCw className="w-3 h-3" /> Try Again
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                            msg.role === 'user' ? "bg-slate-200 text-slate-600" : "bg-primary text-slate-900"
                          )}>
                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>
                          <div className={cn(
                            "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                            msg.role === 'user' 
                              ? "bg-primary text-slate-900 rounded-tr-none" 
                              : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                          )}>
                            <div className="markdown-body">
                              <Markdown>{msg.text}</Markdown>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 mr-auto">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-slate-900 shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form 
                  onSubmit={handleSend}
                  className="p-4 bg-white border-t border-slate-100 flex items-center gap-3"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about investments, planning..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="w-12 h-12 bg-primary text-slate-900 rounded-xl flex items-center justify-center hover:brightness-110 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
