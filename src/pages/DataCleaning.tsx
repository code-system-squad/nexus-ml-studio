import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Droplet, TrendingUp, AlertCircle } from "lucide-react";

const DataCleaning = () => {
  const navigate = useNavigate();
  const [selectedColumns, setSelectedColumns] = useState<string[]>(["age", "income", "score"]);

  // Mock data
  const mockData = [
    { id: 1, age: 25, income: 50000, score: 85.5, category: "A" },
    { id: 2, age: 32, income: 75000, score: 92.3, category: "B" },
    { id: 3, age: 28, income: 60000, score: 78.9, category: "A" },
    { id: 4, age: 45, income: 95000, score: 88.7, category: "C" },
  ];

  const columns = ["age", "income", "score", "category"];
  const stats = {
    totalRows: 10000,
    missingValues: 234,
    duplicates: 12,
    outliers: 45,
  };

  const toggleColumn = (column: string) => {
    setSelectedColumns(prev =>
      prev.includes(column) ? prev.filter(c => c !== column) : [...prev, column]
    );
  };

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
                {((stats.missingValues / stats.totalRows) * 100).toFixed(2)}% del total
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
              {columns.map((column) => (
                <div key={column} className="flex items-center space-x-2">
                  <Checkbox
                    id={column}
                    checked={selectedColumns.includes(column)}
                    onCheckedChange={() => toggleColumn(column)}
                  />
                  <Label htmlFor={column} className="cursor-pointer capitalize">
                    {column}
                  </Label>
                </div>
              ))}
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
                    <TableHead>ID</TableHead>
                    {selectedColumns.map((col) => (
                      <TableHead key={col} className="capitalize">{col}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.id}</TableCell>
                      {selectedColumns.map((col) => (
                        <TableCell key={col}>
                          {col === "category" ? (
                            <Badge variant="secondary">{row[col as keyof typeof row]}</Badge>
                          ) : (
                            row[col as keyof typeof row]
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
          <Button size="lg" onClick={() => navigate("/train")} className="shadow-glow">
            Continuar a Entrenamiento
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataCleaning;
