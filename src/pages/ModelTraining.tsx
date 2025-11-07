import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Brain, Settings, Play } from "lucide-react";

const ModelTraining = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [framework, setFramework] = useState("sklearn");
  const [modelType, setModelType] = useState("random_forest");
  const [epochs, setEpochs] = useState([50]);
  const [batchSize, setBatchSize] = useState([32]);
  const [learningRate, setLearningRate] = useState("0.001");

  const handleTrain = () => {
    toast({
      title: "Entrenamiento iniciado",
      description: "El modelo está siendo entrenado...",
    });
    
    setTimeout(() => {
      toast({
        title: "Entrenamiento completado",
        description: "El modelo ha sido entrenado exitosamente",
      });
      navigate("/results");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Entrenar Modelo
          </h1>
          <p className="text-muted-foreground mt-2">
            Configura y entrena tu modelo de Machine Learning
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
                <Input id="train-split" type="number" defaultValue="80" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-split">Test Split (%)</Label>
                <Input id="test-split" type="number" defaultValue="20" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/clean")}>
            Volver
          </Button>
          <Button size="lg" onClick={handleTrain} className="shadow-glow">
            <Play className="w-4 h-4 mr-2" />
            Iniciar Entrenamiento
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModelTraining;
