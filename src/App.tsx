import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import Index from "./users/Welcome";
import VoterView from "./users/VoterView"; 
import AdminView from "./admin/pages/AdminView";
import DataUpload from "./admin/pages/DataUpload";
import DataCleaning from "./admin/pages/DataCleaning";
import ModelTraining from "./admin/pages/ModelTraining";
import Results from "./admin/pages/Results";
import NotFound from "./admin/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DataProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Ruta principal - Página de bienvenida */}
            <Route path="/" element={<Index />} />
            
            {/* Rutas de login */}
            <Route path="/voter-login" element={<VoterView />} />
            <Route path="/admin-login" element={<AdminView />} />
            
            {/* Rutas alternativas (mantener compatibilidad) */}
            <Route path="/voter" element={<VoterView />} />
            <Route path="/admin" element={<AdminView />} />
            
            {/* Rutas administrativas */}
            <Route path="/upload" element={<DataUpload />} />
            <Route path="/clean" element={<DataCleaning />} />
            <Route path="/train" element={<ModelTraining />} />
            <Route path="/results" element={<Results />} />
            
            {/* Ruta 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;