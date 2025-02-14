"use client"; 

import "./globals.css";
import { BrowserRouter as Router, Routes, Route, Link , useLocation } from "react-router-dom";
import Stock from "./pages/stock";
import SupplierOrders from "./pages/supplier-orders";
import ClientOrders from "./pages/client-orders";

export default function RootLayout() {  

  return (
    <Router> 
      <AppContent /> 
    </Router>
  );
}

function AppContent() {
  const location = useLocation(); 

  return (
    <html lang="en">
      <body>
      {/* Header */}
            <header className="bg-customGreen text-white py-4 px-8 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img
                  src="/images/logo.jpg"
                  alt="Logo"
                  className="h-10 w-auto"
                />
              </div>

<nav className="hidden md:flex gap-6">
  <Link 
    to="/" 
    className={`p-2.5 rounded-lg ${location.pathname === "/" ? "bg-white text-customGreen" : "text-white hover:bg-white hover:text-customGreen"}`}>
    Stock
  </Link>

  <Link 
    to="/supplier-orders" 
    className={`p-2.5 rounded-lg ${location.pathname === "/supplier-orders" ? "bg-white text-customGreen" : "text-white hover:bg-white hover:text-customGreen"}`}>
    Commandes fournisseurs
  </Link>

  <Link 
    to="/client-orders" 
    className={`p-2.5 rounded-lg ${location.pathname === "/client-orders" ? "bg-white text-customGreen" : "text-white hover:bg-white hover:text-customGreen"}`}>
    Commandes Clients
  </Link>
</nav>

            </header>

        {/* Main Content */}
        <main className="flex-grow p-8">
          <Routes>
            <Route path="/" element={<Stock />} />
            <Route path="/supplier-orders" element={<SupplierOrders />} />
            <Route path="/client-orders" element={<ClientOrders />} />
          </Routes>
        </main>

        {/* Footer */}
      <footer className="bg-customGreen text-gray-300 py-4 px-8 text-center">
        <p>© 2025 Inventory Management. All rights reserved.</p>
      </footer>
      </body>
    </html>
  );
}

