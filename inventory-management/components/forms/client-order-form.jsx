"use client"

import React, {useState, useEffect} from "react";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {useToast} from "app/hooks/use-toast"

const formSchema = z.object({
  client: z.string().nonempty("Veuillez choisir un client"),
  products: z.array(
    z.object({
      id: z.string().nonempty("Veuillez choisir un produit"),
      quantity: z.number().min(1, "La quantité doit être au moins 1"),
    })
  ),
});

export default function ClientOrderForm() {

    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [clientOrder, setClientOrder] = useState(null);

//Toast
const { toast } = useToast();

useEffect(() => {
    fetchClients()
    fetchProducts()
  }, [])

const fetchClients = async () => {
  try{
    const response = await fetch('/api/client');  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }    const data = await response.json();
    setClients(data);
    
  }
  catch (error) {
    console.error("Erreur lors de la récupération des clients :", error);
  }}

const fetchProducts = async () => {
  try{
    const response = await fetch('/api/product');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }    const data = await response.json();
    setProducts(data);

  }
  catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
  }}

const CreateClientOrders = async (values) => {
  try{
    const { client, products } = values;
    // Vérifier si les champs obligatoires sont remplis
    if (!client || products.length === 0) {
    toast({
      title: "Erreur",
      description: "Veuillez sélectionner un client et au moins un produit.",
      variant: "destructive",
    });
    return;
}

 // Convertir les produits dans le format attendu
 const formattedProducts = products.map(({ id, quantity }) => ({
  product_id: id,
  quantity: quantity,
}));

  // Envoi des données à l'API
  const response = await fetch('/api/client-orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: client,
      products: formattedProducts,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors de la création de la commande.");
  }

  toast({
    title: "Commande créée",
    description: "Votre commande a été ajoutée avec succès.",
    variant: "success",
  });

  // Réinitialiser le formulaire après soumission
  form.reset({
    client: "",
    products: [],
  });

  }
  catch(error){
    console.log("Erreur lors de la creation de la commande",error)
    toast({
      title: "Erreur",
      description: "Impossible de créer la commande. Veuillez réessayer.",
      variant: "destructive",
    });
  }
}



const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: "",
      products: [],
    },
  })


// Gestion des champs dynamiques
const { fields, append, remove } = useFieldArray({
  control: form.control,
  name: "products",
});

 // Liste des produits disponibles après suppression des produits déjà choisis
 const selectedProductIds = form.watch("products").map((p) => p.id);
 const availableProducts = products.filter((p) => !selectedProductIds.includes(p.id));


  function onSubmit(values) {
    console.log(values);
    CreateClientOrders(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="client"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Selectionnez un client" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                            {client.first_name} {client.last_name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  </FormItem>
                )}
              />

{/* Sélection des produits */}


{fields.map((product, index) => (
  <div key={product.id} className="flex space-x-4 items-center">
    <FormField
      control={form.control}
      name={`products.${index}.id`}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un produit">
                {products.find((p) => p.id === field.value)?.name || "Sélectionnez un produit"}
              </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availableProducts.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
      </FormItem>
  )}
    />

{/* Quantité */}

    <FormField
      control={form.control}
      name={`products.${index}.quantity`}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              type="number"
              min="1"
              value={field.value}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    {/* Supprimer */}
    <Button type="button" variant="destructive" onClick={() => remove(index)}>
      X
    </Button>
  </div>
))}

<Button type="button" className="bg-customGreen" onClick={() => append({ id: "", quantity: 1 })}  
disabled={availableProducts.length === 0} // Désactiver si tous les produits sont sélectionnés
>
  + Ajouter un produit
</Button>

        <FormDescription>
          This is your public display name.
        </FormDescription>
        <FormMessage />
         
        <Button type="submit" className="bg-customGreen">Submit</Button>
      </form>
    </Form>
  )
}