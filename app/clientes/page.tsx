import { SearchClients } from "@/components/clients/search-clients";
import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

interface SearchParams {
  search?: string;
}

export default async function ClientesPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();
  const searchParams = await props.searchParams;
  const searchTerm = searchParams.search || "";

  // Construir query base
  let query = supabase
    .from("clients")
    .select("*")
    .order("full_name", { ascending: true });

  // Aplicar filtro de búsqueda si existe
  if (searchTerm) {
    query = query.or(`full_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
  }

  const { data: clients, error } = await query;

  // Obtener conteo de mascotas por cliente
  const { data: petsCount } = await supabase
    .from("pets")
    .select("client_id");

  // Crear mapa de conteo de mascotas
  const petsCountMap = petsCount?.reduce((acc, pet) => {
    acc[pet.client_id] = (acc[pet.client_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  if (error) {
    return <p>Error al cargar clientes</p>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <LogoutButton />
      </div>

      <div className="mb-4 flex gap-2">
        <SearchClients />
        <Button asChild>
          <Link href="/clientes/nuevo">Nuevo Cliente</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Mascotas</TableHead>
            <TableHead>Fecha de Registro</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients?.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <Link href={`/clientes/${client.id}`}>
                  {client.full_name}
                </Link>
              </TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{petsCountMap[client.id] || 0}</TableCell>
              <TableCell>{client.created_at ? new Date(client.created_at).toLocaleDateString("es-ES") : "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
