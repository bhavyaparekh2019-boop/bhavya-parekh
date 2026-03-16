import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Zap, BarChart3, ShieldCheck, Info, ArrowRight, CheckCircle2, HelpCircle, Sparkles, Target, Plus, X, Scale, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import BlurText from '@/src/components/BlurText';
import ChromaGrid from '@/src/components/ChromaGrid';
import Tooltip from '@/src/components/Tooltip';
import { useModal } from '@/src/context/ModalContext';
import { cn } from '@/src/lib/utils';

const COMPARISON_FUNDS = [
  {
    id: '1',
    name: 'BHP Bluechip Equity Fund',
    category: 'Large Cap',
    expenseRatio: '0.45%',
    returns1Y: '18.5%',
    returns3Y: '15.2%',
    returns5Y: '14.8%',
    alpha: '2.1',
    beta: '0.85',
    sharpe: '1.4',
    risk: 'Very High'
  },
  {
    id: '2',
    name: 'BHP Dynamic Bond Fund',
    category: 'Debt',
    expenseRatio: '0.30%',
    returns1Y: '7.2%',
    returns3Y: '6.8%',
    returns5Y: '7.1%',
    alpha: '0.5',
    beta: '0.12',
    sharpe: '0.9',
    risk: 'Moderate'
  },
  {
    id: '3',
    name: 'BHP Midcap Opportunities',
    category: 'Mid Cap',
    expenseRatio: '0.65%',
    returns1Y: '24.8%',
    returns3Y: '19.4%',
    returns5Y: '17.2%',
    alpha: '4.5',
    beta: '1.2',
    sharpe: '1.6',
    risk: 'Very High'
  },
  {
    id: '4',
    name: 'BHP Balanced Advantage',
    category: 'Hybrid',
    expenseRatio: '0.55%',
    returns1Y: '14.2%',
    returns3Y: '12.5%',
    returns5Y: '11.8%',
    alpha: '1.8',
    beta: '0.65',
    sharpe: '1.2',
    risk: 'High'
  }
];

const fundTypes = [
  {
    title: 'Equity Funds',
    description: 'Invest primarily in stocks. High risk, high return potential.',
    details: [
      'Large Cap: Investing in top 100 companies. Pro Tip: Best for stable long-term growth and core portfolio stability.',
      'Mid Cap: High growth potential in mid-sized firms. Pro Tip: Ideal for investors with a 5-7 year horizon seeking higher alpha.',
      'Small Cap: High risk, exponential growth potential. Pro Tip: Use SIPs to navigate high volatility; limit exposure to 10-15% of portfolio.',
      'ELSS: Tax-saving funds with 3-year lock-in. Pro Tip: Best for combining tax saving with equity growth; has the shortest lock-in among 80C options.',
      'Sectoral: Focused on specific industries like IT/Banking. Pro Tip: Avoid for core portfolio; use only for tactical bets if you understand the specific industry cycle.'
    ],
    color: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Debt Funds',
    description: 'Invest in fixed-income securities like govt bonds and corporate debentures.',
    details: [
      'Liquid Funds: For surplus cash, very low risk. Pro Tip: Better alternative to savings accounts.',
      'Gilt Funds: Investing in government securities. No credit risk but high interest rate risk.',
      'Corporate Bond Funds: High-quality corporate debt. Aim for higher yields than govt bonds.',
      'Dynamic Bond Funds: Managing interest rate volatility by changing portfolio duration.',
      'Short Duration Funds: Ideal for 1-3 year investment horizons.'
    ],
    color: 'bg-sky-50 text-sky-600'
  },
  {
    title: 'Hybrid Funds',
    description: 'A mix of equity and debt to balance risk and reward.',
    details: [
      'Aggressive Hybrid: 65-80% equity exposure. Pro Tip: Great for first-time equity investors.',
      'Balanced Advantage: Dynamic asset allocation based on market valuations.',
      'Multi Asset: Equity, debt, and gold in one fund. True diversification in a single product.',
      'Arbitrage: Low-risk equity-taxed returns. Ideal for parking money for 3-6 months.',
      'Equity Savings: Mix of equity, debt, and arbitrage for conservative growth.'
    ],
    color: 'bg-amber-50 text-amber-600'
  },
  {
    title: 'Index / Passive Funds',
    description: 'Mimic a market index like Nifty 50. Low cost and transparent.',
    details: [
      'Nifty 50 Index: Top 50 Indian companies. Pro Tip: The simplest way to invest in India.',
      'Nifty Next 50: The next 50 potential blue-chips. Higher growth potential than Nifty 50.',
      'Target Maturity Funds: Debt index funds with fixed dates. Predictable returns if held to maturity.',
      'ETFs: Traded on stock exchanges like shares. Requires a demat account.',
      'Factor Funds: Rules-based indexing like Value, Momentum, or Low Volatility.'
    ],
    color: 'bg-indigo-50 text-indigo-600'
  }
];

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50 transition-colors hover:bg-slate-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="w-full p-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset rounded-2xl"
      >
        <span className="font-bold text-slate-900 text-sm pr-8">{question}</span>
        <div 
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
            isOpen ? "bg-primary text-white rotate-45" : "bg-white text-slate-400 shadow-sm"
          )}
          aria-hidden="true"
        >
          <Plus className="w-4 h-4" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={contentId}
            role="region"
            aria-label={question}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const METRICS = [
  { 
    label: 'Expense Ratio', 
    key: 'expenseRatio', 
    tooltip: 'Annual fee charged by the fund to cover management and operating expenses. A lower ratio means more of your money stays invested.' 
  },
  { 
    label: '1Y Returns', 
    key: 'returns1Y', 
    tooltip: 'Total percentage growth or decline over the last 12 months. Indicates recent performance momentum.' 
  },
  { 
    label: '3Y Returns', 
    key: 'returns3Y', 
    tooltip: 'Average annual compounded growth over the last 3 years. Helps identify medium-term consistency.' 
  },
  { 
    label: '5Y Returns', 
    key: 'returns5Y', 
    tooltip: 'Average annual compounded growth over the last 5 years. The gold standard for evaluating long-term performance stability.' 
  },
  { 
    label: 'Alpha', 
    key: 'alpha', 
    tooltip: 'Measures the excess return generated by the fund manager relative to the benchmark. Positive alpha indicates value-add.' 
  },
  { 
    label: 'Beta', 
    key: 'beta', 
    tooltip: 'Measures the fund\'s volatility relative to the market. A beta of 1.0 matches the market; >1.0 is more aggressive, <1.0 is more defensive.' 
  },
  { 
    label: 'Sharpe Ratio', 
    key: 'sharpe', 
    tooltip: 'Measures risk-adjusted performance. It tells you if the returns are due to smart investment decisions or excessive risk-taking.' 
  },
  { 
    label: 'Risk Profile', 
    key: 'risk', 
    tooltip: 'An assessment of the potential for capital loss and price volatility, ranging from Low to Very High.' 
  },
];

