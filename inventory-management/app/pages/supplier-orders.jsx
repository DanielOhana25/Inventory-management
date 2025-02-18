'use client';

import React, {useState, useEffect} from "react";
import  SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";  
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "app/hooks/use-toast";
import {Toaster} from "@/components/ui/toaster";
import SupplierOrderForm from "@/components/forms/supplier-order-form";

export default function SupplierOrders() {

    const [supplierOrders, setSupplierOrders] = useState([]);
    const [filteredSupplierOrders, setFilteredSupplierOrders] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    //Toast
    const { toast } = useToast();

    useEffect(() => {
        fetchSupplierOrders()
      }, [])
    
      const fetchSupplierOrders = async () => {
        try {
          const response = await fetch('/api/supplier-orders');  
              
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
    
          setSupplierOrders(data);
          setFilteredSupplierOrders(data);
        } catch (error) {
          console.error("❌ Erreur lors de la récupération des commandes clients :", error);}
    };

    const handleStatusChange = async(supplierOrderID, status, newStatus) => {
      console.log("hello");
      try {
        await fetch('/api/supplier-orders', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: supplierOrderID,
            status: status,
            payment_status: parseInt(newStatus),
          }),
        });
        toast({
          title: "Succès",
          description: "Statut de paiement mis à jour avec succès",
          variant: "success",
        });
        fetchSupplierOrders(); // Rafraîchir les données après mise à jour
      } catch (error) {
        console.error("❌ Erreur lors de la mise à jour du statut de paiement :", error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la mise à jour du statut de paiement.",
          variant: "destructive",
        });
      }
    };

    // Helper function to determine if a status should be disabled
const getAvailableStatuses = (currentStatus) => {
  const allowedTransitions = {
    0: ["0", "1"],
    1: ["1", "2"],
    2: ["2", "3"],
    3: ["3", "4"],
    4: ["4"], // Annulé, aucune modification possible
  };
  return allowedTransitions[currentStatus] || [];
};

    const handleSearch = (term) => {
      const lowercasedTerm = term.toLowerCase();
      const filtered = supplierOrders.filter((supplierOrder) => 
        supplierOrder.suppliers?.supplier_name?.toLowerCase().includes(lowercasedTerm) 
      );
      setFilteredSupplierOrders(filtered);
    };

  const statusLabels = {
    0: { text: "Non traité", color: "bg-gray-500 text-white" },
    1: { text: "Commandé", color: "bg-blue-500 text-white" },
    2: { text: "Expédié", color: "bg-orange-500 text-white" },
    3: { text: "Reçu", color: "bg-customGreen text-white" },
    4: { text: "Annulé", color: "bg-red-500 text-white" },
  };

  return (
    <div className="min-h-screen flex flex-col">
  
       <Toaster />
    <main className="flex-grow p-8">
    
      <div className="flex flex-row justify-between mb-4 itweems-center">
       <SearchBar onSearch={handleSearch} placeholder={"Rechercher..."} />
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-customGreen flex items-center justify-center text-white text-xl w-12 h-12 rounded-full ml-10 md:rounded-lg md:w-auto md:px-6 md:py-2s"
                    onClick={() => {
                      setIsDialogOpen(true);
                    }
                  }>
                      <span className="md:hidden">+</span>
                      <span className="hidden md:inline">Nouvelle commande</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                  <DialogHeader>
                      <DialogTitle>Nouvelle commande fournisseur</DialogTitle>
                  </DialogHeader>
                    <SupplierOrderForm  />
                  </DialogContent>
                </Dialog>    
       </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-200">
              <thead className="bg-customGreenSecondary">
                <tr>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Date de creation</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Nom & Prenom</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Qte d'articles</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Montant TTC</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Statut de paiement</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Statut</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Date de reception</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 bg-white">
                {filteredSupplierOrders.map((supplierOrder) => {
                                   const totalQuantity = supplierOrder.supplier_order_products.reduce((acc, item) => acc + item.quantity, 0);
                                   const totalPrice = supplierOrder.supplier_order_products.reduce((acc, item) => acc + (item.quantity * (item.product?.price_ht || 0)), 0);
                                   const { text, color } = statusLabels[supplierOrder?.status] || { text: "Pas de statut", color: "bg-gray-200 text-gray-800" };
                  return (
                
                  <tr key={supplierOrder.id} className="hover:bg-gray-200 transition-all duration-300">
                    
                    <td className="px-6 py-4 text-center whitespace-nowrap">{new Date(supplierOrder.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{supplierOrder.suppliers?.supplier_name || "Inconnu"}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{totalQuantity}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{totalPrice.toFixed(2)} €</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">              
                      <Select
                        value={supplierOrder.payment_status.toString()}
                        onValueChange={(value) => handleStatusChange(supplierOrder.id, supplierOrder.status, value)}
                      >
                      <SelectTrigger className={`px-3 py-2 rounded-md text-white ${supplierOrder.payment_status == 0 ? "bg-red-500" : "bg-customGreen"}`}>
                        <SelectValue>{supplierOrder.payment_status === 0 ? "À payer" : "Payée"} </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                        <SelectItem value="0">À payer</SelectItem>
                        <SelectItem value="1">Payée</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      </td>                    
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                    <Select
                      value={supplierOrder.status.toString()}
                      onValueChange={(value) => handleStatusChange(supplierOrder.id, value, supplierOrder.payment_status)}
                    >
                      <SelectTrigger className={`px-3 py-2 rounded-md text-white ${color}`}>
                        <SelectValue>{text}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {getAvailableStatuses(supplierOrder.status).map((status) => (
                            <SelectItem key={status} value={status}>{statusLabels[status].text}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>                    </td>        
                    <td className="px-6 py-4 text-center whitespace-nowrap">{new Date(supplierOrder?.reception_date).toLocaleDateString() || "Inconnu"}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <Button className="bg-customGreen">Voir</Button>
                    </td>
                  </tr>
                )}
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
