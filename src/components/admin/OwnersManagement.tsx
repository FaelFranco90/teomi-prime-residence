import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useOwnersManagement } from "@/hooks/useOwnersManagement";
import { Users, Home, TrendingUp, TrendingDown, Calendar } from "lucide-react";

export default function OwnersManagement() {
  const { owners, loading, error } = useOwnersManagement();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando proprietários...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  const totalStats = owners.reduce((acc, owner) => ({
    totalOwners: acc.totalOwners + 1,
    totalProperties: acc.totalProperties + owner.total_properties,
    activeProperties: acc.activeProperties + owner.active_properties,
    soldProperties: acc.soldProperties + owner.sold_properties,
    inactiveProperties: acc.inactiveProperties + owner.inactive_properties,
  }), {
    totalOwners: 0,
    totalProperties: 0,
    activeProperties: 0,
    soldProperties: 0,
    inactiveProperties: 0,
  });

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proprietários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalOwners}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Imóveis Ativos</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalStats.activeProperties}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Imóveis Vendidos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalStats.soldProperties}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Imóveis Inativos</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalStats.inactiveProperties}</div>
          </CardContent>
        </Card>
      </div>

      {/* Owners Table */}
      <Card>
        <CardHeader>
          <CardTitle>Proprietários Cadastrados</CardTitle>
          <CardDescription>
            Lista completa de proprietários e suas estatísticas de imóveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proprietário</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Ativos</TableHead>
                <TableHead>Vendidos</TableHead>
                <TableHead>Inativos</TableHead>
                <TableHead>Último Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {owners.map((owner) => (
                <TableRow key={owner.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{owner.full_name}</div>
                      {owner.document && (
                        <div className="text-sm text-muted-foreground">{owner.document}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {owner.email && (
                        <div className="text-sm">{owner.email}</div>
                      )}
                      {owner.phone && (
                        <div className="text-sm text-muted-foreground">{owner.phone}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {owner.total_properties}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {owner.active_properties > 0 ? (
                      <Badge variant="default" className="bg-green-600">
                        {owner.active_properties}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {owner.sold_properties > 0 ? (
                      <Badge variant="default" className="bg-blue-600">
                        {owner.sold_properties}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {owner.inactive_properties > 0 ? (
                      <Badge variant="default" className="bg-orange-600">
                        {owner.inactive_properties}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {owner.last_property_created_at ? (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(owner.last_property_created_at).toLocaleDateString('pt-BR')}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {owners.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum proprietário cadastrado ainda.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}