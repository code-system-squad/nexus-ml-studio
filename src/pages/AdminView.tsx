import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, ArrowLeft, Users, BarChart3, Settings, Brain } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

const AdminView = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo authentication
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true);
      toast.success("Acceso autorizado");
    } else {
      toast.error("Credenciales inválidas");
    }
  };

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
                    <p className="text-4xl font-bold text-primary">1,234</p>
                    <p className="text-xs text-muted-foreground">↑ 12% vs anterior</p>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-card border-border">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Participación</p>
                    <p className="text-4xl font-bold text-accent">78.5%</p>
                    <p className="text-xs text-muted-foreground">↑ 5.2% vs anterior</p>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-card border-border">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Categorías Activas</p>
                    <p className="text-4xl font-bold text-primary">3</p>
                    <p className="text-xs text-muted-foreground">Presidencial, Congreso, Distrital</p>
                  </div>
                </Card>
              </div>

              <Card className="p-6 bg-gradient-card border-border">
                <h3 className="text-xl font-bold mb-4">Resultados en Tiempo Real</h3>
                <div className="space-y-4">
                  {["Candidato A", "Candidato B", "Candidato C"].map((name, index) => (
                    <div key={name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{name}</span>
                        <span className="text-primary font-bold">{45 - index * 10}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-primary"
                          style={{ width: `${45 - index * 10}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="candidates" className="space-y-6">
              <Card className="p-6 bg-gradient-card border-border">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">Gestión de Candidatos</h3>
                    <Button size="sm">
                      Agregar Candidato
                    </Button>
                  </div>
                  <p className="text-muted-foreground">
                    Administra la información de candidatos, categorías y propuestas electorales.
                  </p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="p-6 bg-gradient-card border-border">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Configuración del Sistema</h3>
                  <p className="text-muted-foreground">
                    Configura categorías, parámetros de votación y seguridad del sistema.
                  </p>
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
