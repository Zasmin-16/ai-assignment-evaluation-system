import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export const login = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const getProfile = async (userId) => {
  return await supabase.from("profiles").select("*").eq("id", userId).single();
};
