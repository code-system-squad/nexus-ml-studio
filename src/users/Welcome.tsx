import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserCircle, Shield, Menu, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const handleVoterClick = () => {
    navigate('/voter');
  };

  const handleAdminClick = () => {
    navigate('/admin');
    setIsAdminMenuOpen(false);
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('/vote-fondo.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm" />

      {/* Header with Admin Menu */}
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
              {/* Admin Login Card */}
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

              {/* Admin Features */}
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

      {/* Main Content - Centered */}
      <main className="relative z-10 flex items-center justify-center px-4 py-8 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in">
          
          {/* Hero Content */}
          <div className="text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-full px-5 py-2 text-sm font-medium backdrop-blur-sm">
              Democracia Digital
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="block text-white mb-2">Sistema de</span>
              <span className="text-blue-400">
                Votación Electoral
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-xl mx-auto">
              Plataforma oficial segura y transparente para ejercer tu derecho al voto
            </p>
          </div>

          {/* Voter Access Card */}
          <Card className="border-slate-700/50 bg-slate-800/70 backdrop-blur-xl shadow-2xl">
            <div className="p-8 space-y-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center bg-blue-600/20 backdrop-blur-sm border border-blue-500/30">
                  <UserCircle className="w-10 h-10 text-blue-400" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">
                    Acceso de Votante
                  </h2>
                  <p className="text-base text-slate-400">
                    Ingresa con tu DNI para ejercer tu voto de manera segura
                  </p>
                </div>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base py-6"
                onClick={handleVoterClick}
              >
                Ingresar como Votante
              </Button>

              {/* Features List */}
              <div className="space-y-3 pt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-sm">Verificación de identidad segura</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-sm">Proceso simple y guiado</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-sm">Voto confidencial garantizado</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Security Badge */}
          <div className="text-center text-sm text-slate-400 bg-slate-800/40 backdrop-blur-md rounded-lg px-6 py-3 border border-slate-700/50">
            🔒 Sistema protegido con encriptación de extremo a extremo • Certificado por autoridades electorales
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;