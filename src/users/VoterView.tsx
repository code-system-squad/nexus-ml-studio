import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Users, MapPin, Check, ArrowLeft, User, Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  initializeStorage,
  initializeCategories,
  getActiveCategories,
  getActiveCandidatesByCategory,
  hasVoted, 
  registerVote,
  getVoter,
  type Candidate,
  type Category
} from "@/lib/storage";

// Mapeo de iconos por defecto
const DEFAULT_ICONS: Record<string, any> = {
  presidential: Building2,
  congress: Users,
  district: MapPin,
};

interface VoteCategory {
  id: string;
  name: string;
  description: string; // 👈 NUEVO: Agregamos descripción
  icon: any;
  voted: boolean;
}

const VoterView = () => {
  const navigate = useNavigate();
  const [dni, setDni] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState<VoteCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    initializeStorage();
    initializeCategories();
    loadCategories();
  }, []);

  // 👇 MODIFICADO: Cargar descripción de las categorías
  const loadCategories = () => {
    const activeCategories = getActiveCategories();
    const mappedCategories: VoteCategory[] = activeCategories.map(cat => ({
      id: cat.id,
      name: cat.displayName,
      description: cat.description || 'Categoría de votación', // 👈 NUEVO
      icon: DEFAULT_ICONS[cat.id] || Folder,
      voted: false,
    }));
    setCategories(mappedCategories);
  };

  useEffect(() => {
    if (isAuthenticated && dni) {
      const voter = getVoter(dni);
      if (voter) {
        setCategories(prev =>
          prev.map(cat => ({
            ...cat,
            voted: voter.votedCategories.includes(cat.id),
          }))
        );
      }
    }
  }, [isAuthenticated, dni]);

  const handleDniSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dni.length === 8) {
      setIsAuthenticated(true);
      toast.success("Acceso autorizado");
    } else {
      toast.error("DNI inválido. Debe contener 8 dígitos");
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    if (hasVoted(dni, categoryId)) {
      toast.error("Ya has votado en esta categoría");
      return;
    }
    setSelectedCategory(categoryId);
    setCandidates(getActiveCandidatesByCategory(categoryId));
  };

  const handleVote = (candidateId: string) => {
    if (!selectedCategory) return;
    
    try {
      registerVote(dni, selectedCategory, candidateId);
      
      setCategories(prev =>
        prev.map(cat =>
          cat.id === selectedCategory ? { ...cat, voted: true } : cat
        )
      );
      
      toast.success("Voto registrado exitosamente");
      setSelectedCategory(null);
      setCandidates([]);
    } catch (error) {
      toast.error("Error al registrar el voto");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0f1729]">
        {/* Fondo con imagen de Machu Picchu */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('/fondo_machu_pichu.jpg')",
            filter: "brightness(0.3) contrast(1.2)"
          }}
        />
        
        {/* Overlay gradiente para mejor legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1729]/60 via-[#1a2332]/40 to-[#0f1729]/70" />
        
        <Card className="relative z-10 w-full max-w-lg p-10 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="space-y-8 mt-6">
            <div className="text-center space-y-4">
              {/* Animación con ícono */}
              <div className="relative w-28 h-28 mx-auto">
                {/* Anillos animados de fondo */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#5b8ef5]/30 to-[#4a7ceb]/30 animate-pulse" />
                <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-[#5b8ef5]/20 to-[#4a7ceb]/20 animate-pulse" style={{ animationDelay: '0.3s' }} />
                
                {/* Contenedor del ícono */}
                <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-[#5b8ef5]/40 to-[#4a7ceb]/40 flex items-center justify-center border border-[#6ba3f5]/40 shadow-2xl shadow-[#5b8ef5]/30 backdrop-blur-sm">
                  <Building2 className="w-14 h-14 text-white animate-pulse" style={{ animationDuration: '2s' }} />
                </div>
                
                {/* Partículas flotantes */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#6ba3f5] rounded-full animate-ping" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#4a7ceb] rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              </div>

              <h2 className="text-4xl font-bold text-white tracking-tight">Ingreso de Votante</h2>
              <p className="text-white/60 text-lg">Ingresa tu DNI para continuar con el proceso de votación</p>
            </div>

            <form onSubmit={handleDniSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="dni" className="text-white/80 text-sm font-medium">Documento Nacional de Identidad</Label>
                <Input
                  id="dni"
                  type="text"
                  placeholder="12345678"
                  maxLength={8}
                  value={dni}
                  onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-3xl tracking-widest bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-[#5b8ef5] focus:ring-2 focus:ring-[#5b8ef5]/30 rounded-2xl h-16 backdrop-blur-sm transition-all"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full relative overflow-hidden bg-white/10 hover:bg-white/15 backdrop-blur-md border-2 border-white/20 hover:border-white/30 text-white font-semibold rounded-2xl h-12 shadow-2xl shadow-black/20 transition-all hover:shadow-[#5b8ef5]/50 hover:scale-[1.02] group" 
                size="lg"
              >
                {/* Efecto de brillo animado al hacer hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                
                {/* Gradiente sutil de fondo */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#5b8ef5]/20 via-[#4a7ceb]/20 to-[#5b8ef5]/20 opacity-50 group-hover:opacity-70 transition-opacity" />
                
                <span className="relative z-10 flex items-center justify-center gap-2 text-base">
                  Ingresar
                  <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </form>
          </div>
        </Card>
      </div>
    );
  }

  const allVoted = categories.every(cat => cat.voted);

  // Candidate selection modal
  if (selectedCategory && candidates.length > 0) {
    const currentCategory = categories.find(c => c.id === selectedCategory);
    
    return (
      <div className="min-h-screen relative overflow-hidden bg-[#0f1729]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('/fondo_machu_pichu.jpg')",
            filter: "brightness(0.2) contrast(1.1)"
          }}
        />
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-[#5b9cef]">
                  Selecciona tu Candidato
                </h1>
                <p className="text-[#8b9ab8] mt-2">
                  {currentCategory?.name}
                </p>
                {/* 👇 NUEVO: Mostrar descripción de la categoría */}
                {currentCategory?.description && (
                  <p className="text-[#7a8a9f] text-sm mt-1">
                    {currentCategory.description}
                  </p>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSelectedCategory(null)} 
                className="border-[#3d4a5f] bg-transparent text-white hover:bg-[#2a3441] hover:text-white hover:border-[#4a5a6f] px-5 py-2 rounded-md"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {candidates.map((candidate) => (
                <Card
                  key={candidate.id}
                  className="p-6 bg-[#1e2b3d]/95 backdrop-blur-sm border-[#2d3d52] rounded-2xl hover:border-[#5b8ef5]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#5b8ef5]/10 cursor-pointer group"
                  onClick={() => handleVote(candidate.id)}
                >
                  <div className="space-y-4">
                    {candidate.image ? (
                      <div className="relative w-24 h-24 mx-auto">
                        <img 
                          src={candidate.image} 
                          alt={candidate.name}
                          className="w-24 h-24 rounded-full object-cover border-2 border-[#4a6bb5]/30 group-hover:border-[#5b8ef5]/50 transition-all"
                        />
                        {/* Efecto de brillo al hover */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-[#5b8ef5]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-[#3d5580]/30 flex items-center justify-center mx-auto text-3xl font-bold text-[#6ba3f5] border-2 border-[#4a6bb5]/30 group-hover:border-[#5b8ef5]/50 transition-all">
                        {candidate.name.charAt(0)}
                      </div>
                    )}
                    
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-bold text-white">{candidate.name}</h3>
                      <p className="text-sm text-[#8b9ab8]">{candidate.party}</p>
                      {candidate.description && (
                        <p className="text-xs text-[#7a8a9f] line-clamp-2 px-2">
                          {candidate.description}
                        </p>
                      )}
                    </div>
                    <Button className="w-full bg-[#5b8ef5] hover:bg-[#4a7ceb] text-white font-medium rounded-xl h-11 shadow-lg transition-all">
                      Votar por {candidate.name.split(' ')[0]}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0f1729]">
      {/* Fondo con imagen de Machu Picchu */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/fondo_machu_pichu.jpg')",
          filter: "brightness(0.2) contrast(1.1)"
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-bold text-[#5b9cef]">
                Panel de Votación
              </h1>
              <p className="text-[#8b9ab8] mt-2 text-base">DNI: {dni}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')} 
              className="border-[#3d4a5f] bg-transparent text-white hover:bg-[#2a3441] hover:text-white hover:border-[#4a5a6f] px-5 py-2 rounded-md"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>

          {/* Mensaje si no hay categorías activas */}
          {categories.length === 0 && (
            <Card className="p-8 bg-[#1e2b3d]/95 backdrop-blur-sm border-[#2d3d52] rounded-2xl">
              <div className="text-center space-y-4">
                <Folder className="w-16 h-16 text-[#6ba3f5] mx-auto" />
                <div>
                  <h3 className="text-2xl font-bold text-white">No hay categorías disponibles</h3>
                  <p className="text-[#8b9ab8] mt-2">
                    Actualmente no hay categorías de votación activas. Contacta al administrador.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Categories Grid */}
          <div className="grid md:grid-cols-3 gap-6 pt-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className={`p-6 bg-[#1e2b3d]/95 backdrop-blur-sm border-[#2d3d52] rounded-2xl transition-all duration-300 ${
                    category.voted
                      ? "border-[#5b8ef5]/60 shadow-xl shadow-[#5b8ef5]/10"
                      : "hover:border-[#5b8ef5]/50 hover:shadow-xl hover:shadow-[#5b8ef5]/10 cursor-pointer"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => !category.voted && handleCategoryClick(category.id)}
                >
                  <div className="space-y-5">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto ${
                      category.voted 
                        ? "bg-[#3d5580]/40 border border-[#5b8ef5]/50" 
                        : "bg-[#3d5580]/30 border border-[#4a6bb5]/30"
                    }`}>
                      {category.voted ? (
                        <Check className="w-8 h-8 text-[#6ba3f5]" />
                      ) : (
                        <Icon className="w-8 h-8 text-[#6ba3f5]" />
                      )}
                    </div>

                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-bold text-white">{category.name}</h3>
                      {/* 👇 MODIFICADO: Mostrar descripción en lugar de estado */}
                      <p className="text-sm text-[#8b9ab8] line-clamp-2 min-h-[40px]">
                        {category.description}
                      </p>
                      {/* 👇 NUEVO: Badge de estado */}
                      {category.voted && (
                        <span className="inline-block text-xs bg-[#5b8ef5]/20 text-[#6ba3f5] px-3 py-1 rounded-full">
                          Voto registrado
                        </span>
                      )}
                    </div>

                    <Button
                      className={`w-full font-medium rounded-xl h-11 transition-all ${
                        category.voted 
                          ? "bg-slate-700 text-slate-400 cursor-not-allowed hover:bg-slate-700" 
                          : "bg-[#5b8ef5] hover:bg-[#4a7ceb] text-white shadow-lg"
                      }`}
                      disabled={category.voted}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryClick(category.id);
                      }}
                    >
                      {category.voted ? "Votado" : "Votar Ahora"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Summary */}
          {allVoted && categories.length > 0 && (
            <Card className="p-8 bg-[#1e2b3d]/95 backdrop-blur-sm border-[#5b8ef5]/60 shadow-xl shadow-[#5b8ef5]/10 rounded-2xl">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#3d5580]/40 flex items-center justify-center mx-auto border border-[#5b8ef5]/50">
                  <Check className="w-10 h-10 text-[#6ba3f5]" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-[#5b9cef]">¡Votación Completada!</h3>
                  <p className="text-[#8b9ab8] mt-2 text-lg">
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