import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ModelViewerPage from './pages/ModelViewerPage';

const App: React.FC = () => {
  // In development, avoid basename to match URL "/"
  // In production, extract path part from PUBLIC_URL (e.g., https://host/model -> /model)
  let basename: string | undefined;
  if (process.env.NODE_ENV === 'production') {
    basename = (process.env.PUBLIC_URL || '').replace(/^https?:\/\/[^/]+/, '') || undefined;
  } else {
    // Dev: if current URL starts with /model, honor it to avoid no-match warning
    if (typeof window !== 'undefined' && window.location && window.location.pathname.startsWith('/model')) {
      basename = '/model';
    } else {
      basename = undefined;
    }
  }
  return (
    <Router basename={basename}>
      <ScrollToTop />
      <div className="min-h-screen text-light">
        <div className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/viewer" element={<ModelViewerPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;