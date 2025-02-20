import supabase from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(req) {

    try { 
        const {data: clients, error: clientError} = await supabase
        .from('client')
        .select('id, first_name, last_name, email, tel');

        if (clientError) {
            console.error('Erreur lors de la récupération des clients :', clientError);
            return NextResponse.json(
                {message: 'Erreur lors de la récupération des clients'},
                {status: 500}
            );
        }

        return NextResponse.json(clients, {status: 200});
    }

    catch (error) {
        console.error('Erreur interne du serveur :', error);
        return NextResponse.json({message: 'Erreur interne du serveur'}, {status: 500});
    }
}

