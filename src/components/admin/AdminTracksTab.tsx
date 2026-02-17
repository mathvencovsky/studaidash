import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2, Trash2, Pencil, ChevronRight, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTracks, createTrack, updateTrack, deleteTrack, type Track } from "@/api/tracks";
import { useModulesQuery, useCreateModule, useUpdateModule, useDeleteModule } from "@/hooks/use-modules";
import { useContentsQuery } from "@/hooks/use-contents";
import { useModuleContentsQuery, useAddContentToModule, useRemoveContentFromModule } from "@/hooks/use-module-contents";
import type { Module } from "@/api/modules";

export function AdminTracksTab() {
  const qc = useQueryClient();
  const { data: tracks, isLoading: tracksLoading } = useQuery({ queryKey: ["tracks"], queryFn: getTracks });
  const { data: modules } = useModulesQuery();
  const { data: contents } = useContentsQuery();

  const [trackDialog, setTrackDialog] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [trackForm, setTrackForm] = useState({ title: "", description: "" });

  const [moduleDialog, setModuleDialog] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [moduleForm, setModuleForm] = useState({ title: "", description: "" });
  const [selectedTrackForModule, setSelectedTrackForModule] = useState<Track | null>(null);

  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);

  const createTrackMut = useMutation({
    mutationFn: createTrack,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tracks"] }); qc.invalidateQueries({ queryKey: ["modules"] }); },
  });
  const updateTrackMut = useMutation({
    mutationFn: ({ id, ...input }: { id: string } & Partial<Omit<Track, "id" | "created_at" | "updated_at">>) =>
      updateTrack(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tracks"] }),
  });
  const deleteTrackMut = useMutation({
    mutationFn: deleteTrack,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tracks"] }),
  });

  const createModuleMut = useCreateModule();
  const updateModuleMut = useUpdateModule();
  const deleteModuleMut = useDeleteModule();
  const addContentToModule = useAddContentToModule();

  // Get modules for a track
  const getTrackModules = (track: Track) => {
    if (!modules) return [];
    const moduleIds = new Set([track.root_module_id, ...Object.keys(track.parent_by_module_id)]);
    return modules.filter((m) => moduleIds.has(m.id));
  };

  const handleCreateTrack = async () => {
    if (!trackForm.title) { toast.error("Título obrigatório"); return; }
    try {
      // Create root module first
      const rootModule = await createModuleMut.mutateAsync({
        title: trackForm.title,
        description: trackForm.description || "Módulo raiz",
      });
      await createTrackMut.mutateAsync({
        title: trackForm.title,
        description: trackForm.description,
        root_module_id: rootModule.id,
        parent_by_module_id: {},
      });
      toast.success("Trilha criada!");
      setTrackDialog(false);
      setTrackForm({ title: "", description: "" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao criar trilha");
    }
  };

  const handleUpdateTrack = async () => {
    if (!editingTrack) return;
    try {
      await updateTrackMut.mutateAsync({
        id: editingTrack.id,
        title: trackForm.title,
        description: trackForm.description,
      });
      toast.success("Trilha atualizada!");
      setTrackDialog(false);
      setEditingTrack(null);
      setTrackForm({ title: "", description: "" });
    } catch (e) {
      toast.error("Erro ao atualizar");
    }
  };

  const handleDeleteTrack = async (id: string) => {
    if (!confirm("Excluir esta trilha?")) return;
    try {
      await deleteTrackMut.mutateAsync(id);
      toast.success("Trilha excluída");
    } catch (e) {
      toast.error("Erro ao excluir");
    }
  };

  const handleAddModule = async () => {
    if (!selectedTrackForModule || !moduleForm.title) { toast.error("Título obrigatório"); return; }
    try {
      const newModule = await createModuleMut.mutateAsync({
        title: moduleForm.title,
        description: moduleForm.description,
      });
      // Add to track's parent_by_module_id (child of root)
      const updatedParents = {
        ...selectedTrackForModule.parent_by_module_id,
        [newModule.id]: selectedTrackForModule.root_module_id,
      };
      await updateTrackMut.mutateAsync({
        id: selectedTrackForModule.id,
        parent_by_module_id: updatedParents,
      });
      toast.success("Módulo adicionado à trilha!");
      setModuleDialog(false);
      setModuleForm({ title: "", description: "" });
      setSelectedTrackForModule(null);
    } catch (e) {
      toast.error("Erro ao adicionar módulo");
    }
  };

  const handleDeleteModule = async (moduleId: string, track: Track) => {
    if (!confirm("Remover este módulo da trilha?")) return;
    try {
      const updatedParents = { ...track.parent_by_module_id };
      delete updatedParents[moduleId];
      await updateTrackMut.mutateAsync({ id: track.id, parent_by_module_id: updatedParents });
      await deleteModuleMut.mutateAsync(moduleId);
      toast.success("Módulo removido");
    } catch (e) {
      toast.error("Erro ao remover");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {tracks?.length ?? 0} trilhas cadastradas
        </p>
        <Dialog open={trackDialog} onOpenChange={(o) => { setTrackDialog(o); if (!o) { setEditingTrack(null); setTrackForm({ title: "", description: "" }); } }}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus size={16} className="mr-1.5" />Nova Trilha</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTrack ? "Editar Trilha" : "Nova Trilha"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Título *</Label>
                <Input value={trackForm.title} onChange={(e) => setTrackForm((f) => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Descrição</Label>
                <Textarea value={trackForm.description} onChange={(e) => setTrackForm((f) => ({ ...f, description: e.target.value }))} rows={3} />
              </div>
              <Button
                onClick={editingTrack ? handleUpdateTrack : handleCreateTrack}
                disabled={createTrackMut.isPending || updateTrackMut.isPending}
                className="w-full"
              >
                {(createTrackMut.isPending || updateTrackMut.isPending) && <Loader2 size={14} className="animate-spin mr-1.5" />}
                {editingTrack ? "Salvar" : "Criar Trilha"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Module dialog */}
      <Dialog open={moduleDialog} onOpenChange={(o) => { setModuleDialog(o); if (!o) setModuleForm({ title: "", description: "" }); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Novo Módulo {selectedTrackForModule && `em "${selectedTrackForModule.title}"`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Título *</Label>
              <Input value={moduleForm.title} onChange={(e) => setModuleForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Descrição</Label>
              <Textarea value={moduleForm.description} onChange={(e) => setModuleForm((f) => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            <Button onClick={handleAddModule} disabled={createModuleMut.isPending} className="w-full">
              {createModuleMut.isPending && <Loader2 size={14} className="animate-spin mr-1.5" />}
              Adicionar Módulo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Track list */}
      {tracksLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}><CardContent className="p-4"><Skeleton className="h-12 w-full" /></CardContent></Card>
        ))
      ) : !tracks?.length ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhuma trilha cadastrada
          </CardContent>
        </Card>
      ) : (
        tracks.map((track) => {
          const trackModules = getTrackModules(track);
          const isExpanded = expandedTrack === track.id;

          return (
            <Card key={track.id}>
              <CardContent className="p-0">
                {/* Track header */}
                <div
                  className="p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedTrack(isExpanded ? null : track.id)}
                >
                  <ChevronRight size={16} className={`text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{track.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{track.description}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {trackModules.length} módulos
                  </Badge>
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => {
                        setEditingTrack(track);
                        setTrackForm({ title: track.title, description: track.description });
                        setTrackDialog(true);
                      }}
                    >
                      <Pencil size={13} />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleDeleteTrack(track.id)}>
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>

                {/* Expanded modules */}
                {isExpanded && (
                  <div className="border-t px-3 pb-3 space-y-2 pt-2">
                    {trackModules
                      .filter((m) => m.id !== track.root_module_id)
                      .map((mod) => (
                        <div key={mod.id} className="flex items-center gap-2 pl-6 py-1.5 rounded hover:bg-muted/30">
                          <BookOpen size={14} className="text-muted-foreground shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{mod.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{mod.description}</p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive shrink-0"
                            onClick={() => handleDeleteModule(mod.id, track)}
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      ))}
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-6 text-xs"
                      onClick={() => {
                        setSelectedTrackForModule(track);
                        setModuleDialog(true);
                      }}
                    >
                      <Plus size={12} className="mr-1" />
                      Adicionar Módulo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
