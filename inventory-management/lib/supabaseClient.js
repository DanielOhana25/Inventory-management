// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Charger l'URL et la clé de Supabase depuis les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Les variables d'environnement Supabase ne sont pas définies !");
}

// Créer le client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;