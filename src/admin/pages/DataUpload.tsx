import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import type { DataRow } from "@/contexts/DataContext";
import Papa from "papaparse";

const DataUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setRawData, setFileName } = useData();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (!selectedFile.name.endsWith('.csv')) {
        toast({
          title: "Error",
          description: "Por favor, sube un archivo CSV válido",
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
      toast({
        title: "Archivo cargado",
        description: `${selectedFile.name} listo para procesar`,
      });
    }
  };

  const handleProcessData = () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Debes cargar un archivo primero",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          toast({
            title: "Error al procesar CSV",
            description: "El archivo tiene errores de formato",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }

        if (!results.data || results.data.length === 0) {
          toast({
            title: "Error",
            description: "El archivo CSV está vacío",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }

        // Type assertion para convertir unknown[] a DataRow[]
        setRawData(results.data as DataRow[]);
        
        toast({
          title: "Datos procesados",
          description: `${results.data.length} filas cargadas exitosamente`,
        });
        
        setIsProcessing(false);
        navigate("/clean");
      },
      error: (error) => {
        toast({
          title: "Error",
          description: `Error al leer el archivo: ${error.message}`,
          variant: "destructive",
        });
        setIsProcessing(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Cargar Datos
          </h1>
          <p className="text-muted-foreground mt-2">
            Importa tus datos desde CSV
          </p>
        </div>

        <Card className="border-border bg-gradient-card">
          <CardHeader>
            <CardTitle>Subir archivo CSV</CardTitle>
            <CardDescription>
              Selecciona un archivo CSV con tus datos de entrenamiento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
              {file ? (
                <FileCheck className="w-12 h-12 mx-auto mb-4 text-green-500" />
              ) : (
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              )}
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-primary font-semibold">Click para subir</span> o arrastra el archivo
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
              />
              {file && (
                <div className="mt-4">
                  <p className="text-sm text-foreground">
                    Archivo seleccionado: <span className="font-semibold">{file.name}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tamaño: {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            size="lg" 
            onClick={handleProcessData} 
            className="shadow-glow"
            disabled={!file || isProcessing}
          >
            {isProcessing ? "Procesando..." : "Continuar a Limpieza"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataUpload;