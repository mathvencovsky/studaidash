import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Flame, TrendingUp, TrendingDown, Minus } from "lucide-react";

// Mock ranking data
const MOCK_RANKING = [
  { id: 1, name: "Maria Silva", xp: 4850, streak: 28, trend: "up", position: 1 },
  { id: 2, name: "João Santos", xp: 4520, streak: 21, trend: "up", position: 2 },
  { id: 3, name: "Ana Costa", xp: 4200, streak: 15, trend: "same", position: 3 },
  { id: 4, name: "Pedro Lima", xp: 3890, streak: 12, trend: "down", position: 4 },
  { id: 5, name: "Você", xp: 2450, streak: 12, trend: "up", position: 5, isCurrentUser: true },
  { id: 6, name: "Lucas Oliveira", xp: 2300, streak: 8, trend: "down", position: 6 },
  { id: 7, name: "Carla Mendes", xp: 2100, streak: 5, trend: "up", position: 7 },
  { id: 8, name: "Bruno Alves", xp: 1950, streak: 3, trend: "same", position: 8 },
  { id: 9, name: "Julia Ferreira", xp: 1800, streak: 10, trend: "up", position: 9 },
  { id: 10, name: "Rafael Souza", xp: 1650, streak: 2, trend: "down", position: 10 },
];

export default function Ranking() {
  const currentUser = MOCK_RANKING.find(u => u.isCurrentUser);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getPositionBadge = (position: number) => {
    switch (position) {
      case 1:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100">
            <Trophy className="w-5 h-5 text-yellow-600" />
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
            <Medal className="w-5 h-5 text-gray-500" />
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100">
            <Medal className="w-5 h-5 text-amber-600" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
            <span className="font-semibold text-sm">{position}</span>
          </div>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Ranking</h1>
        <p className="text-muted-foreground mt-1">Veja sua posição entre os estudantes</p>
      </div>

      {/* Current User Position */}
      {currentUser && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                  {currentUser.position}º
                </div>
                <div>
                  <p className="font-semibold">Sua Posição</p>
                  <p className="text-sm text-muted-foreground">{currentUser.xp.toLocaleString()} XP</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-semibold">{currentUser.streak} dias</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ranking List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Top 10 Semanal
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {MOCK_RANKING.map((user) => (
              <div 
                key={user.id} 
                className={`flex items-center gap-3 p-4 ${user.isCurrentUser ? "bg-primary/5" : ""}`}
              >
                {getPositionBadge(user.position)}
                
                <Avatar className="w-10 h-10">
                  <AvatarFallback className={user.isCurrentUser ? "bg-primary text-primary-foreground" : ""}>
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-medium truncate ${user.isCurrentUser ? "text-primary" : ""}`}>
                      {user.name}
                    </p>
                    {user.isCurrentUser && (
                      <Badge variant="secondary" className="text-xs">Você</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{user.xp.toLocaleString()} XP</span>
                    <span>•</span>
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span>{user.streak} dias</span>
                  </div>
                </div>
                
                {getTrendIcon(user.trend)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
