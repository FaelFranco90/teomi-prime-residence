
import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { searchOwners } from "@/hooks/useOwners";
import type { Owner, SelectedOwner } from "@/types/owners";
import OwnerInlineForm from "./OwnerInlineForm";
import { Plus, Search, Trash2 } from "lucide-react";

interface OwnersPickerProps {
  selected: SelectedOwner[];
  onChange: (next: SelectedOwner[]) => void;
}

export default function OwnersPicker({ selected, onChange }: OwnersPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(false);

  const selectedIds = useMemo(() => new Set(selected.map((s) => s.owner.id)), [selected]);

  useEffect(() => {
    let ignore = false;
    const run = async () => {
      setLoading(true);
      try {
        const data = await searchOwners(query);
        if (!ignore) setResults(data);
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => {
      ignore = true;
    };
  }, [query]);

  const addOwner = (owner: Owner) => {
    if (selectedIds.has(owner.id)) return;
    onChange([...selected, { owner, ownership_percent: null }]);
  };

  const removeOwner = (ownerId: string) => {
    onChange(selected.filter((s) => s.owner.id !== ownerId));
  };

  const setPercent = (ownerId: string, value: string) => {
    const num = value === "" ? null : Number(value);
    if (num !== null && (isNaN(num) || num < 0 || num > 100)) return;
    onChange(
      selected.map((s) =>
        s.owner.id === ownerId ? { ...s, ownership_percent: num } : s
      )
    );
  };

  const handleCreated = (o: { id: string; full_name: string }) => {
    onChange([
      ...selected,
      {
        owner: {
          id: o.id,
          full_name: o.full_name,
          email: null,
          phone: null,
          document: null,
          notes: null,
          created_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        ownership_percent: null,
      },
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Gerenciar proprietários
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Selecionar proprietários (interno)</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Buscar</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8"
                  placeholder="Digite um nome para buscar"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="border rounded-md p-2 max-h-56 overflow-auto">
              {loading ? (
                <div className="text-sm text-muted-foreground">Carregando...</div>
              ) : results.length === 0 ? (
                <div className="text-sm text-muted-foreground">Nenhum resultado</div>
              ) : (
                <ul className="space-y-2">
                  {results.map((o) => (
                    <li key={o.id} className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{o.full_name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {o.email || "-"} • {o.phone || "-"}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={selectedIds.has(o.id) ? "secondary" : "default"}
                        onClick={() => addOwner(o)}
                        disabled={selectedIds.has(o.id)}
                      >
                        {selectedIds.has(o.id) ? "Adicionado" : "Adicionar"}
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Selecionados</Label>
            {selected.length === 0 ? (
              <div className="text-sm text-muted-foreground">Nenhum proprietário selecionado.</div>
            ) : (
              <div className="space-y-2">
                {selected.map((s) => (
                  <div key={s.owner.id} className="flex items-center gap-3">
                    <Badge variant="secondary" className="max-w-[50%] truncate">{s.owner.full_name}</Badge>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground">%</Label>
                      <Input
                        className="w-24"
                        inputMode="decimal"
                        placeholder="ex: 50"
                        value={s.ownership_percent ?? ""}
                        onChange={(e) => setPercent(s.owner.id, e.target.value)}
                      />
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removeOwner(s.owner.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Novo proprietário</Label>
            <OwnerInlineForm onCreated={handleCreated} />
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setOpen(false)}>Concluir</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
