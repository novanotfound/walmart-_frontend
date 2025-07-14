import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import WalmartRecycling from "./components/landing_page.jsx";
import KioskQRAuth from "./components/KioskQRAuth.jsx";
import KioskScan from "./components/kiosk_scan.jsx";
import SummaryPage from "./components/summary_page.jsx";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<WalmartRecycling />} />
          <Route path="/kiosk-auth" element={<KioskQRAuth />} />
          <Route path="/scan" element={<KioskScan />} />
          <Route path="/summary" element={<SummaryPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
