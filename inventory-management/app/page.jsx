"use client"

import React, { useState } from "react";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

const handleSearch = (term) => {
  setSearchTerm(term);
  console.log("Recherche en cours :", term);}

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 text-white py-4 px-8">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <nav className="mt-2">
          <ul className="flex gap-4">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/products" className="hover:underline">
                Products
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                About
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-grow p-8">
      <div className="mb-4">
        <SearchBar
          search={searchTerm} 
          setSearch={handleSearch} 
        />
      </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-4 px-8 text-center">
        <p>© 2025 Inventory Management. All rights reserved.</p>
      </footer>
    </div>
  );
}
