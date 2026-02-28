"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DeletePetButtonProps {
  petId: string;
  petName: string;
}

export function DeletePetButton({ petId, petName }: DeletePetButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [supabaseClient, setSupabaseClient] = useState<any>(null);

  // Inicializar cliente de Supabase
  useEffect(() => {
    createClient().then(setSupabaseClient);
  }, []);

  const handleDelete = async () => {
    if (!supabaseClient) return;
    
    setLoading(true);
    const { error } = await supabaseClient
      .from("pets")
      .delete()
      .eq("id", petId);

    setLoading(false);

    if (error) {
      alert("Error al eliminar la mascota");
      return;
    }

    // Recargar la página para actualizar la lista
    router.refresh();
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-600">¿Eliminar {petName}?</span>
        <Button
          size="sm"
          variant="destructive"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? "..." : "Sí"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowConfirm(false)}
        >
          No
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => setShowConfirm(true)}
      title="Eliminar mascota"
    >
      <Trash2 className="w-4 h-4 text-red-500" />
    </Button>
  );
}
