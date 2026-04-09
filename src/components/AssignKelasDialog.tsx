import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useClasses } from "@/hooks/useClasses";
import { toast } from "sonner";
import { getSafeErrorMessage } from "@/utils/errorMessages";
import { BookOpen, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface AssignKelasDialogProps {
  pengujiUserId: string;
  pengujiName: string;
}

export default function AssignKelasDialog({ pengujiUserId, pengujiName }: AssignKelasDialogProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  // Get penguji record from user_id
  const { data: pengujiRecord, isLoading: loadingPenguji } = useQuery({
    queryKey: ["penguji-by-user", pengujiUserId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("penguji")
        .select("id, name")
        .eq("user_id", pengujiUserId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  // Get assigned classes for this penguji
  const { data: assignedClasses = [], isLoading: loadingAssigned } = useQuery({
    queryKey: ["penguji-classes", pengujiRecord?.id],
    queryFn: async () => {
      if (!pengujiRecord?.id) return [];
      const { data, error } = await supabase
        .from("class_penguji")
        .select("class_id, classes:class_id(id, name)")
        .eq("penguji_id", pengujiRecord.id);
      if (error) throw error;
      return (data || []).map((row: any) => row.classes as { id: string; name: string });
    },
    enabled: !!pengujiRecord?.id,
  });

  const { data: allClasses = [], isLoading: loadingClasses } = useClasses();

  const assignedIds = new Set(assignedClasses.map((c) => c.id));
  const available = allClasses.filter((c) => !assignedIds.has(c.id));

  const assign = useMutation({
    mutationFn: async (classId: string) => {
      if (!pengujiRecord?.id) throw new Error("Penguji tidak ditemukan");
      const { error } = await supabase
        .from("class_penguji")
        .insert({ class_id: classId, penguji_id: pengujiRecord.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["penguji-classes", pengujiRecord?.id] });
      queryClient.invalidateQueries({ queryKey: ["class-penguji"] });
      toast.success("Kelas berhasil ditambahkan");
    },
    onError: (err: any) => toast.error(getSafeErrorMessage(err)),
  });

  const unassign = useMutation({
    mutationFn: async (classId: string) => {
      if (!pengujiRecord?.id) throw new Error("Penguji tidak ditemukan");
      const { error } = await supabase
        .from("class_penguji")
        .delete()
        .eq("class_id", classId)
        .eq("penguji_id", pengujiRecord.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["penguji-classes", pengujiRecord?.id] });
      queryClient.invalidateQueries({ queryKey: ["class-penguji"] });
      toast.success("Kelas berhasil dihapus");
    },
    onError: (err: any) => toast.error(getSafeErrorMessage(err)),
  });

  const isLoading = loadingPenguji || loadingAssigned || loadingClasses;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
          <BookOpen className="w-3.5 h-3.5" />
          Kelola Kelas
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Kelas — {pengujiName}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : !pengujiRecord ? (
          <p className="text-sm text-muted-foreground py-4">
            Penguji ini belum terdaftar di tabel penguji. Pastikan data penguji sudah dibuat.
          </p>
        ) : (
          <div className="space-y-4 pt-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Kelas Aktif ({assignedClasses.length})
              </p>
              {assignedClasses.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Belum ada kelas</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {assignedClasses.map((c) => (
                    <Badge key={c.id} variant="secondary" className="flex items-center gap-1 pr-1">
                      {c.name}
                      <button
                        onClick={() => unassign.mutate(c.id)}
                        className="ml-1 p-0.5 rounded-full hover:bg-destructive/20 transition-colors"
                      >
                        <X className="w-3 h-3 text-destructive" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Tambahkan Kelas</p>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {available.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">Semua kelas sudah di-assign</p>
                ) : (
                  available.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => assign.mutate(c.id)}
                      className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors flex items-center justify-between"
                    >
                      <span>{c.name}</span>
                      <BookOpen className="w-3.5 h-3.5 text-primary opacity-60" />
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
