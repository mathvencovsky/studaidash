import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2, Youtube, Trash2, ExternalLink, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useContentsQuery, useCreateContent, useUpdateContent, useDeleteContent } from "@/hooks/use-contents";
import { extractYoutubeMetadata } from "@/api/youtube-metadata";
import type { Content } from "@/api/contents";

const emptyForm = {
  title: "",
  description: "",
  type: "youtube_video" as Content["type"],
  duration_in_seconds: 0,
  link: "",
  category: "",
  level: "beginner" as Content["level"],
  thumbnail_url: null as string | null,
  author: null as string | null,
  published_at: null as string | null,
  language: "pt-BR",
  ai_transcript: null as string | null,
  ai_summary: null as string | null,
};

export function AdminContentsTab() {
  const { data: contents, isLoading } = useContentsQuery();
  const createContent = useCreateContent();
  const updateContent = useUpdateContent();
  const deleteContent = useDeleteContent();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [extracting, setExtracting] = useState(false);

  const resetForm = () => {
    setForm(emptyForm);
    setYoutubeUrl("");
    setEditingId(null);
  };

  const handleExtractYoutube = async () => {
    if (!youtubeUrl.trim()) return;
    setExtracting(true);
    try {
      const meta = await extractYoutubeMetadata(youtubeUrl);
      setForm((f) => ({
        ...f,
        title: meta.title,
        description: meta.description,
        author: meta.author,
        thumbnail_url: meta.thumbnail_url,
        duration_in_seconds: meta.duration_in_seconds,
        link: meta.link,
        type: "youtube_video",
      }));
      toast.success("Metadados extraídos com sucesso!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao extrair metadados");
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.link) {
      toast.error("Título e link são obrigatórios");
      return;
    }
    try {
      if (editingId) {
        await updateContent.mutateAsync({ id: editingId, ...form });
        toast.success("Conteúdo atualizado!");
      } else {
        await createContent.mutateAsync(form);
        toast.success("Conteúdo criado!");
      }
      setDialogOpen(false);
      resetForm();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar");
    }
  };

  const handleEdit = (c: Content) => {
    setEditingId(c.id);
    setForm({
      title: c.title,
      description: c.description,
      type: c.type,
      duration_in_seconds: c.duration_in_seconds,
      link: c.link,
      category: c.category,
      level: c.level,
      thumbnail_url: c.thumbnail_url,
      author: c.author,
      published_at: c.published_at,
      language: c.language,
      ai_transcript: c.ai_transcript,
      ai_summary: c.ai_summary,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este conteúdo?")) return;
    try {
      await deleteContent.mutateAsync(id);
      toast.success("Conteúdo excluído");
    } catch (e) {
      toast.error("Erro ao excluir");
    }
  };

  const formatDuration = (s: number) => {
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    return m < 60 ? `${m}min` : `${Math.floor(m / 60)}h${m % 60 > 0 ? ` ${m % 60}min` : ""}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {contents?.length ?? 0} conteúdos cadastrados
        </p>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus size={16} className="mr-1.5" />
              Adicionar Conteúdo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Conteúdo" : "Novo Conteúdo"}</DialogTitle>
            </DialogHeader>

            {/* YouTube auto-fill */}
            <Card className="border-dashed">
              <CardContent className="p-3 space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <Youtube size={14} className="text-red-500" />
                  Preencher via YouTube
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="text-sm"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleExtractYoutube}
                    disabled={extracting || !youtubeUrl.trim()}
                  >
                    {extracting ? <Loader2 size={14} className="animate-spin" /> : "Extrair"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <div>
                <Label className="text-xs">Título *</Label>
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Descrição *</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Tipo</Label>
                  <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as Content["type"] }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube_video">Vídeo YouTube</SelectItem>
                      <SelectItem value="article">Artigo</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="assignment">Exercício</SelectItem>
                      <SelectItem value="lab">Lab</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Nível</Label>
                  <Select value={form.level} onValueChange={(v) => setForm((f) => ({ ...f, level: v as Content["level"] }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Iniciante</SelectItem>
                      <SelectItem value="intermediate">Intermediário</SelectItem>
                      <SelectItem value="advanced">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Link *</Label>
                  <Input value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} />
                </div>
                <div>
                  <Label className="text-xs">Duração (segundos)</Label>
                  <Input
                    type="number"
                    value={form.duration_in_seconds}
                    onChange={(e) => setForm((f) => ({ ...f, duration_in_seconds: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Categoria</Label>
                  <Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
                </div>
                <div>
                  <Label className="text-xs">Autor</Label>
                  <Input value={form.author ?? ""} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value || null }))} />
                </div>
              </div>
              <div>
                <Label className="text-xs">Thumbnail URL</Label>
                <Input value={form.thumbnail_url ?? ""} onChange={(e) => setForm((f) => ({ ...f, thumbnail_url: e.target.value || null }))} />
                {form.thumbnail_url && (
                  <img src={form.thumbnail_url} alt="thumb" className="mt-2 rounded h-20 object-cover" />
                )}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={createContent.isPending || updateContent.isPending}
                className="w-full"
              >
                {(createContent.isPending || updateContent.isPending) && <Loader2 size={14} className="animate-spin mr-1.5" />}
                {editingId ? "Salvar Alterações" : "Criar Conteúdo"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content list */}
      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}><CardContent className="p-4"><Skeleton className="h-12 w-full" /></CardContent></Card>
        ))
      ) : !contents?.length ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhum conteúdo cadastrado
          </CardContent>
        </Card>
      ) : (
        contents.map((c) => (
          <Card key={c.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-3 flex items-center gap-3">
              {c.thumbnail_url ? (
                <img src={c.thumbnail_url} alt="" className="w-14 h-9 rounded object-cover shrink-0" />
              ) : (
                <div className="w-14 h-9 rounded bg-muted flex items-center justify-center shrink-0 text-xs text-muted-foreground">
                  {c.type === "youtube_video" ? "▶" : "📄"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{c.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <Badge variant="outline" className="text-[10px] px-1 py-0">{c.type}</Badge>
                  {c.duration_in_seconds > 0 && <span>{formatDuration(c.duration_in_seconds)}</span>}
                  {c.category && <span>• {c.category}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(c)}>
                  <Pencil size={14} />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(c.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
