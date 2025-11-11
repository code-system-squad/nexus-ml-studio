import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface LoginUserProps {
  onLoginSuccess: (dni: string) => void;
}

const LoginUser = ({ onLoginSuccess }: LoginUserProps) => {
  const navigate = useNavigate();
  const [dni, setDni] = useState("");

  const handleDniSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dni.length === 8) {
      onLoginSuccess(dni);
      toast.success("Acceso autorizado");
    } else {
      toast.error("DNI inválido. Debe contener 8 dígitos");
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
        <Card className="p-8 bg-gradient-to-br from-neutral-900/95 to-neutral-950/95 backdrop-blur-xl rounded-3xl border border-neutral-800" style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <div className="space-y-6">
            {/* Icono y título */}
            <div className="text-center space-y-4">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-2xl bg-red-500/40 blur-2xl" />
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-2xl">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    className="w-10 h-10"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="white" strokeWidth="2" fill="none"/>
                    <path d="M8 10h8M8 14h5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="16" cy="8" r="1.5" fill="white"/>
                  </svg>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Ingreso de Votante
              </h2>
              <p className="text-neutral-400 text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Ingresa tu DNI para continuar con el proceso de votación
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleDniSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label 
                  htmlFor="dni" 
                  className="text-neutral-300 text-sm font-medium flex items-center gap-2" 
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  <span className="text-red-500 text-xs">●</span>
                  Documento Nacional de Identidad
                </Label>
                <Input
                  id="dni"
                  type="text"
                  placeholder="1 2 3 4 5 6 7 8"
                  value={dni.split('').join(' ')}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, '');
                    if (numericValue.length <= 8) {
                      setDni(numericValue);
                    }
                  }}
                  className="text-center text-base tracking-[0.75em] bg-transparent border-neutral-700 text-neutral-400 placeholder:text-neutral-700 focus:border-neutral-600 focus:ring-0 rounded-xl h-14 transition-all duration-300"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                />
              </div>

              {/* Mensaje de seguridad */}
              <div className="flex items-start gap-3 p-3 bg-transparent rounded-xl border border-neutral-800/50">
                <div className="text-yellow-500 text-sm mt-0.5">🔒</div>
                <p className="text-neutral-400 text-xs leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Tus datos están protegidos con encriptación de grado institucional
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl h-12 transition-all duration-300 hover:scale-[1.02] text-base mt-2" 
                style={{ 
                  fontFamily: 'Inter, system-ui, sans-serif',
                  boxShadow: '0 10px 40px -10px rgba(220, 38, 38, 0.6)'
                }}
                size="lg"
              >
                Ingresar al Sistema
              </Button>
            </form>

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

export default LoginUser;