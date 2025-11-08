import { Card } from "@/components/ui/card";
import { BarChart3, Users, TrendingUp, PieChart } from "lucide-react";
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
} from "recharts";
import type { Candidate } from "@/lib/storage";

const COLORS = ["#7877C6", "#5E5BA8", "#4A478A", "#36336C", "#22204E", "#8B89D6", "#6F6DB5"];

interface DashboardVoteProps {
  candidates: Candidate[];
  stats: {
    totalVotes: number;
    totalVoters: number;
    votesByCategory: {
      presidential: number;
      congress: number;
      district: number;
    };
  };
  topCandidates: {
    presidential: Candidate[];
    congress: Candidate[];
    district: Candidate[];
  };
}

const DashboardVote = ({ candidates, stats, topCandidates }: DashboardVoteProps) => {
  const participation =
    stats.totalVoters > 0
      ? ((stats.totalVotes / (stats.totalVoters * 3)) * 100).toFixed(1)
      : "0";

  // Preparar datos para gráfico de barras por categoría
  const categoryData = [
    { name: "Presidencial", votos: stats.votesByCategory.presidential },
    { name: "Congresistas", votos: stats.votesByCategory.congress },
    { name: "Distrital", votos: stats.votesByCategory.district },
  ];

  // Preparar datos para gráfico circular por categoría
  const categoryDistribution = categoryData.filter((c) => c.votos > 0);

  // Top 10 candidatos con más votos
  const topCandidatesOverall = [...candidates]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 10)
    .map((c) => ({
      name: c.name.length > 20 ? c.name.substring(0, 20) + "..." : c.name,
      votos: c.votes,
      partido: c.party,
    }));

  // Preparar datos para gráfico de votos por partido
  const partyVotes = candidates.reduce((acc, candidate) => {
    if (!acc[candidate.party]) {
      acc[candidate.party] = 0;
    }
    acc[candidate.party] += candidate.votes;
    return acc;
  }, {} as Record<string, number>);

  const partyData = Object.entries(partyVotes)
    .map(([name, value]) => ({ name, value }))
    .filter((p) => p.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Métricas Generales */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-card border-border">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total de Votos</p>
              <BarChart3 className="w-5 h-5 text-primary opacity-50" />
            </div>
            <p className="text-4xl font-bold text-primary">{stats.totalVotes}</p>
            <p className="text-xs text-muted-foreground">
              Registrados en el sistema
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Votantes</p>
              <Users className="w-5 h-5 text-accent opacity-50" />
            </div>
            <p className="text-4xl font-bold text-accent">{stats.totalVoters}</p>
            <p className="text-xs text-muted-foreground">DNIs únicos</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Participación</p>
              <TrendingUp className="w-5 h-5 text-primary opacity-50" />
            </div>
            <p className="text-4xl font-bold text-primary">{participation}%</p>
            <p className="text-xs text-muted-foreground">
              Promedio en categorías
            </p>
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
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a2e",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
              />
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
          {categoryDistribution.length > 0 ? (
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
                  dataKey="votos"
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
                    borderRadius: "8px",
                  }}
                />
              </RePieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No hay datos para mostrar
            </div>
          )}
        </Card>
      </div>

      {/* Top 10 Candidatos Más Votados */}
      {topCandidatesOverall.length > 0 && (
        <Card className="p-6 bg-gradient-card border-border">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Top 10 Candidatos Más Votados
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topCandidatesOverall} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
              <XAxis type="number" stroke="#888" />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
                stroke="#888"
                style={{ fontSize: "12px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a2e",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#1a1a2e] border border-[#333] rounded-lg p-3">
                        <p className="font-bold text-white">
                          {payload[0].payload.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payload[0].payload.partido}
                        </p>
                        <p className="text-primary font-bold">
                          {payload[0].value} votos
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="votos" fill="#7877C6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Distribución de Votos por Partido */}
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
                  borderRadius: "8px",
                }}
              />
            </RePieChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Resultados por Categoría */}
      <div className="space-y-6">
        {[
          { title: "Presidencial", data: topCandidates.presidential },
          { title: "Congresistas", data: topCandidates.congress },
          { title: "Distrital", data: topCandidates.district },
        ].map((category) => {
          const totalVotes = category.data.reduce((sum, c) => sum + c.votes, 0);
          return (
            <Card
              key={category.title}
              className="p-6 bg-gradient-card border-border"
            >
              <h3 className="text-xl font-bold mb-4">{category.title}</h3>
              <div className="space-y-4">
                {category.data.length > 0 ? (
                  category.data.map((candidate) => {
                    const percentage =
                      totalVotes > 0
                        ? ((candidate.votes / totalVotes) * 100).toFixed(1)
                        : "0";
                    return (
                      <div key={candidate.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{candidate.name}</span>
                          <span className="text-primary font-bold">
                            {candidate.votes} votos ({percentage}%)
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-primary transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No hay datos disponibles
                  </p>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Análisis de Participación por Categoría */}
      <Card className="p-6 bg-gradient-card border-border">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-accent" />
          Análisis de Participación por Categoría
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
                <p className="text-3xl font-bold text-primary mb-2">
                  {percentage}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {cat.votes} de {stats.totalVoters} votantes
                </p>
                <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default DashboardVote;