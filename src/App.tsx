import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import ConsultationModal from '@/components/ConsultationModal';
import { ModalProvider } from '@/context/ModalContext';
import Home from '@/pages/Home';
import ArticleDetail from '@/pages/ArticleDetail';
import MortgageCalculator from '@/pages/tools/MortgageCalculator';
import RetirementPlanner from '@/pages/tools/RetirementPlanner';
import InvestmentROI from '@/pages/tools/InvestmentROI';
import InsuranceCalculator from '@/pages/tools/InsuranceCalculator';
import SIPCalculator from '@/pages/tools/SIPCalculator';
import LumpsumCalculator from '@/pages/tools/LumpsumCalculator';
import InsuranceGuide from '@/pages/guides/InsuranceGuide';
import InvestmentGuide from '@/pages/guides/InvestmentGuide';
import RetirementGuide from '@/pages/guides/RetirementGuide';
import TaxGuide from '@/pages/guides/TaxGuide';
import MutualFundsGuide from '@/pages/guides/MutualFundsGuide';
import StockMarketGuide from '@/pages/guides/StockMarketGuide';
import MarketAnalysis from '@/pages/MarketAnalysis';
import About from '@/pages/About';
import Admin from '@/pages/Admin';
import Portfolio from '@/pages/Portfolio';
import AppErrorBoundary from './AppErrorBoundary';

// Force re-transformation of App.tsx v4
export default function App() {
  return (
    <AppErrorBoundary>
      <ModalProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/article/:id" element={<ArticleDetail />} />
                <Route path="/tools/mortgage" element={<MortgageCalculator />} />
                <Route path="/tools/retirement" element={<RetirementPlanner />} />
                <Route path="/tools/roi" element={<InvestmentROI />} />
                <Route path="/tools/insurance" element={<InsuranceCalculator />} />
                <Route path="/tools/sip" element={<SIPCalculator />} />
                <Route path="/tools/lumpsum" element={<LumpsumCalculator />} />
                <Route path="/guides/insurance" element={<InsuranceGuide />} />
                <Route path="/guides/investment" element={<InvestmentGuide />} />
                <Route path="/guides/retirement" element={<RetirementGuide />} />
                <Route path="/guides/tax" element={<TaxGuide />} />
                <Route path="/guides/mutual-funds" element={<MutualFundsGuide />} />
                <Route path="/guides/stocks" element={<StockMarketGuide />} />
                <Route path="/market-analysis" element={<MarketAnalysis />} />
                <Route path="/about" element={<About />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </div>
            <Footer />
            <ChatBot />
            <ConsultationModal />
          </div>
        </Router>
      </ModalProvider>
    </AppErrorBoundary>
  );
}
