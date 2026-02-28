import { SupabaseProvider } from "@/components/supabase-provider";

export default async function ClientesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SupabaseProvider>
      {children}
    </SupabaseProvider>
  );
}
