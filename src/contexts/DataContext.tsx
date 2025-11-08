import { createContext, useContext, useState, ReactNode } from 'react';

// Tipo genérico para datos tabulares (CSV, Excel, etc.)
export type DataRow = Record<string, string | number | boolean | null | undefined>;

export interface TrainingConfig {
  framework: string;
  modelType: string;
  epochs: number;
  batchSize: number;
  learningRate: string;
  trainSplit: number;
  testSplit: number;
}

export interface TrainingResults {
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
  trainingHistory: Array<{
    epoch: number;
    loss: number;
    accuracy: number;
    valLoss: number;
    valAccuracy: number;
  }>;
  trainingTime: string;
}

interface DataContextType {
  rawData: DataRow[] | null;
  setRawData: (data: DataRow[] | null) => void;
  cleanedData: DataRow[] | null;
  setCleanedData: (data: DataRow[] | null) => void;
  fileName: string | null;
  setFileName: (name: string | null) => void;
  trainingConfig: TrainingConfig | null;
  setTrainingConfig: (config: TrainingConfig | null) => void;
  trainingResults: TrainingResults | null;
  setTrainingResults: (results: TrainingResults | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [rawData, setRawData] = useState<DataRow[] | null>(null);
  const [cleanedData, setCleanedData] = useState<DataRow[] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [trainingConfig, setTrainingConfig] = useState<TrainingConfig | null>(null);
  const [trainingResults, setTrainingResults] = useState<TrainingResults | null>(null);

  return (
    <DataContext.Provider
      value={{
        rawData,
        setRawData,
        cleanedData,
        setCleanedData,
        fileName,
        setFileName,
        trainingConfig,
        setTrainingConfig,
        trainingResults,
        setTrainingResults,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};