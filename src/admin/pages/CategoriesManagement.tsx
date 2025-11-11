// src/admin/pages/CategoriesManagement.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2, Power, GripVertical, X, Folder, Upload, Camera } from "lucide-react";
import { toast } from "sonner";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  type Category,
} from "@/lib/storage";

const CategoriesManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    enabled: true,
    description: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    const cats = getCategories().sort((a, b) => a.order - b.order);
    setCategories(cats);
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        displayName: category.displayName,
        enabled: category.enabled,
        description: category.description || "",
        image: category.image || "",
      });
      setImagePreview(category.image || "");
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        displayName: "",
        enabled: true,
        description: "",
        image: "",
      });
      setImagePreview("");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      displayName: "",
      enabled: true,
      description: "",
      image: "",
    });
    setImagePreview("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor selecciona un archivo de imagen válido");
      return;
    }

    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("La imagen debe ser menor a 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData({ ...formData, image: base64String });
      setImagePreview(base64String);
      toast.success("Imagen cargada correctamente");
    };
    reader.onerror = () => {
      toast.error("Error al cargar la imagen");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: "" });
    setImagePreview("");
    toast.success("Imagen eliminada");
  };

  const handleSaveCategory = () => {
    if (!formData.name.trim() || !formData.displayName.trim()) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      if (editingCategory) {
        // Editar categoría existente
        updateCategory(editingCategory.id, {
          name: formData.name,
          displayName: formData.displayName,
          enabled: formData.enabled,
          description: formData.description,
          image: formData.image,
        });
        toast.success("Categoría actualizada");
      } else {
        // Agregar nueva categoría
        addCategory({
          name: formData.name,
          displayName: formData.displayName,
          enabled: formData.enabled,
          description: formData.description,
          image: formData.image,
          order: categories.length + 1,
        });
        toast.success("Categoría agregada");
      }

      loadCategories();
      handleCloseModal();
    } catch (error) {
      toast.error("Error al guardar la categoría");
      console.error(error);
    }
  };

  const handleToggleCategory = (category: Category) => {
    updateCategory(category.id, { enabled: !category.enabled });
    loadCategories();
    toast.success(category.enabled ? "Categoría deshabilitada" : "Categoría habilitada");
  };

  const handleDeleteCategory = (category: Category) => {
    // Verificar si es una categoría por defecto
    if (['presidential', 'congress', 'district'].includes(category.id)) {
      toast.error("No se pueden eliminar las categorías por defecto");
      return;
    }

    if (confirm(`¿Eliminar la categoría "${category.displayName}"?\n\nEsto también eliminará todos los candidatos y votos asociados.`)) {
      try {
        deleteCategory(category.id);
        loadCategories();
        toast.success("Categoría eliminada");
      } catch (error: any) {
        toast.error(error.message || "Error al eliminar la categoría");
      }
    }
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newCategories = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newCategories.length) return;

    [newCategories[index], newCategories[targetIndex]] = [newCategories[targetIndex], newCategories[index]];
    
    // Reordenar
    const categoryIds = newCategories.map(cat => cat.id);
    reorderCategories(categoryIds);
    
    loadCategories();
    toast.success("Orden actualizado");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Categorías</h2>
          <p className="text-muted-foreground mt-1">
            Administra las categorías de votación del sistema
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      <Card className="p-6 bg-gradient-card border-border">
        <div className="space-y-3">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <div
                key={category.id}
                className={`flex items-center justify-between p-4 bg-card rounded-lg border border-border transition-opacity ${
                  !category.enabled ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveCategory(index, 'up')}
                      disabled={index === 0}
                    >
                      <GripVertical className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveCategory(index, 'down')}
                      disabled={index === categories.length - 1}
                    >
                      <GripVertical className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={category.displayName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Folder className="w-6 h-6 text-primary" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-bold flex items-center gap-2">
                      {category.displayName}
                      {!category.enabled && (
                        <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded">
                          Deshabilitada
                        </span>
                      )}
                      {['presidential', 'congress', 'district'].includes(category.id) && (
                        <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded">
                          Por defecto
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {category.description || 'Sin descripción'} • Orden: {category.order}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleCategory(category)}
                    title={category.enabled ? "Deshabilitar" : "Habilitar"}
                  >
                    <Power className={`w-4 h-4 ${category.enabled ? 'text-green-500' : 'text-muted-foreground'}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenModal(category)}
                    title="Editar"
                  >
                    <Edit className="w-4 h-4 text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCategory(category)}
                    title="Eliminar"
                    disabled={['presidential', 'congress', 'district'].includes(category.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No hay categorías configuradas
            </p>
          )}
        </div>
      </Card>

      {/* Modal de Edición/Creación */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 bg-card border-border max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">
                {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
              </h3>
              <Button variant="ghost" size="icon" onClick={handleCloseModal}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Imagen de Categoría */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Imagen de Categoría
                </label>
                
                <div className="flex flex-col gap-3">
                  {imagePreview ? (
                    <div className="relative w-full h-40 rounded-lg border-2 border-border overflow-hidden bg-muted">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full h-40 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center bg-muted/50">
                      <Camera className="w-12 h-12 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Sin imagen</p>
                    </div>
                  )}

                  <label className="cursor-pointer">
                    <Button variant="outline" className="w-full" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        {imagePreview ? "Cambiar Imagen" : "Subir Imagen"}
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  Formatos: JPG, PNG, GIF. Tamaño máximo: 2MB
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  ID de Categoría *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="ej: alcaldes, gobernador"
                  disabled={editingCategory !== null}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Solo letras minúsculas y guiones bajos. No se puede cambiar después.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre para Mostrar *
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="ej: Alcaldes, Gobernador"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Descripción de la categoría electoral"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Explica brevemente qué tipo de representantes se eligen en esta categoría
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="enabled" className="text-sm font-medium">
                  Categoría habilitada
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={handleCloseModal} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleSaveCategory} className="flex-1">
                  {editingCategory ? "Guardar Cambios" : "Crear Categoría"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;