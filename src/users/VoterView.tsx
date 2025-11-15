import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Users, MapPin, Check, ArrowLeft, User, Folder, Lock } from "lucide-react";
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
import "./VoterView.css"; // 👈 Importar estilos separados

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
  const [isVotingClosed, setIsVotingClosed] = useState(false);

  useEffect(() => {
    initializeStorage();
    initializeCategories();
    loadCategories();
    
    // Verificar si las votaciones están cerradas
    const votingClosed = localStorage.getItem('votingClosed') === 'true';
    setIsVotingClosed(votingClosed);
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

  const handleLogout = () => {
    setIsAuthenticated(false);
    setDni("");
    setSelectedCategory(null);
    setCandidates([]);
    setCategories([]);
    toast.success("Sesión cerrada exitosamente");
    navigate('/');
  };

  const handleCategoryClick = (categoryId: string) => {
    // Verificar si las votaciones están cerradas
    if (isVotingClosed) {
      toast.error("🔒 Las votaciones han sido cerradas por el administrador");
      return;
    }

    if (hasVoted(dni, categoryId)) {
      toast.error("Ya has votado en esta categoría");
      return;
    }
    
    setSelectedCategory(categoryId);
    setCandidates(getActiveCandidatesByCategory(categoryId));
  };

  const handleVote = (candidateId: string) => {
    if (!selectedCategory) return;
    
    // Verificar si las votaciones están cerradas
    if (isVotingClosed) {
      toast.error("🔒 Las votaciones han sido cerradas. No se pueden registrar más votos.");
      setSelectedCategory(null);
      setCandidates([]);
      return;
    }
    
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
    return <LoginUser onLoginSuccess={handleLoginSuccess} />;
  }

  const allVoted = categories.every(cat => cat.voted);

  // Candidate selection modal
  if (selectedCategory && candidates.length > 0) {
    const currentCategory = categories.find(c => c.id === selectedCategory);
    
    return (
      <div className="voter-view-container">
        {/* Animated background elements */}
        <div className="animated-background">
          <div className="bg-blob bg-blob-1"></div>
          <div className="bg-blob bg-blob-2"></div>
          <div className="bg-blob bg-blob-3"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="grid-pattern"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-white voter-heading">
                  Selecciona tu Candidato
                </h1>
                <p className="text-cyan-300 mt-2 voter-text">
                  {currentCategory?.name}
                </p>
                {currentCategory?.description && (
                  <p className="text-slate-300 text-sm mt-1 voter-text">
                    {currentCategory.description}
                  </p>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSelectedCategory(null)} 
                className="back-button"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {candidates.map((candidate) => (
                <Card
                  key={candidate.id}
                  className="candidate-card"
                  onClick={() => handleVote(candidate.id)}
                >
                  <div className="space-y-4">
                    {candidate.image ? (
                      <div className="relative w-24 h-24 mx-auto">
                        <img 
                          src={candidate.image} 
                          alt={candidate.name}
                          className="candidate-image"
                        />
                      </div>
                    ) : (
                      <div className="candidate-avatar">
                        {candidate.name.charAt(0)}
                      </div>
                    )}
                    
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                        {candidate.name}
                      </h3>
                      <p className="text-sm text-slate-400">{candidate.party}</p>
                      {candidate.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 px-2">
                          {candidate.description}
                        </p>
                      )}
                    </div>
                    <Button className="vote-candidate-button">
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
    <div className="voter-view-container">
      {/* Animated background elements */}
      <div className="animated-background">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        <div className="bg-blob bg-blob-3"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="grid-pattern"></div>

      {/* Banner Superior con Machu Picchu */}
      <div className="header-banner">
        <div className="banner-bg-image" />
        <div className="banner-gradient" />
        
        {/* Patrón decorativo peruano */}
        <div className="banner-pattern">
          <div className="pattern-lines" />
        </div>
        
        {/* Contenido del banner */}
        <div className="banner-content">
          <div className="text-white space-y-2">
            <h1 className="text-5xl font-bold drop-shadow-2xl tracking-tight">
              Votaciones Electorales
            </h1>
            <p className="text-xl drop-shadow-lg opacity-95 font-light">
              Sistema de Gestión Electoral del Perú
            </p>
          </div>
          
          {/* Bandera y elementos decorativos */}
          <div className="banner-icons">
            <div className="ballot-box-icon">
              <div className="text-4xl">🗳️</div>
            </div>
            <div className="peru-flag">
              <div className="flag-stripe flag-red" />
              <div className="flag-stripe flag-white" />
              <div className="flag-stripe flag-red" />
            </div>
          </div>
        </div>
        
        {/* Botón salir */}
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="logout-button"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Salir
        </Button>
      </div>

      {/* Transición suave con degradado */}
      <div className="banner-transition" />

      {/* Banner de votaciones cerradas */}
      {isVotingClosed && (
        <div className="relative z-20 container mx-auto px-4 -mt-6 mb-6">
          <Card className="max-w-4xl mx-auto bg-destructive/10 border-destructive/30 backdrop-blur-sm shadow-2xl">
            <div className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                <Lock className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-destructive mb-1">
                  🔒 Votaciones Cerradas
                </h3>
                <p className="text-slate-300 text-sm">
                  El sistema de votación ha sido cerrado por el administrador. Ya no es posible emitir votos.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header de Sección */}
          <div className="section-header">
            {/* Decoración de papeletas flotantes */}
            <div className="floating-emoji floating-emoji-1">📝</div>
            <div className="floating-emoji floating-emoji-2">🗳️</div>
            <div className="floating-emoji floating-emoji-3">✓</div>
            
            <h2 className="text-4xl font-bold text-white">
              Módulos de Votación
            </h2>
            <p className="text-slate-300 text-base max-w-2xl mx-auto">
              {isVotingClosed 
                ? "Las votaciones han finalizado. Los resultados están siendo procesados."
                : "Seleccione el tipo de elección para acceder al sistema de votación correspondiente"}
            </p>
            <div className="dni-badge">
              <User className="w-4 h-4 text-slate-300" />
              <p className="text-white text-sm font-medium">DNI: {dni}</p>
            </div>
          </div>

          {/* Mensaje si no hay categorías activas */}
          {categories.length === 0 && (
            <Card className="empty-categories-card">
              <div className="text-center space-y-5">
                <div className="w-20 h-20 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto">
                  <Folder className="w-10 h-10 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">No hay categorías disponibles</h3>
                  <p className="text-slate-400 mt-2 max-w-md mx-auto">
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
              const isDisabled = category.voted || isVotingClosed;
              
              return (
                <Card
                  key={category.id}
                  className={`category-card ${isDisabled ? 'category-voted' : ''}`}
                  style={{ 
                    animationDelay: `${index * 0.15}s`,
                  }}
                  onClick={() => !isDisabled && handleCategoryClick(category.id)}
                >
                  <div className="space-y-6">
                    <div className={`category-icon-container ${isDisabled ? 'voted' : ''}`}>
                      {category.image ? (
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="category-image"
                          style={{ opacity: isVotingClosed ? 0.5 : 1 }}
                        />
                      ) : isVotingClosed ? (
                        <Lock className="w-24 h-24 text-destructive" />
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
                              className="checkmark-circle"
                            />
                          </svg>
                        </div>
                      ) : (
                        <Icon className="w-24 h-24 text-slate-400 transition-all duration-500 group-hover:text-red-400 group-hover:scale-110" />
                      )}
                    </div>

                    <div className="text-center space-y-3">
                      <h3 className="text-2xl font-bold text-white transition-colors duration-300 group-hover:text-red-400">
                        {category.name}
                      </h3>
                      <p className="text-base text-slate-400 line-clamp-2 min-h-[48px] px-2">
                        {category.description}
                      </p>
                      {category.voted && !isVotingClosed && (
                        <span className="voted-badge">
                          <Check className="w-4 h-4" />
                          Voto registrado
                        </span>
                      )}
                      {isVotingClosed && (
                        <span className="inline-flex items-center gap-2 bg-destructive/20 text-destructive px-3 py-1 rounded-full text-sm font-medium">
                          <Lock className="w-4 h-4" />
                          Cerrado
                        </span>
                      )}
                    </div>

                    <Button
                      className={`category-vote-button ${isDisabled ? 'voted' : ''}`}
                      disabled={isDisabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isDisabled) {
                          handleCategoryClick(category.id);
                        }
                      }}
                    >
                      {isVotingClosed 
                        ? "🔒 Cerrado" 
                        : category.voted 
                        ? "✓ Votado" 
                        : "🗳️ Acceder a Votación"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Summary */}
          {allVoted && categories.length > 0 && (
            <Card className="completion-card">
              <div className="text-center space-y-5">
                <div className="completion-icon">
                  <Check className="w-12 h-12 text-green-400" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">¡Votación Completada!</h3>
                  <p className="text-slate-300 mt-3 text-lg max-w-xl mx-auto">
                    Has ejercido tu derecho al voto en todas las categorías disponibles. Gracias por tu participación.
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