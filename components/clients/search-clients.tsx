"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function SearchClients() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // Función para actualizar la URL con debounce
  const updateSearch = useCallback((term: string) => {
    const params = new URLSearchParams(window.location.search);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    const newUrl = `/clientes?${params.toString()}`;
    router.push(newUrl);
  }, [router]);

  // Debounce para evitar actualizaciones excesivas
  useEffect(() => {
    const timer = setTimeout(() => {
      updateSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, updateSearch]);

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
