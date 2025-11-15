import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Users, X, Download } from "lucide-react";
import { getCandidates, getVoteStats } from "@/lib/storage";
import { generateElectionPDF } from "@/lib/pdfExport";
import { toast } from "sonner";

interface ResultsModalProps {
  onClose: () => void;
}

export default function ResultsModal({ onClose }: ResultsModalProps) {
  const candidates = getCandidates();
  const stats = getVoteStats();

  // Obtener ganador por categoría
  const getWinner = (category: 'presidential' | 'congress' | 'district') => {
    const categoryCandidates = candidates.filter(c => c.category === category);
    if (categoryCandidates.length === 0) return null;
    
    return categoryCandidates.reduce((prev, current) => 
      current.votes > prev.votes ? current : prev
    );
  };

  // Obtener top 3 por categoría
  const getTop3 = (category: 'presidential' | 'congress' | 'district') => {
    const categoryCandidates = candidates.filter(c => c.category === category);
    return categoryCandidates
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 3);
  };

  // Calcular porcentaje
  const getPercentage = (votes: number, total: number) => {
    if (total === 0) return 0;
    return ((votes / total) * 100).toFixed(1);
  };

  const presidentialWinner = getWinner('presidential');
  const congressWinner = getWinner('congress');
  const districtWinner = getWinner('district');

  const presidentialTop3 = getTop3('presidential');
  const congressTop3 = getTop3('congress');
  const districtTop3 = getTop3('district');

  const categoryNames = {
    presidential: 'Presidencial',
    congress: 'Congresistas',
    district: 'Distrital'
  };

  // Función para generar PDF
  const handleDownloadPDF = () => {
    try {
      const participation = stats.totalVoters > 0 
        ? ((stats.totalVotes / (stats.totalVoters * 3)) * 100) 
        : 0;

      const pdfData = {
        totalVoters: stats.totalVoters,
        totalVotes: stats.totalVotes,
        participation: participation,
        presidential: presidentialTop3,
        congress: congressTop3,
        district: districtTop3
      };

      generateElectionPDF(pdfData);
      toast.success("📄 PDF generado exitosamente", {
        description: "El reporte ha sido descargado"
      });
    } catch (error) {
      toast.error("Error al generar el PDF", {
        description: "Por favor, intenta nuevamente"
      });
      console.error("Error generando PDF:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-background rounded-lg">
        <div className="sticky top-0 bg-gradient-to-b from-background to-background/95 p-6 border-b border-border backdrop-blur-sm z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                🏆 Resultados Finales
              </h2>
              <p className="text-muted-foreground mt-2">
                Ganadores de las Elecciones 2024
              </p>
            </div>
            
            <div className="flex gap-3">
              {/* Botón de descargar PDF */}
              <Button 
                onClick={handleDownloadPDF}
                className="shadow-glow bg-primary hover:bg-primary/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </Button>
              
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Estadísticas Generales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-gradient-card border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Votantes</p>
                  <p className="text-2xl font-bold">{stats.totalVoters.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Votos</p>
                  <p className="text-2xl font-bold">{stats.totalVotes.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Participación</p>
                  <p className="text-2xl font-bold">
                    {stats.totalVoters > 0 ? ((stats.totalVotes / (stats.totalVoters * 3)) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Ganadores por Categoría */}
          {['presidential', 'congress', 'district'].map((category) => {
            const cat = category as 'presidential' | 'congress' | 'district';
            const winner = cat === 'presidential' ? presidentialWinner : 
                          cat === 'congress' ? congressWinner : districtWinner;
            const top3 = cat === 'presidential' ? presidentialTop3 : 
                        cat === 'congress' ? congressTop3 : districtTop3;
            const totalVotes = stats.votesByCategory[cat];

            if (!winner) return null;

            return (
              <Card key={category} className="p-6 bg-gradient-card border-border">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{categoryNames[cat]}</h3>
                      <p className="text-sm text-muted-foreground">
                        {totalVotes.toLocaleString()} votos totales
                      </p>
                    </div>
                  </div>

                  {/* Ganador Principal */}
                  <div className="p-6 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-lg border-2 border-yellow-500/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative flex items-start gap-6">
                      {winner.image ? (
                        <img 
                          src={winner.image} 
                          alt={winner.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-yellow-500 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center text-3xl font-bold text-yellow-500 border-4 border-yellow-500 flex-shrink-0">
                          {winner.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Trophy className="w-6 h-6 text-yellow-500" />
                          <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">
                            Ganador
                          </span>
                        </div>
                        <h4 className="text-2xl font-bold mb-1">{winner.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{winner.party}</p>
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-3xl font-bold text-primary">
                              {winner.votes.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">votos</p>
                          </div>
                          <div>
                            <p className="text-3xl font-bold text-accent">
                              {getPercentage(winner.votes, totalVotes)}%
                            </p>
                            <p className="text-xs text-muted-foreground">del total</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top 3 */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Resultados Completos:</p>
                    {top3.map((candidate, index) => (
                      <div 
                        key={candidate.id}
                        className={`p-4 rounded-lg border transition-all ${
                          index === 0 
                            ? 'bg-yellow-500/5 border-yellow-500/30' 
                            : 'bg-card border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            index === 0 ? 'bg-yellow-500 text-black' :
                            index === 1 ? 'bg-gray-400 text-black' :
                            'bg-orange-700 text-white'
                          }`}>
                            {index + 1}
                          </div>
                          
                          {candidate.image ? (
                            <img 
                              src={candidate.image} 
                              alt={candidate.name}
                              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
                              {candidate.name.charAt(0)}
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <p className="font-bold truncate">{candidate.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{candidate.party}</p>
                          </div>

                          <div className="text-right">
                            <p className="text-xl font-bold text-primary">
                              {candidate.votes.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {getPercentage(candidate.votes, totalVotes)}%
                            </p>
                          </div>

                          <div className="w-24">
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all ${
                                  index === 0 ? 'bg-yellow-500' :
                                  index === 1 ? 'bg-gray-400' :
                                  'bg-orange-700'
                                }`}
                                style={{ 
                                  width: `${getPercentage(candidate.votes, totalVotes)}%` 
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Botón de cerrar */}
          <div className="flex justify-center pt-4">
            <Button size="lg" onClick={onClose} className="shadow-glow">
              Cerrar Resultados
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}