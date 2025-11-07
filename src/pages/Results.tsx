import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Download, TrendingUp, CheckCircle, Clock } from "lucide-react";

const Results = () => {
  const navigate = useNavigate();

  const metrics = {
    accuracy: 94.5,
    precision: 92.8,
    recall: 91.3,
    f1Score: 92.0,
  };

  const trainingHistory = [
    { epoch: 10, loss: 0.45, accuracy: 85.2, valLoss: 0.52, valAccuracy: 83.1 },
    { epoch: 20, loss: 0.32, accuracy: 89.7, valLoss: 0.38, valAccuracy: 87.5 },
    { epoch: 30, loss: 0.21, accuracy: 92.4, valLoss: 0.28, valAccuracy: 90.8 },
    { epoch: 40, loss: 0.15, accuracy: 93.9, valLoss: 0.19, valAccuracy: 92.3 },
    { epoch: 50, loss: 0.08, accuracy: 94.5, valLoss: 0.12, valAccuracy: 94.1 },
  ];

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Resultados del Modelo
            </h1>
            <p className="text-muted-foreground mt-2">
              Métricas de rendimiento y análisis del entrenamiento
            </p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Entrenamiento Completo
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border bg-gradient-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{metrics.accuracy}%</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +2.3% desde última vez
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Precision</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{metrics.precision}%</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                Excelente desempeño
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Recall</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{metrics.recall}%</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                Buena cobertura
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">F1 Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{metrics.f1Score}%</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <CheckCircle className="w-3 h-3 mr-1" />
                Modelo balanceado
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border bg-gradient-card">
          <CardHeader>
            <CardTitle>Historial de Entrenamiento</CardTitle>
            <CardDescription>
              Evolución de métricas durante el entrenamiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Época
                    </TableHead>
                    <TableHead>Loss</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Val Loss</TableHead>
                    <TableHead>Val Accuracy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainingHistory.map((row) => (
                    <TableRow key={row.epoch}>
                      <TableCell className="font-medium">{row.epoch}</TableCell>
                      <TableCell>{row.loss.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{row.accuracy}%</Badge>
                      </TableCell>
                      <TableCell>{row.valLoss.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{row.valAccuracy}%</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-card">
          <CardHeader>
            <CardTitle>Información del Modelo</CardTitle>
            <CardDescription>
              Detalles técnicos del modelo entrenado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Framework:</span>
              <span className="font-semibold">Scikit-learn</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Algoritmo:</span>
              <span className="font-semibold">Random Forest</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tiempo de entrenamiento:</span>
              <span className="font-semibold">2m 34s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dataset size:</span>
              <span className="font-semibold">10,000 filas</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/")}>
            Volver al Dashboard
          </Button>
          <div className="space-x-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar Resultados
            </Button>
            <Button onClick={() => navigate("/train")} className="shadow-glow">
              Entrenar Nuevo Modelo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
