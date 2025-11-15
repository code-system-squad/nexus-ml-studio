import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Lock, Shield, Zap, Globe, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const Welcome = () => {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 8 + 3, // Aumentado de 4+1 a 8+3 (ahora 3-11px)
          duration: Math.random() * 20 + 15,
          delay: Math.random() * 5,
          opacity: Math.random() * 0.6 + 0.3, // Aumentado de 0.5+0.2 a 0.6+0.3 (más visibles)
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  const handleVoterClick = () => {
    console.log('Navegando a votante...');
  };

  const handleAdminClick = () => {
    console.log('Navegando a admin...');
    setIsAdminMenuOpen(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-red-950">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-30px) translateX(15px);
          }
          50% {
            transform: translateY(-60px) translateX(-15px);
          }
          75% {
            transform: translateY(-30px) translateX(10px);
          }
        }
        
        .particle {
          animation: float var(--duration) infinite ease-in-out;
          animation-delay: var(--delay);
        }

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

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        .title-animated {
          animation: fadeInUp 1s ease-out;
        }

        .title-gradient {
          background: linear-gradient(90deg, #f87171, #ef4444, #dc2626, #b91c1c, #ef4444, #f87171);
          background-size: 200% auto;
          animation: gradientShift 3s ease infinite;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle-animated {
          animation: fadeInUp 1s ease-out 0.3s backwards;
        }

        .button-animated {
          animation: fadeInUp 1s ease-out 0.6s backwards;
        }
      `}} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle absolute rounded-full bg-white"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              '--duration': `${particle.duration}s`,
              '--delay': `${particle.delay}s`,
            } as React.CSSProperties & { '--duration': string; '--delay': string }}
          />
        ))}
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '700ms'}}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1000ms'}}></div>
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <header className="relative z-20 p-4">
        <Sheet open={isAdminMenuOpen} onOpenChange={setIsAdminMenuOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="bg-slate-800/80 backdrop-blur-md border-slate-700 hover:bg-slate-700/80 hover:border-amber-500/50 transition-all text-white"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="w-80 bg-slate-800/95 backdrop-blur-xl border-slate-700"
          >
            <SheetHeader className="mb-6">
              <SheetTitle className="flex items-center gap-3 text-2xl text-white">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                  <Shield className="w-6 h-6 text-amber-500" />
                </div>
                Administrador
              </SheetTitle>
              <SheetDescription className="text-base text-slate-400">
                Panel de control y gestión del sistema electoral
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6">
              <Card className="border-slate-700 bg-slate-700/50 backdrop-blur-md">
                <div className="p-6 text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center bg-amber-500/20 border border-amber-500/30">
                    <Shield className="w-8 h-8 text-amber-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">
                      Acceso Administrativo
                    </h3>
                    <p className="text-sm text-slate-400">
                      Credenciales de seguridad requeridas
                    </p>
                  </div>
                  <Button
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold"
                    size="lg"
                    onClick={handleAdminClick}
                  >
                    Iniciar Sesión
                  </Button>
                  
                  <div className="pt-2 border-t border-slate-600">
                    <p className="text-xs text-slate-500 text-center">
                      Solo personal autorizado
                    </p>
                  </div>
                </div>
              </Card>

              <div className="space-y-3 pt-4">
                <p className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                  Funciones Administrativas
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm text-slate-400 bg-slate-700/50 rounded-lg p-3">
                    <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>Gestión de procesos electorales</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400 bg-slate-700/50 rounded-lg p-3">
                    <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>Monitoreo en tiempo real</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400 bg-slate-700/50 rounded-lg p-3">
                    <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>Reportes y auditoría</span>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="relative z-10 px-4 py-12 min-h-screen">
        <div className="w-full max-w-7xl mx-auto">
          
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-96px)]">
            
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full px-6 py-2.5 text-sm font-semibold backdrop-blur-sm shadow-lg">
                <Lock className="w-4 h-4" />
                Certificado con encriptación avanzada
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="block text-white mb-3 title-animated">Sistema de Votación</span>
                  <span className="title-gradient title-animated">
                    Digital 2030
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-300 leading-relaxed subtitle-animated">
                  Una plataforma inteligente, segura y transparente para ejercer tu derecho al voto
                </p>
              </div>

              <div className="pt-4 button-animated">
                <Button
                  className="bg-red-600 hover:bg-red-500 text-white font-bold text-lg px-10 py-7 rounded-xl shadow-2xl hover:shadow-red-500/50 transition-all transform hover:scale-105"
                  onClick={handleVoterClick}
                >
                  Ingresar como Votante →
                </Button>
                <p className="text-sm text-slate-400 mt-3">
                  Plataforma certificada con auditoría ciudadana continua
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-5 border border-slate-700/50 hover:border-red-500/30 transition-all">
                  <div className="text-3xl font-bold text-red-400 mb-1">100%</div>
                  <div className="text-xs text-slate-400">Seguro</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-5 border border-slate-700/50 hover:border-blue-500/30 transition-all">
                  <div className="text-3xl font-bold text-blue-400 mb-1">24/7</div>
                  <div className="text-xs text-slate-400">Disponible</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-5 border border-slate-700/50 hover:border-green-500/30 transition-all">
                  <div className="text-3xl font-bold text-green-400 mb-1">0</div>
                  <div className="text-xs text-slate-400">Errores</div>
                </div>
              </div>
            </div>

            <div className="relative lg:block hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
                
                <div className="relative bg-slate-800/30 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                  <img 
                    src="/hero-voting.jpg" 
                    alt="Sistema de Votación Digital" 
                    className="w-full h-auto rounded-2xl shadow-2xl"
                  />
                  
                  <div className="absolute -top-4 -right-4 bg-green-500/90 backdrop-blur-md text-white px-6 py-3 rounded-full font-bold shadow-xl border border-green-400/50">
                    ✓ Verificado
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-blue-500/90 backdrop-blur-md text-white px-6 py-3 rounded-full font-bold shadow-xl border border-blue-400/50">
                    🔒 Encriptado
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                ¿Cómo funciona el <span className="text-red-400">voto digital</span>?
              </h2>
              <p className="text-slate-400 text-lg">
                Tres simples pasos para ejercer tu derecho democrático de forma segura
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 hover:border-red-500/50 transition-all group">
                <div className="p-8 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/30 group-hover:bg-red-500/30 transition-all">
                    <Shield className="w-8 h-8 text-red-400" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-5xl font-bold text-red-500/30">01</span>
                    <h3 className="text-xl font-bold text-white">Autenticación Segura</h3>
                  </div>
                  <p className="text-slate-400">
                    Ingresa con tu DNI digital y verifica tu identidad mediante reconocimiento biométrico avanzado.
                  </p>
                </div>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 hover:border-blue-500/50 transition-all group">
                <div className="p-8 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 group-hover:bg-blue-500/30 transition-all">
                    <CheckCircle className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-5xl font-bold text-blue-500/30">02</span>
                    <h3 className="text-xl font-bold text-white">Selección Guiada</h3>
                  </div>
                  <p className="text-slate-400">
                    Navega por una interfaz intuitiva y elige a tus candidatos con información completa y verificada.
                  </p>
                </div>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 hover:border-green-500/50 transition-all group">
                <div className="p-8 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center border border-green-500/30 group-hover:bg-green-500/30 transition-all">
                    <Zap className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-5xl font-bold text-green-500/30">03</span>
                    <h3 className="text-xl font-bold text-white">Envío Cifrado</h3>
                  </div>
                  <p className="text-slate-400">
                    Tu voto se encripta y valida automáticamente, garantizando anonimato y seguridad absoluta.
                  </p>
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-20 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Ventajas del <span className="text-red-400">Voto Electrónico</span>
              </h2>
              <p className="text-slate-400 text-lg">
                Tecnología de vanguardia al servicio de la democracia moderna
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 hover:border-red-500/30 transition-all">
                <div className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
                    <Lock className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Seguridad Institucional</h3>
                  <p className="text-sm text-slate-400">
                    Encriptación de grado militar y protocolos de seguridad auditados por organismos internacionales.
                  </p>
                </div>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 hover:border-blue-500/30 transition-all">
                <div className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <Shield className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Transparencia Total</h3>
                  <p className="text-sm text-slate-400">
                    Cada voto es trazable y verificable sin comprometer el anonimato del votante.
                  </p>
                </div>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 hover:border-yellow-500/30 transition-all">
                <div className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
                    <Zap className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Rapidez Extrema</h3>
                  <p className="text-sm text-slate-400">
                    Resultados en tiempo real con conteo automático y reducción de errores humanos a cero.
                  </p>
                </div>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 hover:border-green-500/30 transition-all">
                <div className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/30">
                    <Globe className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Acceso Universal</h3>
                  <p className="text-sm text-slate-400">
                    Vota desde cualquier lugar del país o del mundo con tu dispositivo móvil o computadora.
                  </p>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50">
                <div className="text-4xl font-bold text-red-400 mb-2">Voto</div>
                <div className="text-sm text-slate-400">Seguro</div>
              </div>
              <div className="text-center p-6 bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50">
                <div className="text-4xl font-bold text-blue-400 mb-2">Proceso</div>
                <div className="text-sm text-slate-400">Transparente</div>
              </div>
              <div className="text-center p-6 bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50">
                <div className="text-4xl font-bold text-yellow-400 mb-2">Integridad</div>
                <div className="text-sm text-slate-400">Verificada</div>
              </div>
              <div className="text-center p-6 bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50">
                <div className="text-4xl font-bold text-green-400 mb-2">Sistema</div>
                <div className="text-sm text-slate-400">Auditable</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Welcome;