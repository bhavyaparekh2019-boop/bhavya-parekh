import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import ChatBot from '@/src/components/ChatBot';
import ConsultationModal from '@/src/components/ConsultationModal';
import { ModalProvider } from '@/src/context/ModalContext';
import Home from '@/src/pages/Home';
import ArticleDetail from '@/src/pages/ArticleDetail';
import MortgageCalculator from '@/src/pages/tools/MortgageCalculator';
import RetirementPlanner from '@/src/pages/tools/RetirementPlanner';
import InvestmentROI from '@/src/pages/tools/InvestmentROI';
import InsuranceCalculator from '@/src/pages/tools/InsuranceCalculator';
import SIPCalculator from '@/src/pages/tools/SIPCalculator';
import LumpsumCalculator from '@/src/pages/tools/LumpsumCalculator';
import InsuranceGuide from '@/src/pages/guides/InsuranceGuide';
import InvestmentGuide from '@/src/pages/guides/InvestmentGuide';
import RetirementGuide from '@/src/pages/guides/RetirementGuide';
import TaxGuide from '@/src/pages/guides/TaxGuide';
import MutualFundsGuide from '@/src/pages/guides/MutualFundsGuide';
import StockMarketGuide from '@/src/pages/guides/StockMarketGuide';
import MarketAnalysis from '@/src/pages/MarketAnalysis';
import Insights from '@/src/pages/Insights';
import About from '@/src/pages/About';
import Admin from '@/src/pages/Admin';
import Portfolio from '@/src/pages/Portfolio';
import NavigationDock from '@/src/components/NavigationDock';

import ErrorBoundary from '@/src/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
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
                <Route path="/insights" element={<Insights />} />
                <Route path="/about" element={<About />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </div>
            <Footer />
            <ChatBot />
            <ConsultationModal />
            <NavigationDock />
          </div>
        </Router>
      </ModalProvider>
    </ErrorBoundary>
  );
}
