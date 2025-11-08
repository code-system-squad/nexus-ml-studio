import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import Index from "./pages/Index";
import VoterView from "./pages/VoterView";
import AdminView from "./pages/AdminView";
import DataUpload from "./pages/DataUpload";
import DataCleaning from "./pages/DataCleaning";
import ModelTraining from "./pages/ModelTraining";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DataProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/voter" element={<VoterView />} />
            <Route path="/admin" element={<AdminView />} />
            <Route path="/upload" element={<DataUpload />} />
            <Route path="/clean" element={<DataCleaning />} />
            <Route path="/train" element={<ModelTraining />} />
            <Route path="/results" element={<Results />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;