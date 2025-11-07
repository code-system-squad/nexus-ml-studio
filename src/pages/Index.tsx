import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserCircle, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      
      <div className="relative z-10 w-full max-w-4xl space-y-12 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Sistema de Votación
          </h1>
          <p className="text-xl text-muted-foreground">
            Plataforma segura y transparente para ejercer tu derecho al voto
          </p>
        </div>

        {/* Access Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Voter Access */}
          <Card 
            className="p-8 bg-gradient-card border-border hover:border-primary transition-all duration-300 hover:shadow-glow cursor-pointer group"
            onClick={() => navigate('/voter')}
          >
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:animate-glow">
                <UserCircle className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Votante</h2>
                <p className="text-muted-foreground">
                  Ingresa con tu DNI para ejercer tu voto
                </p>
              </div>
              <Button 
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90"
              >
                Ingresar como Votante
              </Button>
            </div>
          </Card>

          {/* Admin Access */}
          <Card 
            className="p-8 bg-gradient-card border-border hover:border-accent transition-all duration-300 hover:shadow-glow-accent cursor-pointer group"
            onClick={() => navigate('/admin')}
          >
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto group-hover:animate-glow">
                <Shield className="w-10 h-10 text-accent" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Administrador</h2>
                <p className="text-muted-foreground">
                  Acceso al panel de control y gestión
                </p>
              </div>
              <Button 
                size="lg" 
                variant="outline"
                className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                Iniciar Sesión
              </Button>
            </div>
          </Card>
        </div>

        {/* Security Badge */}
        <div className="text-center text-sm text-muted-foreground">
          <p>🔒 Sistema protegido con encriptación de extremo a extremo</p>
        </div>
      </div>
    </div>
  );
};

export default Index;

