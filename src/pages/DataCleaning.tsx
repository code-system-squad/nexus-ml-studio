import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Droplet, TrendingUp, AlertCircle } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";

const DataCleaning = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { rawData, setCleanedData } = useData();
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  // Obtener las columnas disponibles del dataset
  const availableColumns = useMemo(() => {
    if (!rawData || rawData.length === 0) return [];
    return Object.keys(rawData[0]);
  }, [rawData]);

  // Inicializar columnas seleccionadas con todas las columnas disponibles
  useEffect(() => {
    if (availableColumns.length > 0 && selectedColumns.length === 0) {
      setSelectedColumns(availableColumns);
    }
  }, [availableColumns, selectedColumns.length]);

  // Calcular estadísticas del dataset
  const stats = useMemo(() => {
    if (!rawData) {
      return {
        totalRows: 0,
        missingValues: 0,
        duplicates: 0,
        outliers: 0,
      };
    }

    const totalRows = rawData.length;
    let missingValues = 0;

    // Contar valores faltantes (null, undefined, empty string)
    rawData.forEach(row => {
      Object.values(row).forEach(value => {
        if (value === null || value === undefined || value === "") {
          missingValues++;
        }
      });
    });

    // Detectar duplicados (simplificado)
    const uniqueRows = new Set(rawData.map(row => JSON.stringify(row)));
    const duplicates = totalRows - uniqueRows.size;

    return {
      totalRows,
      missingValues,
      duplicates,
      outliers: 0,
    };
  }, [rawData]);

  // Obtener primeras 5 filas para preview
  const previewData = useMemo(() => {
    if (!rawData) return [];
    return rawData.slice(0, 5);
  }, [rawData]);

  const toggleColumn = (column: string) => {
    setSelectedColumns(prev => {
      const isCurrentlySelected = prev.includes(column);
      
      if (isCurrentlySelected) {
        // Si está seleccionada, la removemos
        return prev.filter(c => c !== column);
      } else {
        // Si no está seleccionada, la agregamos
        return [...prev, column];
      }
    });
  };

  const handleContinue = () => {
    if (!rawData) {
      toast({
        title: "Error",
        description: "No hay datos para limpiar",
        variant: "destructive",
      });
      return;
    }

    if (selectedColumns.length === 0) {
      toast({
        title: "Error",
        description: "Debes seleccionar al menos una columna",
        variant: "destructive",
      });
      return;
    }

    // Filtrar datos solo con las columnas seleccionadas
    const cleaned = rawData.map(row => {
      const cleanedRow: Record<string, string | number | boolean | null | undefined> = {};
      selectedColumns.forEach(col => {
        cleanedRow[col] = row[col];
      });
      return cleanedRow;
    });

    setCleanedData(cleaned);
    
    toast({
      title: "Datos limpiados",
      description: `Dataset preparado con ${selectedColumns.length} columnas`,
    });

    navigate("/train");
  };

  // Redirigir si no hay datos
  useEffect(() => {
    if (!rawData || rawData.length === 0) {
      toast({
        title: "No hay datos",
        description: "Por favor, carga un archivo CSV primero",
        variant: "destructive",
      });
      navigate("/upload");
    }
  }, [rawData, navigate, toast]);

  if (!rawData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Limpiar Datos
          </h1>
          <p className="text-muted-foreground mt-2">
            Revisa y prepara tus datos para el entrenamiento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border bg-gradient-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Filas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRows.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                Dataset completo
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Valores Faltantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.missingValues}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <AlertCircle className="w-3 h-3 mr-1" />
                {stats.totalRows > 0 ? ((stats.missingValues / (stats.totalRows * availableColumns.length)) * 100).toFixed(2) : 0}% del total
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Duplicados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.duplicates}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <Droplet className="w-3 h-3 mr-1" />
                Para remover
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Outliers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.outliers}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <AlertCircle className="w-3 h-3 mr-1" />
                Detectados
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border bg-gradient-card">
          <CardHeader>
            <CardTitle>Selección de Columnas</CardTitle>
            <CardDescription>
              Elige las columnas que deseas incluir en el entrenamiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availableColumns.map((column) => {
                const isChecked = selectedColumns.includes(column);
                return (
                  <div key={column} className="flex items-center space-x-2">
                    <Checkbox
                      id={column}
                      checked={isChecked}
                      onCheckedChange={() => toggleColumn(column)}
                    />
                    <Label htmlFor={column} className="cursor-pointer capitalize">
                      {column}
                    </Label>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-card">
          <CardHeader>
            <CardTitle>Vista Previa de Datos</CardTitle>
            <CardDescription>
              Primeras filas del dataset limpio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    {selectedColumns.map((col) => (
                      <TableHead key={col} className="capitalize">{col}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((row, index) => (
                    <TableRow key={index}>
                      {selectedColumns.map((col) => (
                        <TableCell key={col}>
                          {typeof row[col] === 'string' && row[col] ? (
                            <Badge variant="secondary">{String(row[col])}</Badge>
                          ) : (
                            String(row[col] ?? 'N/A')
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/upload")}>
            Volver
          </Button>
          <Button size="lg" onClick={handleContinue} className="shadow-glow">
            Continuar a Entrenamiento
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataCleaning;