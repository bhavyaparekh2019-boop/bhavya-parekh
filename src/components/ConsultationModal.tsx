import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useModal } from '../context/ModalContext';

const services = [
  'Investment Planning',
  'Insurance Advisory',
  'Retirement Planning',
  'Tax Saving',
  'Mutual Funds',
  'Stock Market Guidance',
  'Loan Assistance'
];

export default function ConsultationModal() {
  const { isConsultationModalOpen, closeConsultationModal, initialService } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: initialService || services[0]
  });
  const [successNote, setSuccessNote] = useState<string | null>(null);

  // Update service if initialService changes
  React.useEffect(() => {
    if (initialService) {
      setFormData(prev => ({ ...prev, service: initialService }));
    }
  }, [initialService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned an unexpected response format.');
      }

      if (response.ok) {
        setIsSuccess(true);
        setSuccessNote(data.note || null);
        setTimeout(() => {
          setIsSuccess(false);
          setSuccessNote(null);
          closeConsultationModal();
          setFormData({ name: '', email: '', phone: '', service: services[0] });
        }, 5000);
      } else {
        const errorMsg = data.details ? `${data.error}: ${data.details}` : (data.error || 'Failed to submit request. Please check your connection.');
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setError(err.message === 'Server returned an unexpected response format.' 
        ? 'The server encountered an internal error. Please try again later.' 
        : 'A network error occurred. Please check your internet connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isConsultationModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeConsultationModal}
            className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 sm:p-10">
              <button
                onClick={closeConsultationModal}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {isSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Request Received!</h3>
                  <p className="text-slate-500 mb-4">Our expert advisor will contact you shortly.</p>
                  {successNote && (
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-[10px] font-bold uppercase tracking-wider max-w-xs mx-auto">
                      Note: {successNote}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Consult an Advisor</h2>
                    <p className="text-slate-500">Fill in your details and we'll get back to you.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold">
                        {error}
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                        <input
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Interested Service</label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none"
                      >
                        {services.map(service => (
                          <option key={service} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-slate-900 font-black py-5 rounded-2xl text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Submit Request <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
