"use client"

import React, { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button"; 


export default function Stock() {

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

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
    setFilteredProducts(data);
    
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

 
  const handleSearch = (term) => {
    const lowercasedTerm = term.toLowerCase();
    const filtered = products.filter((product) => 
      product.name.toLowerCase().includes(lowercasedTerm) || 
      (product.suppliers && product.suppliers.supplier_name.toLowerCase().includes(lowercasedTerm))
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col">
      

      {/* Main */}
      <main className="flex-grow p-8">
      <div className="mb-4">
                  <SearchBar onSearch={handleSearch} placeholder={"Rechercher un produit dans le stock..."} />
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
                {filteredProducts.map((product) => (
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
                    <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      onClick={() => alert("bonjour")}
                      variant="default" 
                      className="bg-customGreen"
                    >
                      Editer
                    </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      
    </div>
  );
}
