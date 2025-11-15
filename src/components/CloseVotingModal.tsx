import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, AlertTriangle, Trophy, X, CheckCircle, UnlockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface CloseVotingModalProps {
  onClose: () => void;
}

export default function CloseVotingModal({ onClose }: CloseVotingModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [showReopenConfirm, setShowReopenConfirm] = useState(false);
  const navigate = useNavigate();

  const handleCloseVoting = () => {
    if (confirmText.toUpperCase() !== "CERRAR") {
      toast.error("Debes escribir 'CERRAR' para confirmar");
      return;
    }

    setIsClosing(true);
    
    // Cerrar el sistema de votación
    localStorage.setItem('votingClosed', 'true');
    localStorage.setItem('votingClosedDate', new Date().toISOString());
    
    toast.success("🔒 Sistema de votaciones cerrado exitosamente");
    
    setTimeout(() => {
      onClose();
      toast.info("Ahora puedes ver los resultados finales", {
        action: {
          label: "Ver Resultados",
          onClick: () => navigate('/results')
        }
      });
    }, 1500);
  };

  const handleReopenVoting = () => {
    setShowReopenConfirm(true);
  };

  const confirmReopenVoting = () => {
    localStorage.removeItem('votingClosed');
    localStorage.removeItem('votingClosedDate');
    toast.success("✅ Votaciones reabiertas exitosamente", {
      description: "El sistema está listo para recibir nuevos votos"
    });
    setShowReopenConfirm(false);
    onClose();
    window.location.reload();
  };

  const isVotingClosed = localStorage.getItem('votingClosed') === 'true';
  const closedDate = localStorage.getItem('votingClosedDate');

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
        <Card className="w-full max-w-lg p-8 bg-card border-border relative animate-scale-in">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 hover:bg-destructive/10"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                isVotingClosed ? 'bg-green-500/10' : 'bg-destructive/10'
              }`}>
                {isVotingClosed ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <Lock className="w-8 h-8 text-destructive" />
                )}
              </div>
              <h2 className="text-3xl font-bold">
                {isVotingClosed ? "Votaciones Cerradas" : "Cerrar Votaciones"}
              </h2>
              <p className="text-muted-foreground">
                {isVotingClosed 
                  ? "El sistema de votación ya ha sido cerrado" 
                  : "Esta acción impedirá que los usuarios sigan votando"}
              </p>
            </div>

            {isVotingClosed ? (
              // Estado: Votaciones ya cerradas
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <p className="text-sm text-center text-muted-foreground mb-2">
                    Las votaciones fueron cerradas el:
                  </p>
                  <p className="text-center font-bold text-green-500">
                    {formatDate(closedDate)}
                  </p>
                </div>

                <div className="p-4 bg-card rounded-lg border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="font-bold">Estado del Sistema</p>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-8">
                    <li>✓ No se aceptan más votos</li>
                    <li>✓ Resultados disponibles</li>
                    <li>✓ Datos almacenados de forma segura</li>
                  </ul>
                </div>

                <div className="flex justify-center">
                  <Button 
                    onClick={handleReopenVoting}
                    variant="outline"
                    className="w-full hover:bg-primary/10"
                  >
                    Reabrir Votaciones
                  </Button>
                </div>
              </div>
            ) : (
              // Estado: Confirmar cierre
              <div className="space-y-4">
                {/* Advertencia */}
                <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <p className="font-bold text-destructive">¡Advertencia Importante!</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Los usuarios no podrán votar más</li>
                        <li>• Los resultados se harán visibles públicamente</li>
                        <li>• Esta acción es reversible desde el panel admin</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Info adicional */}
                <div className="p-4 bg-card rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong>Nota:</strong> Después de cerrar las votaciones, podrás:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 mt-2 ml-4">
                    <li>✓ Ver los resultados finales con ganadores</li>
                    <li>✓ Exportar estadísticas completas</li>
                    <li>✓ Reabrir las votaciones si es necesario</li>
                  </ul>
                </div>

                {/* Confirmación */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Escribe <span className="font-bold text-destructive">CERRAR</span> para confirmar:
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Escribe CERRAR"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-destructive text-center font-bold uppercase"
                    disabled={isClosing}
                    autoComplete="off"
                  />
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={onClose}
                    className="flex-1"
                    disabled={isClosing}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleCloseVoting}
                    className="flex-1 bg-destructive hover:bg-destructive/90 shadow-lg"
                    disabled={isClosing || confirmText.toUpperCase() !== "CERRAR"}
                  >
                    {isClosing ? (
                      <>
                        <Lock className="w-4 h-4 mr-2 animate-pulse" />
                        Cerrando...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Cerrar Votaciones
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Modal de confirmación para reabrir votaciones */}
      {showReopenConfirm && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] animate-fade-in">
          <Card className="w-full max-w-md p-6 bg-card border-border animate-scale-in">
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <UnlockKeyhole className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">¿Reabrir Votaciones?</h3>
                <p className="text-muted-foreground">
                  Los usuarios podrán votar nuevamente en todas las categorías
                </p>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Se permitirán nuevos votos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Los votos actuales se mantendrán</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Se recargará la página automáticamente</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowReopenConfirm(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={confirmReopenVoting}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <UnlockKeyhole className="w-4 h-4 mr-2" />
                  Confirmar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}