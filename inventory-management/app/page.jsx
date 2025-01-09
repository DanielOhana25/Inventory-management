"use client"

import React, { useState } from "react";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // לשנות את מצב הפתיחה והסגירה
  };
const handleSearch = (term) => {
  setSearchTerm(term);
  console.log("Recherche en cours :", term);}

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-teal-500 text-white py-4 px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* לוגו */}
          <img
            src="/images/logo.jpg"
            alt="Logo"
            className="h-10 w-auto"
          />
        </div>
        {/* תפריט ניווט */}
        <nav className="hidden md:flex gap-6">
          <a href="/" className="hover:underline">
            Dashboard
          </a>
          <a href="/products" className="hover:underline">
            Produits
          </a>
          <a href="/stock" className="hover:underline">
            Stock
          </a>
          <a href="/supplier-orders" className="hover:underline">
            Commandes fournisseurs
          </a>
          <a href="/client-orders" className="hover:underline">
            Commande Clients
          </a>
        </nav>
        {/* כפתור Mamane Ethan עם רקע צהוב כתום ותפריט פתיחה/סגירה */}
        <div className="relative">
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={toggleDropdown} // שימו לב שהכפתור מפעיל את הפונקציה
          >
            Mamane Ethan
            <svg
              className={`w-4 h-4 transform ${isDropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          {/* תפריט שיתפוס מצב פתיחה או סגירה */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg w-48">
              <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                Profile
              </a>
              <a href="/settings" className="block px-4 py-2 hover:bg-gray-100">
                Settings
              </a>
              <a href="/logout" className="block px-4 py-2 hover:bg-gray-100">
                Logout
              </a>
            </div>
          )}
        </div>
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
