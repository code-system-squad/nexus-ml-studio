import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
} from "@/lib/storage";
import LoginUser from "./LoginUser";

// Mapeo de iconos por defecto
const DEFAULT_ICONS: Record<string, any> = {
  presidential: Building2,
  congress: Users,
  district: MapPin,
};

interface VoteCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  image?: string;
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

  const loadCategories = () => {
    const activeCategories = getActiveCategories();
    const mappedCategories: VoteCategory[] = activeCategories.map(cat => ({
      id: cat.id,
      name: cat.displayName,
      description: cat.description || 'Categoría de votación',
      icon: DEFAULT_ICONS[cat.id] || Folder,
      image: cat.image,
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

  const handleLoginSuccess = (userDni: string) => {
    setDni(userDni);
    setIsAuthenticated(true);
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

  // Si no está autenticado, mostrar el componente de login
  if (!isAuthenticated) {
    return <LoginUser onLoginSuccess={handleLoginSuccess} />;
  }

  const allVoted = categories.every(cat => cat.voted);

  // Candidate selection modal
  if (selectedCategory && candidates.length > 0) {
    const currentCategory = categories.find(c => c.id === selectedCategory);
    
    return (
      <div className="min-h-screen" style={{
        background: 'linear-gradient(180deg, #FFF6F6 0%, #F3F3F3 100%)'
      }}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-gray-800" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Selecciona tu Candidato
                </h1>
                <p className="text-gray-600 mt-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {currentCategory?.name}
                </p>
                {currentCategory?.description && (
                  <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {currentCategory.description}
                  </p>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSelectedCategory(null)} 
                className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-5 py-2 rounded-xl transition-all duration-300"
                style={{ 
                  fontFamily: 'Inter, system-ui, sans-serif',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {candidates.map((candidate) => (
                <Card
                  key={candidate.id}
                  className="p-6 bg-white rounded-2xl hover:scale-[1.03] transition-all duration-300 cursor-pointer group border border-gray-200"
                  style={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)',
                    fontFamily: 'Inter, system-ui, sans-serif'
                  }}
                  onClick={() => handleVote(candidate.id)}
                >
                  <div className="space-y-4">
                    {candidate.image ? (
                      <div className="relative w-24 h-24 mx-auto">
                        <img 
                          src={candidate.image} 
                          alt={candidate.name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 group-hover:border-red-400 transition-all duration-300"
                          style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-3xl font-bold text-gray-400 border-4 border-gray-200 group-hover:border-red-400 transition-all duration-300">
                        {candidate.name.charAt(0)}
                      </div>
                    )}
                    
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-red-700 transition-colors duration-300">
                        {candidate.name}
                      </h3>
                      <p className="text-sm text-gray-600">{candidate.party}</p>
                      {candidate.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 px-2">
                          {candidate.description}
                        </p>
                      )}
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-xl h-11 transition-all duration-300"
                      style={{ boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)' }}
                    >
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
    <div className="min-h-screen" style={{
      background: 'linear-gradient(180deg, #FFF6F6 0%, #F3F3F3 100%)',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Banner Superior con Machu Picchu */}
      <div className="relative h-56 bg-gradient-to-r from-red-600 via-red-500 to-red-600 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ 
            backgroundImage: "url('/fondo_machu_pichu.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-600/20 to-red-800/30" />
        
        {/* Patrón decorativo peruano */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)'
          }} />
        </div>
        
        {/* Contenido del banner */}
        <div className="relative z-10 h-full flex items-center justify-between px-8 max-w-7xl mx-auto">
          <div className="text-white space-y-2">
            <h1 className="text-5xl font-bold drop-shadow-2xl tracking-tight">
              Votaciones Electorales
            </h1>
            <p className="text-xl drop-shadow-lg opacity-95 font-light">
              Sistema de Gestión Electoral del Perú
            </p>
          </div>
          
          {/* Bandera y elementos decorativos */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 transition-transform duration-300 ballot-icon" style={{
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}>
              <div className="text-4xl">🗳️</div>
            </div>
            <div className="w-28 h-20 bg-white rounded-xl overflow-hidden border-4 border-white/80 hover:scale-105 transition-transform duration-300" style={{
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)'
            }}>
              <div className="h-1/3 bg-red-600" />
              <div className="h-1/3 bg-white" />
              <div className="h-1/3 bg-red-600" />
            </div>
          </div>
        </div>
        
        {/* Botón salir */}
        <Button 
          variant="outline" 
          onClick={() => navigate('/')} 
          className="absolute top-4 right-8 border-white/40 bg-white/15 backdrop-blur-md text-white hover:bg-white/25 hover:border-white/60 px-5 py-2 rounded-xl transition-all duration-300"
          style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Salir
        </Button>
      </div>

      {/* Transición suave con degradado */}
      <div className="h-8 bg-gradient-to-b from-red-600/10 to-transparent" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header de Sección */}
          <div className="text-center space-y-3 relative">
            {/* Decoración de papeletas flotantes */}
            <div className="absolute top-0 left-1/4 w-8 h-10 opacity-20 ballot-icon" style={{ animationDelay: '0s' }}>
              📝
            </div>
            <div className="absolute top-10 right-1/4 w-8 h-10 opacity-20 ballot-icon" style={{ animationDelay: '1s' }}>
              🗳️
            </div>
            <div className="absolute top-5 left-1/3 w-8 h-10 opacity-20 ballot-icon" style={{ animationDelay: '0.5s' }}>
              ✓
            </div>
            
            <h2 className="text-4xl font-bold text-gray-800">
              Módulos de Votación
            </h2>
            <p className="text-gray-600 text-base max-w-2xl mx-auto">
              Seleccione el tipo de elección para acceder al sistema de votación correspondiente
            </p>
            <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-gray-200 mt-4" style={{
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
            }}>
              <User className="w-4 h-4 text-gray-600" />
              <p className="text-gray-700 text-sm font-medium">DNI: {dni}</p>
            </div>
          </div>

          {/* Mensaje si no hay categorías activas */}
          {categories.length === 0 && (
            <Card className="p-10 bg-white rounded-2xl border border-gray-200" style={{
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
            }}>
              <div className="text-center space-y-5">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                  <Folder className="w-10 h-10 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">No hay categorías disponibles</h3>
                  <p className="text-gray-600 mt-2 max-w-md mx-auto">
                    Actualmente no hay categorías de votación activas. Contacta al administrador.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Categories Grid */}
          <div className="grid md:grid-cols-3 gap-8 pt-2 pb-12">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className={`p-8 bg-white rounded-2xl transition-all duration-500 cursor-pointer group border-2 ${
                    category.voted
                      ? "border-green-400"
                      : "border-gray-200 hover:border-red-400 hover:-translate-y-2"
                  }`}
                  style={{ 
                    animationDelay: `${index * 0.15}s`,
                    animation: 'fadeInUp 0.6s ease-out forwards',
                    opacity: 0,
                    boxShadow: category.voted 
                      ? '0 10px 40px rgba(34, 197, 94, 0.15), 0 2px 8px rgba(34, 197, 94, 0.08)'
                      : '0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
                  }}
                  onClick={() => !category.voted && handleCategoryClick(category.id)}
                  onMouseEnter={(e) => {
                    if (!category.voted) {
                      e.currentTarget.style.boxShadow = '0 20px 60px rgba(220, 38, 38, 0.15), 0 4px 12px rgba(220, 38, 38, 0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!category.voted) {
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)';
                    }
                  }}
                >
                  <div className="space-y-6">
                    <div className={`relative w-full aspect-square rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-500 ${
                      category.voted 
                        ? "bg-gradient-to-br from-green-50 to-green-100 border-4 border-green-300" 
                        : "bg-gradient-to-br from-gray-50 to-gray-100 border-4 border-gray-200 group-hover:border-red-300"
                    }`} style={{
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                    }}>
                      {category.image ? (
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : category.voted ? (
                        <div className="relative">
                          <Check className="w-24 h-24 text-green-600" />
                          <svg className="absolute inset-0 w-24 h-24" viewBox="0 0 100 100">
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="45" 
                              fill="none" 
                              stroke="#22c55e" 
                              strokeWidth="3"
                              strokeDasharray="283"
                              strokeDashoffset="0"
                              style={{
                                animation: 'checkmark 0.6s ease-in-out'
                              }}
                            />
                          </svg>
                        </div>
                      ) : (
                        <Icon className="w-24 h-24 text-gray-400 transition-all duration-500 group-hover:text-red-500 group-hover:scale-110" />
                      )}
                    </div>

                    <div className="text-center space-y-3">
                      <h3 className="text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-red-700">
                        {category.name}
                      </h3>
                      <p className="text-base text-gray-600 line-clamp-2 min-h-[48px] px-2">
                        {category.description}
                      </p>
                      {category.voted && (
                        <span className="inline-flex items-center gap-2 text-sm bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold" style={{
                          boxShadow: '0 2px 8px rgba(34, 197, 94, 0.2)'
                        }}>
                          <Check className="w-4 h-4" />
                          Voto registrado
                        </span>
                      )}
                    </div>

                    <Button
                      className={`w-full font-semibold rounded-xl h-12 text-base transition-all duration-300 ${
                        category.voted 
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                          : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white hover:scale-105 vote-glow"
                      }`}
                      style={{
                        boxShadow: category.voted ? 'none' : '0 4px 14px rgba(220, 38, 38, 0.4)'
                      }}
                      disabled={category.voted}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryClick(category.id);
                      }}
                    >
                      {category.voted ? "✓ Votado" : "🗳️ Acceder a Votación"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Summary */}
          {allVoted && categories.length > 0 && (
            <Card className="p-10 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-400" style={{
              boxShadow: '0 10px 40px rgba(34, 197, 94, 0.2), 0 2px 8px rgba(34, 197, 94, 0.1)'
            }}>
              <div className="text-center space-y-5">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mx-auto border-4 border-green-400" style={{
                  boxShadow: '0 8px 24px rgba(34, 197, 94, 0.25)'
                }}>
                  <Check className="w-12 h-12 text-green-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-800">¡Votación Completada!</h3>
                  <p className="text-gray-600 mt-3 text-lg max-w-xl mx-auto">
                    Has ejercido tu derecho al voto en todas las categorías disponibles. Gracias por tu participación.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes checkmark {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes ballot-drop {
          0% {
            transform: translateY(-100px) rotate(-10deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(220, 38, 38, 0.6);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        .ballot-icon {
          animation: float 3s ease-in-out infinite;
        }
        
        .vote-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default VoterView;