"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Params {
  id: string;
}

export default function NuevaMascota(props: { params: Promise<Params> }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("canino");
  const [breed, setBreed] = useState("");
  const [behaviorNotes, setBehaviorNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState<string>("");
  const [supabaseClient, setSupabaseClient] = useState<any>(null);

  // Inicializar cliente de Supabase
  useEffect(() => {
    createClient().then(setSupabaseClient);
  }, []);

  // Resolver params de forma asíncrona
  useEffect(() => {
    props.params.then((p) => setClientId(p.id));
  }, [props.params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientId || !supabaseClient) {
      setError("ID de cliente no disponible");
      return;
    }

    setLoading(true);
    setError("");

    if (!name || !species) {
      setError("Nombre y especie son obligatorios");
      setLoading(false);
      return;
    }

    const { data, error: supabaseError } = await supabaseClient
      .from("pets")
      .insert({
        name,
        species,
        breed: breed || null,
        behavior_notes: behaviorNotes || null,
        client_id: clientId,
      });

    if (supabaseError) {
      setError(supabaseError.message);
      setLoading(false);
      return;
    }

    router.push(`/clientes/${clientId}`);
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
          <CardTitle>Agregar Nueva Mascota</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nombre de la mascota"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="species">Especie *</Label>
              <select
                id="species"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="canino">🐕 Canino</option>
                <option value="felino">🐈 Felino</option>
                <option value="otro">🐾 Otro</option>
              </select>
            </div>

            <div>
              <Label htmlFor="breed">Raza</Label>
              <Input
                id="breed"
                type="text"
                placeholder="Raza de la mascota"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="behaviorNotes">Notas de comportamiento</Label>
              <Textarea
                id="behaviorNotes"
                placeholder="Notas sobre el comportamiento de la mascota"
                value={behaviorNotes}
                onChange={(e) => setBehaviorNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Mascota"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
