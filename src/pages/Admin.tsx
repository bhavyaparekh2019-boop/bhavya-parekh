import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Mail, Phone, Calendar, Briefcase, Shield, ArrowLeft, Loader2, RefreshCcw, Database, Sparkles, CheckCircle2, AlertCircle, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth, signInWithPopup, googleProvider, signOut, onAuthStateChanged } from '../lib/firebase';
import { 
  fetchRealMutualFunds, 
  saveMutualFundsToFirestore, 
  getAllMutualFundsFromFirestore, 
  MutualFund, 
  searchMutualFunds, 
  verifyMutualFundData, 
  deleteMutualFundFromFirestore 
} from '../services/mutualFundService';
import {
  fetchRealInsurancePlans,
  saveInsurancePlansToFirestore,
  getAllInsurancePlansFromFirestore,
  InsurancePlan,
  verifyInsurancePlanData,
  deleteInsurancePlanFromFirestore
} from '../services/insuranceService';
import { Search, Trash2, CheckCircle, XCircle, Info, Heart } from 'lucide-react';

interface Consultation {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
}

interface Subscription {
  email: string;
  date: string;
}

interface AdminData {
  subscriptions: Subscription[];
  consultations: Consultation[];
}

export default function Admin() {
  const [data, setData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [mutualFunds, setMutualFunds] = useState<MutualFund[]>([]);
  const [insurancePlans, setInsurancePlans] = useState<InsurancePlan[]>([]);
  const [activeTab, setActiveTab] = useState<'mutual-funds' | 'insurance'>('mutual-funds');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const isAdmin = user?.email === "bhavya.parekh2019@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        fetchData();
        fetchMutualFunds();
        fetchInsurancePlans();
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/data');
      if (!response.ok) throw new Error('Failed to fetch admin data');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err: any) {
      console.error('Admin Fetch Error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMutualFunds = async () => {
    try {
      const funds = await getAllMutualFundsFromFirestore();
      setMutualFunds(funds);
    } catch (err) {
      console.error("Fetch Mutual Funds Error:", err);
    }
  };

  const fetchInsurancePlans = async () => {
    try {
      const plans = await getAllInsurancePlansFromFirestore();
      setInsurancePlans(plans);
    } catch (err) {
      console.error("Fetch Insurance Plans Error:", err);
    }
  };

  const handleSyncMutualFunds = async () => {
    setIsSyncing(true);
    setSyncStatus({ type: null, message: '' });
    try {
      const realFunds = await fetchRealMutualFunds(20);
      await saveMutualFundsToFirestore(realFunds);
      await fetchMutualFunds();
      setSyncStatus({ type: 'success', message: `Successfully synced ${realFunds.length} mutual funds.` });
    } catch (err: any) {
      console.error("Sync Error:", err);
      setSyncStatus({ type: 'error', message: `Failed to sync: ${err.message}` });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncInsurancePlans = async () => {
    setIsSyncing(true);
    setSyncStatus({ type: null, message: '' });
    try {
      const realPlans = await fetchRealInsurancePlans(15);
      await saveInsurancePlansToFirestore(realPlans);
      await fetchInsurancePlans();
      setSyncStatus({ type: 'success', message: `Successfully synced ${realPlans.length} insurance plans.` });
    } catch (err: any) {
      console.error("Sync Error:", err);
      setSyncStatus({ type: 'error', message: `Failed to sync: ${err.message}` });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleVerifyInsurancePlan = async (plan: InsurancePlan) => {
    if (!plan.id) return;
    setVerifyingId(plan.id);
    try {
      const result = await verifyInsurancePlanData(plan);
      if (result.isValid) {
        setSyncStatus({ type: 'success', message: `${plan.name} is verified as accurate.` });
      } else if (result.correctedData) {
        await saveInsurancePlansToFirestore([result.correctedData]);
        await fetchInsurancePlans();
        setSyncStatus({ type: 'success', message: `${plan.name} data was corrected based on latest info: ${result.reason}` });
      } else {
        setSyncStatus({ type: 'error', message: `Verification failed for ${plan.name}: ${result.reason}` });
      }
    } catch (err: any) {
      console.error("Verify Error:", err);
      setSyncStatus({ type: 'error', message: `Verification error: ${err.message}` });
    } finally {
      setVerifyingId(null);
    }
  };

  const handleDeleteInsurancePlan = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this insurance plan?")) return;
    try {
      await deleteInsurancePlanFromFirestore(id);
      await fetchInsurancePlans();
      setSyncStatus({ type: 'success', message: "Plan deleted successfully." });
    } catch (err: any) {
      console.error("Delete Error:", err);
      setSyncStatus({ type: 'error', message: `Failed to delete: ${err.message}` });
    }
  };

  const handleSearchFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchMutualFunds(searchQuery);
      await saveMutualFundsToFirestore(results);
      await fetchMutualFunds();
      setSearchQuery('');
      setSyncStatus({ type: 'success', message: `Found and added ${results.length} funds matching "${searchQuery}".` });
    } catch (err: any) {
      console.error("Search Error:", err);
      setSyncStatus({ type: 'error', message: `Search failed: ${err.message}` });
    } finally {
      setIsSearching(false);
    }
  };

  const handleVerifyFund = async (fund: MutualFund) => {
    if (!fund.id) return;
    setVerifyingId(fund.id);
    try {
      const result = await verifyMutualFundData(fund);
      if (result.isValid) {
        setSyncStatus({ type: 'success', message: `${fund.name} is verified as accurate.` });
      } else if (result.correctedData) {
        await saveMutualFundsToFirestore([result.correctedData]);
        await fetchMutualFunds();
        setSyncStatus({ type: 'success', message: `${fund.name} data was corrected based on latest info: ${result.reason}` });
      } else {
        setSyncStatus({ type: 'error', message: `Verification failed for ${fund.name}: ${result.reason}` });
      }
    } catch (err: any) {
      console.error("Verify Error:", err);
      setSyncStatus({ type: 'error', message: `Verification error: ${err.message}` });
    } finally {
      setVerifyingId(null);
    }
  };

  const handleDeleteFund = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this mutual fund?")) return;
    try {
      await deleteMutualFundFromFirestore(id);
      await fetchMutualFunds();
      setSyncStatus({ type: 'success', message: "Fund deleted successfully." });
    } catch (err: any) {
      console.error("Delete Error:", err);
      setSyncStatus({ type: 'error', message: `Failed to delete: ${err.message}` });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Admin Access</h1>
          <p className="text-slate-500 mb-8">Please sign in with your administrator account to continue.</p>
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            <LogIn className="w-5 h-5" />
            Sign in with Google
          </button>
          <Link to="/" className="inline-block mt-6 text-sm font-bold text-slate-400 hover:text-primary transition-colors">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-500 mb-8">You do not have administrative privileges. Please contact the system owner.</p>
          <button 
            onClick={handleLogout}
            className="w-full px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-4 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 mt-2">Manage mutual funds, consultation requests, and newsletter subscriptions.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchData}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 font-bold hover:bg-slate-50 transition-all shadow-sm"
            >
              <RefreshCcw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              Refresh Data
            </button>
            <button 
              onClick={handleLogout}
              className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 font-bold mb-8">
            Error: {error}
          </div>
        )}

        {/* Data Management Section */}
        <section className="mb-12">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Financial Data Manager</h2>
                  <p className="text-sm text-slate-500">Sync and verify real-time data using Gemini AI.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                  <button 
                    onClick={() => setActiveTab('mutual-funds')}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                      activeTab === 'mutual-funds' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    Mutual Funds
                  </button>
                  <button 
                    onClick={() => setActiveTab('insurance')}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                      activeTab === 'insurance' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    Insurance
                  </button>
                </div>
                {activeTab === 'mutual-funds' ? (
                  <>
                    <form onSubmit={handleSearchFunds} className="relative">
                      <input 
                        type="text" 
                        placeholder="Search & add funds..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all w-64"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />}
                    </form>
                    <button 
                      onClick={handleSyncMutualFunds}
                      disabled={isSyncing}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                      {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      {isSyncing ? 'Syncing...' : 'Sync 20 Funds'}
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleSyncInsurancePlans}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {isSyncing ? 'Syncing...' : 'Sync 15 Plans'}
                  </button>
                )}
              </div>
            </div>

            {syncStatus.type && (
              <div className={cn(
                "p-4 rounded-2xl mb-8 flex items-center gap-3 font-bold text-sm",
                syncStatus.type === 'success' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
              )}>
                {syncStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {syncStatus.message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
              {activeTab === 'mutual-funds' ? (
                mutualFunds.length === 0 ? (
                  <div className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">No mutual funds in database. Click Sync or Search to fetch real data.</p>
                  </div>
                ) : (
                  mutualFunds.map((fund) => (
                    <div key={fund.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-primary/20 transition-all group relative">
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-primary uppercase tracking-widest">{fund.category}</span>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleVerifyFund(fund)}
                            disabled={verifyingId === fund.id}
                            title="Verify Data"
                            className="p-2 bg-white border border-slate-200 rounded-xl text-amber-500 hover:bg-amber-50 transition-colors"
                          >
                            {verifyingId === fund.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                          </button>
                          <button 
                            onClick={() => fund.id && handleDeleteFund(fund.id)}
                            title="Delete Fund"
                            className="p-2 bg-white border border-slate-200 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-black text-slate-900 mb-3 leading-tight">{fund.name}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">1Y Return</p>
                          <p className="text-sm font-black text-emerald-600">{fund.returns1Y}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Risk</p>
                          <p className="text-sm font-black text-slate-700">{fund.risk}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Exp. Ratio</p>
                          <p className="text-sm font-bold text-slate-600">{fund.expenseRatio}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sharpe</p>
                          <p className="text-sm font-bold text-slate-600">{fund.sharpe}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <RefreshCcw className="w-2.5 h-2.5" />
                          {new Date(fund.lastUpdated).toLocaleDateString()}
                        </span>
                        {fund.isReal && (
                          <span className="flex items-center gap-1 text-[9px] font-black text-amber-500 uppercase tracking-widest">
                            <Sparkles className="w-2.5 h-2.5" />
                            Verified Real
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )
              ) : (
                insurancePlans.length === 0 ? (
                  <div className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">No insurance plans in database. Click Sync to fetch real data.</p>
                  </div>
                ) : (
                  insurancePlans.map((plan) => (
                    <div key={plan.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-primary/20 transition-all group relative">
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-primary uppercase tracking-widest">{plan.category}</span>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleVerifyInsurancePlan(plan)}
                            disabled={verifyingId === plan.id}
                            title="Verify Data"
                            className="p-2 bg-white border border-slate-200 rounded-xl text-amber-500 hover:bg-amber-50 transition-colors"
                          >
                            {verifyingId === plan.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                          </button>
                          <button 
                            onClick={() => plan.id && handleDeleteInsurancePlan(plan.id)}
                            title="Delete Plan"
                            className="p-2 bg-white border border-slate-200 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-black text-slate-900 mb-1 leading-tight">{plan.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">{plan.company}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CSR</p>
                          <p className="text-sm font-black text-emerald-600">{plan.csr}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium</p>
                          <p className="text-sm font-black text-slate-700">{plan.premium}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Coverage</p>
                          <p className="text-sm font-bold text-slate-600">{plan.sumAssured}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <RefreshCcw className="w-2.5 h-2.5" />
                          {new Date(plan.lastUpdated).toLocaleDateString()}
                        </span>
                        {plan.isReal && (
                          <span className="flex items-center gap-1 text-[9px] font-black text-amber-500 uppercase tracking-widest">
                            <Sparkles className="w-2.5 h-2.5" />
                            Verified Real
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Consultation Requests */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Consultation Requests</h2>
              <span className="ml-auto px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                {data?.consultations.length || 0} Total
              </span>
            </div>

            <div className="space-y-4">
              {data?.consultations.length === 0 ? (
                <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 text-center">
                  <p className="text-slate-400 font-medium">No consultation requests yet.</p>
                </div>
              ) : (
                data?.consultations.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-black text-slate-900 mb-1">{item.name}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" />
                            {item.email}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" />
                            {item.phone}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                          {item.service}
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )).reverse()
              )}
            </div>
          </div>

          {/* Newsletter Subscriptions */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Subscribers</h2>
              <span className="ml-auto px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                {data?.subscriptions.length || 0}
              </span>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {data?.subscriptions.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-slate-400 font-medium">No subscribers yet.</p>
                  </div>
                ) : (
                  data?.subscriptions.map((item, idx) => (
                    <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                      <div className="truncate">
                        <p className="text-sm font-bold text-slate-900 truncate">{item.email}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Shield className="w-4 h-4 text-sky-500 shrink-0" />
                    </div>
                  )).reverse()
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Helper for conditional classes
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
