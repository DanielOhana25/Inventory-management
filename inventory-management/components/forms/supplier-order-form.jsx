"use client"

import React, {useState, useEffect} from "react";

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, set, useForm } from "react-hook-form"
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {useToast} from "app/hooks/use-toast"
import {Toaster} from "@/components/ui/toaster"

const formSchema = z.object({
  supplier : z.string().nonempty("Veuillez choisir un client"),
})

export default function SupplierOrderForm() {

    const [suppliers, setSuppliers] = useState([]);
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [supplierOrder, setSupplierOrder] = useState(null);
    
//Toast
const { toast } = useToast();

useEffect(() => {
    fetchSuppliers()
  }, [])

const fetchSuppliers = async () => {
  try{
    const response = await fetch('/api/suppliers');  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }    const data = await response.json();
    setSuppliers(data);
    
  }
  catch (error) {
    console.error("Erreur lors de la récupération des fournisseurs :", error);
  }}

const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier: "",
    },
  })


  function onSubmit(values) {

    console.log(values)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="supplier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fournisseur</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                    <SelectValue placeholder="Selectionnez un fournisseur" />
                </SelectTrigger>
              </FormControl>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.supplier_name}
                    </SelectItem>
                    ))}
                    </SelectContent>
                 </Select>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-customGreen"  >Submit</Button>
      </form>
    </Form>
  )
}