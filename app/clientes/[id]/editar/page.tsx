"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Cliente {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  notes: string | null;
}

export default function EditarCliente(props: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [params, setParams] = useState<{ id: string } | null>(null);
  const [supabaseClient, setSupabaseClient] = useState<any>(null);

  // Inicializar cliente de Supabase
  useEffect(() => {
    createClient().then(setSupabaseClient);
  }, []);

  // Obtener los params de forma asíncrona
  useEffect(() => {
    props.params.then((resolvedParams) => {
      setParams(resolvedParams);
    });
  }, [props.params]);

  // Cargar datos del cliente cuando params esté disponible
  useEffect(() => {
    const clientId = params?.id;
    if (!clientId || !supabaseClient) return;

    async function fetchCliente() {
      const { data, error: fetchError } = await supabaseClient
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();

      if (fetchError) {
        setError("Error al cargar el cliente");
      } else {
        setCliente(data);
      }
      setLoading(false);
    }

    fetchCliente();
  }, [params?.id, supabaseClient]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const clientId = params?.id;
    if (!clientId || !supabaseClient) return;
    
    setSaving(true);
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
      setSaving(false);
      return;
    }

    // Validar que el teléfono solo contenga números
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(values.phone)) {
      setError("El teléfono solo debe contener números");
      setSaving(false);
      return;
    }

    const { error: supabaseError } = await supabaseClient
      .from("clients")
      .update(values)
      .eq("id", clientId);

    if (supabaseError) {
      setError(supabaseError.message);
      setSaving(false);
      return;
    }

    router.push(`/clientes/${clientId}`);
  };

  if (loading) {
    return (
      <div className="p-6">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="p-6">
        <p className="text-red-500">Cliente no encontrado</p>
        <Button variant="outline" onClick={() => router.back()}>
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="mb-4">
        <Button variant="outline" onClick={() => router.back()}>
          Volver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Editar Cliente</CardTitle>
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
                defaultValue={cliente.full_name}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Número de teléfono"
                defaultValue={cliente.phone}
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
                defaultValue={cliente.email || ""}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Notas sobre el cliente"
                rows={3}
                defaultValue={cliente.notes || ""}
              />
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
