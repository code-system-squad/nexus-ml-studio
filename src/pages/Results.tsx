import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Download, TrendingUp, CheckCircle, Clock, BarChart3 } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const Results = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trainingResults, trainingConfig, cleanedData, fileName } = useData();

  // Redirigir si no hay resultados
  useEffect(() => {
    if (!trainingResults) {
      toast({
        title: "No hay resultados",
        description: "Por favor, entrena un modelo primero",
        variant: "destructive",
      });
      navigate("/train");
    }
  }, [trainingResults, navigate, toast]);

  if (!trainingResults || !trainingConfig) {
    return null;
  }

  const { metrics, trainingHistory, trainingTime } = trainingResults;

  // Formatear el nombre del modelo
  const getModelName = (modelType: string) => {
    const names: Record<string, string> = {
      'random_forest': 'Random Forest',
      'svm': 'Support Vector Machine',
      'logistic': 'Logistic Regression',
      'gradient_boost': 'Gradient Boosting',
      'mlp': 'Multi-Layer Perceptron',
      'cnn': 'Convolutional Neural Network',
      'rnn': 'Recurrent Neural Network',
      'transformer': 'Transformer',
      'sequential': 'Sequential Model',
      'functional': 'Functional API',
      'keras': 'Keras Model',
    };
    return names[modelType] || modelType;
  };

  // Formatear el nombre del framework
  const getFrameworkName = (framework: string) => {
    const names: Record<string, string> = {
      'sklearn': 'Scikit-learn',
      'pytorch': 'PyTorch',
      'tensorflow': 'TensorFlow',
    };
    return names[framework] || framework;
  };

  // Datos para el gráfico de radar (métricas)
  const metricsRadarData = [
    { metric: 'Accuracy', value: metrics.accuracy, fullMark: 100 },
    { metric: 'Precision', value: metrics.precision, fullMark: 100 },
    { metric: 'Recall', value: metrics.recall, fullMark: 100 },
    { metric: 'F1 Score', value: metrics.f1Score, fullMark: 100 },
  ];

  // Datos para el gráfico de barras comparativo
  const metricsBarData = [
    { name: 'Accuracy', valor: metrics.accuracy },
    { name: 'Precision', valor: metrics.precision },
    { name: 'Recall', valor: metrics.recall },
    { name: 'F1 Score', valor: metrics.f1Score },
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

        {/* Gráficos de métricas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                Comparación de Métricas
              </CardTitle>
              <CardDescription>
                Visualización de las métricas principales del modelo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metricsBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis domain={[0, 100]} stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="valor" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-accent" />
                Radar de Rendimiento
              </CardTitle>
              <CardDescription>
                Análisis multidimensional del modelo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={metricsRadarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="metric" stroke="#9CA3AF" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9CA3AF" />
                  <Radar 
                    name="Métricas" 
                    dataKey="value" 
                    stroke="#8B5CF6" 
                    fill="#8B5CF6" 
                    fillOpacity={0.6} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de historial de entrenamiento */}
        <Card className="border-border bg-gradient-card">
          <CardHeader>
            <CardTitle>Evolución del Entrenamiento</CardTitle>
            <CardDescription>
              Progreso de accuracy y loss durante las épocas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={trainingHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="epoch" 
                  stroke="#9CA3AF"
                  label={{ value: 'Época', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#9CA3AF"
                  label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                  domain={[0, 100]}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  stroke="#9CA3AF"
                  label={{ value: 'Loss', angle: 90, position: 'insideRight', fill: '#9CA3AF' }}
                  domain={[0, 1]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Training Accuracy"
                  dot={{ fill: '#8B5CF6', r: 4 }}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="valAccuracy" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Validation Accuracy"
                  dot={{ fill: '#10B981', r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="loss" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="Training Loss"
                  dot={{ fill: '#F59E0B', r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="valLoss" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  name="Validation Loss"
                  dot={{ fill: '#EF4444', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tabla de historial */}
        <Card className="border-border bg-gradient-card">
          <CardHeader>
            <CardTitle>Historial de Entrenamiento</CardTitle>
            <CardDescription>
              Detalle numérico de las métricas por época
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
                        <Badge variant="secondary">{row.accuracy.toFixed(1)}%</Badge>
                      </TableCell>
                      <TableCell>{row.valLoss.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{row.valAccuracy.toFixed(1)}%</Badge>
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
              <span className="font-semibold">{getFrameworkName(trainingConfig.framework)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Algoritmo:</span>
              <span className="font-semibold">{getModelName(trainingConfig.modelType)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tiempo de entrenamiento:</span>
              <span className="font-semibold">{trainingTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dataset:</span>
              <span className="font-semibold">{fileName || 'datos.csv'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tamaño del dataset:</span>
              <span className="font-semibold">{cleanedData?.length.toLocaleString()} filas</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Épocas:</span>
              <span className="font-semibold">{trainingConfig.epochs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Batch Size:</span>
              <span className="font-semibold">{trainingConfig.batchSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Learning Rate:</span>
              <span className="font-semibold">{trainingConfig.learningRate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Train/Test Split:</span>
              <span className="font-semibold">{trainingConfig.trainSplit}% / {trainingConfig.testSplit}%</span>
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