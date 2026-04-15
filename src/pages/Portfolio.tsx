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
  Settings,
  ShieldCheck,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { GoogleGenAI, Type } from "@google/genai";
import { getGeminiClient, getApiKey } from '@/lib/gemini';
import Markdown from 'react-markdown';
import { cn } from '@/lib/utils';

type AssetCategory = 'Stock' | 'Mutual Fund' | 'Insurance' | 'Other';

interface Investment {
  id: string;
  category: AssetCategory;
  name: string;
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  lastUpdated: string;
  sourceUrl?: string;
  metadata?: {
    policyNumber?: string;
    sumAssured?: number;
    maturityDate?: string;
    fundType?: string;
    premiumAmount?: number;
    premiumFrequency?: 'Monthly' | 'Quarterly' | 'Yearly';
  };
}

const COLORS = ['#3B82F6', '#0ea5e9', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

export default function Portfolio() {
  const [investments, setInvestments] = useState<Investment[]>(() => {
    const saved = localStorage.getItem('portfolio_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration for old data format
        return parsed.map((inv: any) => ({
          id: inv.id || Math.random().toString(36).substr(2, 9),
          category: inv.category || 'Stock',
          name: inv.name || inv.symbol,
          symbol: inv.symbol,
          quantity: inv.quantity,
          purchasePrice: inv.purchasePrice,
          currentPrice: inv.currentPrice || inv.purchasePrice,
          lastUpdated: inv.lastUpdated || new Date().toISOString(),
          metadata: inv.metadata || {}
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [portfolioInsight, setPortfolioInsight] = useState<string | null>(null);
  const [isHealthCheckOpen, setIsHealthCheckOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [marketIndices, setMarketIndices] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(60); // 30, 60, or 0 for manual
  const [countdown, setCountdown] = useState(60);
  
  // Stock details state
  const [selectedStock, setSelectedStock] = useState<Investment | null>(null);
  const [stockDetails, setStockDetails] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifiedIds, setVerifiedIds] = useState<Set<string>>(new Set());

  // Form state
  const [newInvestment, setNewInvestment] = useState({
    category: 'Stock' as AssetCategory,
    name: '',
    symbol: '',
    quantity: '1',
    purchasePrice: '0',
    metadata: {
      policyNumber: '',
      sumAssured: 0,
      maturityDate: '',
      fundType: '',
      premiumAmount: 0,
      premiumFrequency: 'Yearly' as const
    }
  });

  const priceCache = useRef<Record<string, { price: number; timestamp: number; sourceUrl?: string }>>({});
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('portfolio_data', JSON.stringify(investments));
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
    if (investment.category !== 'Stock') return;
    
    setSelectedStock(investment);
    setIsLoadingDetails(true);
    setStockDetails(null);
    setError(null);

    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error('AI service temporarily unavailable');
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: `Fetch detailed financial information for the Indian stock symbol: ${investment.symbol}.
        Search for the most recent data from reliable sources like NSE, BSE, or Google Finance.
        
        Include:
        - Market Cap (in INR Crores)
        - P/E Ratio
        - 52-Week High and Low
        - Dividend Yield
        - Sector/Industry
        - A concise 2-sentence business summary
        - Consensus analyst rating (Buy/Hold/Sell)
        - Average analyst target price
        
        Format your response as a valid JSON object matching the requested schema.` }] }],
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              marketCap: { type: Type.STRING, description: "Market Cap in INR Crores" },
              peRatio: { type: Type.STRING, description: "P/E Ratio" },
              fiftyTwoWeekHigh: { type: Type.STRING, description: "52-Week High price in INR" },
              fiftyTwoWeekLow: { type: Type.STRING, description: "52-Week Low price in INR" },
              dividendYield: { type: Type.STRING, description: "Dividend Yield percentage" },
              sector: { type: Type.STRING, description: "Industry sector" },
              summary: { type: Type.STRING, description: "1-2 sentence business summary" },
              analystRating: { type: Type.STRING, description: "Consensus analyst rating" },
              targetPrice: { type: Type.STRING, description: "Average analyst target price in INR" }
            },
            required: ["marketCap", "peRatio", "fiftyTwoWeekHigh", "fiftyTwoWeekLow", "analystRating", "targetPrice", "summary", "sector"]
          }
        },
      });

      if (!response.text) {
        throw new Error('Empty response from AI model.');
      }

      const data = JSON.parse(response.text);
      setStockDetails(data);
    } catch (err: any) {
      console.error('Failed to fetch stock details', err);
      setError(`Could not fetch details for ${investment.symbol}. Service temporarily unavailable.`);
      setSelectedStock(null);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const refreshPrices = async () => {
    if (investments.length === 0) return;
    setIsRefreshing(true);
    setError(null);

    const now = Date.now();
    
    // Identify symbols that need refreshing (Stocks and Mutual Funds only)
    const refreshableInvestments = investments.filter(inv => 
      (inv.category === 'Stock' || inv.category === 'Mutual Fund') &&
      (!priceCache.current[inv.symbol.toUpperCase()] || (now - priceCache.current[inv.symbol.toUpperCase()].timestamp > CACHE_DURATION))
    );

    if (refreshableInvestments.length === 0) {
      setInvestments(prev => prev.map(inv => {
        const cached = priceCache.current[inv.symbol.toUpperCase()];
        if (cached) {
          return {
            ...inv,
            currentPrice: cached.price,
            lastUpdated: new Date(cached.timestamp).toISOString()
          };
        }
        return inv;
      }));
      setIsRefreshing(false);
      return;
    }

    const BATCH_SIZE = 5;
    const batches: Investment[][] = [];
    for (let i = 0; i < refreshableInvestments.length; i += BATCH_SIZE) {
      batches.push(refreshableInvestments.slice(i, i + BATCH_SIZE));
    }

    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        setIsRefreshing(false);
        return;
      }
      const ai = getGeminiClient();
      
      const batchPromises = batches.map(async (batch) => {
        const prompt = `Find the current market prices (NAV for mutual funds, stock price for stocks) for the following Indian investments:
        ${batch.map(inv => `${inv.category}: ${inv.name} (${inv.symbol})`).join(', ')}.
        You MUST use the Google Search tool to find the most recent prices from NSE, BSE, AMFI, or Google Finance.
        Return the prices in INR as a JSON object where the keys are the symbols and values are the prices.`;

        try {
          const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
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
          
          batch.forEach(inv => {
            const symbol = inv.symbol.toUpperCase();
            const price = prices[symbol] || prices[inv.name] || prices[inv.symbol];
            if (price && !isNaN(price)) {
              priceCache.current[symbol] = {
                price,
                timestamp: now
              };
            }
          });
        } catch (batchErr) {
          console.error(`Failed to fetch batch`, batchErr);
        }
      });

      await Promise.all(batchPromises);

      setInvestments(prev => prev.map(inv => {
        const cached = priceCache.current[inv.symbol.toUpperCase()];
        if (cached) {
          return {
            ...inv,
            currentPrice: cached.price,
            lastUpdated: new Date(cached.timestamp).toISOString()
          };
        }
        return inv;
      }));
      
    } catch (err: any) {
      console.error('Failed to refresh prices', err);
      setError(`Market data update failed. Please try again later.`);
    } finally {
      setIsRefreshing(false);
    }
  };

  const verifyAssetData = async (inv: Investment) => {
    if (inv.category === 'Insurance' || inv.category === 'Other') return;
    
    setVerifyingId(inv.id);
    setError(null);

    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        setVerifyingId(null);
        return;
      }
      const ai = getGeminiClient();
      const prompt = `Verify and provide the absolute latest market price (NAV for mutual funds, stock price for stocks) for: ${inv.category}: ${inv.name} (${inv.symbol}) in India. 
      Use Google Search to find the most recent closing or live price from NSE, BSE, AMFI, or Google Finance.
      Return ONLY a JSON object with the price and the source URL. 
      Example: {"price": 1234.56, "source": "https://..."}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
        },
      });

      const text = response.text;
      if (text) {
        let result: { price: number; source?: string } = { price: 0 };
        try {
          result = JSON.parse(text);
        } catch (e) {
          const match = text.match(/\{[\s\S]*\}/);
          if (match) result = JSON.parse(match[0]);
        }

        if (result.price && !isNaN(result.price)) {
          setInvestments(prev => prev.map(item => 
            item.id === inv.id 
              ? { 
                  ...item, 
                  currentPrice: result.price, 
                  lastUpdated: new Date().toISOString(),
                  sourceUrl: result.source || item.sourceUrl
                } 
              : item
          ));
          
          // Update cache too
          priceCache.current[inv.symbol.toUpperCase()] = {
            price: result.price,
            timestamp: Date.now(),
            sourceUrl: result.source
          };

          setVerifiedIds(prev => new Set(prev).add(inv.id));
          setTimeout(() => {
            setVerifiedIds(prev => {
              const next = new Set(prev);
              next.delete(inv.id);
              return next;
            });
          }, 3000);
        }
      }
    } catch (err: any) {
      console.error('Verification failed', err);
      setError(`Verification failed for ${inv.symbol}. Service temporarily unavailable.`);
    } finally {
      setVerifyingId(null);
    }
  };

  const generatePortfolioInsight = async () => {
    if (investments.length === 0) return;
    
    setIsAnalyzing(true);
    setIsHealthCheckOpen(true);
    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        setPortfolioInsight("Please configure your Gemini API key in settings to use AI analysis.");
        setIsAnalyzing(false);
        return;
      }
      const ai = getGeminiClient();
      const portfolioSummary = investments.map(inv => ({
        symbol: inv.symbol,
        category: inv.category,
        quantity: inv.quantity,
        currentPrice: inv.currentPrice,
        purchasePrice: inv.purchasePrice,
        gain: ((inv.currentPrice - inv.purchasePrice) / inv.purchasePrice) * 100
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this financial portfolio and provide a health check report in Markdown format. 
        Focus on diversification, performance, risk management, and projected returns. 
        Portfolio: ${JSON.stringify(portfolioSummary)}
        
        Structure:
        1. Executive Summary (Overall health score out of 10)
        2. Diversification Analysis (Asset allocation critique)
        3. Performance & Projected Returns (Analysis of current gains and future outlook)
        4. Risk Assessment (Concentration risk, market exposure)
        5. Actionable Recommendations (Specific steps to improve)`,
        config: {
          systemInstruction: "You are a professional financial advisor specializing in the Indian market. Provide concise, data-driven insights.",
        }
      });

      setPortfolioInsight(response.text || "Could not generate insights at this time.");
    } catch (error) {
      console.error("Error generating portfolio insight:", error);
      setPortfolioInsight("An error occurred while analyzing your portfolio. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAssetSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        setIsSearching(false);
        return;
      }
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Search for Indian ${newInvestment.category}s matching "${query}". 
        Return a list of top 5 matches with their symbol/name and current approximate price.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                symbol: { type: Type.STRING, description: "Stock symbol or Fund name" },
                name: { type: Type.STRING, description: "Full name of the asset" },
                price: { type: Type.NUMBER, description: "Current market price" }
              },
              required: ["symbol", "name", "price"]
            }
          }
        }
      });

      const results = JSON.parse(response.text || "[]");
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching assets:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (result: any) => {
    setNewInvestment({
      ...newInvestment,
      symbol: result.symbol,
      purchasePrice: result.price.toString()
    });
    setSearchResults([]);
    setSearchQuery(result.symbol);
  };

  const fetchMarketIndices = async () => {
    try {
      const apiKey = getApiKey();
      if (!apiKey) return;
      
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Fetch current values and daily changes for Nifty 50, Sensex, Bank Nifty, and Nifty IT.",
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                value: { type: Type.STRING },
                change: { type: Type.STRING },
                isPositive: { type: Type.BOOLEAN }
              },
              required: ["name", "value", "change", "isPositive"]
            }
          }
        }
      });
      const data = JSON.parse(response.text || "[]");
      if (data.length > 0) setMarketIndices(data);
    } catch (error) {
      console.error("Error fetching market indices:", error);
      // Fallback to some default values if needed
    }
  };

  useEffect(() => {
    fetchMarketIndices();
  }, []);

  const addInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    const isInsurance = newInvestment.category === 'Insurance';
    
    if (!newInvestment.symbol) return;
    if (!isInsurance && (!newInvestment.quantity || !newInvestment.purchasePrice)) return;

    const newItem: Investment = {
      id: Math.random().toString(36).substr(2, 9),
      category: newInvestment.category,
      name: newInvestment.name || newInvestment.symbol,
      symbol: newInvestment.symbol.toUpperCase(),
      quantity: isInsurance ? 1 : parseFloat(newInvestment.quantity),
      purchasePrice: isInsurance ? 0 : parseFloat(newInvestment.purchasePrice),
      currentPrice: isInsurance ? 0 : parseFloat(newInvestment.purchasePrice),
      lastUpdated: new Date().toISOString(),
      metadata: { ...newInvestment.metadata }
    };

    setInvestments([...investments, newItem]);
    setNewInvestment({
      category: 'Stock',
      name: '',
      symbol: '',
      quantity: '1',
      purchasePrice: '0',
      metadata: {
        policyNumber: '',
        sumAssured: 0,
        maturityDate: '',
        fundType: '',
        premiumAmount: 0,
        premiumFrequency: 'Yearly'
      }
    });
    setIsAdding(false);
  };

  const removeInvestment = (id: string) => {
    setInvestments(investments.filter(inv => inv.id !== id));
  };

  const stats = useMemo(() => {
    const totalInvested = investments.reduce((acc, inv) => {
      if (inv.category === 'Insurance') return acc + (inv.metadata?.premiumAmount || 0);
      return acc + (inv.quantity * inv.purchasePrice);
    }, 0);

    const currentValue = investments.reduce((acc, inv) => {
      if (inv.category === 'Insurance') return acc + (inv.metadata?.premiumAmount || 0);
      return acc + (inv.quantity * (inv.currentPrice || inv.purchasePrice));
    }, 0);

    const totalSumAssured = investments
      .filter(inv => inv.category === 'Insurance')
      .reduce((acc, inv) => acc + (inv.metadata?.sumAssured || 0), 0);

    const totalProfit = currentValue - totalInvested;
    const profitPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    return { totalInvested, currentValue, totalProfit, profitPercentage, totalSumAssured };
  }, [investments]);

  const generateHistoricalData = (purchasePrice: number, currentPrice: number) => {
    const points = 8;
    const data = [];
    const diff = currentPrice - purchasePrice;
    
    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1);
      // Add some volatility
      const noise = (Math.random() - 0.5) * (Math.abs(diff) * 0.3);
      const value = purchasePrice + (diff * progress) + noise;
      data.push({ value: Math.max(0, value) });
    }
    
    data[points - 1] = { value: currentPrice };
    return data;
  };

  const chartData = useMemo(() => {
    const categories = Array.from(new Set(investments.map(inv => inv.category)));
    const allocation = categories.map(cat => ({
      name: cat,
      value: investments
        .filter(inv => inv.category === cat)
        .reduce((acc, inv) => {
          if (inv.category === 'Insurance') return acc + (inv.metadata?.premiumAmount || 0);
          return acc + (inv.quantity * (inv.currentPrice || inv.purchasePrice));
        }, 0)
    })).filter(d => d.value > 0);

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
            <button
              onClick={generatePortfolioInsight}
              disabled={isAnalyzing || investments.length === 0}
              className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50"
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Health Check
            </button>

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
              Add Asset
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
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Net Worth</p>
            <h3 className="text-3xl font-black text-slate-900">₹{stats.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
            <div className={cn(
              "flex items-center gap-1 mt-2 text-xs font-bold",
              stats.totalProfit >= 0 ? "text-emerald-600" : "text-rose-600"
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
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Across {investments.length} Assets</p>
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
              stats.totalProfit >= 0 ? "text-emerald-600" : "text-rose-600"
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
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Insurance Cover</p>
            <h3 className="text-3xl font-black text-slate-900">₹{stats.totalSumAssured.toLocaleString('en-IN')}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Total Sum Assured</p>
          </motion.div>
        </div>

        {/* AI Portfolio Health Check Section */}
        <AnimatePresence>
          {isHealthCheckOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12 overflow-hidden"
            >
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="p-8 bg-slate-900 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-slate-900" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white tracking-tight">Portfolio Health Check</h3>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">AI-Powered Analysis</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsHealthCheckOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>

                <div className="p-8">
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                      <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
                      <p className="text-sm font-black uppercase tracking-widest">AI Strategist is analyzing your holdings...</p>
                    </div>
                  ) : portfolioInsight ? (
                    <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-600 prose-li:text-slate-600">
                      <Markdown>{portfolioInsight}</Markdown>
                      <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={() => generatePortfolioInsight()}
                          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Re-Analyze Portfolio
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-slate-500 mb-6">No analysis data available. Click the button above to start.</p>
                      <button
                        onClick={generatePortfolioInsight}
                        className="bg-primary text-slate-900 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all"
                      >
                        Start Health Check
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Market Overview */}
        {marketIndices.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Market Overview</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {marketIndices.map((index, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{index.name}</span>
                  <div className="flex items-end justify-between mt-1">
                    <span className="text-sm font-black text-slate-900">{index.value}</span>
                    <span className={cn(
                      "text-[10px] font-bold flex items-center gap-0.5",
                      index.isPositive ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {index.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {index.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
                      <th className="px-4 sm:px-8 py-4 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[100px]">Asset</th>
                      <th className="hidden sm:table-cell px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty / Info</th>
                      <th className="px-4 sm:px-8 py-4 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Purchase / Premium</th>
                      <th className="px-4 sm:px-8 py-4 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Current / Cover</th>
                      <th className="hidden lg:table-cell px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance Trend</th>
                      <th className="px-4 sm:px-8 py-4 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Profit / Status</th>
                      <th className="hidden md:table-cell px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Source</th>
                      <th className="px-4 sm:px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {investments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-slate-50 rounded-full">
                              <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-slate-400 font-bold">No investments tracked yet.</p>
                            <button 
                              onClick={() => setIsAdding(true)}
                              className="text-primary font-black text-xs uppercase tracking-widest hover:underline"
                            >
                              Add your first asset
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      investments.map((inv) => {
                        const isInsurance = inv.category === 'Insurance';
                        const profit = isInsurance ? 0 : ((inv.currentPrice || inv.purchasePrice) - inv.purchasePrice) * inv.quantity;
                        const profitPerc = isInsurance ? 0 : (((inv.currentPrice || inv.purchasePrice) - inv.purchasePrice) / inv.purchasePrice) * 100;
                        
                        return (
                          <tr 
                            key={inv.id} 
                            onClick={() => inv.category === 'Stock' && fetchStockDetails(inv)}
                            className={cn(
                              "hover:bg-slate-50/50 transition-colors cursor-pointer group",
                              inv.category !== 'Stock' && "cursor-default"
                            )}
                          >
                            <td className="px-4 sm:px-8 py-6">
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "font-black text-slate-900 text-xs sm:text-sm transition-colors",
                                  inv.category === 'Stock' && "group-hover:text-primary group-hover:underline decoration-2 underline-offset-4"
                                )}>
                                  {inv.symbol}
                                </div>
                                {inv.category === 'Stock' && (
                                  <BarChart3 className="w-3 h-3 text-slate-300 group-hover:text-primary transition-colors" />
                                )}
                              </div>
                              <div className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">{inv.category}</div>
                              {/* Mobile-only info */}
                              <div className="sm:hidden text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                {isInsurance ? `Policy: ${inv.metadata.policyNumber || 'N/A'}` : `Qty: ${inv.quantity}`}
                              </div>
                            </td>
                            <td className="hidden sm:table-cell px-8 py-6 text-sm font-bold text-slate-600">
                              {isInsurance ? (
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                  Policy: {inv.metadata.policyNumber || 'N/A'}
                                </div>
                              ) : (
                                inv.quantity
                              )}
                            </td>
                            <td className="px-4 sm:px-8 py-6 text-xs sm:text-sm font-bold text-slate-600">
                              ₹{(isInsurance ? inv.metadata.premiumAmount : inv.purchasePrice).toLocaleString('en-IN')}
                            </td>
                            <td className="px-4 sm:px-8 py-6">
                              <div className="flex items-center gap-2">
                                <div className="text-xs sm:text-sm font-bold text-slate-900">
                                  ₹{(isInsurance ? inv.metadata.sumAssured : inv.currentPrice)?.toLocaleString('en-IN')}
                                </div>
                                {!isInsurance && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      verifyAssetData(inv);
                                    }}
                                    disabled={verifyingId === inv.id}
                                    className={cn(
                                      "p-1 rounded-md transition-all",
                                      verifiedIds.has(inv.id) 
                                        ? "text-emerald-500 bg-emerald-50" 
                                        : "text-slate-300 hover:text-primary hover:bg-primary/5"
                                    )}
                                    title="Verify latest data"
                                  >
                                    {verifyingId === inv.id ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : verifiedIds.has(inv.id) ? (
                                      <CheckCircle2 className="w-3 h-3" />
                                    ) : (
                                      <ShieldCheck className="w-3 h-3" />
                                    )}
                                  </button>
                                )}
                              </div>
                              {!isInsurance && inv.lastUpdated && (
                                <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                                  {new Date(inv.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              )}
                            </td>
                            <td className="hidden lg:table-cell px-8 py-6">
                              {!isInsurance && (
                                <div className="h-10 w-24">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={generateHistoricalData(inv.purchasePrice, inv.currentPrice || inv.purchasePrice)}>
                                      <Line 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke={profit >= 0 ? '#10b981' : '#ef4444'} 
                                        strokeWidth={2} 
                                        dot={false} 
                                      />
                                    </LineChart>
                                  </ResponsiveContainer>
                                </div>
                              )}
                            </td>
                            <td className="px-4 sm:px-8 py-6 text-right">
                              {isInsurance ? (
                                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Active</span>
                              ) : (
                                <div className="flex flex-col items-end">
                                  <div className={cn(
                                    "text-xs sm:text-sm font-black flex items-center justify-end gap-1 px-2 py-1 rounded-lg",
                                    profit >= 0 ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                                  )}>
                                    {profit >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    {profit >= 0 ? '+' : ''}₹{profit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                  </div>
                                  <div className={cn(
                                    "text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-1",
                                    profit >= 0 ? "text-emerald-500" : "text-rose-500"
                                  )}>
                                    {profitPerc >= 0 ? '+' : ''}{profitPerc.toFixed(2)}%
                                  </div>
                                </div>
                              )}
                            </td>
                            <td className="hidden md:table-cell px-8 py-6 text-center">
                              {inv.sourceUrl ? (
                                <a 
                                  href={inv.sourceUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Verify <ArrowUpRight className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">N/A</span>
                              )}
                            </td>
                            <td className="px-4 sm:px-8 py-6 text-right">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeInvestment(inv.id);
                                }}
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
              <div className="relative h-64">
                {investments.length > 0 ? (
                  <>
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
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                          stroke="none"
                        >
                          {chartData.allocation.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]} 
                              className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '1.5rem', 
                            border: 'none', 
                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                            padding: '1rem 1.5rem',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(8px)'
                          }}
                          itemStyle={{
                            fontSize: '12px',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}
                          formatter={(value: number, name: string) => {
                            const percentage = ((value / stats.currentValue) * 100).toFixed(1);
                            return [`₹${value.toLocaleString('en-IN')} (${percentage}%)`, name];
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portfolio</span>
                      <span className="text-base font-black text-slate-900">₹{stats.currentValue > 10000000 ? `${(stats.currentValue / 10000000).toFixed(2)}Cr` : stats.currentValue > 100000 ? `${(stats.currentValue / 100000).toFixed(2)}L` : stats.currentValue.toLocaleString('en-IN')}</span>
                    </div>
                  </>
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

      {/* Add Asset Modal */}
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
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Add New Asset</h3>
                <p className="text-slate-500 text-sm mt-1">Track your investments and protection.</p>
              </div>
              <form onSubmit={addInvestment} className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Asset Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Stock', 'Mutual Fund', 'Insurance', 'Other'] as AssetCategory[]).map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setNewInvestment({ ...newInvestment, category: cat })}
                        className={cn(
                          "px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                          newInvestment.category === cat 
                            ? "bg-primary border-primary text-slate-900 shadow-lg shadow-primary/20" 
                            : "bg-slate-50 border-slate-200 text-slate-500 hover:border-primary/50"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 relative">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      {newInvestment.category === 'Insurance' ? 'Policy Name' : 'Asset Name / Symbol'}
                    </label>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        value={newInvestment.symbol}
                        onChange={(e) => {
                          setNewInvestment({ ...newInvestment, symbol: e.target.value });
                          if (newInvestment.category !== 'Insurance') handleAssetSearch(e.target.value);
                        }}
                        placeholder={newInvestment.category === 'Stock' ? 'e.g. RELIANCE' : 'e.g. HDFC Top 100'}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:outline-none focus:border-primary transition-all"
                      />
                      {isSearching && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        </div>
                      )}
                    </div>

                    {searchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                        {searchResults.map((result, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => selectSearchResult(result)}
                            className="w-full px-6 py-4 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-black text-slate-900">{result.symbol}</p>
                                <p className="text-[10px] text-slate-500 font-bold">{result.name}</p>
                              </div>
                              <p className="text-xs font-black text-primary">₹{result.price}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {newInvestment.category !== 'Insurance' ? (
                    <>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Quantity / Units</label>
                        <input
                          required
                          type="number"
                          step="any"
                          value={newInvestment.quantity}
                          onChange={(e) => setNewInvestment({ ...newInvestment, quantity: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Avg. Price (₹)</label>
                        <input
                          required
                          type="number"
                          step="any"
                          value={newInvestment.purchasePrice}
                          onChange={(e) => setNewInvestment({ ...newInvestment, purchasePrice: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Policy Number</label>
                        <input
                          type="text"
                          value={newInvestment.metadata.policyNumber}
                          onChange={(e) => setNewInvestment({ 
                            ...newInvestment, 
                            metadata: { ...newInvestment.metadata, policyNumber: e.target.value } 
                          })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sum Assured (₹)</label>
                        <input
                          type="number"
                          value={newInvestment.metadata.sumAssured}
                          onChange={(e) => setNewInvestment({ 
                            ...newInvestment, 
                            metadata: { ...newInvestment.metadata, sumAssured: Number(e.target.value) } 
                          })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Premium Amount (₹)</label>
                        <input
                          type="number"
                          value={newInvestment.metadata.premiumAmount}
                          onChange={(e) => setNewInvestment({ 
                            ...newInvestment, 
                            metadata: { ...newInvestment.metadata, premiumAmount: Number(e.target.value) } 
                          })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </>
                  )}
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
                  <p className="text-slate-700 text-[10px] font-black uppercase tracking-widest">Company Analysis</p>
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
                        Close Analysis
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
