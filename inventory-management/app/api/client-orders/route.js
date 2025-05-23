import supabase from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Récupération des commandes avec les produits associés
    const { data: clientOrders, error: clientOrderError } = await supabase
      .from('client_orders')
      .select('*, client_order_products (quantity, product_id, product:product_id (price_ht, tva)), client (first_name, last_name)');
      

    if (clientOrderError) {
      console.error('Erreur lors de la récupération des commandes :', clientOrderError);
      return NextResponse.json({ message: 'Erreur lors de la récupération des commandes' }, { status: 500 });
    }

    return NextResponse.json(clientOrders, { status: 200 });

  } catch (error) {
    console.error('Erreur interne du serveur:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}


export async function PATCH(req) {
    try {
      const { id, status, payment_status, reception_date } = await req.json();
      console.log(id, status, payment_status, reception_date);
  
      if (!id || status === undefined || payment_status === undefined) {
        return NextResponse.json({ message: "Données manquantes" }, { status: 400 });
      }
  
      const { data, error } = await supabase
        .from('client_orders')
        .update({ status, payment_status, reception_date })
        .eq('id', id);
  
      if (error) {
        console.error("Erreur lors de la mise à jour de la commande:", error);
        return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
      }
  
      return NextResponse.json(data, { status: 200 });
  
    } catch (error) {
      console.error("Erreur serveur:", error);
      return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
  }

  export async function POST(req) {
    try {
      const { client_id, products } = await req.json();
      console.log("Données reçues :", client_id, products);

      if (!client_id || !products || products.length === 0) {
        return NextResponse.json({ message: "Données manquantes" }, { status: 400 });
      }

       // Obtenir la date actuelle
      const createdAt = new Date().toISOString();
  
      // Création de la commande
      const { data: order, error: orderError } = await supabase
        .from('client_orders')
        .insert([{ client_id, status: "0", payment_status: "0", created_at : createdAt }])
        .select()
        .single();
  
      if (orderError) {
        console.error("Erreur lors de la création de la commande:", orderError);
        return NextResponse.json({ message: `Erreur interne: ${orderError.message}` }, { status: 500 });
      }
  
      // Associer les produits à la commande
      const orderProducts = products.map(({ product_id, quantity }) => ({
        client_order_id: order.id,
        product_id,
        quantity
      }));
  
      const { error: productsError } = await supabase
        .from('client_order_products')
        .insert(orderProducts);
  
      if (productsError) {
        console.error("Erreur lors de l'ajout des produits:", productsError);
        return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
      }
  
      return NextResponse.json({ message: "Your order has been successfully added." }, { status: 201 });
  
    } catch (error) {
      console.error("Erreur serveur:", error);
      return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
  }
  
