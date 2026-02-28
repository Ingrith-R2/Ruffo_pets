"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeletePetButton } from "./delete-pet-button";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  behavior_notes: string | null;
}

interface PetsTableProps {
  pets: Pet[];
}

export function PetsTable({ pets }: PetsTableProps) {
  if (pets.length === 0) {
    return <p className="text-gray-500 py-4">Este cliente no tiene mascotas registradas.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Especie</TableHead>
          <TableHead>Raza</TableHead>
          <TableHead>Notas de comportamiento</TableHead>
          <TableHead className="w-20">Acción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pets.map((pet) => (
          <TableRow key={pet.id}>
            <TableCell className="font-medium">{pet.name}</TableCell>
            <TableCell>
              {pet.species === "canino" && "🐕 Canino"}
              {pet.species === "felino" && "🐈 Felino"}
              {pet.species === "otro" && "🐾 Otro"}
            </TableCell>
            <TableCell>{pet.breed || "-"}</TableCell>
            <TableCell>{pet.behavior_notes || "-"}</TableCell>
            <TableCell>
              <DeletePetButton
                petId={pet.id}
                petName={pet.name}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
