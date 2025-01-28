"use client"

import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";

export default function Home() {

  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  fetchProducts()
}, [])

const fetchProducts = async () => {
  try{
    const response = await fetch('/api/product');  // fetch() -> by default : GET
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }    const data = await response.json();
    setProducts(data);
    
  }
  catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
  }}

  const handleEditInventory = async(data) => {
    setIsLoading(true);
    try {
      await fetch('/api/product', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      await fetchProducts();
      setQuantityToEdit(undefined)
    }
    catch(error) {
      console.error("Erreur lors de la mise à jour de l'inventaire :", error);
    }
    finally {
      setIsLoading(false);
    }
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
const handleSearch = (term) => {
  setSearchTerm(term);
  console.log("Recherche en cours :", term);}

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-teal-500 text-white py-4 px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img
            src="/images/logo.jpg"
            alt="Logo"
            className="h-10 w-auto"
          />
        </div>
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
        <div className="relative">
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={toggleDropdown} >
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
          placeholder={"Rechercher un produit dans le stock..."}
        />
      </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-200">
              <thead className="bg-customGreenSecondary">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nom</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fourninsseur</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Quantite disponible</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Quantite</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>

                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 bg-white">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-200 transition-all duration-300">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 rounded-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    {product.suppliers ? product.suppliers.supplier_name : 'Inconnu'}                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${product.available_quantity <= 5 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>{product.available_quantity}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.quantity}
                    </td>
                    <td className=" bg-blue-600 text-white text-xs font-medium rounded-lg px-6 py-4 whitespace-nowrap hover:bg-blue-700 transition-all duration-300 disabled:opacity-50" disabled={isLoading} onClick={() => alert("bonjour")}>
                      <button>Editer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-teal-500 text-gray-300 py-4 px-8 text-center">
        <p>© 2025 Inventory Management. All rights reserved.</p>
      </footer>
    </div>
  );
}
