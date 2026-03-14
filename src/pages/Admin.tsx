import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Mail, Phone, Calendar, Briefcase, Shield, ArrowLeft, Loader2, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

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

  useEffect(() => {
    fetchData();
  }, []);

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
            <p className="text-slate-500 mt-2">Manage consultation requests and newsletter subscriptions.</p>
          </div>
          <button 
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCcw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            Refresh Data
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 font-bold mb-8">
            Error: {error}
          </div>
        )}

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
