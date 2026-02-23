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
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <Footer />
        <ChatBot />
      </div>
    </Router>
  );
}
