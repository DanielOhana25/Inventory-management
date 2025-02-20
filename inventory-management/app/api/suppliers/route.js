import supabase from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(req) {

    try { 
        const {data: suppliers, error: supplierError} = await supabase
        .from('suppliers')
        .select('id, supplier_name, supplier_email, supplier_phone');

        if (supplierError) {
            console.error('Erreur lors de la récupération des fournisseurs :', clientError);
            return NextResponse.json(
                {message: 'Erreur lors de la récupération des fournisseurs'},
                {status: 500}
            );
        }

        return NextResponse.json(suppliers, {status: 200});
    }

    catch (error) {
        console.error('Erreur interne du serveur :', error);
        return NextResponse.json({message: 'Erreur interne du serveur'}, {status: 500});
    }
}

