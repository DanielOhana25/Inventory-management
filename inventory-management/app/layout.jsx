"use client"; 

import React, {useState} from "react";
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

  const [menuOpen, setMenuOpen] = useState(false); // Gère l'état du menu mobile
  const location = useLocation(); 

  return (
    <html lang="en">
      <body>
      {/* Header */}
            <header className="bg-customGreen text-white py-4 px-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img
                  src="/images/logo.jpg"
                  alt="Logo"
                  className="h-10 w-auto"
                />
              </div>

      {/* Menu Burger (Mobile) */}
      <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

       {/* Navigation Desktop */}
       <nav className="hidden md:flex gap-6">
            <NavLink to="/" text="Stock" location={location} />
            <NavLink to="/supplier-orders" text="Commandes fournisseurs" location={location} />
            <NavLink to="/client-orders" text="Commandes Clients" location={location} />
          </nav>
            </header>

            {menuOpen && (
          <nav className="md:hidden bg-customGreen text-white flex flex-col gap-4 p-4">
            <NavLink to="/" text="Stock" location={location} />
            <NavLink to="/supplier-orders" text="Commandes fournisseurs" location={location} />
            <NavLink to="/client-orders" text="Commandes Clients" location={location} />
          </nav>
        )}

        {/* Main Content */}
        <main className="flex-grow container mx-auto p-6">
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

function NavLink({ to, text, location }) {
  return (
    <Link
      to={to}
      className={`p-2.5 rounded-lg ${
        location.pathname === to ? "bg-white text-customGreen" : "text-white hover:bg-white hover:text-customGreen"
      }`}
    >
      {text}
    </Link>
  );
}

