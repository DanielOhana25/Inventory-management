"use client"; 

import "./globals.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
import Stock from "./pages/stock";
import SupplierOrders from "./pages/supplier-orders";
import ClientOrders from "./pages/client-orders";

export default function RootLayout({ children }) {
;

  return (
    <html lang="en">
      <body>
      <Router>
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
              <Link to="/" className="hover:underline">Stock</Link>
              <Link to="/supplier-orders" className="hover:underline">Commandes fournisseurs</Link>
              <Link to="/client-orders" className="hover:underline">Commandes Clients</Link>
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
      </Router>
      </body>
    </html>
  );
}

