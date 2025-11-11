import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Users, BarChart3, PieChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  getCandidates,
  getVoteStats,
  type Candidate,
} from "@/lib/storage";

const COLORS = ["#7877C6", "#5E5BA8", "#4A478A", "#36336C", "#22204E"];

const StatsView = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState({
    totalVotes: 0,
    totalVoters: 0,
    votesByCategory: { presidential: 0, congress: 0, district: 0 },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setCandidates(getCandidates());
    setStats(getVoteStats());
  };

  // Preparar datos para gráfico de barras por categoría
  const categoryData = [
    { name: "Presidencial", votos: stats.votesByCategory.presidential },
    { name: "Congresistas", votos: stats.votesByCategory.congress },
    { name: "Distrital", votos: stats.votesByCategory.district },
  ];

  // Preparar datos para gráfico circular (pie) por partido
  const partyVotes = candidates.reduce((acc, candidate) => {
    if (!acc[candidate.party]) {
      acc[candidate.party] = 0;
    }
    acc[candidate.party] += candidate.votes;
    return acc;
  }, {} as Record<string, number>);

  const partyData = Object.entries(partyVotes).map(([name, value]) => ({
    name,
    value,
  }));

  // Top 10 candidatos con más votos
  const topCandidates = [...candidates]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 10)
    .map((c) => ({
      name: c.name.length > 15 ? c.name.substring(0, 15) + "..." : c.name,
      votos: c.votes,
      partido: c.party,
    }));

  // Distribución de votos por categoría (para pie chart)
  const categoryDistribution = [
    { name: "Presidencial", value: stats.votesByCategory.presidential },
    { name: "Congresistas", value: stats.votesByCategory.congress },
    { name: "Distrital", value: stats.votesByCategory.district },
  ];

  const participation =
    stats.totalVoters > 0
      ? ((stats.totalVotes / (stats.totalVoters * 3)) * 100).toFixed(1)
      : "0";

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),rgba(255,255,255,0))]" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Estadísticas y Análisis
              </h1>
              <p className="text-muted-foreground mt-2">
                Visualización avanzada de datos electorales
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/admin")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Panel
            </Button>
          </div>

          {/* Métricas Generales */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6 bg-gradient-card border-border">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Total Votos</p>
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-primary">
                  {stats.totalVotes}
                </p>
                <p className="text-xs text-muted-foreground">
                  Registrados en el sistema
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card border-border">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Votantes</p>
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <p className="text-3xl font-bold text-accent">
                  {stats.totalVoters}
                </p>
                <p className="text-xs text-muted-foreground">DNIs únicos</p>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card border-border">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Participación</p>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-primary">
                  {participation}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Promedio de categorías
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card border-border">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Candidatos</p>
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <p className="text-3xl font-bold text-accent">
                  {candidates.filter((c) => c.enabled !== false).length}
                </p>
                <p className="text-xs text-muted-foreground">Activos</p>
              </div>
            </Card>
          </div>

          {/* Gráficos Principales */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Gráfico de Barras - Votos por Categoría */}
            <Card className="p-6 bg-gradient-card border-border">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Votos por Categoría
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a2e",
                      border: "1px solid #333",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="votos" fill="#7877C6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Gráfico Circular - Distribución por Categoría */}
            <Card className="p-6 bg-gradient-card border-border">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-accent" />
                Distribución por Categoría
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a2e",
                      border: "1px solid #333",
                    }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Top 10 Candidatos */}
          <Card className="p-6 bg-gradient-card border-border">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Top 10 Candidatos Más Votados
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topCandidates} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="name" type="category" width={150} stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid #333",
                  }}
                />
                <Legend />
                <Bar dataKey="votos" fill="#7877C6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Gráfico de Votos por Partido */}
          {partyData.length > 0 && (
            <Card className="p-6 bg-gradient-card border-border">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-accent" />
                Distribución de Votos por Partido
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <RePieChart>
                  <Pie
                    data={partyData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(1)}%`
                    }
                    outerRadius={130}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {partyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a2e",
                      border: "1px solid #333",
                    }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Análisis de Participación */}
          <Card className="p-6 bg-gradient-card border-border">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Análisis de Participación
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  category: "Presidencial",
                  votes: stats.votesByCategory.presidential,
                },
                {
                  category: "Congresistas",
                  votes: stats.votesByCategory.congress,
                },
                {
                  category: "Distrital",
                  votes: stats.votesByCategory.district,
                },
              ].map((cat) => {
                const percentage =
                  stats.totalVoters > 0
                    ? ((cat.votes / stats.totalVoters) * 100).toFixed(1)
                    : "0";
                return (
                  <div
                    key={cat.category}
                    className="p-4 bg-card rounded-lg border border-border"
                  >
                    <p className="text-sm text-muted-foreground mb-2">
                      {cat.category}
                    </p>
                    <p className="text-2xl font-bold text-primary mb-2">
                      {percentage}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {cat.votes} de {stats.totalVoters} votantes
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StatsView;