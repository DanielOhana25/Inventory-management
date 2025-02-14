'use client';

import React, {useState, useEffect} from "react";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";

export default function ClientOrders() {

  const [clientOrders, setClientOrders] = useState([]);
  const [filteredClientOrders, setFilteredClientOrders] = useState([]);
  

  useEffect(() => {
    fetchClientOrders()
  }, [])

  const fetchClientOrders = async () => {
    try {
      const response = await fetch('/api/client-orders');  
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setClientOrders(data);
      setFilteredClientOrders(data);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des commandes clients :", error);
    }
};

const handleSearch = (term) => {
  const lowercasedTerm = term.toLowerCase();
  const filtered = clientOrders.filter((clientOrder) => 
    clientOrder.client?.first_name?.toLowerCase().includes(lowercasedTerm) ||
    clientOrder.client?.last_name?.toLowerCase().includes(lowercasedTerm)
  );
  setFilteredClientOrders(filtered);
};


  const statusLabels = {
    0: { text: "Non traité", color: "bg-gray-500 text-white" },
    1: { text: "Prete a la livraison", color: "bg-blue-500 text-white" },
    2: { text: "Expédié", color: "bg-orange-500 text-white" },
    3: { text: "Reçu", color: "bg-customGreen text-white" },
    4: { text: "Annulé", color: "bg-red-500 text-white" },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow p-8">
      <div className="flex flex-row justify-between mb-4 items-center">
           <SearchBar onSearch={handleSearch} placeholder={"Rechercher..."} />
           <Button className="bg-customGreen flex items-center justify-center text-white text-xl w-12 h-12 rounded-full ml-10 md:rounded-lg md:w-auto md:px-6 md:py-2s">
            <span className="md:hidden">+</span>
            <span className="hidden md:inline">Nouvelle commande</span>
          </Button>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-200">
              <thead className="bg-customGreenSecondary">
                <tr>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Date de creation</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Nom & Prenom</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Qte d'artciles</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Montant TTC</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Statut de paiement</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Statut</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Date de reception</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 bg-white">
              {filteredClientOrders.map((clientOrder) => {
                 const totalQuantity = clientOrder.client_order_products.reduce((acc, item) => acc + item.quantity, 0);
                 const totalPrice = clientOrder.client_order_products.reduce((acc, item) => acc + (item.quantity * (item.product?.price_ht || 0)), 0);
                 const { text, color } = statusLabels[clientOrder?.status] || { text: "Pas de statut", color: "bg-gray-200 text-gray-800" };

              return(
                  <tr key={clientOrder.id}  className="hover:bg-gray-200 transition-all duration-300">
                    
                    <td className="px-6 py-4 text-center whitespace-nowrap">{new Date(clientOrder.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{clientOrder.client?.last_name} {clientOrder.client?.first_name}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{totalQuantity}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{totalPrice.toFixed(2)} €</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">              
                    <span className={`inline-flex rounded-xl p-2.5 text-xs font-semibold leading-5 
                          ${clientOrder.payment_status == 0 ? "bg-red-500 text-white" : "bg-customGreen text-white"}`}>
                          {clientOrder.payment_status == 0 ? "À payer" : "Payée"}
                    </span>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                     <span className={`inline-flex rounded-xl p-2.5 text-xs font-semibold leading-5 ${color}`}>{text}</span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{clientOrder.confirmed_reception_date ? new Date(clientOrder.confirmed_reception_date).toLocaleDateString() : "N/A"}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <Button className="bg-customGreen">Voir</Button>
                    </td>
                  </tr>
              );
        })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}