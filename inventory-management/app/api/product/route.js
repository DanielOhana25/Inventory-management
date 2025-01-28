import supabase from '../../../lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Récupération des données de la table `product`
    const { data: products, error: productError } = await supabase
      .from('product')
      .select('*, suppliers: supplier_id (supplier_name)');

    if (productError) {
      console.error('Erreur lors de la récupération des produits :', productError);
      return NextResponse.json(
        { message: 'Erreur lors de la récupération des produits' },
        { status: 500 }
      );
    }

    // Récupérer les produits de linventaire depuis Supabase
    const { data: inventory, error: inventoryError } = await supabase
      .from('inventory_products')
      .select('*'); // On récupère toutes les colonnes des produits

      if (inventoryError) {
        console.error('Erreur lors de la récupération de l inventaire:', inventoryError);
        return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
      }

 // Combinaison des données : join sur `id` (produit)
 const combinedData = products.map((product) => {
  const inventoryData = inventory.find(
    (inv) => inv.product_id === product.id
  );

  return {
    ...product,
    available_quantity: inventoryData?.available_quantity || 0, // Par défaut à 0 si pas d'inventaire
    quantity: inventoryData?.quantity || 0, // Par défaut à 0 si pas d'inventaire
  };
});




      return NextResponse.json(combinedData, { status: 200 });
    }  catch (error) {
        console.error('Erreur interne du serveur:', error);
        return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
      }
}





export async function PATCH(req) {
    try {
      // Récupérer les données envoyées dans le body de la requête
      const { id, available_quantity, quantity } = await req.json();
  
      // Vérifier si l'ID est bien fourni
    if (!id) {
        return new Response('ID du produit manquant', { status: 400 });
      }
      // Mettre à jour le produit dans la base de données Supabase
      const { data, error } = await supabase
        .from('inventory_products')
        .update({
          available_quantity,
          quantity,
        })
        .eq('id', id); 
  
      if (error) {
        console.error('Erreur lors de la mise à jour de l inventaire:', error);
        return new Response('Erreur lors de la mise à jour de l inventaire', { status: 500 });
      }
  
      // Retourner le produit mis à jour avec un statut 200
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Erreur interne du serveur:', error);
      return new Response('Erreur interne du serveur', { status: 500 });
    }
  }
