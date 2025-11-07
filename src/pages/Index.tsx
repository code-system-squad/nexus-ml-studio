import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Upload, Droplet, Brain, BarChart3, Zap, Database } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Cargar Datos",
      description: "Importa datos desde CSV o conecta una base de datos externa",
      icon: Upload,
      color: "text-primary",
      path: "/upload",
    },
    {
      title: "Limpiar Datos",
      description: "Preprocesa y limpia tus datos para el entrenamiento",
      icon: Droplet,
      color: "text-accent",
      path: "/clean",
    },
    {
      title: "Entrenar Modelo",
      description: "Configura y entrena modelos con sklearn, PyTorch o TensorFlow",
      icon: Brain,
      color: "text-primary",
      path: "/train",
    },
    {
      title: "Ver Resultados",
      description: "Analiza métricas, precisión y rendimiento del modelo",
      icon: BarChart3,
      color: "text-accent",
      path: "/results",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-8 animate-float">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm">ML Pipeline Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent animate-slide-up">
            Sistema de Pipeline ML
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            Plataforma completa para gestionar tu flujo de trabajo de Machine Learning desde la carga de datos hasta el análisis de resultados
          </p>

          <div className="flex gap-4 justify-center animate-fade-in">
            <Button size="lg" onClick={() => navigate("/upload")} className="shadow-glow">
              <Database className="w-4 h-4 mr-2" />
              Comenzar Pipeline
            </Button>
            <Button size="lg" variant="outline">
              Ver Documentación
            </Button>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Módulos del Pipeline</h2>
          <p className="text-muted-foreground">
            Navega por cada etapa del proceso de Machine Learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module, index) => (
            <Card
              key={module.title}
              className="border-border bg-gradient-card hover:shadow-glow transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(module.path)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-muted group-hover:scale-110 transition-transform">
                    <module.icon className={`w-6 h-6 ${module.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {module.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-start group-hover:text-primary transition-colors">
                  Abrir módulo →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Características Principales</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Múltiples Fuentes</h3>
              <p className="text-sm text-muted-foreground">
                Importa datos desde CSV o conecta bases de datos externas
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg">Frameworks Populares</h3>
              <p className="text-sm text-muted-foreground">
                Soporte para sklearn, PyTorch y TensorFlow
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Análisis Detallado</h3>
              <p className="text-sm text-muted-foreground">
                Métricas completas y visualización de resultados
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
