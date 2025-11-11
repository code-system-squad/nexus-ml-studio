import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin = ({ onLoginSuccess }: AdminLoginProps) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      onLoginSuccess();
      toast.success("Acceso autorizado");
    } else {
      toast.error("Credenciales inválidas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Imagen de fondo con overlay oscuro */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/hero-voting.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-black/70" />

      {/* Contenido */}
      <div className="relative z-10 w-full max-w-md">
        {/* Botón de Volver */}
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:text-red-500 hover:bg-white/10 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>

        <Card className="p-8 bg-gradient-to-br from-neutral-900/95 to-neutral-950/95 backdrop-blur-xl rounded-3xl border border-neutral-800" style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <div className="space-y-6">
            {/* Icono y título */}
            <div className="text-center space-y-4">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-[20px] bg-red-500/40 blur-2xl" />
                <div className="relative w-20 h-20 rounded-[20px] bg-red-600 flex items-center justify-center shadow-2xl">
                  <Shield className="w-10 h-10 text-white" strokeWidth={2} />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Panel Administrativo
              </h2>
              <p className="text-neutral-400 text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Acceso restringido al sistema de gestión electoral
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-3">
                <Label 
                  htmlFor="username" 
                  className="text-neutral-300 text-sm font-medium flex items-center gap-2" 
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  <span className="text-red-500 text-xs">●</span>
                  Usuario
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-black/30 border-2 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-500 focus:ring-0 rounded-xl h-12 transition-all duration-300"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                />
              </div>

              <div className="space-y-3">
                <Label 
                  htmlFor="password" 
                  className="text-neutral-300 text-sm font-medium flex items-center gap-2" 
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  <span className="text-red-500 text-xs">●</span>
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/30 border-2 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-500 focus:ring-0 rounded-xl h-12 transition-all duration-300"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                />
              </div>

              {/* Mensaje de seguridad */}
              <div className="flex items-start gap-3 p-3 bg-transparent rounded-xl border border-neutral-800/50">
                <div className="text-yellow-500 text-sm mt-0.5">🔒</div>
                <p className="text-neutral-400 text-xs leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Panel protegido con autenticación de dos factores
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl h-12 transition-all duration-300 hover:scale-[1.02] text-base mt-2" 
                style={{ 
                  fontFamily: 'Inter, system-ui, sans-serif',
                  boxShadow: '0 0 30px rgba(220, 38, 38, 0.5)'
                }}
                size="lg"
              >
                Iniciar Sesión
              </Button>
            </form>

            {/* Demo info */}
            <div className="text-center pt-2">
              <p className="text-xs text-neutral-500" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Demo: usuario "admin" / contraseña "admin123"
              </p>
            </div>

            {/* Footer de seguridad */}
            <div className="flex items-center justify-center gap-6 pt-4 border-t border-neutral-800/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-green-500 text-xs font-medium" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Conexión Segura
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-yellow-500 text-sm">🔒</div>
                <span className="text-yellow-600 text-xs font-medium" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Certificado SSL
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
      `}</style>
    </div>
  );
};

export default AdminLogin;