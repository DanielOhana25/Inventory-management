"use client"

import React, { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button"; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "app/hooks/use-toast";
import {Toaster} from "@/components/ui/toaster";

export default function Stock() {

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

    if (!selectedProduct) return;

    // Vérification avant l'enregistrement que la qte dispo ne soit pas superieur à la qte totale
    if (selectedProduct.quantity < selectedProduct.available_quantity) {
      toast({
        title: "Erreur",
        description: "La quantité totale ne peut pas être inférieure à la quantité disponible.",
        variant: "destructive",
      });
      return;  // Empêche l'exécution de la mise à jour
    }

   // Vérification que les quantités ne soient pas négatives
    if (selectedProduct.quantity < 0 || selectedProduct.available_quantity < 0) {
      toast({
        title: "Erreur",
        description: "Les quantités ne peuvent pas être négatives.",
        variant: "destructive",
      });
      return; // Empêche l'exécution de la mise à jour
    }

    setIsLoading(true);
    try {
      await fetch('/api/product', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedProduct.id,
          available_quantity: selectedProduct.available_quantity,
          quantity: selectedProduct.quantity,
        }),
      })
      await fetchProducts();
      setSelectedProduct(null);
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
      <Toaster />

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
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">image</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Nom</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Fourninsseur</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Quantite disponible</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Quantite</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Action</th>

                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 bg-white">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-200 transition-all duration-300">
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 rounded-full"
                      />
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                    {product.suppliers ? product.suppliers.supplier_name : 'Inconnu'}                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className={`inline-flex rounded-full p-2.5 leading-5 ${product.available_quantity <= 5 ? "bg-red-500 text-white" : "bg-customGreen text-white"}`}>{product.available_quantity}</span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setSelectedProduct(product)}
                          variant="default" 
                          className="bg-customGreen"
                        >
                          Editer
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Modifier les quantités</DialogTitle>
                          </DialogHeader>
                          <div className="flex flex-col gap-4">
                            <Label className="text-sm font-semibold">Quantité disponible</Label>
                            <Input
                              type="number"
                              value={selectedProduct?.available_quantity || ""}
                              onChange={(e) => setSelectedProduct({ ...selectedProduct, available_quantity:  Number(e.target.value) })}
                            />
                            <Label className="text-sm font-semibold">Quantité générale</Label>
                            <Input
                              type="number"
                              value={selectedProduct?.quantity || ""}
                              onChange={(e) => {setSelectedProduct({ ...selectedProduct, quantity: Number(e.target.value) });}}                            />
                            <Button onClick={handleEditInventory} disabled={isLoading} className="bg-customGreen">
                              {isLoading ? "Mise à jour..." : "Enregistrer"}
                            </Button>
                          </div>
                        </DialogContent>
                    </Dialog>
                    
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
