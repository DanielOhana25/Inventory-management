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