const getRiskColor = (risk: string) => {
  const r = risk.toLowerCase();
  if (r.includes('very high')) return 'bg-rose-100 text-rose-700 border-rose-200';
  if (r.includes('high')) return 'bg-orange-100 text-orange-700 border-orange-200';
  if (r.includes('moderate')) return 'bg-amber-100 text-amber-700 border-amber-200';
  if (r.includes('low')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

const getRiskBaseColor = (risk: string) => {
  const r = risk.toLowerCase();
  if (r.includes('very high')) return 'bg-rose-500';
  if (r.includes('high')) return 'bg-orange-500';
  if (r.includes('moderate')) return 'bg-amber-500';
  if (r.includes('low')) return 'bg-emerald-500';
  return 'bg-slate-500';
};

const getRiskBorderColor = (risk: string) => {
  const r = risk.toLowerCase();
  if (r.includes('very high')) return 'border-rose-200';
  if (r.includes('high')) return 'border-orange-200';
  if (r.includes('moderate')) return 'border-amber-200';
  if (r.includes('low')) return 'border-emerald-200';
  return 'border-slate-200';
};

const getRiskBgColor = (risk: string) => {
  const r = risk.toLowerCase();
  if (r.includes('very high')) return 'bg-rose-50/30';
  if (r.includes('high')) return 'bg-orange-50/30';
  if (r.includes('moderate')) return 'bg-amber-50/30';
  if (r.includes('low')) return 'bg-emerald-50/30';
  return 'bg-slate-50/30';
};

export default function MutualFundsGuide() {
  const { openConsultationModal } = useModal();
  const [selectedFundIds, setSelectedFundIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const toggleFund = (id: string) => {
    setSelectedFundIds(prev => 
      prev.includes(id) 
        ? prev.filter(fid => fid !== id) 
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const handleSort = (key: string) => {
    if (!key) {
      setSortConfig(null);
      return;
    }
    setSortConfig(prev => {
      if (prev?.key === key) {
        if (prev.direction === 'desc') return { key, direction: 'asc' };
        return null;
      }
      return { key, direction: 'desc' };
    });
  };

  const selectedFunds = COMPARISON_FUNDS.filter(f => selectedFundIds.includes(f.id));

  const sortedFunds = [...selectedFunds].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key as keyof typeof a];
    const bValue = b[sortConfig.key as keyof typeof b];
    
    const parseValue = (val: string | number) => {
      if (typeof val === 'number') return val;
      const riskLevels: Record<string, number> = { 'Low': 1, 'Moderate': 2, 'High': 3, 'Very High': 4 };
      if (riskLevels[val]) return riskLevels[val];
      return parseFloat(val.replace(/[^\d.-]/g, '')) || 0;
    };

    const aNum = parseValue(aValue);
    const bNum = parseValue(bValue);

    return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
  });
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 pt-24 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                Knowledge Base
              </span>
              <BlurText 
                text="Mutual Funds: Wealth Simplified"
                centered={false}
                highlight="Wealth Simplified"
                className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
              />
              <p className="text-xl text-slate-600 leading-relaxed">
                Mutual funds allow you to pool your money with other investors to be managed by professionals. It's the most efficient way for retail investors to participate in the Indian growth story.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="hidden lg:block"
            >
              <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&q=80&w=1200&h=675" 
                  alt="Mutual Funds Investing" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Mutual Fund Comparison Tool */}
            <section id="fund-comparison" className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden scroll-mt-24">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Scale className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 leading-tight">Compare Mutual Funds</h2>
                    <p className="text-sm text-slate-500">Select up to 3 funds to compare metrics side-by-side</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {selectedFundIds.length > 1 && (
                    <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort By:</span>
                      <select 
                        value={sortConfig?.key || ''}
                        onChange={(e) => handleSort(e.target.value)}
                        className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                      >
                        <option value="">Default</option>
                        {METRICS.map(m => (
                          <option key={m.key} value={m.key}>{m.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedFundIds.length > 0 && (
                    <button 
                      onClick={() => {
                        setSelectedFundIds([]);
                        setSortConfig(null);
                      }}
                      className="text-xs font-bold text-rose-500 hover:text-rose-600 uppercase tracking-widest whitespace-nowrap"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {selectedFundIds.length > 1 && (
                <div className="sm:hidden mb-6">
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort Comparison By</span>
                    <select 
                      value={sortConfig?.key || ''}
                      onChange={(e) => handleSort(e.target.value)}
                      className="bg-transparent text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
                    >
                      <option value="">Default</option>
                      {METRICS.map(m => (
                        <option key={m.key} value={m.key}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {COMPARISON_FUNDS.map(fund => (
                  <button
                    key={fund.id}
                    onClick={() => toggleFund(fund.id)}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all text-left group relative",
                      selectedFundIds.includes(fund.id) 
                        ? "border-primary bg-primary/5" 
                        : "border-slate-100 bg-slate-50 hover:border-slate-200"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{fund.category}</span>
                      {selectedFundIds.includes(fund.id) ? (
                        <X className="w-4 h-4 text-primary" />
                      ) : (
                        <Plus className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                      )}
                    </div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">{fund.name}</p>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {selectedFunds.length > 0 ? (
                  <motion.div
                    key="comparison-table"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="overflow-x-auto"
                  >
                    {selectedFunds.length === 1 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-10 p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] text-white overflow-hidden relative group"
                      >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/20 transition-colors duration-700" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-primary shrink-0 border border-white/10">
                            <Scale className="w-8 h-8" />
                          </div>
                          <div className="text-center md:text-left flex-1">
                            <h3 className="text-xl font-black mb-2 tracking-tight">Unlock Side-by-Side Analysis</h3>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xl">
                              You've selected <span className="text-white font-bold">"{selectedFunds[0].name}"</span>. 
                              Add at least one more fund to unlock deep-dive comparisons of Alpha, Beta, and Expense Ratios.
                            </p>
                          </div>
                          <div className="shrink-0 flex flex-col items-center gap-3">
                            <div className="px-6 py-3 bg-white text-slate-900 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-black/20">
                              Select 1 More Fund
                            </div>
                            <button 
                              onClick={() => document.getElementById('fund-comparison')?.scrollIntoView({ behavior: 'smooth' })}
                              className="text-[10px] font-black text-white/60 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors"
                            >
                              Browse Funds <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div className="hidden md:block overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                      <table className="w-full border-collapse min-w-[800px]">
                        <thead className="sticky top-0 z-20 bg-white shadow-sm">
                          <tr>
                            <th className="sticky left-0 z-30 bg-white text-left py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 min-w-[180px]">
                              Metric
                            </th>
                            {sortedFunds.map(fund => (
                              <th key={fund.id} className="text-left py-6 px-6 text-sm font-black text-slate-900 border-b border-slate-100">
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-primary uppercase tracking-widest mb-1">{fund.category}</span>
                                  {fund.name}
                                </div>
                              </th>
                            ))}
                            {selectedFunds.length === 1 && (
                              <th 
                                className="text-left py-6 px-6 border-b border-slate-100 bg-slate-50/50 cursor-pointer group/slot"
                                onClick={() => document.getElementById('fund-comparison')?.scrollIntoView({ behavior: 'smooth' })}
                              >
                                <div className="flex flex-col items-start opacity-50 group-hover/slot:opacity-100 transition-opacity">
                                  <div className="w-8 h-8 bg-slate-200 rounded-lg mb-3 flex items-center justify-center text-slate-400 group-hover/slot:bg-primary/20 group-hover/slot:text-primary transition-colors">
                                    <Plus className="w-4 h-4" />
                                  </div>
                                  <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-black group-hover/slot:text-primary">Slot 2</span>
                                  <span className="text-sm font-black text-slate-400 italic tracking-tight group-hover/slot:text-slate-600">Add to compare</span>
                                </div>
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {METRICS.map((row, idx) => (
                            <tr key={row.key} className={cn(
                              "group hover:bg-slate-50/80 transition-colors",
                              idx % 2 !== 0 && "bg-slate-50/40"
                            )}>
                              <td className={cn(
                                "sticky left-0 z-10 group-hover:bg-slate-50/80 transition-colors py-5 px-6 border-r border-slate-100",
                                idx % 2 !== 0 ? "bg-slate-50/40" : "bg-white"
                              )}>
                                <div className="flex items-center justify-between gap-2">
                                  <Tooltip content={row.tooltip}>
                                    <div className="flex items-center gap-2 cursor-help">
                                      <span className="text-xs font-bold text-slate-500">{row.label}</span>
                                      <Info className="w-3 h-3 text-slate-300" />
                                    </div>
                                  </Tooltip>
                                  <button 
                                    onClick={() => handleSort(row.key)}
                                    className={cn(
                                      "p-1 rounded-md transition-colors",
                                      sortConfig?.key === row.key ? "bg-primary/10 text-primary" : "text-slate-300 hover:bg-slate-100 hover:text-slate-600"
                                    )}
                                  >
                                    {sortConfig?.key === row.key ? (
                                      sortConfig.direction === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
                                    ) : (
                                      <ArrowUpDown className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              </td>
                              {sortedFunds.map(fund => {
                                const value = fund[row.key as keyof typeof fund];
                                return (
                                  <td key={fund.id} className="py-5 px-6">
                                    {row.key === 'risk' ? (
                                      <span className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider",
                                        getRiskColor(value as string)
                                      )}>
                                        {value}
                                      </span>
                                    ) : (
                                      <span className={cn(
                                        "text-sm font-medium",
                                        (row.key.includes('returns') || row.key === 'alpha') ? "text-emerald-600" : "text-slate-900"
                                      )}>
                                        {value}
                                      </span>
                                    )}
                                  </td>
                                );
                              })}
                              {selectedFunds.length === 1 && (
                                <td className="py-5 px-6 bg-slate-50/30">
                                  <div className="flex items-center gap-2 opacity-10">
                                    <div className="h-2 w-16 bg-slate-400 rounded-full" />
                                    <div className="h-2 w-2 bg-slate-400 rounded-full animate-pulse" />
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Card-based layout for mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden">
                      {sortedFunds.map(fund => (
                        <div key={fund.id} className={cn(
                          "bg-white rounded-[2.5rem] border shadow-sm overflow-hidden relative transition-all duration-300 group/card",
                          getRiskBorderColor(fund.risk),
                          getRiskBgColor(fund.risk)
                        )}>
                          {/* Risk Glow Effect */}
                          <div className={cn(
                            "absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 transition-opacity group-hover/card:opacity-30",
                            getRiskBaseColor(fund.risk)
                          )} />
                          
                          <div className={cn("h-3 w-full relative z-10", getRiskBaseColor(fund.risk))} />
                          <div className="p-7 bg-white/60 backdrop-blur-sm border-b border-slate-100 relative z-10">
                            <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-2 block">{fund.category}</span>
                            <h4 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">{fund.name}</h4>
                          </div>
                          <div className="p-4 space-y-2 relative z-10">
                            {METRICS.map((row, idx) => {
                              const value = fund[row.key as keyof typeof fund];
                              return (
                                <div key={row.key} className={cn(
                                  "flex justify-between items-center gap-4 p-4 rounded-2xl transition-all",
                                  idx % 2 !== 0 ? "bg-white/50" : "bg-transparent"
                                )}>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none">{row.label}</span>
                                    <Tooltip content={row.tooltip}>
                                      <Info className="w-4 h-4 text-slate-300 cursor-help" />
                                    </Tooltip>
                                  </div>
                                  <div className="text-right">
                                    {row.key === 'risk' ? (
                                      <span className={cn(
                                        "px-4 py-1.5 rounded-full text-[11px] font-black border uppercase tracking-wider shadow-sm inline-flex items-center gap-2",
                                        getRiskColor(value as string)
                                      )}>
                                        <span className={cn("w-2 h-2 rounded-full animate-pulse", getRiskBaseColor(value as string))} />
                                        {value}
                                      </span>
                                    ) : (
                                      <span className={cn(
                                        "text-[15px] font-black tracking-tight",
                                        (row.key.includes('returns') || row.key === 'alpha') ? "text-emerald-600" : "text-slate-900"
                                      )}>
                                        {value}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      {selectedFunds.length === 1 && (
                        <div className="bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
                          <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center text-slate-300 mb-6">
                            <Plus className="w-8 h-8" />
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 mb-2">Compare with another fund</h4>
                          <p className="text-sm text-slate-500 max-w-[200px]">Select at least one more fund from the list above to see side-by-side performance.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-24 text-center bg-white rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden group"
                  >
                    {/* Animated Background Blobs */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <motion.div 
                        animate={{ 
                          x: [0, 40, 0],
                          y: [0, 20, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" 
                      />
                      <motion.div 
                        animate={{ 
                          x: [0, -50, 0],
                          y: [0, 40, 0],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-48 -right-48 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-[120px]" 
                      />
                    </div>

                    <div className="relative z-10">
                      <div className="relative mb-12">
                        {/* Floating decorative elements */}
                        <motion.div
                          animate={{ 
                            y: [0, -20, 0],
                            opacity: [0.3, 0.6, 0.3]
                          }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute -top-6 -left-6 w-12 h-12 bg-primary/10 rounded-full blur-xl"
                        />
                        <motion.div
                          animate={{ 
                            y: [0, 20, 0],
                            opacity: [0.2, 0.5, 0.2]
                          }}
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                          className="absolute -bottom-4 -right-8 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl"
                        />
                        
                        <motion.div
                          animate={{ 
                            y: [0, -15, 0],
                            rotate: [0, 8, 0, -8, 0],
                            scale: [1, 1.05, 1]
                          }}
                          transition={{ 
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 flex items-center justify-center mx-auto relative z-10 group-hover:shadow-primary/20 transition-all duration-500"
                        >
                          <Scale className="w-14 h-14 text-primary" />
                          
                          {/* Pulsing rings around the icon */}
                          <motion.div 
                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                            className="absolute inset-0 border-2 border-primary/20 rounded-[2.5rem]"
                          />
                        </motion.div>
                      </div>
                      
                      <div className="max-w-md mx-auto px-8">
                        <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                          Select Funds Above to <br />
                          <span className="text-primary">Start Comparing</span>
                        </h3>
                        <p className="text-slate-500 font-medium leading-relaxed mb-10">
                          Choose two or more mutual funds from the list above to unlock a comprehensive side-by-side performance and risk analysis.
                        </p>
                        
                        <div className="flex flex-col items-center gap-6">
                          <button 
                            onClick={() => document.getElementById('fund-comparison')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group/btn px-10 py-5 bg-slate-900 text-white rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] hover:bg-primary transition-all duration-500 shadow-xl shadow-slate-900/20 hover:shadow-primary/30 hover:-translate-y-1 active:translate-y-0 flex items-center gap-3"
                          >
                            Browse Funds
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                          
                          <div className="flex items-center gap-3 text-[10px] font-black text-slate-300 uppercase tracking-[0.25em]">
                            <span className="w-12 h-px bg-slate-100" />
                            <span className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                              Awaiting Selection
                            </span>
                            <span className="w-12 h-px bg-slate-100" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* SIP vs Lumpsum */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Zap className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">SIP vs. Lumpsum</h2>
              </div>
              <ChromaGrid 
                cols="grid-cols-1 md:grid-cols-2"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={[
                  {
                    title: 'SIP (Systematic Investment Plan)',
                    tooltip: 'Best for long-term wealth creation through disciplined investing',
                    description: 'Invest a fixed amount regularly. It averages out the cost of purchase and instills financial discipline.',
                    details: [
                      'Rupee Cost Averaging: Buying more units when prices are low.',
                      'Disciplined Savings: Automated monthly investments.',
                      'Power of Compounding: Small amounts growing large over time.',
                      'Flexibility: Start, stop, or increase SIPs anytime.',
                      'Pro Tip: Use "Step-up SIP" to increase your investment as your income grows.'
                    ],
                    borderColor: '#3B82F6',
                    gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                  },
                  {
                    title: 'Lumpsum Investment',
                    tooltip: 'Ideal for investing a large surplus when markets are attractive',
                    description: 'Invest a large amount at once. Best suited when the market is undervalued or when you have a windfall.',
                    details: [
                      'Immediate Market Exposure: Full capital starts working from day one.',
                      'Market Timing: High potential if invested during market crashes.',
                      'No Recurring Commitment: One-time process.',
                      'Ideal for Windfalls: Bonuses, property sales, or inheritance.',
                      'Pro Tip: If unsure of market levels, use STP to move lumpsum into equity.'
                    ],
                    borderColor: '#0EA5E9',
                    gradient: 'linear-gradient(180deg, #0EA5E9, #000)'
                  }
                ]}
              />
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4">Advanced Strategies: STP & SWP</h4>
                <ChromaGrid 
                  cols="grid-cols-1 md:grid-cols-2"
                  radius={300}
                  damping={0.45}
                  fadeOut={0.6}
                  ease="power3.out"
                  items={[
                    {
                      title: 'STP (Systematic Transfer Plan)',
                      tooltip: 'Systematic way to move money from debt to equity',
                      description: 'Transfer a fixed amount from one fund to another. Ideal for investing a large lumpsum gradually.',
                      details: [
                        'Risk Mitigation: Avoids the risk of investing all at once at a peak.',
                        'Dual Returns: Earn debt returns on the balance while moving to equity.',
                        'Automated Rebalancing: Maintains your desired asset allocation.',
                        'Pro Tip: Park lumpsum in a Liquid Fund and STP into an Equity Fund.'
                      ],
                      borderColor: '#3B82F6',
                      gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                    },
                    {
                      title: 'SWP (Systematic Withdrawal Plan)',
                      tooltip: 'Perfect for generating regular monthly income',
                      description: 'Withdraw a fixed amount regularly from your fund. Ideal for generating a steady monthly income.',
                      details: [
                        'Tax Efficiency: Only the gain portion is taxed, not the principal.',
                        'Steady Cash Flow: Perfect for retirement or regular expenses.',
                        'Market Participation: Remaining corpus continues to grow.',
                        'Pro Tip: Use SWP from a Debt or Hybrid fund for lower volatility in income.'
                      ],
                      borderColor: '#0EA5E9',
                      gradient: 'linear-gradient(180deg, #0EA5E9, #000)'
                    }
                  ]}
                />
              </div>
            </section>

            {/* Fund Types Grid */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Layers className="w-6 h-6 text-primary" />
                Categories of Mutual Funds
              </h2>
            <ChromaGrid 
              cols="grid-cols-1 md:grid-cols-2"
              radius={300}
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
              items={fundTypes.map(fund => ({
                title: fund.title,
                tooltip: `Learn more about ${fund.title} strategies`,
                description: fund.description,
                icon: BarChart3,
                details: fund.details,
                borderColor: fund.color.includes('blue') ? '#3B82F6' : fund.color.includes('sky') ? '#0EA5E9' : fund.color.includes('amber') ? '#F59E0B' : '#6366F1',
                gradient: `linear-gradient(145deg, ${fund.color.includes('blue') ? '#3B82F6' : fund.color.includes('sky') ? '#0EA5E9' : fund.color.includes('amber') ? '#F59E0B' : '#6366F1'}, #000)`
              }))}
            />
              <div className="mt-8 bg-white p-8 rounded-3xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-6">How to Read a Fund Factsheet</h4>
                <p className="text-sm text-slate-600 mb-6">The monthly factsheet is the most important document for an investor. Here's what to look for:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h5 className="font-bold text-slate-900 text-xs mb-1">Portfolio Disclosure</h5>
                    <p className="text-[10px] text-slate-500">Check the top 10 stocks and sector allocation to understand where your money is going.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h5 className="font-bold text-slate-900 text-xs mb-1">Standard Deviation</h5>
                    <p className="text-[10px] text-slate-500">Measures volatility. A lower SD means the fund's returns are more stable.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h5 className="font-bold text-slate-900 text-xs mb-1">Sharpe Ratio</h5>
                    <p className="text-[10px] text-slate-500">Measures risk-adjusted returns. A higher Sharpe ratio is better.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-primary" />
                Understanding Risk Ratios
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 font-bold text-primary">α</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Alpha</h4>
                    <p className="text-xs text-slate-600">The excess return of a fund relative to the return of its benchmark index. A positive alpha means the fund manager has outperformed the market.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 font-bold text-primary">β</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Beta</h4>
                    <p className="text-xs text-slate-600">Measures the fund's sensitivity to market movements. A beta of 1 means the fund moves with the market. {'>'}1 means it's more volatile, {'<'}1 means it's less volatile.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-primary" />
                Advanced Mutual Fund Categories
              </h2>
              <ChromaGrid 
                cols="grid-cols-1 md:grid-cols-2"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={[
                  {
                    title: 'Arbitrage Funds',
                    tooltip: 'Low-risk equity-taxed returns',
                    description: 'Exploit price difference between cash and derivatives market. Low-risk and taxed as equity funds.',
                    details: [
                      'Market Neutral: Returns are independent of market direction.',
                      'Tax Advantage: Equity taxation makes it better than FDs for high-bracket investors.',
                      'Low Volatility: Similar to debt funds but with equity tax treatment.',
                      'Pro Tip: Best for parking money for 3-12 months.'
                    ],
                    borderColor: '#3B82F6',
                    gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                  },
                  {
                    title: 'Quant Funds',
                    tooltip: 'Data-driven algorithmic investing',
                    description: 'Investment decisions are made by mathematical models and algorithms. Removes emotional bias.',
                    details: [
                      'Algorithm Driven: Rules-based stock selection and weighting.',
                      'No Human Emotion: Eliminates fear and greed from the process.',
                      'Back-tested Strategies: Based on historical data and patterns.',
                      'Pro Tip: Good for diversifying away from traditional "star" fund managers.'
                    ],
                    borderColor: '#0EA5E9',
                    gradient: 'linear-gradient(180deg, #0EA5E9, #000)'
                  },
                  {
                    title: 'ESG Funds',
                    tooltip: 'Investing with a conscience',
                    description: 'Focus on companies with high Environmental, Social, and Governance standards.',
                    details: [
                      'Responsible Investing: Supporting ethical and sustainable businesses.',
                      'Risk Management: Companies with high ESG scores often have lower legal/reputational risk.',
                      'Future Ready: Aligning with global shifts towards sustainability.',
                      'Pro Tip: Ideal for investors who want their money to do good while earning returns.'
                    ],
                    borderColor: '#F59E0B',
                    gradient: 'linear-gradient(145deg, #F59E0B, #000)'
                  },
                  {
                    title: 'International Funds',
                    tooltip: 'Global exposure for your portfolio',
                    description: 'Invest in global markets like US or Europe. Provides geographical diversification.',
                    details: [
                      'Global Diversification: Reduces dependence on the Indian economy.',
                      'Currency Hedge: Benefit from Rupee depreciation against the Dollar.',
                      'Access to Tech Giants: Invest in companies not listed in India (e.g., Tesla, Meta).',
                      'Pro Tip: Limit exposure to 10-15% of your total portfolio.'
                    ],
                    borderColor: '#6366F1',
                    gradient: 'linear-gradient(145deg, #6366F1, #000)'
                  }
                ]}
              />
            </section>

            <section className="bg-primary/10 p-10 rounded-[2.5rem] border border-primary/20">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                BHP's 5-Step Fund Selection Process
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Rolling Returns Analysis</h4>
                    <p className="text-sm text-slate-600">We don't look at point-to-point returns. We analyze performance over multiple 3-year and 5-year periods to check consistency.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Fund Manager Track Record</h4>
                    <p className="text-sm text-slate-600">We evaluate the manager's experience, investment philosophy, and performance across different market cycles.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Portfolio Quality Check</h4>
                    <p className="text-sm text-slate-600">Deep dive into the underlying stocks/bonds. We look for high-quality companies with strong balance sheets.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold shrink-0">4</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Risk-Adjusted Returns</h4>
                    <p className="text-sm text-slate-600">Using ratios like Sharpe and Sortino to ensure the fund isn't taking excessive risk for the returns generated.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold shrink-0">5</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Expense Ratio & Exit Load</h4>
                    <p className="text-sm text-slate-600">Ensuring the costs are reasonable and aligned with the fund's strategy.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Taxation Section */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-primary" />
                Taxation on Mutual Funds (India)
              </h2>
              <ChromaGrid 
                cols="grid-cols-1 md:grid-cols-2"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={[
                  {
                    title: 'Equity-Oriented Funds',
                    tooltip: 'Taxation for funds with >65% equity exposure',
                    description: 'STCG (< 1 yr): 15% flat tax. LTCG (> 1 yr): 10% tax on gains above ₹1 Lakh.',
                    details: [
                      'Short-Term Capital Gains (STCG): 15% if held for less than 12 months.',
                      'Long-Term Capital Gains (LTCG): 10% on gains exceeding ₹1 Lakh per year.',
                      'Exemption Limit: No tax on the first ₹1 Lakh of LTCG in a financial year.',
                      'Pro Tip: Plan your redemptions to stay within the ₹1 Lakh exemption limit.'
                    ],
                    borderColor: '#3B82F6',
                    gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                  },
                  {
                    title: 'Debt-Oriented Funds',
                    tooltip: 'Taxation for fixed-income funds',
                    description: 'All Gains: Taxed as per your income tax slab rate. Indexation is no longer available.',
                    details: [
                      'Slab Rate Taxation: Gains are added to your total income and taxed accordingly.',
                      'No Indexation: Benefit of adjusting for inflation is no longer available for new investments.',
                      'TDS: Tax is not deducted at source for residents, but mandatory for NRIs.',
                      'Pro Tip: Debt funds are still better than FDs for those who want liquidity and professional management.'
                    ],
                    borderColor: '#0EA5E9',
                    gradient: 'linear-gradient(180deg, #0EA5E9, #000)'
                  }
                ]}
              />
            </section>

            {/* Common Mistakes */}
            <section className="bg-rose-50 p-10 rounded-[2.5rem] border border-rose-100">
              <h2 className="text-2xl font-bold text-rose-900 mb-8 flex items-center gap-3">
                <Info className="w-6 h-6 text-rose-600" />
                Common Investing Mistakes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: 'Chasing Past Performance', desc: 'Investing in last year\'s top performer without understanding the strategy.', tooltip: 'Past performance does not guarantee future results' },
                  { title: 'Stopping SIPs in Bear Markets', desc: 'The best time to buy is when markets are low. Stopping SIPs kills rupee cost averaging.', tooltip: 'Market volatility is your friend in the long run' },
                  { title: 'Ignoring Expense Ratios', desc: 'High expense ratios can eat up a significant portion of your wealth over 20 years.', tooltip: 'Even 1% difference can cost lakhs over decades' },
                  { title: 'Over-diversification', desc: 'Holding 20+ funds doesn\'t reduce risk; it just makes tracking difficult and dilutes returns.', tooltip: 'Focus on 4-6 quality funds across categories' }
                ].map((m, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-rose-200">
                    <Tooltip content={m.tooltip}>
                      <h4 className="font-bold text-rose-900 mb-1 cursor-help">{m.title}</h4>
                    </Tooltip>
                    <p className="text-xs text-rose-700 leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Direct vs Regular */}
            <section className="bg-primary/20 p-10 rounded-[2.5rem] border border-primary/30">
              <div className="flex items-center gap-4 mb-6">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold text-slate-900">Direct vs. Regular Plans</h2>
              </div>
              <p className="text-slate-700 mb-8 leading-relaxed">
                Every mutual fund has two versions. Choosing the right one can save you lakhs of rupees over 20 years.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-white/50 rounded-2xl border border-primary/20">
                  <Tooltip content="No commission, higher returns">
                    <h4 className="font-bold mb-2 text-primary cursor-help">Direct Plan</h4>
                  </Tooltip>
                  <p className="text-sm text-slate-600">Bought directly from the AMC. No commissions paid to brokers. Lower expense ratio = Higher returns.</p>
                </div>
                <div className="p-6 bg-white/50 rounded-2xl border border-primary/20">
                  <Tooltip content="Includes agent commission">
                    <h4 className="font-bold mb-2 text-slate-500 cursor-help">Regular Plan</h4>
                  </Tooltip>
                  <p className="text-sm text-slate-600">Bought through a distributor. Includes commission. Higher expense ratio = Slightly lower returns.</p>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
              </div>
              
              <div className="space-y-4">
                {[
                  {
                    q: "What exactly is a Mutual Fund?",
                    a: "A mutual fund is a professional investment vehicle that pools money from many investors to purchase a diversified portfolio of stocks, bonds, or other securities. Each investor owns 'units' which represent a portion of the fund's holdings."
                  },
                  {
                    q: "What is NAV and does a lower NAV mean a better fund?",
                    a: "NAV (Net Asset Value) is the market value of a single unit of the fund. A common myth is that a low NAV (like ₹10) is 'cheaper' than a high NAV (like ₹500). In reality, NAV doesn't indicate value; it's just the total assets divided by units. Performance depends on the percentage growth of the underlying assets, not the starting NAV."
                  },
                  {
                    q: "What is the Expense Ratio and why should I care?",
                    a: "The Expense Ratio is the annual fee charged by the fund house to manage your investment. It's expressed as a percentage of the fund's daily net assets. Even a 0.5% difference in expense ratio can lead to a difference of lakhs of rupees in your final corpus over a 20-year period due to the power of compounding."
                  },
                  {
                    q: "How are Mutual Funds taxed in India?",
                    a: "Taxation depends on the fund type. For Equity Funds (65%+ equity), Short-Term Capital Gains (STCG, <1 year) are taxed at 20%, and Long-Term Capital Gains (LTCG, >1 year) are taxed at 12.5% on gains above ₹1.25 Lakh. For Debt Funds, all gains are now taxed as per your individual income tax slab rate."
                  },
                  {
                    q: "What is the difference between Direct and Regular plans?",
                    a: "Direct plans are bought directly from the fund house, while Regular plans are bought through a broker or distributor. Direct plans have a lower expense ratio because no commission is paid to an intermediary, resulting in higher returns for you over the long term."
                  },
                  {
                    q: "Can I lose money in Mutual Funds?",
                    a: "Yes, mutual funds are subject to market risks. The value of your units can fluctuate based on the performance of the underlying stocks or bonds. However, staying invested for the long term (5-10+ years) typically helps in averaging out market volatility and generating inflation-beating returns."
                  }
                ].map((faq, index) => (
                  <FAQItem key={index} question={faq.q} answer={faq.a} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Key Terminologies
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">NAV (Net Asset Value)</h4>
                  <p className="text-xs text-slate-500">The price of one unit of a mutual fund scheme.</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Expense Ratio</h4>
                  <p className="text-xs text-slate-500">The annual fee charged by the AMC to manage your money.</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Exit Load</h4>
                  <p className="text-xs text-slate-500">A fee charged if you withdraw your money before a certain period.</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">AUM (Assets Under Management)</h4>
                  <p className="text-xs text-slate-500">The total market value of investments managed by the fund.</p>
                </div>
              </div>
            </div>

            <div className="bg-primary text-slate-900 p-8 rounded-[2rem]">
              <HelpCircle className="w-10 h-10 text-white mb-6" />
              <h3 className="text-xl font-bold mb-4">How to Choose?</h3>
              <p className="text-slate-800 text-sm mb-6 leading-relaxed font-medium">
                Selecting a fund based on past returns alone is a mistake. Look at the fund manager's track record, risk ratios (Alpha/Beta), and consistency across market cycles.
              </p>
              <button 
                onClick={() => openConsultationModal('Mutual Funds')}
                className="w-full bg-white text-primary font-bold py-4 rounded-2xl text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                Get Personalized Advice <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
