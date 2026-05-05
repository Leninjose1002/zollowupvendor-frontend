import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VendorPortal from "./pages/vendorPortal";
import AdminPanel from './pages/AdminPanel';
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<VendorPortal />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;