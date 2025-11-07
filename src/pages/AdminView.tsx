import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, ArrowLeft, Users, BarChart3, Settings, Brain, Trash2, RefreshCw } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  initializeStorage,
  getCandidates,
  getVoteStats,
  getTopCandidates,
  deleteCandidate,
  resetSystem,
  type Candidate,
} from "@/lib/storage";

const AdminView = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState({ totalVotes: 0, totalVoters: 0, votesByCategory: { presidential: 0, congress: 0, district: 0 } });
  const [topCandidates, setTopCandidates] = useState<{ presidential: Candidate[], congress: Candidate[], district: Candidate[] }>({
    presidential: [],
    congress: [],
    district: [],
  });

  useEffect(() => {
    initializeStorage();
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true);
      toast.success("Acceso autorizado");
    } else {
      toast.error("Credenciales inválidas");
    }
  };

  const handleDeleteCandidate = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este candidato?")) {
      deleteCandidate(id);
      loadData();
      toast.success("Candidato eliminado");
    }
  };

  const handleResetSystem = () => {
    if (confirm("⚠️ ADVERTENCIA: Esto eliminará TODOS los votos y candidatos. ¿Continuar?")) {
      resetSystem();
      loadData();
      toast.success("Sistema reiniciado");
    }
  };

  const participation = stats.totalVoters > 0 ? ((stats.totalVotes / (stats.totalVoters * 3)) * 100).toFixed(1) : "0";

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
        
        <Card className="relative z-10 w-full max-w-md p-8 bg-gradient-card border-border animate-fade-in">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-3xl font-bold">Panel Administrativo</h2>
              <p className="text-muted-foreground">Acceso restringido</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Iniciar Sesión
              </Button>
            </form>

            <p className="text-xs text-center text-muted-foreground">
              Demo: usuario "admin" / contraseña "admin123"
            </p>
          </div>
        </Card>
      </div>
    );
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">
                <BarChart3 className="w-4 h-4 mr-2" />
                Resumen
              </TabsTrigger>
              <TabsTrigger value="candidates">
                <Users className="w-4 h-4 mr-2" />
                Candidatos
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

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-card border-border">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total de Votos</p>
                    <p className="text-4xl font-bold text-primary">{stats.totalVotes}</p>
                    <p className="text-xs text-muted-foreground">Registrados en el sistema</p>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-card border-border">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Votantes</p>
                    <p className="text-4xl font-bold text-accent">{stats.totalVoters}</p>
                    <p className="text-xs text-muted-foreground">DNIs únicos</p>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-card border-border">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Participación</p>
                    <p className="text-4xl font-bold text-primary">{participation}%</p>
                    <p className="text-xs text-muted-foreground">Promedio en categorías</p>
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                {[
                  { title: "Presidencial", data: topCandidates.presidential },
                  { title: "Congresistas", data: topCandidates.congress },
                  { title: "Distrital", data: topCandidates.district },
                ].map((category) => {
                  const totalVotes = category.data.reduce((sum, c) => sum + c.votes, 0);
                  return (
                    <Card key={category.title} className="p-6 bg-gradient-card border-border">
                      <h3 className="text-xl font-bold mb-4">{category.title}</h3>
                      <div className="space-y-4">
                        {category.data.length > 0 ? (
                          category.data.map((candidate) => {
                            const percentage = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : "0";
                            return (
                              <div key={candidate.id} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">{candidate.name}</span>
                                  <span className="text-primary font-bold">
                                    {candidate.votes} votos ({percentage}%)
                                  </span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-primary transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-muted-foreground text-center py-4">No hay datos disponibles</p>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="candidates" className="space-y-6">
              {['presidential', 'congress', 'district'].map((category) => {
                const categoryName = category === 'presidential' ? 'Presidencial' : category === 'congress' ? 'Congresistas' : 'Distrital';
                const categoryCandidates = candidates.filter(c => c.category === category);
                
                return (
                  <Card key={category} className="p-6 bg-gradient-card border-border">
                    <h3 className="text-xl font-bold mb-4">{categoryName}</h3>
                    <div className="space-y-3">
                      {categoryCandidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          className="flex items-center justify-between p-4 bg-card rounded-lg border border-border"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                              {candidate.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold">{candidate.name}</p>
                              <p className="text-sm text-muted-foreground">{candidate.party}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">{candidate.votes}</p>
                              <p className="text-xs text-muted-foreground">votos</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteCandidate(candidate.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </TabsContent>

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
                        <p><span className="text-muted-foreground">Total Candidatos:</span> <span className="font-bold">{candidates.length}</span></p>
                        <p><span className="text-muted-foreground">Total Votantes:</span> <span className="font-bold">{stats.totalVoters}</span></p>
                        <p><span className="text-muted-foreground">Total Votos:</span> <span className="font-bold">{stats.totalVotes}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

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
    </div>
  );
};

export default AdminView;
