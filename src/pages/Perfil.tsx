import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Trophy, 
  Flame, 
  Clock, 
  BookOpen, 
  Target,
  Calendar,
  Edit
} from "lucide-react";
import { DEFAULT_USER_PROGRESS, getXPForNextLevel, getLevelProgress } from "@/data/cfa-mock-data";

export default function Perfil() {
  const userProgress = DEFAULT_USER_PROGRESS;
  const levelProgress = getLevelProgress(userProgress.xp, userProgress.level);
  const xpForNext = getXPForNextLevel(userProgress.level);
  const unlockedBadges = userProgress.badges.filter(b => b.unlocked);

  const stats = [
    { icon: Trophy, label: "XP Total", value: userProgress.xp.toLocaleString() },
    { icon: Flame, label: "Streak Atual", value: `${userProgress.streak} dias` },
    { icon: Clock, label: "Tempo de Estudo", value: `${Math.floor(userProgress.totalStudyMinutes / 60)}h` },
    { icon: Target, label: "Meta Semanal", value: `${Math.round((userProgress.weeklyProgress / userProgress.weeklyGoal) * 100)}%` },
  ];

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">Perfil</h1>
        <Button variant="outline" size="sm" className="gap-1">
          <Edit size={14} />
          Editar
        </Button>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                EU
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-xl font-bold">Estudante CFA</h2>
              <p className="text-muted-foreground">estudante@email.com</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <Badge className="bg-primary/10 text-primary">Nível {userProgress.level}</Badge>
                <Badge variant="secondary">CFA Level I</Badge>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso para Nível {userProgress.level + 1}</span>
              <span className="font-medium">{levelProgress}%</span>
            </div>
            <Progress value={levelProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {userProgress.xp} / {xpForNext} XP
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold truncate">{stat.value}</p>
                <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Badges */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Conquistas ({unlockedBadges.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {userProgress.badges.map((badge) => (
              <div 
                key={badge.id}
                className={`p-3 rounded-lg border text-center transition-all ${
                  badge.unlocked 
                    ? "bg-card hover:shadow-md" 
                    : "bg-muted/50 opacity-50"
                }`}
              >
                <span className="text-2xl">{badge.icon}</span>
                <p className="font-medium text-sm mt-1 truncate">{badge.name}</p>
                <p className="text-xs text-muted-foreground truncate">{badge.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Study Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Informações de Estudo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-muted-foreground">Programa Atual</span>
            <span className="font-medium">CFA Level I</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-muted-foreground">Foco Atual</span>
            <span className="font-medium">Quantitative Methods</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-muted-foreground">Meta Diária</span>
            <span className="font-medium">60 min/dia</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">Membro desde</span>
            <span className="font-medium">Janeiro 2025</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
