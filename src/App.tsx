import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import ChatBot from '@/src/components/ChatBot';
import Home from '@/src/pages/Home';
import ArticleDetail from '@/src/pages/ArticleDetail';
import MortgageCalculator from '@/src/pages/tools/MortgageCalculator';
import RetirementPlanner from '@/src/pages/tools/RetirementPlanner';
import InvestmentROI from '@/src/pages/tools/InvestmentROI';
import InsuranceCalculator from '@/src/pages/tools/InsuranceCalculator';
import InsuranceGuide from '@/src/pages/guides/InsuranceGuide';
import InvestmentGuide from '@/src/pages/guides/InvestmentGuide';
import RetirementGuide from '@/src/pages/guides/RetirementGuide';
import TaxGuide from '@/src/pages/guides/TaxGuide';

export default function App() {
  return (
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
            <Route path="/guides/insurance" element={<InsuranceGuide />} />
            <Route path="/guides/investment" element={<InvestmentGuide />} />
            <Route path="/guides/retirement" element={<RetirementGuide />} />
            <Route path="/guides/tax" element={<TaxGuide />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <Footer />
        <ChatBot />
      </div>
    </Router>
  );
}
