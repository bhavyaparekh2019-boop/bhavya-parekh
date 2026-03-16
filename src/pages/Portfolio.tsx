import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  X,
  Trash2, 
  RefreshCw, 
  PieChart as PieChartIcon, 
  BarChart3, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  Loader2,
  AlertCircle,
  Settings
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { GoogleGenAI } from "@google/genai";
import { cn } from '@/src/lib/utils';

interface Investment {
  id: string;
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice?: number;
  lastUpdated?: string;
  sourceUrl?: string;
}

const COLORS = ['#3B82F6', '#0ea5e9', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

export default function Portfolio() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(60); // 30, 60, or 0 for manual
  const [countdown, setCountdown] = useState(60);
  
  // Stock details state
  const [selectedStock, setSelectedStock] = useState<Investment | null>(null);
  const [stockDetails, setStockDetails] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Form state
  const [newSymbol, setNewSymbol] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const priceCache = useRef<Record<string, { price: number; timestamp: number; sourceUrl?: string }>>({});
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bhp_portfolio');
    if (saved) {
      try {
        setInvestments(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse portfolio', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('bhp_portfolio', JSON.stringify(investments));
  }, [investments]);

  // Auto-refresh logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (refreshInterval > 0 && investments.length > 0) {
      interval = setInterval(() => {
        refreshPrices();
        setCountdown(refreshInterval);
      }, refreshInterval * 1000);
    }
    return () => clearInterval(interval);
  }, [refreshInterval, investments.length]);

  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (refreshInterval > 0 && investments.length > 0) {
      timer = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : refreshInterval));
      }, 1000);
    } else {
      setCountdown(refreshInterval || 60);
    }
    return () => clearInterval(timer);
  }, [refreshInterval, investments.length]);

  const fetchStockDetails = async (investment: Investment) => {
    setSelectedStock(investment);
    setIsLoadingDetails(true);
    setStockDetails(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Fetch detailed financial information for the Indian stock symbol: ${investment.symbol}.
        Search for the most recent data from reliable sources like NSE, BSE, or Google Finance.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              marketCap: { type: "STRING", description: "Market Cap in INR Crores" },
              peRatio: { type: "STRING", description: "P/E Ratio" },
              fiftyTwoWeekHigh: { type: "STRING", description: "52-Week High price in INR" },
              fiftyTwoWeekLow: { type: "STRING", description: "52-Week Low price in INR" },
              dividendYield: { type: "STRING", description: "Dividend Yield percentage" },
              sector: { type: "STRING", description: "Industry sector" },
              summary: { type: "STRING", description: "1-2 sentence business summary" },
              analystRating: { type: "STRING", description: "Consensus analyst rating (Buy, Hold, Sell, Strong Buy, etc.)" },
              targetPrice: { type: "STRING", description: "Average analyst target price in INR" }
            },
            required: ["marketCap", "peRatio", "fiftyTwoWeekHigh", "fiftyTwoWeekLow", "analystRating", "targetPrice"]
          }
        },
      });

      const text = response.text;
      if (text) {
        let details = {};
        try {
          details = JSON.parse(text);
        } catch (e) {
          const match = text.match(/\{[\s\S]*\}/);
          if (match) details = JSON.parse(match[0]);
        }
        setStockDetails(details);
      }
    } catch (err) {
      console.error('Failed to fetch stock details', err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const refreshPrices = async () => {
    if (investments.length === 0) return;
    setIsRefreshing(true);
    setError(null);

    const now = Date.now();
    
    // Identify symbols that need refreshing (not in cache or cache expired)
    const symbolsToFetch = investments
      .map(inv => inv.symbol.toUpperCase())
      .filter(symbol => {
        const cached = priceCache.current[symbol];
        return !cached || (now - cached.timestamp > CACHE_DURATION);
      });

    // If all prices are fresh in cache, just update the state and return
    if (symbolsToFetch.length === 0) {
      setInvestments(prev => prev.map(inv => {
        const cached = priceCache.current[inv.symbol.toUpperCase()];
        if (cached) {
          return {
            ...inv,
            currentPrice: cached.price,
            lastUpdated: new Date(cached.timestamp).toISOString(),
            sourceUrl: cached.sourceUrl || inv.sourceUrl
          };
        }
        return inv;
      }));
      setIsRefreshing(false);
      return;
    }

    // Batching logic: Split symbols into groups of 5
    const BATCH_SIZE = 5;
    const batches: string[][] = [];
    for (let i = 0; i < symbolsToFetch.length; i += BATCH_SIZE) {
      batches.push(symbolsToFetch.slice(i, i + BATCH_SIZE));
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Fetch batches concurrently
      const batchPromises = batches.map(async (batch) => {
        const symbolsStr = batch.join(', ');
        
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Please find the current stock prices for the following Indian stock symbols: ${symbolsStr}.
            You MUST use the Google Search tool to find the most recent prices from NSE, BSE, or Google Finance.
            Return the prices in INR as a JSON object where the keys are the symbols and values are the prices.
            
            Symbols to fetch: ${symbolsStr}`,
            config: {
              tools: [{ googleSearch: {} }],
              responseMimeType: "application/json",
            },
          });

          const text = response.text;
          if (!text) return;
          
          let prices: Record<string, number> = {};
          try {
            prices = JSON.parse(text);
          } catch (e) {
            const match = text.match(/\{[\s\S]*\}/);
            if (match) prices = JSON.parse(match[0]);
          }
          
          const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
          const sourceUrl = groundingChunks?.[0]?.web?.uri;

          // Update cache with fuzzy matching
          batch.forEach(requestedSymbol => {
            const symbolBase = requestedSymbol.split('.')[0];
            
            const priceEntry = Object.entries(prices).find(([k]) => {
              const keyUpper = k.toUpperCase();
              return keyUpper === requestedSymbol || 
                     keyUpper === symbolBase || 
                     requestedSymbol === keyUpper.split('.')[0] ||
                     keyUpper.includes(requestedSymbol) ||
                     requestedSymbol.includes(keyUpper);
            });

            const price = priceEntry ? Number(priceEntry[1]) : (prices[requestedSymbol] || prices[symbolBase]);

            if (price && !isNaN(price)) {
              priceCache.current[requestedSymbol] = {
                price,
                timestamp: now,
                sourceUrl: sourceUrl
              };
            }
          });
        } catch (batchErr) {
          console.error(`Failed to fetch batch: ${symbolsStr}`, batchErr);
          // We don't throw here to allow other batches to complete
        }
      });

      await Promise.all(batchPromises);

      // Final state update from cache
      setInvestments(prev => prev.map(inv => {
        const symbolUpper = inv.symbol.toUpperCase();
        const cached = priceCache.current[symbolUpper];
        
        if (cached) {
          return {
            ...inv,
            currentPrice: cached.price,
            lastUpdated: new Date(cached.timestamp).toISOString(),
            sourceUrl: cached.sourceUrl || inv.sourceUrl
          };
        }
        return inv;
      }));

      // Check if any symbols were still not found
      const missingSymbols = symbolsToFetch.filter(s => !priceCache.current[s]);
      if (missingSymbols.length > 0 && missingSymbols.length === symbolsToFetch.length) {
        setError(`Could not find prices for: ${missingSymbols.join(', ')}. Please ensure you are using standard NSE symbols.`);
      }
      
    } catch (err: any) {
      console.error('Failed to refresh prices', err);
      if (err.message?.includes('quota') || err.message?.includes('429')) {
        setError("I've reached my free usage limit for the moment. Please try again in a few minutes.");
      } else {
        setError(`Update failed: ${err.message || 'Unknown error'}. Please try again.`);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const addInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymbol || !newQuantity || !newPrice) return;

    const newItem: Investment = {
      id: Math.random().toString(36).substr(2, 9),
      symbol: newSymbol.toUpperCase(),
      quantity: parseFloat(newQuantity),
      purchasePrice: parseFloat(newPrice),
      currentPrice: parseFloat(newPrice), // Initial current price is purchase price
      lastUpdated: new Date().toISOString()
    };

    setInvestments([...investments, newItem]);
    setNewSymbol('');
    setNewQuantity('');
    setNewPrice('');
    setIsAdding(false);
  };

  const removeInvestment = (id: string) => {
    setInvestments(investments.filter(inv => inv.id !== id));
  };

  const stats = useMemo(() => {
    const totalInvested = investments.reduce((acc, inv) => acc + (inv.quantity * inv.purchasePrice), 0);
    const currentValue = investments.reduce((acc, inv) => acc + (inv.quantity * (inv.currentPrice || inv.purchasePrice)), 0);
    const totalProfit = currentValue - totalInvested;
    const profitPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    return { totalInvested, currentValue, totalProfit, profitPercentage };
  }, [investments]);

  const chartData = useMemo(() => {
    const allocation = investments.map(inv => ({
      name: inv.symbol,
      value: inv.quantity * (inv.currentPrice || inv.purchasePrice)
    }));

    const performance = investments.map(inv => ({
      name: inv.symbol,
      profit: (inv.currentPrice || inv.purchasePrice) - inv.purchasePrice,
      percentage: (((inv.currentPrice || inv.purchasePrice) - inv.purchasePrice) / inv.purchasePrice) * 100
    }));

    return { allocation, performance };
  }, [investments]);

  return (
    <main className="bg-slate-50 min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Investment Portfolio</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Wealth Tracker</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-2xl">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Refresh Rate</span>
                <span className="text-[10px] font-bold text-slate-600">
                  {refreshInterval > 0 ? `Updating in ${countdown}s` : 'Manual Mode'}
                </span>
              </div>
              <div className="relative group">
                <select
                  value={refreshInterval}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setRefreshInterval(val);
                    setCountdown(val || 60);
                  }}
                  className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600 focus:outline-none focus:border-primary cursor-pointer pr-8"
                >
                  <option value={30}>30s</option>
                  <option value={60}>60s</option>
                  <option value={0}>Manual</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Settings className="w-3 h-3 text-slate-400" />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                refreshPrices();
                setCountdown(refreshInterval || 60);
              }}
              disabled={isRefreshing || investments.length === 0}
              className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Refresh Now
            </button>
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 bg-primary text-slate-900 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              Add Stock
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50"
          >
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Value</p>
            <h3 className="text-3xl font-black text-slate-900">₹{stats.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
            <div className={cn(
              "flex items-center gap-1 mt-2 text-xs font-bold",
              stats.totalProfit >= 0 ? "text-sky-600" : "text-rose-600"
            )}>
              {stats.totalProfit >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {stats.profitPercentage.toFixed(2)}%
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50"
          >
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Invested</p>
            <h3 className="text-3xl font-black text-slate-900">₹{stats.totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50"
          >
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Profit/Loss</p>
            <h3 className={cn(
              "text-3xl font-black",
              stats.totalProfit >= 0 ? "text-sky-600" : "text-rose-600"
            )}>
              {stats.totalProfit >= 0 ? '+' : ''}₹{stats.totalProfit.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50"
          >
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Holdings</p>
            <h3 className="text-3xl font-black text-slate-900">{investments.length}</h3>
          </motion.div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 font-bold text-sm">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Holdings Table */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Current Holdings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Purchase</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Profit/Loss</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Source</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {investments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-slate-50 rounded-full">
                              <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-slate-400 font-bold">No investments tracked yet.</p>
                            <button 
                              onClick={() => setIsAdding(true)}
                              className="text-primary font-black text-xs uppercase tracking-widest hover:underline"
                            >
                              Add your first stock
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      investments.map((inv) => {
                        const profit = ((inv.currentPrice || inv.purchasePrice) - inv.purchasePrice) * inv.quantity;
                        const profitPerc = (((inv.currentPrice || inv.purchasePrice) - inv.purchasePrice) / inv.purchasePrice) * 100;
                        
                        return (
                          <tr 
                            key={inv.id} 
                            onClick={() => fetchStockDetails(inv)}
                            className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                          >
                            <td className="px-8 py-6">
                              <div className="font-black text-slate-900 group-hover:text-primary transition-colors">{inv.symbol}</div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Equity</div>
                            </td>
                            <td className="px-8 py-6 text-sm font-bold text-slate-600">{inv.quantity}</td>
                            <td className="px-8 py-6 text-sm font-bold text-slate-600">₹{inv.purchasePrice.toLocaleString('en-IN')}</td>
                            <td className="px-8 py-6">
                              <div className="text-sm font-bold text-slate-900">₹{inv.currentPrice?.toLocaleString('en-IN')}</div>
                              {inv.lastUpdated && (
                                <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                                  {new Date(inv.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              )}
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className={cn(
                                "text-sm font-black",
                                profit >= 0 ? "text-sky-600" : "text-rose-600"
                              )}>
                                {profit >= 0 ? '+' : ''}₹{profit.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                              </div>
                              <div className={cn(
                                "text-[10px] font-bold uppercase tracking-widest",
                                profit >= 0 ? "text-sky-500" : "text-rose-500"
                              )}>
                                {profitPerc.toFixed(2)}%
                              </div>
                            </td>
                            <td className="px-8 py-6 text-center">
                              {inv.sourceUrl ? (
                                <a 
                                  href={inv.sourceUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                                >
                                  Verify <ArrowUpRight className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">N/A</span>
                              )}
                            </td>
                            <td className="px-8 py-6 text-right">
                              <button 
                                onClick={() => removeInvestment(inv.id)}
                                className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Charts & Sidebar */}
          <div className="space-y-8">
            {/* Allocation Chart */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="flex items-center gap-3 mb-8">
                <PieChartIcon className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Allocation</h3>
              </div>
              <div className="h-64">
                {investments.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.allocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.allocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-300 text-xs font-bold uppercase tracking-widest">
                    No data available
                  </div>
                )}
              </div>
              <div className="mt-6 space-y-2">
                {chartData.allocation.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="font-bold text-slate-600">{item.name}</span>
                    </div>
                    <span className="font-black text-slate-900">
                      {((item.value / stats.currentValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Bar Chart */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="flex items-center gap-3 mb-8">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Performance</h3>
              </div>
              <div className="h-64">
                {investments.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.performance}>
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => `${value.toFixed(2)}%`}
                      />
                      <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                        {chartData.performance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.percentage >= 0 ? '#0ea5e9' : '#EF4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-300 text-xs font-bold uppercase tracking-widest">
                    No data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Stock Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Add New Stock</h3>
                <p className="text-slate-500 text-sm mt-1">Enter your investment details below.</p>
              </div>
              <form onSubmit={addInvestment} className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Stock Symbol</label>
                  <input
                    required
                    type="text"
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                    placeholder="e.g. RELIANCE, TCS, HDFCBANK"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:outline-none focus:border-primary transition-all"
                  />
                  <p className="text-[8px] text-slate-400 font-bold mt-2 uppercase tracking-widest">
                    Tip: Use NSE symbols for best results. Add .NS for NSE (e.g. RELIANCE.NS) if needed.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Quantity</label>
                    <input
                      required
                      type="number"
                      step="any"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Purchase Price</label>
                    <input
                      required
                      type="number"
                      step="any"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="₹0.00"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-slate-900 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/20"
                  >
                    Add to Portfolio
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stock Details Modal */}
      <AnimatePresence>
        {selectedStock && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStock(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 bg-primary flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedStock.symbol}</h3>
                  <p className="text-slate-700 text-[10px] font-black uppercase tracking-widest">Company Insights</p>
                </div>
                <button 
                  onClick={() => setSelectedStock(null)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-900" />
                </button>
              </div>

              <div className="p-8">
                {isLoadingDetails ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Fetching Market Intelligence...</p>
                  </div>
                ) : stockDetails ? (
                  <div className="space-y-8">
                    {/* Summary */}
                    <div className="flex flex-wrap gap-3 items-center">
                      {stockDetails.sector && (
                        <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          {stockDetails.sector}
                        </div>
                      )}
                      {stockDetails.analystRating && (
                        <div className={cn(
                          "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                          stockDetails.analystRating.toLowerCase().includes('buy') ? "bg-sky-100 text-sky-700" :
                          stockDetails.analystRating.toLowerCase().includes('sell') ? "bg-rose-100 text-rose-700" :
                          "bg-amber-100 text-amber-700"
                        )}>
                          Rating: {stockDetails.analystRating}
                        </div>
                      )}
                    </div>
                    
                    {stockDetails.summary && (
                      <p className="text-slate-600 text-sm leading-relaxed italic">
                        "{stockDetails.summary}"
                      </p>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Market Cap</p>
                        <p className="text-sm font-black text-slate-900">{stockDetails.marketCap || 'N/A'}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">P/E Ratio</p>
                        <p className="text-sm font-black text-slate-900">{stockDetails.peRatio || 'N/A'}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Price</p>
                        <p className="text-sm font-black text-primary">{stockDetails.targetPrice.startsWith('₹') ? '' : '₹'}{stockDetails.targetPrice || 'N/A'}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">52W High</p>
                        <p className="text-sm font-black text-sky-600">{stockDetails.fiftyTwoWeekHigh.startsWith('₹') ? '' : '₹'}{stockDetails.fiftyTwoWeekHigh || 'N/A'}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">52W Low</p>
                        <p className="text-sm font-black text-rose-600">{stockDetails.fiftyTwoWeekLow.startsWith('₹') ? '' : '₹'}{stockDetails.fiftyTwoWeekLow || 'N/A'}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Div. Yield</p>
                        <p className="text-sm font-black text-slate-900">{stockDetails.dividendYield || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={() => setSelectedStock(null)}
                        className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all"
                      >
                        Close Insights
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">Could not fetch detailed insights for this stock.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
