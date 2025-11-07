import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Users, MapPin, Check, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface VoteCategory {
  id: string;
  name: string;
  icon: any;
  voted: boolean;
}

const VoterView = () => {
  const navigate = useNavigate();
  const [dni, setDni] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState<VoteCategory[]>([
    { id: "presidential", name: "Presidencial", icon: Building2, voted: false },
    { id: "congress", name: "Congresistas", icon: Users, voted: false },
    { id: "district", name: "Distrital", icon: MapPin, voted: false },
  ]);

  const handleDniSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dni.length === 8) {
      setIsAuthenticated(true);
      toast.success("Acceso autorizado");
    } else {
      toast.error("DNI inválido. Debe contener 8 dígitos");
    }
  };

  const handleVote = (categoryId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, voted: true } : cat
      )
    );
    toast.success("Voto registrado exitosamente");
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
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Ingreso de Votante</h2>
              <p className="text-muted-foreground">Ingresa tu DNI para continuar</p>
            </div>

            <form onSubmit={handleDniSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dni">Documento Nacional de Identidad</Label>
                <Input
                  id="dni"
                  type="text"
                  placeholder="12345678"
                  maxLength={8}
                  value={dni}
                  onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-2xl tracking-wider"
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Ingresar al Sistema
              </Button>
            </form>
          </div>
        </Card>
      </div>
    );
  }

  const allVoted = categories.every(cat => cat.voted);

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),rgba(255,255,255,0))]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Panel de Votación
              </h1>
              <p className="text-muted-foreground mt-2">DNI: {dni}</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className={`p-6 bg-gradient-card border-border transition-all duration-300 animate-slide-up ${
                    category.voted
                      ? "border-primary shadow-glow"
                      : "hover:border-primary hover:shadow-glow"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="space-y-4">
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto ${
                      category.voted ? "bg-primary/20" : "bg-primary/10"
                    }`}>
                      {category.voted ? (
                        <Check className="w-8 h-8 text-primary" />
                      ) : (
                        <Icon className="w-8 h-8 text-primary" />
                      )}
                    </div>

                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-bold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.voted ? "Voto registrado" : "Pendiente de votación"}
                      </p>
                    </div>

                    <Button
                      className="w-full"
                      disabled={category.voted}
                      onClick={() => handleVote(category.id)}
                    >
                      {category.voted ? "Votado" : "Votar Ahora"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Summary */}
          {allVoted && (
            <Card className="p-6 bg-gradient-card border-primary shadow-glow animate-fade-in">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">¡Votación Completada!</h3>
                  <p className="text-muted-foreground mt-2">
                    Has ejercido tu derecho al voto en todas las categorías
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoterView;
