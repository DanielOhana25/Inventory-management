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
import { Select } from "@/components/ui/select"
import {useToast} from "app/hooks/use-toast"
import {Toaster} from "@/components/ui/toaster"

const formSchema = z.object({
  username: z.string().nonempty("Veuillez choisir un client"),
})

export default function SupplierOrderForm() {

    const [suppliers, setSuppliers] = useState([]);
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [supplierOrder, setSupplierOrder] = useState(null);
    
//Toast
const { toast } = useToast();


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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
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