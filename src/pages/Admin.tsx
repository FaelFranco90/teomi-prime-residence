import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAdminProperties, AdminProperty } from '@/hooks/useAdminProperties';
import { useAuthHook } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PropertyForm } from '@/components/PropertyForm';
import { Plus, Edit, Trash2, LogOut, Search, Settings2 } from 'lucide-react';
import PropertyTypesManager from '@/components/admin/PropertyTypesManager';
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
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<AdminProperty | undefined>(undefined);
  const [showTypesManager, setShowTypesManager] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

    setFilteredProperties(filtered);
  }, [properties, searchTerm, typeFilter, cityFilter, featuredFilter, publishFilter]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/');
  };

  const requestDelete = (id: string) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const performDelete = async () => {
    if (!deletingId) return;

    try {
      const { data: images } = await supabase
        .from('property_images')
        .select('image_url')
        .eq('property_id', deletingId);

      if (images && images.length > 0) {
        const imagePaths = images
          .map((img) => img.image_url.split('/storage/v1/object/public/property-images/')[1])
          .filter((p): p is string => !!p);

        if (imagePaths.length > 0) {
          await supabase.storage.from('property-images').remove(imagePaths);
        }

        await supabase.from('property_images').delete().eq('property_id', deletingId);
      }

      const { error } = await supabase.from('properties').delete().eq('id', deletingId);
      if (error) throw error;

      toast({ title: 'Imóvel excluído', description: 'O imóvel foi removido com sucesso.' });
      refetch();
    } catch (err: any) {
      const msg = typeof err?.message === 'string' ? err.message : '';
      const description = msg.includes('23503')
        ? 'Não é possível excluir: registro relacionado.'
        : 'Não foi possível excluir o imóvel.';
      toast({ title: 'Erro ao excluir', description, variant: 'destructive' });
    } finally {
      setConfirmOpen(false);
      setDeletingId(null);
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Gerenciar Imóveis</h2>
          <Button className="gap-2" onClick={handleAddProperty}>
            <Plus className="h-4 w-4" />
            Adicionar Imóvel
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Filtre os imóveis por diferentes critérios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => requestDelete(property.id)}
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
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. O imóvel e suas imagens serão removidos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={performDelete}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
