import supabase from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Récupération des commandes avec les produits associés
    const { data: clientOrders, error: clientOrderError } = await supabase
      .from('supplier_orders')
      .select('*, supplier_order_products (quantity, product_id, product:product_id (price_ht, tva)), suppliers (supplier_name)');

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
    const { id, status, payment_status } = await req.json();
    console.log(id, status, payment_status);

    if (!id || status === undefined || payment_status === undefined) {
      return NextResponse.json({ message: "Données manquantes" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('supplier_orders')
      .update({ status, payment_status })
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
