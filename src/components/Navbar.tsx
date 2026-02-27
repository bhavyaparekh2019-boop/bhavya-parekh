import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useModal } from '@/src/context/ModalContext';

import Logo from './Logo';

export default function Navbar() {
  const { openConsultationModal } = useModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const knowledgeLinks = [
    { name: 'Investment', href: '/guides/investment' },
    { name: 'Insurance', href: '/guides/insurance' },
    { name: 'Retirement', href: '/guides/retirement' },
    { name: 'Tax', href: '/guides/tax' },
    { name: 'Mutual Funds', href: '/guides/mutual-funds' },
    { name: 'Stocks', href: '/guides/stocks' },
    { name: 'Blogs', href: '/insights' },
  ];

  const toolLinks = [
    { name: 'SIP Calculator', href: '/tools/sip' },
    { name: 'Home Loan EMI', href: '/tools/mortgage' },
    { name: 'Retirement Planner', href: '/tools/retirement' },
    { name: 'Insurance Needs', href: '/tools/insurance' },
    { name: 'Investment ROI', href: '/tools/roi' },
  ];

  const mainLinks = [
    { name: 'About Us', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      {/* Top Row: Logo & Knowledge Center & Insights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <Link to="/">
            <Logo size="lg" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {knowledgeLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'text-sm font-bold transition-colors hover:text-primary whitespace-nowrap',
                  location.pathname === link.href ? 'text-primary' : 'text-slate-600'
                )}
              >
                {link.name}
              </Link>
            ))}

            {/* Financial Tools Dropdown */}
            <div className="relative group">
              <button
                className={cn(
                  'flex items-center gap-1 text-sm font-bold transition-colors hover:text-primary whitespace-nowrap',
                  location.pathname.startsWith('/tools') ? 'text-primary' : 'text-slate-600'
                )}
              >
                Financial Tools <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-2">
                {toolLinks.map((tool) => (
                  <Link
                    key={tool.name}
                    to={tool.href}
                    className="block px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-6">
            <button className="p-2 text-slate-500 hover:text-primary transition-colors">
              <Search className="w-6 h-6" />
            </button>
            <button
              className="lg:hidden p-2 text-slate-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Tools & Main Navigation */}
      <div className="bg-slate-50 border-t border-slate-100 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <nav className="flex items-center gap-10">
              {mainLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    'text-xs font-black uppercase tracking-widest transition-all hover:text-primary',
                    location.pathname === link.href ? 'text-primary' : 'text-slate-500'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <button
              onClick={openConsultationModal}
              className="bg-primary text-slate-900 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/20"
            >
              Get Started &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-8 space-y-8 max-h-[85vh] overflow-y-auto shadow-2xl">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Knowledge & Insights</p>
            <div className="grid grid-cols-1 gap-y-4">
              {knowledgeLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-lg font-bold text-slate-900 hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Financial Tools</p>
            <div className="grid grid-cols-1 gap-y-4">
              {toolLinks.map((tool) => (
                <Link
                  key={tool.name}
                  to={tool.href}
                  className="text-lg font-bold text-slate-900 hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Explore BHP Finance</p>
            <div className="space-y-6">
              {mainLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-2xl font-bold text-slate-900 hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <button
            className="block w-full bg-primary text-slate-900 text-center py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20"
            onClick={() => {
              setIsMobileMenuOpen(false);
              openConsultationModal();
            }}
          >
            Get Started
          </button>
        </div>
      )}
    </header>
  );
}
