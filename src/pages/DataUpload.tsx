import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Database, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const DataUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dbConnection, setDbConnection] = useState({ host: "", port: "", database: "", user: "", password: "" });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast({
        title: "Archivo cargado",
        description: `${e.target.files[0].name} listo para procesar`,
      });
    }
  };

  const handleDbConnect = () => {
    // Simulated DB connection
    toast({
      title: "Conectando...",
      description: "Estableciendo conexión con la base de datos",
    });
    setTimeout(() => {
      toast({
        title: "Conexión exitosa",
        description: "Base de datos conectada correctamente",
      });
    }, 1500);
  };

  const handleProcessData = () => {
    if (!file && !dbConnection.host) {
      toast({
        title: "Error",
        description: "Debes cargar datos primero",
        variant: "destructive",
      });
      return;
    }
    navigate("/clean");
  };

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Cargar Datos
          </h1>
          <p className="text-muted-foreground mt-2">
            Importa tus datos desde CSV o conecta una base de datos externa
          </p>
        </div>

        <Tabs defaultValue="csv" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="csv">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Archivo CSV
            </TabsTrigger>
            <TabsTrigger value="database">
              <Database className="w-4 h-4 mr-2" />
              Base de Datos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="csv" className="space-y-4">
            <Card className="border-border bg-gradient-card">
              <CardHeader>
                <CardTitle>Subir archivo CSV</CardTitle>
                <CardDescription>
                  Selecciona un archivo CSV con tus datos de entrenamiento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
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
                    <p className="mt-4 text-sm text-foreground">
                      Archivo seleccionado: <span className="font-semibold">{file.name}</span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <Card className="border-border bg-gradient-card">
              <CardHeader>
                <CardTitle>Conectar Base de Datos</CardTitle>
                <CardDescription>
                  Proporciona las credenciales para conectar a tu base de datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="host">Host</Label>
                    <Input
                      id="host"
                      placeholder="localhost"
                      value={dbConnection.host}
                      onChange={(e) => setDbConnection({ ...dbConnection, host: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="port">Puerto</Label>
                    <Input
                      id="port"
                      placeholder="5432"
                      value={dbConnection.port}
                      onChange={(e) => setDbConnection({ ...dbConnection, port: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="database">Base de Datos</Label>
                  <Input
                    id="database"
                    placeholder="ml_database"
                    value={dbConnection.database}
                    onChange={(e) => setDbConnection({ ...dbConnection, database: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user">Usuario</Label>
                    <Input
                      id="user"
                      placeholder="admin"
                      value={dbConnection.user}
                      onChange={(e) => setDbConnection({ ...dbConnection, user: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={dbConnection.password}
                      onChange={(e) => setDbConnection({ ...dbConnection, password: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleDbConnect} className="w-full">
                  <Database className="w-4 h-4 mr-2" />
                  Conectar Base de Datos
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button size="lg" onClick={handleProcessData} className="shadow-glow">
            Continuar a Limpieza
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataUpload;
