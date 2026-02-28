"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NuevoCliente() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const values = {
      full_name: formData.get("full_name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string || null,
      notes: formData.get("notes") as string || null,
    };

    if (!values.full_name || !values.phone) {
      setError("Nombre y teléfono son obligatorios");
      setLoading(false);
      return;
    }
    // Validar que el nombre solo contenga letras y espacios
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(values.full_name)) {
      setError("El nombre solo debe contener letras y espacios");
      setLoading(false);
      return;
    }

    // Validar que el teléfono solo contenga números
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(values.phone)) {
      setError("El teléfono solo debe contener números");
      setLoading(false);
      return;
    }

    const queryBuilder = await supabase.from("clients");
    const { error: supabaseError } = await queryBuilder.insert(values);

    if (supabaseError) {
      setError(supabaseError.message);
      setLoading(false);
      return;
    }

    router.push("/clientes");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="mb-4">
        <Button variant="outline" onClick={() => router.back()}>
          Volver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agregar Nuevo Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="full_name">Nombre completo *</Label>
              <Input
                id="full_name"
                name="full_name"
                placeholder="Nombre completo del cliente"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Número de teléfono"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Notas sobre el cliente"
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cliente"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
