import supabase from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Récupérer les produits et l'inventaire en un seul appel en utilisant une jointure
    const { data: products, error: productError } = await supabase
      .from('product')
      .select('*, suppliers: supplier_id (supplier_name), inventory_products (available_quantity, quantity)');

    if (productError) {
      console.error('Erreur lors de la récupération des produits :', productError);
      return NextResponse.json(
        { message: 'Erreur lors de la récupération des produits' },
        { status: 500 }
      );
    }

    const combinedData = products.map((product) => {
      const inventoryData = product.inventory_products[0] || {}; 

      return {
        ...product,
        available_quantity: inventoryData.available_quantity || 0, 
        quantity: inventoryData.quantity || 0, 
      };
    });

    return NextResponse.json(combinedData);
  } catch (error) {
    console.error('Erreur dans le traitement de la récupération des produits et de l\'inventaire :', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}





export async function PATCH(req) {
    try {
      // Récupérer les données envoyées dans le body de la requête
      const { id, available_quantity, quantity } = await req.json();
     console.log(id, available_quantity, quantity); 
  
      // Vérifier si les donnes sont bien fourni
      if (!id || available_quantity === undefined || quantity === undefined) {
        return NextResponse.json({ message: "Données manquantes" }, { status: 400 });
      }
      // Mettre à jour le produit dans la base de données Supabase
      const { data, error } = await supabase
        .from('inventory_products')
        .update({
          available_quantity,
          quantity,
        })
        .eq('product_id', id); 
  
      if (error) {
        console.error('Erreur lors de la mise à jour de l inventaire:', error);
        return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
      }
  
      // Retourner le produit mis à jour avec un statut 200
      return NextResponse.json(data, { status: 200 });
     } catch (error) {
      console.error('Erreur interne du serveur:', error);
      return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
  }
