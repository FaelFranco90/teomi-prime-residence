import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSupabaseProperties, Property } from '@/hooks/useSupabaseProperties';
import { useAuthHook } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PropertyForm } from '@/components/PropertyForm';
import { Plus, Edit, Trash2, LogOut, Search } from 'lucide-react';

export default function Admin() {
  const { properties, loading, refetch } = useSupabaseProperties();
  const { signOut, user } = useAuthHook();
  const { toast } = useToast();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>(undefined);

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

    setFilteredProperties(filtered);
  }, [properties, searchTerm, typeFilter, cityFilter, featuredFilter]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este imóvel?')) return;

    try {
      // First delete property images from storage and database
      const { data: images } = await supabase
        .from('property_images')
        .select('image_url')
        .eq('property_id', id);

      if (images) {
        // Delete from storage
        const imagePaths = images.map(img => {
          const url = new URL(img.image_url);
          return url.pathname.split('/').slice(-2).join('/'); // Get the file path from URL
        });

        if (imagePaths.length > 0) {
          await supabase.storage
            .from('property-images')
            .remove(imagePaths);
        }

        // Delete image records
        await supabase
          .from('property_images')
          .delete()
          .eq('property_id', id);
      }

      // Delete the property
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Imóvel excluído",
        description: "O imóvel foi removido com sucesso.",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o imóvel.",
        variant: "destructive",
      });
    }
  };

  const handleAddProperty = () => {
    setEditingProperty(undefined);
    setShowForm(true);
  };

  const handleEditProperty = (property: Property) => {
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
  const uniqueCities = [...new Set(properties.map(p => 
    p.location.split(',')[0].trim()
  ))];

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
          <Button variant="outline" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Gerenciar Imóveis</h2>
          <Button className="gap-2" onClick={handleAddProperty}>
            <Plus className="h-4 w-4" />
            Adicionar Imóvel
          </Button>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Filtre os imóveis por diferentes critérios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Imóveis */}
        <Card>
          <CardHeader>
            <CardTitle>Imóveis Cadastrados ({filteredProperties.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-mono">{property.code}</TableCell>
                    <TableCell className="font-medium">{property.title}</TableCell>
                    <TableCell>{property.location}</TableCell>
                    <TableCell>{property.price}</TableCell>
                    <TableCell>{property.propertyType || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {property.featured && (
                          <Badge variant="secondary">Destaque</Badge>
                        )}
                        {property.exclusive && (
                          <Badge variant="outline">Exclusivo</Badge>
                        )}
                        {property.isNew && (
                          <Badge>Novo</Badge>
                        )}
                      </div>
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
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleDelete(property.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                          Excluir
                        </Button>
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
      </main>

      {/* Property Form Dialog */}
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
    </div>
  );
}