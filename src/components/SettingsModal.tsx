import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Key, Save, AlertCircle, CheckCircle2, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  useEffect(() => {
    if (isOpen) {
      const savedKey = localStorage.getItem('BHP_GEMINI_API_KEY') || '';
      setApiKey(savedKey);
      setStatus('idle');
    }
  }, [isOpen]);

  const handleSave = () => {
    setStatus('saving');
    setTimeout(() => {
      if (apiKey.trim()) {
        localStorage.setItem('BHP_GEMINI_API_KEY', apiKey.trim());
      } else {
        localStorage.removeItem('BHP_GEMINI_API_KEY');
      }
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        onClose();
        window.location.reload(); // Reload to apply the new key globally
      }, 1000);
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">System Settings</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Configuration & API</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900">
                  <Key className="w-4 h-4 text-primary" />
                  <label className="text-sm font-black uppercase tracking-wider">Gemini API Key</label>
                </div>
                
                <div className="relative">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Google Gemini API Key..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                  />
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">Self-Hosting Note</p>
                    <p className="text-[11px] text-amber-700 leading-relaxed">
                      If you are hosting this application on your own server or as a static site, you must provide your own Gemini API key for the AI features to work. Your key is stored securely in your browser's local storage and is never sent to our servers.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex gap-3">
                  <Globe className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-sky-900 uppercase tracking-wider">How to get a key?</p>
                    <p className="text-[11px] text-sky-700 leading-relaxed">
                      Visit the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="font-black underline hover:text-sky-900">Google AI Studio</a> to generate a free API key.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={status !== 'idle'}
                className={cn(
                  "w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl",
                  status === 'success' ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-primary text-slate-900 shadow-primary/20 hover:brightness-110"
                )}
              >
                {status === 'idle' && <><Save className="w-4 h-4" /> Save Configuration</>}
                {status === 'saving' && <><div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> Saving...</>}
                {status === 'success' && <><CheckCircle2 className="w-4 h-4" /> Settings Applied</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
