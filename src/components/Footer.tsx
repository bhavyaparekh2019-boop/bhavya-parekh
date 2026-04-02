import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Share2, Mail, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

import Logo from './Logo';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [subscribeNote, setSubscribeNote] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (response.ok) {
          setStatus('success');
          setMessage('Thank you for subscribing!');
          setSubscribeNote(data.note || '');
          setEmail('');
        } else {
          throw new Error(data.error || 'Subscription failed');
        }
      } else {
        const text = await response.text();
        console.error('Non-JSON response from /api/subscribe:', text.substring(0, 500));
        throw new Error(`Server returned an unexpected response format (${response.status}). Please try again later.`);
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  const sections = [
    {
      title: 'Guides',
      links: [
        { name: 'Investment', href: '/guides/investment' },
        { name: 'Insurance', href: '/guides/insurance' },
        { name: 'Retirement', href: '/guides/retirement' },
        { name: 'Tax Planning', href: '/guides/tax' }
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Admin Dashboard', href: '/admin' }
      ],
    },
    {
      title: 'Tools',
      links: [
        { name: 'SIP Calculator', href: '/tools/sip' },
        { name: 'Lumpsum Calculator', href: '/tools/lumpsum' },
        { name: 'EMI Calculator', href: '/tools/mortgage' },
        { name: 'ROI Calculator', href: '/tools/roi' }
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-slate-200 pt-20 pb-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Logo size="sm" className="mb-6" />
            <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-xs">
              Empowering individuals and institutions with strategic financial guidance and innovative market insights since 2002.
            </p>
            
            <div className="mb-8">
              <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Subscribe to our Newsletter</h4>
              <form onSubmit={handleSubscribe} className="relative max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="absolute right-1.5 top-1.5 p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
              
              {status === 'success' && (
                <div className="mt-3 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sky-600 text-xs font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    {message}
                  </div>
                  {subscribeNote && (
                    <p className="text-[10px] text-slate-400 italic ml-6">
                      Note: {subscribeNote}
                    </p>
                  )}
                </div>
              )}
              
              {status === 'error' && (
                <div className="mt-3 flex items-center gap-2 text-rose-600 text-xs font-medium">
                  <AlertCircle className="w-4 h-4" />
                  {message}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              {[Globe, Share2, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold text-slate-900 mb-6">{section.title}</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} BHP Finance. All rights reserved. Registered Investment Advisor.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <MapPin className="w-3 h-3 text-primary" />
            Global Financial District
          </div>
        </div>
      </div>
    </footer>
  );
}
