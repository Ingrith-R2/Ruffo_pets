"use client";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function SearchClients() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Actualizar URL con el término de búsqueda
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    router.push(`/clientes?${params.toString()}`);
  }, [searchTerm, router]);

  return (
    <Input
      type="text"
      placeholder="Buscar clientes..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="max-w-sm"
    />
  );
}
