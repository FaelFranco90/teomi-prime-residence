
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import OwnersPicker from "./OwnersPicker";
import type { SelectedOwner } from "@/types/owners";
import { Badge } from "@/components/ui/badge";

interface PropertyOwnersSectionProps {
  selectedOwners: SelectedOwner[];
  setSelectedOwners: (next: SelectedOwner[]) => void;
  isVisible?: boolean;
}

export default function PropertyOwnersSection({
  selectedOwners,
  setSelectedOwners,
  isVisible = true,
}: PropertyOwnersSectionProps) {
  useEffect(() => {
    console.log("[PropertyOwnersSection] selectedOwners", selectedOwners);
  }, [selectedOwners]);

  if (!isVisible) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proprietários (interno)</CardTitle>
        <CardDescription>
          Estes dados são privados e não aparecem no site público.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <OwnersPicker selected={selectedOwners} onChange={setSelectedOwners} />
        {selectedOwners.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Selecionados:</div>
            <div className="flex flex-wrap gap-2">
              {selectedOwners.map((s) => (
                <Badge key={s.owner.id} variant="outline">
                  {s.owner.full_name}
                  {typeof s.ownership_percent === "number" ? ` • ${s.ownership_percent}%` : ""}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
