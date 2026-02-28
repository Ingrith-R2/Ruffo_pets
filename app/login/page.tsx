"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si ya está autenticado
    createClient().then(supabase => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          router.push("/clientes");
        } else {
          setLoading(false);
        }
      });
    });
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Credenciales incorrectas");
      return;
    }

    router.push("/clientes");
  };

  if (loading) {
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="p-6 w-96">
        <form onSubmit={handleLogin} className="space-y-4">
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" required />

          <Button type="submit" className="w-full">
            Iniciar sesión
          </Button>
        </form>
      </Card>
    </div>
  );
}
