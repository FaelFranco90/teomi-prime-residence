
import { useMemo, useState } from 'react';
import { usePropertyTypes, PropertyType } from '@/hooks/usePropertyTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit3, Save, X, Trash2, RefreshCw, Search } from 'lucide-react';

export interface PropertyTypesManagerProps {
  onClose?: () => void;
}

export default function PropertyTypesManager({ onClose }: PropertyTypesManagerProps) {
  const { types, loading, error, refetch, createType, updateType, deleteType } = usePropertyTypes();
  const { toast } = useToast();

  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);
  const [newType, setNewType] = useState({ key: '', label: '', prefix: '', order_index: 0, active: true });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Partial<PropertyType>>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return types;
    return types.filter(t =>
      t.key.toLowerCase().includes(q) ||
      t.label.toLowerCase().includes(q) ||
      t.prefix.toLowerCase().includes(q)
    );
  }, [types, query]);

  const startEdit = (t: PropertyType) => {
    setEditingId(t.id);
    setDrafts((d) => ({ ...d, [t.id]: { key: t.key, label: t.label, prefix: t.prefix, active: t.active, order_index: t.order_index } }));
  };

  const cancelEdit = (id: string) => {
    setEditingId(null);
    setDrafts((d) => {
      const copy = { ...d };
      delete copy[id];
      return copy;
    });
  };

  const saveEdit = async (id: string) => {
    const patch = drafts[id] || {};
    try {
      if (patch.prefix && patch.prefix.length !== 2) {
        toast({ title: 'Prefixo inválido', description: 'O prefixo deve ter exatamente 2 letras.', variant: 'destructive' });
        return;
      }
      await updateType(id, patch);
      toast({ title: 'Tipo atualizado', description: 'As alterações foram salvas.' });
      setEditingId(null);
      setDrafts((d) => {
        const copy = { ...d };
        delete copy[id];
        return copy;
      });
    } catch (e: any) {
      toast({ title: 'Erro ao atualizar', description: e?.message || 'Tente novamente.', variant: 'destructive' });
    }
  };

  const handleAdd = async () => {
    try {
      if (!newType.key || !newType.label || !newType.prefix) {
        toast({ title: 'Campos obrigatórios', description: 'Preencha chave, rótulo e prefixo.', variant: 'destructive' });
        return;
      }
      if (newType.prefix.length !== 2) {
        toast({ title: 'Prefixo inválido', description: 'O prefixo deve ter exatamente 2 letras.', variant: 'destructive' });
        return;
      }
      await createType(newType);
      toast({ title: 'Tipo criado', description: 'Novo tipo de imóvel adicionado.' });
      setNewType({ key: '', label: '', prefix: '', order_index: 0, active: true });
      setAdding(false);
    } catch (e: any) {
      toast({ title: 'Erro ao criar', description: e?.message || 'Tente novamente.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este tipo?')) return;
    try {
      await deleteType(id);
      toast({ title: 'Tipo excluído', description: 'O tipo foi removido.' });
    } catch (e: any) {
      toast({ title: 'Erro ao excluir', description: e?.message || 'Tente novamente.', variant: 'destructive' });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="gap-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tipos de Imóvel</CardTitle>
            <CardDescription>Gerencie os tipos, prefixos e a ordem para geração de códigos</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={refetch} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
            {onClose && (
              <Button variant="outline" onClick={onClose} className="gap-2">
                <X className="h-4 w-4" />
                Fechar
              </Button>
            )}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por chave, rótulo ou prefixo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setAdding((v) => !v)} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Tipo
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {adding && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 border rounded-md">
            <Input
              placeholder="chave (ex: casa)"
              value={newType.key}
              onChange={(e) => setNewType((s) => ({ ...s, key: e.target.value }))}
            />
            <Input
              placeholder="rótulo (ex: Casa)"
              value={newType.label}
              onChange={(e) => setNewType((s) => ({ ...s, label: e.target.value }))}
            />
            <Input
              placeholder="prefixo (ex: CA)"
              value={newType.prefix}
              onChange={(e) => setNewType((s) => ({ ...s, prefix: e.target.value }))}
              maxLength={2}
            />
            <Input
              type="number"
              placeholder="ordem"
              value={newType.order_index}
              onChange={(e) => setNewType((s) => ({ ...s, order_index: Number(e.target.value) }))}
            />
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setAdding(false)} className="gap-2">
                <X className="h-4 w-4" /> Cancelar
              </Button>
              <Button onClick={handleAdd} className="gap-2">
                <Save className="h-4 w-4" /> Salvar
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordem</TableHead>
                <TableHead>Prefixo</TableHead>
                <TableHead>Chave</TableHead>
                <TableHead>Rótulo</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Carregando...
                  </TableCell>
                </TableRow>
              )}
              {error && !loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-destructive">
                    Erro: {error}
                  </TableCell>
                </TableRow>
              )}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Nenhum tipo encontrado.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((t) => {
                const isEditing = editingId === t.id;
                const d = drafts[t.id] || {};
                return (
                  <TableRow key={t.id}>
                    <TableCell className="w-28">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={d.order_index ?? t.order_index}
                          onChange={(e) =>
                            setDrafts((prev) => ({ ...prev, [t.id]: { ...prev[t.id], order_index: Number(e.target.value) } }))
                          }
                        />
                      ) : (
                        t.order_index
                      )}
                    </TableCell>
                    <TableCell className="w-28">
                      {isEditing ? (
                        <Input
                          value={d.prefix ?? t.prefix}
                          maxLength={2}
                          onChange={(e) =>
                            setDrafts((prev) => ({ ...prev, [t.id]: { ...prev[t.id], prefix: e.target.value } }))
                          }
                        />
                      ) : (
                        t.prefix
                      )}
                    </TableCell>
                    <TableCell className="min-w-40">
                      {isEditing ? (
                        <Input
                          value={d.key ?? t.key}
                          onChange={(e) =>
                            setDrafts((prev) => ({ ...prev, [t.id]: { ...prev[t.id], key: e.target.value } }))
                          }
                        />
                      ) : (
                        t.key
                      )}
                    </TableCell>
                    <TableCell className="min-w-48">
                      {isEditing ? (
                        <Input
                          value={d.label ?? t.label}
                          onChange={(e) =>
                            setDrafts((prev) => ({ ...prev, [t.id]: { ...prev[t.id], label: e.target.value } }))
                          }
                        />
                      ) : (
                        t.label
                      )}
                    </TableCell>
                    <TableCell className="w-28">
                      {isEditing ? (
                        <div className="flex items-center">
                          <Switch
                            checked={d.active ?? t.active}
                            onCheckedChange={(checked) =>
                              setDrafts((prev) => ({ ...prev, [t.id]: { ...prev[t.id], active: checked } }))
                            }
                          />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Switch
                            checked={t.active}
                            onCheckedChange={async (checked) => {
                              try {
                                await updateType(t.id, { active: checked });
                                toast({ title: 'Atualizado', description: `Tipo ${checked ? 'ativado' : 'desativado'}.` });
                              } catch (e: any) {
                                toast({ title: 'Erro', description: e?.message || 'Tente novamente.', variant: 'destructive' });
                              }
                            }}
                          />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right w-56">
                      {isEditing ? (
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => cancelEdit(t.id)} className="gap-2">
                            <X className="h-4 w-4" /> Cancelar
                          </Button>
                          <Button onClick={() => saveEdit(t.id)} className="gap-2">
                            <Save className="h-4 w-4" /> Salvar
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => startEdit(t)} className="gap-2">
                            <Edit3 className="h-4 w-4" /> Editar
                          </Button>
                          <Button variant="destructive" onClick={() => handleDelete(t.id)} className="gap-2">
                            <Trash2 className="h-4 w-4" /> Excluir
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
