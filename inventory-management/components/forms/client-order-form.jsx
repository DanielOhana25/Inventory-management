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
  client: z.string().nonempty("Veuillez choisir un client"),
})

export default function ClientOrderForm() {

    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [clientOrder, setClientOrder] = useState(null);
    
//Toast
const { toast } = useToast();

useEffect(() => {
    fetchClients()
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

const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
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