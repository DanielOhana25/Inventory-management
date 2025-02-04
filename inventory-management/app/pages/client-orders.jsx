"use client"

import React from "react";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";

export default function ClientOrders() {


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
      <div className="flex flex-row justify-between mb-4">
           <SearchBar onSearch={handleSearch} placeholder={"Rechercher une commande client..."} />
           <Button className="bg-customGreen">Nouvelle commande</Button>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-200">
              <thead className="bg-customGreenSecondary">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date de creation</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nom & prenom</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Qte d'artcile</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Montant TTC</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut de paiement</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date de reception</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 bg-white">
                
                  <tr  className="hover:bg-gray-200 transition-all duration-300">
                    
                    <td className="px-6 py-4 whitespace-nowrap"></td>
                    <td className="px-6 py-4 whitespace-nowrap"></td>
                    <td className="px-6 py-4 whitespace-nowrap"></td>
                    <td className="px-6 py-4 whitespace-nowrap"></td>
                    <td className="px-6 py-4 whitespace-nowrap"></td>
                    <td className="px-6 py-4 whitespace-nowrap"></td>
                    <td className="px-6 py-4 whitespace-nowrap"></td>
                    <td className="px-6 py-4 whitespace-nowrap"></td>
                    <td className="px-6 py-4 whitespace-nowrap"></td>

                  </tr>
                
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}