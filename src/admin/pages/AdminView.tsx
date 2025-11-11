import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, BarChart3, Settings, Brain, Trash2, RefreshCw, Plus, Edit, Power, Upload, X, User, Folder } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  initializeStorage,
  initializeCategories,
  getCandidates,
  getVoteStats,
  getTopCandidates,
  deleteCandidate,
  resetSystem,
  addCandidate,
  updateCandidate,
  type Candidate,
} from "@/lib/storage";
import AdminLogin from "./AdminLogin";
import DashboardVote from "@/components/DashboardVote";
import CategoriesManagement from "./CategoriesManagement";

const AdminView = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState({ 
    totalVotes: 0, 
    totalVoters: 0, 
    votesByCategory: { presidential: 0, congress: 0, district: 0 } 
  });
  const [topCandidates, setTopCandidates] = useState<{ 
    presidential: Candidate[], 
    congress: Candidate[], 
    district: Candidate[] 
  }>({
    presidential: [],
    congress: [],
    district: [],
  });

  // Estados para el modal de edición/creación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    party: "",
    category: "presidential" as "presidential" | "congress" | "district",
    enabled: true,
    description: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    initializeStorage();
    initializeCategories();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = () => {
    setCandidates(getCandidates());
    setStats(getVoteStats());
    setTopCandidates({
      presidential: getTopCandidates('presidential', 3),
      congress: getTopCandidates('congress', 3),
      district: getTopCandidates('district', 3),
    });
  };

  const handleDeleteCandidate = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este candidato?")) {
      deleteCandidate(id);
      loadData();
      toast.success("Candidato eliminado");
    }
  };

  const handleToggleCandidate = (candidate: Candidate) => {
    updateCandidate(candidate.id, { ...candidate, enabled: !candidate.enabled });
    loadData();
    toast.success(candidate.enabled ? "Candidato deshabilitado" : "Candidato habilitado");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("La imagen no debe superar los 2MB");
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error("Por favor selecciona una imagen válida");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData({ ...formData, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setFormData({ ...formData, image: "" });
  };

  const handleOpenModal = (candidate?: Candidate) => {
    if (candidate) {
      setEditingCandidate(candidate);
      setFormData({
        name: candidate.name,
        party: candidate.party,
        category: candidate.category,
        enabled: candidate.enabled ?? true,
        description: candidate.description ?? "",
        image: candidate.image ?? "",
      });
      setImagePreview(candidate.image ?? "");
    } else {
      setEditingCandidate(null);
      setFormData({
        name: "",
        party: "",
        category: "presidential",
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
    setEditingCandidate(null);
    setFormData({
      name: "",
      party: "",
      category: "presidential",
      enabled: true,
      description: "",
      image: "",
    });
    setImagePreview("");
  };

  const handleSaveCandidate = () => {
    if (!formData.name.trim() || !formData.party.trim()) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    if (editingCandidate) {
      updateCandidate(editingCandidate.id, {
        ...editingCandidate,
        name: formData.name,
        party: formData.party,
        category: formData.category,
        enabled: formData.enabled,
        description: formData.description,
        image: formData.image,
      });
      toast.success("Candidato actualizado");
    } else {
      addCandidate({
        name: formData.name,
        party: formData.party,
        category: formData.category,
        enabled: formData.enabled,
        description: formData.description,
        image: formData.image,
      });
      toast.success("Candidato agregado");
    }

    loadData();
    handleCloseModal();
  };

  const handleResetSystem = () => {
    if (confirm("⚠️ ADVERTENCIA: Esto eliminará TODOS los votos y candidatos. ¿Continuar?")) {
      resetSystem();
      loadData();
      toast.success("Sistema reiniciado");
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),rgba(255,255,255,0))]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Panel Administrativo
              </h1>
              <p className="text-muted-foreground mt-2">Sistema de gestión electoral</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>

          {/* Main Dashboard */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">
                <BarChart3 className="w-4 h-4 mr-2" />
                Resumen
              </TabsTrigger>
              <TabsTrigger value="candidates">
                <Users className="w-4 h-4 mr-2" />
                Candidatos
              </TabsTrigger>
              <TabsTrigger value="categories">
                <Folder className="w-4 h-4 mr-2" />
                Categorías
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </TabsTrigger>
              <TabsTrigger value="ml">
                <Brain className="w-4 h-4 mr-2" />
                Machine Learning
              </TabsTrigger>
            </TabsList>

            {/* TAB: Resumen */}
            <TabsContent value="overview">
              <DashboardVote 
                candidates={candidates}
                stats={stats}
                topCandidates={topCandidates}
              />
            </TabsContent>

            {/* TAB: Candidatos */}
            <TabsContent value="candidates" className="space-y-6">
              <div className="flex justify-end mb-4">
                <Button onClick={() => handleOpenModal()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Candidato
                </Button>
              </div>

              {['presidential', 'congress', 'district'].map((category) => {
                const categoryName = category === 'presidential' 
                  ? 'Presidencial' 
                  : category === 'congress' 
                  ? 'Congresistas' 
                  : 'Distrital';
                const categoryCandidates = candidates.filter(c => c.category === category);
                
                return (
                  <Card key={category} className="p-6 bg-gradient-card border-border">
                    <h3 className="text-xl font-bold mb-4">{categoryName}</h3>
                    <div className="space-y-3">
                      {categoryCandidates.length > 0 ? (
                        categoryCandidates.map((candidate) => (
                          <div
                            key={candidate.id}
                            className={`flex items-center justify-between p-4 bg-card rounded-lg border border-border transition-opacity ${
                              candidate.enabled === false ? 'opacity-50' : ''
                            }`}
                          >
                            <div className="flex items-center gap-4 flex-1">
                              {candidate.image ? (
                                <img 
                                  src={candidate.image} 
                                  alt={candidate.name}
                                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary flex-shrink-0">
                                  {candidate.name.charAt(0)}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-bold flex items-center gap-2">
                                  {candidate.name}
                                  {candidate.enabled === false && (
                                    <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded">
                                      Deshabilitado
                                    </span>
                                  )}
                                </p>
                                <p className="text-sm text-muted-foreground">{candidate.party}</p>
                                {candidate.description && (
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {candidate.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right mr-2">
                                <p className="text-2xl font-bold text-primary">{candidate.votes}</p>
                                <p className="text-xs text-muted-foreground">votos</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleCandidate(candidate)}
                                title={candidate.enabled ? "Deshabilitar" : "Habilitar"}
                              >
                                <Power className={`w-4 h-4 ${candidate.enabled !== false ? 'text-green-500' : 'text-muted-foreground'}`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenModal(candidate)}
                                title="Editar"
                              >
                                <Edit className="w-4 h-4 text-primary" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteCandidate(candidate.id)}
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          No hay candidatos en esta categoría
                        </p>
                      )}
                    </div>
                  </Card>
                );
              })}
            </TabsContent>

            {/* TAB: Categorías */}
            <TabsContent value="categories">
              <CategoriesManagement />
            </TabsContent>

            {/* TAB: Configuración */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="p-6 bg-gradient-card border-border">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Configuración del Sistema</h3>
                    <p className="text-muted-foreground">
                      Gestiona el sistema de votación y datos almacenados
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-card rounded-lg border border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold">Refrescar Datos</h4>
                          <p className="text-sm text-muted-foreground">
                            Actualiza las estadísticas y conteos del sistema
                          </p>
                        </div>
                        <Button onClick={loadData}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Refrescar
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-destructive">Reiniciar Sistema</h4>
                          <p className="text-sm text-muted-foreground">
                            Elimina TODOS los votos y restablece candidatos por defecto
                          </p>
                        </div>
                        <Button variant="destructive" onClick={handleResetSystem}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Reiniciar
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-card rounded-lg border border-border">
                      <h4 className="font-bold mb-2">Estado de localStorage</h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-muted-foreground">Total Candidatos:</span>{" "}
                          <span className="font-bold">{candidates.length}</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Candidatos Habilitados:</span>{" "}
                          <span className="font-bold">{candidates.filter(c => c.enabled !== false).length}</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Total Votantes:</span>{" "}
                          <span className="font-bold">{stats.totalVoters}</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Total Votos:</span>{" "}
                          <span className="font-bold">{stats.totalVotes}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* TAB: Machine Learning */}
            <TabsContent value="ml" className="space-y-6">
              <Card className="p-6 bg-gradient-card border-border">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Pipeline de Machine Learning</h3>
                    <p className="text-muted-foreground">
                      Gestiona modelos de predicción, análisis de tendencias y detección de anomalías en el sistema electoral.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Link to="/upload" className="block group">
                      <Card className="p-6 bg-card border-border hover:border-primary transition-all duration-300">
                        <div className="space-y-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Brain className="w-6 h-6 text-primary" />
                          </div>
                          <h4 className="font-bold">Cargar Datos</h4>
                          <p className="text-sm text-muted-foreground">
                            Importa datasets para análisis predictivo
                          </p>
                        </div>
                      </Card>
                    </Link>

                    <Link to="/clean" className="block group">
                      <Card className="p-6 bg-card border-border hover:border-primary transition-all duration-300">
                        <div className="space-y-3">
                          <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                            <Settings className="w-6 h-6 text-accent" />
                          </div>
                          <h4 className="font-bold">Limpiar Datos</h4>
                          <p className="text-sm text-muted-foreground">
                            Procesa y normaliza información
                          </p>
                        </div>
                      </Card>
                    </Link>

                    <Link to="/train" className="block group">
                      <Card className="p-6 bg-card border-border hover:border-primary transition-all duration-300">
                        <div className="space-y-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Brain className="w-6 h-6 text-primary" />
                          </div>
                          <h4 className="font-bold">Entrenar Modelos</h4>
                          <p className="text-sm text-muted-foreground">
                            Configura algoritmos de ML
                          </p>
                        </div>
                      </Card>
                    </Link>

                    <Link to="/results" className="block group">
                      <Card className="p-6 bg-card border-border hover:border-primary transition-all duration-300">
                        <div className="space-y-3">
                          <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-accent" />
                          </div>
                          <h4 className="font-bold">Ver Resultados</h4>
                          <p className="text-sm text-muted-foreground">
                            Analiza métricas y predicciones
                          </p>
                        </div>
                      </Card>
                    </Link>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modal de Edición/Creación de Candidato */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 bg-card border-border max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">
              {editingCandidate ? "Editar Candidato" : "Agregar Candidato"}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Foto del Candidato</label>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-full border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-background">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex gap-2">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">
                          {imagePreview ? "Cambiar" : "Subir"} Imagen
                        </span>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>

                    {imagePreview && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveImage}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Formatos: JPG, PNG, GIF (máx. 2MB)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nombre del candidato"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Partido</label>
                <input
                  type="text"
                  value={formData.party}
                  onChange={(e) => setFormData({ ...formData, party: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Partido político"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Propuestas y descripción del candidato"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as "presidential" | "congress" | "district" })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="presidential">Presidencial</option>
                  <option value="congress">Congresistas</option>
                  <option value="district">Distrital</option>
                </select>
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
                  Candidato habilitado
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={handleCloseModal} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleSaveCandidate} className="flex-1">
                  {editingCandidate ? "Guardar Cambios" : "Agregar"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminView;