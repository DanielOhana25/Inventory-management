'use client';

import React, {useState, useEffect} from "react";
import SearchBar from "@/components/SearchBar";
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
import ClientOrderForm from "@/components/forms/client-order-form";

export default function ClientOrders() {

  const [clientOrders, setClientOrders] = useState([]);
  const [filteredClientOrders, setFilteredClientOrders] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  //Toast
  const { toast } = useToast();
  
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
      console.error("❌ Error fetching client orders :", error);
    }
};

const handleStatusChange = async(clientOrderID, status, paymentStatus, reception_date) => {
  try {
     const order = clientOrders.find((order) => order.id === clientOrderID);
 
     // Vérifier si la transition est de "Non traité" (0) à "Prêt à la livraison" (1)
     if (order.status === 0 && status === "1") {
       const response = await fetch('/api/product');
       const productsData = await response.json();
 
       // Vérifier si le stock est suffisant pour chaque produit de la commande
       const insufficientInventory = order.client_order_products.some((item) => {
         const productStock = productsData.find((p) => p.id === item.product_id);
         return productStock && productStock.available_quantity < item.quantity; // Si le stock disponible est inférieur à la quantité commandée, la condition est vraie.
       });
 
       if (insufficientInventory) {
         toast({
           title: "Insufficient inventory",
           description: "Cannot update: some products are out of inventory.",
           variant: "destructive",
         });
         return;
       }

  // ✅ ICI : Met à jour le stock
  for (const item of order.client_order_products) {
    const product = productsData.find((p) => p.id === item.product_id);
    const newStock = product.available_quantity - item.quantity;

    await fetch('/api/product', {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: product.id, available_quantity: newStock, quantity: product.quantity }),
    });    
  }       

     }

     
// Vérifier si la transition est de "Prêt à la livraison" (1) à "Expedié" (2)
if(order.status === 1 && status === "2" ) {
  const response = await fetch('/api/product');
  const productsData = await response.json();

// ✅ ICI : Met à jour le stock
for (const item of order.client_order_products) {
  const product = productsData.find((p) => p.id === item.product_id);
  const newStock = product.quantity - item.quantity;

  await fetch('/api/product', {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: product.id, available_quantity: product.available_quantity , quantity: newStock }),
  });    
}  
}

// Vérifier si la transition est de "Expedié" (2) à "Recu" (3)
     if(order.status === 2 && status === "3" ) {
      reception_date = new Date().toISOString();
     }
 
     // Mettre à jour si toutes les vérifications sont passées
    await fetch('/api/client-orders', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: clientOrderID,
        status: status,
        payment_status: parseInt(paymentStatus),
        reception_date: reception_date,
      }),
    });
    toast({
      title: "Success",
      description: "Payment status successfully updated",
      variant: "success",
    });
    
    fetchClientOrders(); // Rafraîchir les données après mise à jour
  }
  catch(error) {
    console.error("❌ Error updating payment status: ", error);
    toast({
      title: "Error",
      description: "Error updating payment status.",
      variant: "destructive",
    });
  }
}


// Helper function to determine if a status should be disabled
const getAvailableStatuses = (currentStatus) => {
  const allowedTransitions = {
    0: ["0", "1", "4"],
    1: ["1", "2", "4"],
    2: ["2", "3", "4"],
    3: ["3", "4"],
    4: ["4"], // Annulé, aucune modification possible
  };
  return allowedTransitions[currentStatus] || [];
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
    0: { text: "Untreated", color: "bg-gray-500 text-white" },
    1: { text: "Ready to ship", color: "bg-blue-500 text-white" },
    2: { text: "Shipped", color: "bg-orange-500 text-white" },
    3: { text: "Received", color: "bg-customGreen text-white" },
    4: { text: "Cancelled", color: "bg-red-500 text-white" },
  };

  return (
    <div className="min-h-screen flex flex-col">

      <Toaster />
      <main className="flex-grow p-8">
      <div className="flex flex-row justify-between mb-4 items-center">
           <SearchBar onSearch={handleSearch} placeholder={"Search..."} />

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-customGreen flex items-center justify-center text-white text-xl w-12 h-12 rounded-full ml-10 md:rounded-lg md:w-auto md:px-6 md:py-2s"
              onClick={() => {
                setIsDialogOpen(true);
              }
            }>
                <span className="md:hidden">+</span>
                <span className="hidden md:inline">New order</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>New client order</DialogTitle>
            </DialogHeader>
              <ClientOrderForm onClose={() => setIsDialogOpen(false)}  />
            </DialogContent>
          </Dialog>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-200">
              <thead className="bg-customGreenSecondary">
                <tr>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Creation Date</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Quantity of articles</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Total Amount</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Payment Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Reception Date</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 bg-white">
              {filteredClientOrders.map((clientOrder) => {
                 const totalQuantity = clientOrder.client_order_products.reduce((acc, item) => acc + item.quantity, 0);
                 const totalPrice = clientOrder.client_order_products.reduce((acc, item) => acc + (item.quantity * (item.product?.price_ht || 0)), 0);
                 const { text, color } = statusLabels[clientOrder?.status] || { text: "no status", color: "bg-gray-200 text-gray-800" };

              return(
                  <tr key={clientOrder.id}  className="hover:bg-gray-200 transition-all duration-300">
                    
                    <td className="px-6 py-4 text-center whitespace-nowrap">{new Date(clientOrder.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{clientOrder.client?.last_name} {clientOrder.client?.first_name}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{totalQuantity}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{totalPrice.toFixed(2)} €</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">  
                    <Select
                      value={clientOrder.payment_status.toString()}
                      onValueChange={(value) => handleStatusChange(clientOrder.id, clientOrder.status, value, clientOrder.reception_date)}
                    >
                      <SelectTrigger className={`px-3 py-2 rounded-md text-white ${clientOrder.payment_status == 0 ? "bg-red-500" : "bg-customGreen"}`}>
                        <SelectValue>{clientOrder.payment_status === 0 ? "To pay" : "Paid"} </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                        <SelectItem value="0">To pay</SelectItem>
                        <SelectItem value="1">Paid</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">

                      <Select
                      value={clientOrder.status.toString()}
                      onValueChange={(value) => handleStatusChange(clientOrder.id, value, clientOrder.payment_status)}
                    >
                      <SelectTrigger className={`px-3 py-2 rounded-md text-white ${color}`}>
                        <SelectValue>{text}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                      <SelectGroup>
                        {getAvailableStatuses(clientOrder.status).map((status) => (
                          <SelectItem key={status} value={status}>{statusLabels[status].text}</SelectItem>
                        ))}
                      </SelectGroup>
                      </SelectContent>
                    </Select>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{clientOrder.reception_date ? new Date(clientOrder.reception_date).toLocaleDateString() : "-"}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <Button className="bg-customGreen">View</Button>
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
