import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminProperties, AdminProperty } from '@/hooks/useAdminProperties';
import { useAuthHook } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PropertyForm } from '@/components/PropertyForm';
import { Plus, Edit, Trash2, LogOut, Search, Settings2, Home, Users } from 'lucide-react';
import PropertyTypesManager from '@/components/admin/PropertyTypesManager';
import OwnersManagement from '@/components/admin/OwnersManagement';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const { properties, loading, refetch } = useAdminProperties();
  const { signOut, user } = useAuthHook();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [filteredProperties, setFilteredProperties] = useState<AdminProperty[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');
  const [publishFilter, setPublishFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<AdminProperty | undefined>(undefined);
  const [showTypesManager, setShowTypesManager] = useState(false);

  useEffect(() => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter && typeFilter !== 'all') {
      filtered = filtered.filter(property => property.propertyType === typeFilter);
    }

    if (cityFilter && cityFilter !== 'all') {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }

    if (featuredFilter && featuredFilter !== 'all') {
      filtered = filtered.filter(property => 
        featuredFilter === 'featured' ? property.featured : !property.featured
      );
    }

    if (publishFilter && publishFilter !== 'all') {
      filtered = filtered.filter(property => 
        publishFilter === 'published' ? property.isPublished : !property.isPublished
      );
    }

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(property => property.status === statusFilter);
    }

    setFilteredProperties(filtered);
  }, [properties, searchTerm, typeFilter, cityFilter, featuredFilter, publishFilter, statusFilter]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/');
  };

  const handleStatusChange = async (propertyId: string, newStatus: 'active' | 'sold' | 'inactive') => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ 
          status: newStatus,
          is_published: newStatus === 'active' // Only active properties are published
        })
        .eq('id', propertyId);

      if (error) throw error;

      toast({
        title: 'Status atualizado',
        description: `Status alterado para ${newStatus === 'active' ? 'Ativo' : newStatus === 'sold' ? 'Vendido' : 'Inativo'}.`
      });
      refetch();
    } catch (err: any) {
      toast({
        title: 'Erro ao alterar status',
        description: 'Não foi possível alterar o status do imóvel.',
        variant: 'destructive'
      });
    }
  };

  const handleAddProperty = () => {
    setEditingProperty(undefined);
    setShowForm(true);
  };

  const handleEditProperty = (property: AdminProperty) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProperty(undefined);
    refetch();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProperty(undefined);
  };

  const uniqueTypes = [...new Set(properties.map(p => p.propertyType).filter(Boolean))];
  const uniqueCities = [...new Set(properties.map(p => p.location.split(',')[0].trim()))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando imóveis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
            <p className="text-muted-foreground">Olá, {user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowTypesManager(true)} className="gap-2">
              <Settings2 className="h-4 w-4" />
              Gerenciar Tipos
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="properties" className="w-full">
          <TabsList>
            <TabsTrigger value="properties" className="gap-2">
              <Home className="h-4 w-4" />
              Imóveis
            </TabsTrigger>
            <TabsTrigger value="owners" className="gap-2">
              <Users className="h-4 w-4" />
              Proprietários
            </TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gerenciar Imóveis</h2>
              <Button className="gap-2" onClick={handleAddProperty}>
                <Plus className="h-4 w-4" />
                Adicionar Imóvel
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
                <CardDescription>Filtre os imóveis por diferentes critérios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título ou localização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de imóvel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {uniqueTypes.map(type => (
                    <SelectItem key={type} value={type!}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cidades</SelectItem>
                  {uniqueCities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Destaque" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="featured">Em destaque</SelectItem>
                  <SelectItem value="normal">Normais</SelectItem>
                </SelectContent>
              </Select>

              <Select value={publishFilter} onValueChange={setPublishFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Publicação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="published">Publicados</SelectItem>
                  <SelectItem value="unpublished">Não publicados</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="sold">Vendido</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Imóveis Cadastrados ({filteredProperties.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imagem</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Publicação</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell>
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                            {property.primaryImageUrl ? (
                              <img 
                                src={property.primaryImageUrl} 
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Home className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{property.code}</TableCell>
                        <TableCell className="font-medium">{property.title}</TableCell>
                        <TableCell>{property.location}</TableCell>
                        <TableCell>{property.price}</TableCell>
                        <TableCell>{property.propertyType || '-'}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge 
                              variant={
                                property.status === 'active' ? 'default' : 
                                property.status === 'sold' ? 'secondary' : 
                                'outline'
                              }
                              className={
                                property.status === 'active' ? 'bg-green-600' :
                                property.status === 'sold' ? 'bg-blue-600' :
                                'bg-orange-600 text-white'
                              }
                            >
                              {property.status === 'active' ? 'Ativo' :
                               property.status === 'sold' ? 'Vendido' :
                               'Inativo'}
                            </Badge>
                            <div className="flex gap-1">
                              {property.featured && (
                                <Badge variant="secondary" className="text-xs">Destaque</Badge>
                              )}
                              {property.exclusive && (
                                <Badge variant="outline" className="text-xs">Exclusivo</Badge>
                              )}
                              {property.isNew && (
                                <Badge className="text-xs">Novo</Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={property.isPublished ? "default" : "secondary"}>
                            {property.isPublished ? "Publicado" : "Oculto"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-1"
                              onClick={() => handleEditProperty(property)}
                            >
                              <Edit className="h-3 w-3" />
                              Editar
                            </Button>
                            <Select 
                              value={property.status} 
                              onValueChange={(newStatus) => handleStatusChange(property.id, newStatus as 'active' | 'sold' | 'inactive')}
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Ativo</SelectItem>
                                <SelectItem value="sold">Vendido</SelectItem>
                                <SelectItem value="inactive">Inativo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {filteredProperties.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum imóvel encontrado com os filtros aplicados.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="owners">
            <OwnersManagement />
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProperty ? 'Editar Imóvel' : 'Adicionar Novo Imóvel'}
            </DialogTitle>
          </DialogHeader>
          <PropertyForm
            property={editingProperty}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showTypesManager} onOpenChange={setShowTypesManager}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerenciar Tipos de Imóvel</DialogTitle>
          </DialogHeader>
          <PropertyTypesManager onClose={() => setShowTypesManager(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
