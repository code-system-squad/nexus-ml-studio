import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Brain, Settings, Play } from "lucide-react";
import { useData, type TrainingResults } from "@/contexts/DataContext";

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

  const simulateTraining = (): Promise<TrainingResults> => {
    return new Promise((resolve) => {
      const totalEpochs = epochs[0];
      const dataSize = cleanedData?.length || 100;
      
      // Generar métricas más realistas basadas en el dataset
      const baseAccuracy = 85 + Math.random() * 10; // Entre 85% y 95%
      const history = [];
      
      // Simular progreso del entrenamiento
      const numSteps = Math.min(5, Math.ceil(totalEpochs / 10));
      const stepSize = Math.floor(totalEpochs / numSteps);
      
      for (let i = 1; i <= numSteps; i++) {
        const epoch = i === numSteps ? totalEpochs : i * stepSize;
        const progress = i / numSteps;
        
        // Loss disminuye con el tiempo
        const loss = 0.5 - (progress * 0.42) + (Math.random() * 0.05);
        const valLoss = loss + 0.05 + (Math.random() * 0.05);
        
        // Accuracy aumenta con el tiempo
        const accuracy = 80 + (progress * 14.5) + (Math.random() * 2);
        const valAccuracy = accuracy - 2 + (Math.random() * 3);
        
        history.push({
          epoch,
          loss: Math.max(0.08, loss),
          accuracy: Math.min(95, accuracy),
          valLoss: Math.max(0.12, valLoss),
          valAccuracy: Math.min(94, valAccuracy),
        });
      }

      // Calcular métricas finales
      const finalAccuracy = history[history.length - 1].valAccuracy;
      const precision = finalAccuracy - 2 + (Math.random() * 3);
      const recall = finalAccuracy - 3 + (Math.random() * 4);
      const f1Score = (2 * precision * recall) / (precision + recall);

      // Calcular tiempo de entrenamiento basado en dataset y épocas
      const timePerEpoch = Math.ceil(dataSize / 100); // Segundos por época
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

      setTimeout(() => resolve(results), 3000);
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
    toast({
      title: "Entrenamiento iniciado",
      description: `Entrenando modelo ${modelType.replace('_', ' ')} con ${cleanedData.length} registros...`,
    });
    
    try {
      const results = await simulateTraining();
      setTrainingResults(results);
      
      toast({
        title: "Entrenamiento completado",
        description: `Modelo entrenado con éxito. Accuracy: ${results.metrics.accuracy}%`,
      });
      
      navigate("/results");
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema durante el entrenamiento",
        variant: "destructive",
      });
    } finally {
      setIsTraining(false);
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
            Configura y entrena tu modelo de Machine Learning con {cleanedData.length.toLocaleString()} registros
          </p>
        </div>

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
              <Select value={framework} onValueChange={setFramework}>
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
              <Select value={modelType} onValueChange={setModelType}>
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
            {isTraining ? "Entrenando..." : "Iniciar Entrenamiento"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModelTraining;