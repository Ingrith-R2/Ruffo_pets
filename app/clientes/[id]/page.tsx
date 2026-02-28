import { PetsTable } from "@/components/pets/pets-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { Pencil, Plus } from "lucide-react";
import Link from "next/link";

interface Params {
  id: string;
}

export default async function ClienteDetalle(props: { params: Promise<Params> }) {
  const params = await props.params;
  const supabase = await createClient();

  // Traemos el cliente
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("*")
    .eq("id", params.id)
    .single();

  if (clientError || !client) {
    return (
      <div className="p-6">
        <p className="text-red-500">Error al cargar el cliente</p>
        <Link href="/clientes" className="text-blue-500 underline">
          Volver a clientes
        </Link>
      </div>
    );
  }

  // Traemos las mascotas del cliente
  const { data: pets, error: petsError } = await supabase
    .from("pets")
    .select("*")
    .eq("client_id", params.id)
    .order("name", { ascending: true });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/clientes">
            <Button variant="outline">Volver</Button>
          </Link>
          <h1 className="text-2xl font-bold">Detalles del Cliente</h1>
        </div>
        <Button asChild>
          <Link href={`/clientes/${params.id}/editar`}>
            <Pencil className="w-4 h-4 mr-2" />
            Editar
          </Link>
        </Button>
      </div>

      {/* Datos del cliente */}
      <Card>
        <CardHeader>
          <CardTitle>{client.full_name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Teléfono:</strong> {client.phone || "No registrado"}</p>
          <p><strong>Email:</strong> {client.email || "No registrado"}</p>
          <p><strong>Notas:</strong> {client.notes || "Sin notas"}</p>
          <p><strong>Fecha de registro:</strong> {client.created_at ? new Date(client.created_at).toLocaleDateString("es-ES") : "No disponible"}</p>
        </CardContent>
      </Card>

      {/* Lista de mascotas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mascotas ({pets?.length || 0})</CardTitle>
          <Button asChild>
            <Link href={`/clientes/${params.id}/nueva-mascota`}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Mascota
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {petsError && (
            <p className="text-red-500">Error al cargar las mascotas</p>
          )}
          
          {!petsError && pets && (
            <PetsTable pets={pets} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
