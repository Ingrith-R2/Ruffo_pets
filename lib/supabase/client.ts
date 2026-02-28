import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

// Variable para almacenar el cliente con sesión
let supabaseClient: SupabaseClient<any, "public"> | null = null;

// Función para obtener el cliente con sesión
async function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  let authHeader: Record<string, string> = {};
  
  try {
    const response = await fetch("/api/auth/session", { 
      credentials: "include",
      cache: "no-store" 
    });
    const data = await response.json();
    if (data.session?.access_token) {
      authHeader = { Authorization: `Bearer ${data.session.access_token}` };
    }
  } catch (e) {
    console.error("Error fetching session:", e);
  }

  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: authHeader,
      },
      cookies: {
        getAll() {
          return [];
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            document.cookie = `${name}=${value}; path=${options?.path || "/"}${options?.secure ? "; secure" : ""}${options?.sameSite ? `; samesite=${options.sameSite}` : ""}`;
          });
        },
      },
    }
  );
  
  return supabaseClient;
}

// Export proxy que permite inicializar el cliente de forma lazy
export const supabase = {
  async from(table: string) {
    const client = await getSupabaseClient();
    return client.from(table);
  },
  
  auth: {
    getSession: async () => {
      const client = await getSupabaseClient();
      return client.auth.getSession();
    },
    getUser: async () => {
      const client = await getSupabaseClient();
      return client.auth.getUser();
    },
    signOut: async () => {
      const client = await getSupabaseClient();
      return client.auth.signOut();
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Retorna un objeto de suscripción
      return getSupabaseClient().then(client => {
        return client.auth.onAuthStateChange(callback);
      });
    }
  }
};

// Función para obtener cliente con sesión (para compatibilidad)
export async function createClient() {
  return getSupabaseClient();
}
