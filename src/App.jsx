import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/pos" element={<Layout><POS /></Layout>} />
          <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
          <Route path="/sales" element={<Layout><Sales /></Layout>} />
          <Route path="/customers" element={<Layout><Customers /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
