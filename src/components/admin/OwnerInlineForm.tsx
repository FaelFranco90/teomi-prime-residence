
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createOwner } from "@/hooks/useOwners";
import { Loader2 } from "lucide-react";

interface OwnerInlineFormProps {
  onCreated: (owner: { id: string; full_name: string }) => void;
}

export default function OwnerInlineForm({ onCreated }: OwnerInlineFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [document, setDocument] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const canCreate = fullName.trim().length > 2;

  const handleCreate = async () => {
    if (!canCreate) return;
    setLoading(true);
    try {
      const owner = await createOwner({
        full_name: fullName.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        document: document.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      onCreated({ id: owner.id, full_name: owner.full_name });
      setFullName("");
      setEmail("");
      setPhone("");
      setDocument("");
      setNotes("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Nome completo *</Label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ex: Maria Silva" />
        </div>
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="exemplo@email.com" />
        </div>
        <div className="space-y-1.5">
          <Label>Telefone</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-0000" />
        </div>
        <div className="space-y-1.5">
          <Label>Documento</Label>
          <Input value={document} onChange={(e) => setDocument(e.target.value)} placeholder="CPF/CNPJ" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Observações</Label>
        <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas internas (não público)" />
      </div>
      <div className="flex justify-end">
        <Button onClick={handleCreate} disabled={!canCreate || loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Cadastrar proprietário
        </Button>
      </div>
    </div>
  );
}
