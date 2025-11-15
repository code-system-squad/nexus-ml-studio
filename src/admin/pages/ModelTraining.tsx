import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Brain, Settings, Play, Vote, CheckCircle, AlertCircle } from "lucide-react";
import { useData, type TrainingResults, type DataRow } from "@/contexts/DataContext";
import { getCandidates, registerVote, getVoter } from "@/lib/storage";

interface VoteProcessingResult {
  processedVotes: number;
  duplicates: number;
  errors: number;
  errorDetails: string[];
  votesByCategory: {
    presidential: number;
    congress: number;
    district: number;
  };
}

const ModelTraining = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cleanedData, setTrainingConfig, setTrainingResults } = useData();
  
  const [framework, setFramework] = useState("sklearn");
  const [modelType, setModelType] = useState("random_forest");
  const [epochs, setEpochs] = useState([50]);
  const [batchSize, setBatchSize] = useState([32]);
  const [learningRate, setLearningRate] = useState("0.001");
  const [trainSplit, setTrainSplit] = useState("80");
  const [testSplit, setTestSplit] = useState("20");
  const [isTraining, setIsTraining] = useState(false);
  const [trainingStage, setTrainingStage] = useState("");
  const [voteResults, setVoteResults] = useState<VoteProcessingResult | null>(null);

  // Redirigir si no hay datos limpios
  useEffect(() => {
    if (!cleanedData || cleanedData.length === 0) {
      toast({
        title: "No hay datos",
        description: "Por favor, completa los pasos anteriores primero",
        variant: "destructive",
      });
      navigate("/clean");
    }
  }, [cleanedData, navigate, toast]);

  // Función para procesar y registrar votos en el sistema electoral
  const processVotes = async (data: DataRow[]): Promise<VoteProcessingResult> => {
    const result: VoteProcessingResult = {
      processedVotes: 0,
      duplicates: 0,
      errors: 0,
      errorDetails: [],
      votesByCategory: {
        presidential: 0,
        congress: 0,
        district: 0,
      }
    };

    const candidates = getCandidates();

    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      // Extraer datos (soporta diferentes nombres de columnas)
      const dni = String(row.dni || row.documento || row.votante_dni || '').trim();
      const categoria = String(row.categoria || row.category || row.tipo_voto || '').toLowerCase();
      const candidatoNombre = String(row.candidato || row.nombre_candidato || row.candidate || '').trim();

      // Validar datos requeridos
      if (!dni || !categoria || !candidatoNombre) {
        result.errors++;
        result.errorDetails.push(`Fila ${i + 1}: Datos incompletos`);
        continue;
      }

      // Normalizar categoría
      let categoryNormalized = '';
      if (categoria.includes('presid')) {
        categoryNormalized = 'presidential';
      } else if (categoria.includes('congres')) {
        categoryNormalized = 'congress';
      } else if (categoria.includes('distrit')) {
        categoryNormalized = 'district';
      } else {
        result.errors++;
        result.errorDetails.push(`Fila ${i + 1}: Categoría inválida "${categoria}"`);
        continue;
      }

      // Verificar si ya votó en esta categoría
      const voter = getVoter(dni);
      if (voter && voter.votedCategories.includes(categoryNormalized)) {
        result.duplicates++;
        continue;
      }

      // Buscar candidato por nombre
      const candidate = candidates.find(c => 
        c.name.toLowerCase() === candidatoNombre.toLowerCase() && 
        c.category === categoryNormalized &&
        c.enabled !== false
      );

      if (!candidate) {
        result.errors++;
        result.errorDetails.push(`Fila ${i + 1}: Candidato "${candidatoNombre}" no encontrado o deshabilitado en ${categoryNormalized}`);
        continue;
      }

      // Registrar voto
      try {
        registerVote(dni, categoryNormalized, candidate.id);
        result.processedVotes++;
        result.votesByCategory[categoryNormalized as keyof typeof result.votesByCategory]++;
      } catch (error) {
        result.errors++;
        result.errorDetails.push(`Fila ${i + 1}: Error al registrar voto - ${error}`);
      }

      // Pequeña pausa cada 10 votos para mostrar progreso
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

    return result;
  };

  const simulateTraining = async (votingResults: VoteProcessingResult): Promise<TrainingResults> => {
    return new Promise((resolve) => {
      const totalEpochs = epochs[0];
      const dataSize = cleanedData?.length || 100;
      
      // Métricas basadas en el éxito del procesamiento de votos
      const successRate = votingResults.processedVotes / (cleanedData?.length || 1);
      const baseAccuracy = 75 + (successRate * 20); // Entre 75% y 95%
      
      const history = [];
      const numSteps = Math.min(5, Math.ceil(totalEpochs / 10));
      const stepSize = Math.floor(totalEpochs / numSteps);
      
      for (let i = 1; i <= numSteps; i++) {
        const epoch = i === numSteps ? totalEpochs : i * stepSize;
        const progress = i / numSteps;
        
        const loss = 0.5 - (progress * 0.42) + (Math.random() * 0.05);
        const valLoss = loss + 0.05 + (Math.random() * 0.05);
        
        const accuracy = baseAccuracy + (progress * 10) + (Math.random() * 2);
        const valAccuracy = accuracy - 2 + (Math.random() * 3);
        
        history.push({
          epoch,
          loss: Math.max(0.08, loss),
          accuracy: Math.min(95, accuracy),
          valLoss: Math.max(0.12, valLoss),
          valAccuracy: Math.min(94, valAccuracy),
        });
      }

      const finalAccuracy = history[history.length - 1].valAccuracy;
      const precision = finalAccuracy - 2 + (Math.random() * 3);
      const recall = finalAccuracy - 3 + (Math.random() * 4);
      const f1Score = (2 * precision * recall) / (precision + recall);

      const timePerEpoch = Math.ceil(dataSize / 100);
      const totalSeconds = timePerEpoch * totalEpochs;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const trainingTime = `${minutes}m ${seconds}s`;

      const results: TrainingResults = {
        metrics: {
          accuracy: parseFloat(finalAccuracy.toFixed(1)),
          precision: parseFloat(precision.toFixed(1)),
          recall: parseFloat(recall.toFixed(1)),
          f1Score: parseFloat(f1Score.toFixed(1)),
        },
        trainingHistory: history,
        trainingTime,
      };

      setTimeout(() => resolve(results), 2000);
    });
  };

  const handleTrain = async () => {
    if (!cleanedData) {
      toast({
        title: "Error",
        description: "No hay datos para entrenar",
        variant: "destructive",
      });
      return;
    }

    // Guardar configuración
    const config = {
      framework,
      modelType,
      epochs: epochs[0],
      batchSize: batchSize[0],
      learningRate,
      trainSplit: parseInt(trainSplit),
      testSplit: parseInt(testSplit),
    };
    setTrainingConfig(config);

    setIsTraining(true);
    
    try {
      // ETAPA 1: Procesamiento y registro de votos
      setTrainingStage("Procesando y registrando votos en el sistema...");
      toast({
        title: "Iniciando procesamiento",
        description: `Registrando ${cleanedData.length} votos en el sistema electoral...`,
      });
      
      const votingResults = await processVotes(cleanedData);
      setVoteResults(votingResults);

      if (votingResults.processedVotes > 0) {
        toast({
          title: "✅ Votos registrados",
          description: `${votingResults.processedVotes} votos agregados al sistema`,
        });
      }

      if (votingResults.duplicates > 0) {
        toast({
          title: "⚠️ Votos duplicados",
          description: `${votingResults.duplicates} votos duplicados fueron ignorados`,
        });
      }

      if (votingResults.errors > 0) {
        toast({
          title: "⚠️ Errores encontrados",
          description: `${votingResults.errors} errores durante el procesamiento`,
          variant: "destructive",
        });
      }

      // ETAPA 2: Entrenamiento del modelo
      setTrainingStage("Entrenando modelo de Machine Learning...");
      toast({
        title: "Entrenando modelo",
        description: `Modelo ${modelType.replace('_', ' ')} con ${votingResults.processedVotes} votos válidos...`,
      });
      
      const results = await simulateTraining(votingResults);
      setTrainingResults(results);
      
      toast({
        title: "🎉 Proceso completado",
        description: `Modelo entrenado exitosamente. Accuracy: ${results.metrics.accuracy}%`,
      });
      
      navigate("/results");
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema durante el procesamiento",
        variant: "destructive",
      });
    } finally {
      setIsTraining(false);
      setTrainingStage("");
    }
  };

  if (!cleanedData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Entrenar Modelo
          </h1>
          <p className="text-muted-foreground mt-2">
            Procesa votos y entrena el modelo con {cleanedData.length.toLocaleString()} registros
          </p>
        </div>

        {/* Mostrar resultados del procesamiento de votos si está disponible */}
        {voteResults && (
          <Card className="border-border bg-gradient-card border-green-500/30">
            <CardHeader>
              <CardTitle className="flex items-center text-green-500">
                <Vote className="w-5 h-5 mr-2" />
                Resultados del Procesamiento de Votos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-green-500/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Procesados</span>
                  </div>
                  <p className="text-2xl font-bold text-green-500">{voteResults.processedVotes}</p>
                </div>
                <div className="p-4 bg-yellow-500/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">Duplicados</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-500">{voteResults.duplicates}</p>
                </div>
                <div className="p-4 bg-red-500/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">Errores</span>
                  </div>
                  <p className="text-2xl font-bold text-red-500">{voteResults.errors}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Votos por Categoría:</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-card rounded text-center">
                    <p className="text-xs text-muted-foreground">Presidencial</p>
                    <p className="text-lg font-bold text-primary">{voteResults.votesByCategory.presidential}</p>
                  </div>
                  <div className="p-2 bg-card rounded text-center">
                    <p className="text-xs text-muted-foreground">Congresistas</p>
                    <p className="text-lg font-bold text-primary">{voteResults.votesByCategory.congress}</p>
                  </div>
                  <div className="p-2 bg-card rounded text-center">
                    <p className="text-xs text-muted-foreground">Distrital</p>
                    <p className="text-lg font-bold text-primary">{voteResults.votesByCategory.district}</p>
                  </div>
                </div>
              </div>

              {voteResults.errorDetails.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-500">Errores Detectados:</p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {voteResults.errorDetails.slice(0, 5).map((error, index) => (
                      <p key={index} className="text-xs bg-red-500/10 p-2 rounded">
                        {error}
                      </p>
                    ))}
                    {voteResults.errorDetails.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center">
                        ... y {voteResults.errorDetails.length - 5} errores más
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Estado de entrenamiento */}
        {isTraining && (
          <Card className="border-border bg-gradient-card border-primary/30">
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <div>
                  <p className="font-medium">{trainingStage}</p>
                  <p className="text-sm text-muted-foreground">Por favor espera...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-border bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-primary" />
              Selección de Framework
            </CardTitle>
            <CardDescription>
              Elige el framework para entrenar tu modelo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Framework</Label>
              <Select value={framework} onValueChange={setFramework} disabled={isTraining}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sklearn">Scikit-learn</SelectItem>
                  <SelectItem value="pytorch">PyTorch</SelectItem>
                  <SelectItem value="tensorflow">TensorFlow</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Modelo</Label>
              <Select value={modelType} onValueChange={setModelType} disabled={isTraining}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un modelo" />
                </SelectTrigger>
                <SelectContent>
                  {framework === "sklearn" && (
                    <>
                      <SelectItem value="random_forest">Random Forest</SelectItem>
                      <SelectItem value="svm">Support Vector Machine</SelectItem>
                      <SelectItem value="logistic">Logistic Regression</SelectItem>
                      <SelectItem value="gradient_boost">Gradient Boosting</SelectItem>
                    </>
                  )}
                  {framework === "pytorch" && (
                    <>
                      <SelectItem value="mlp">Multi-Layer Perceptron</SelectItem>
                      <SelectItem value="cnn">Convolutional Neural Network</SelectItem>
                      <SelectItem value="rnn">Recurrent Neural Network</SelectItem>
                      <SelectItem value="transformer">Transformer</SelectItem>
                    </>
                  )}
                  {framework === "tensorflow" && (
                    <>
                      <SelectItem value="sequential">Sequential Model</SelectItem>
                      <SelectItem value="functional">Functional API</SelectItem>
                      <SelectItem value="keras">Keras Model</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2 text-accent" />
              Hiperparámetros
            </CardTitle>
            <CardDescription>
              Ajusta los parámetros de entrenamiento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Épocas</Label>
                <span className="text-sm text-muted-foreground">{epochs[0]}</span>
              </div>
              <Slider
                value={epochs}
                onValueChange={setEpochs}
                min={10}
                max={200}
                step={10}
                className="w-full"
                disabled={isTraining}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Batch Size</Label>
                <span className="text-sm text-muted-foreground">{batchSize[0]}</span>
              </div>
              <Slider
                value={batchSize}
                onValueChange={setBatchSize}
                min={8}
                max={128}
                step={8}
                className="w-full"
                disabled={isTraining}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="learning-rate">Learning Rate</Label>
              <Input
                id="learning-rate"
                type="number"
                step="0.0001"
                value={learningRate}
                onChange={(e) => setLearningRate(e.target.value)}
                placeholder="0.001"
                disabled={isTraining}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="train-split">Train Split (%)</Label>
                <Input 
                  id="train-split" 
                  type="number" 
                  value={trainSplit}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setTrainSplit(e.target.value);
                    setTestSplit((100 - val).toString());
                  }}
                  disabled={isTraining}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-split">Test Split (%)</Label>
                <Input 
                  id="test-split" 
                  type="number" 
                  value={testSplit}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setTestSplit(e.target.value);
                    setTrainSplit((100 - val).toString());
                  }}
                  disabled={isTraining}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/clean")} disabled={isTraining}>
            Volver
          </Button>
          <Button size="lg" onClick={handleTrain} className="shadow-glow" disabled={isTraining}>
            <Play className="w-4 h-4 mr-2" />
            {isTraining ? "Procesando..." : "Procesar Votos y Entrenar"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModelTraining;