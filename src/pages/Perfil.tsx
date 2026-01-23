import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  User, 
  Trophy, 
  Flame, 
  Clock, 
  BookOpen, 
  Target,
  Calendar,
  Edit,
  Camera,
  Save,
  X,
  Check
} from "lucide-react";
import { DEFAULT_USER_PROGRESS, getXPForNextLevel, getLevelProgress } from "@/data/cfa-mock-data";
import { toast } from "sonner";

interface UserProfile {
  name: string;
  email: string;
  initials: string;
  currentProgram: string;
  currentFocus: string;
  dailyGoal: number;
  memberSince: string;
}

const STORAGE_KEY = "studai-user-profile";

const loadProfile = (): UserProfile => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to load profile", e);
  }
  return {
    name: "João Silva",
    email: "joao.silva@email.com",
    initials: "JS",
    currentProgram: "CFA Level I",
    currentFocus: "Quantitative Methods",
    dailyGoal: 60,
    memberSince: "Janeiro 2025"
  };
};

const saveProfile = (profile: UserProfile) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save profile", e);
  }
};

export default function Perfil() {
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(profile);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);
  
  const userProgress = DEFAULT_USER_PROGRESS;
  const levelProgress = getLevelProgress(userProgress.xp, userProgress.level);
  const xpForNext = getXPForNextLevel(userProgress.level);
  const unlockedBadges = userProgress.badges.filter(b => b.unlocked);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const stats = [
    { icon: Trophy, label: "XP Total", value: userProgress.xp.toLocaleString() },
    { icon: Flame, label: "Streak Atual", value: `${userProgress.streak} dias` },
    { icon: Clock, label: "Tempo de Estudo", value: `${Math.floor(userProgress.totalStudyMinutes / 60)}h` },
    { icon: Target, label: "Meta Semanal", value: `${Math.round((userProgress.weeklyProgress / userProgress.weeklyGoal) * 100)}%` },
  ];

  const handleStartEdit = () => {
    setEditForm(profile);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const handleSaveProfile = () => {
    // Generate initials from name
    const nameParts = editForm.name.trim().split(" ");
    const initials = nameParts.length >= 2 
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : nameParts[0].substring(0, 2).toUpperCase();
    
    setProfile({ ...editForm, initials });
    setIsEditing(false);
    toast.success("Perfil atualizado com sucesso!");
  };

  const handleUpdateGoal = (newGoal: number) => {
    setProfile(prev => ({ ...prev, dailyGoal: newGoal }));
    setShowGoalModal(false);
    toast.success(`Meta diária atualizada para ${newGoal} minutos`);
  };

  const handleUpdateProgram = (program: string, focus: string) => {
    setProfile(prev => ({ ...prev, currentProgram: program, currentFocus: focus }));
    setShowProgramModal(false);
    toast.success("Programa atualizado!");
  };

  const programs = [
    { value: "CFA Level I", focuses: ["Quantitative Methods", "Economics", "Financial Statement Analysis", "Corporate Finance", "Equity Investments", "Fixed Income"] },
    { value: "CFA Level II", focuses: ["Equity Valuation", "Fixed Income Analysis", "Derivatives", "Portfolio Management"] },
    { value: "CFA Level III", focuses: ["Portfolio Management", "Wealth Planning", "Asset Allocation"] },
  ];

  const [selectedProgram, setSelectedProgram] = useState(profile.currentProgram);
  const [selectedFocus, setSelectedFocus] = useState(profile.currentFocus);

  const currentProgramFocuses = programs.find(p => p.value === selectedProgram)?.focuses || [];

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">Perfil</h1>
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1" onClick={handleCancelEdit}>
              <X size={14} />
              Cancelar
            </Button>
            <Button size="sm" className="gap-1" onClick={handleSaveProfile}>
              <Check size={14} />
              Salvar
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="gap-1" onClick={handleStartEdit}>
            <Edit size={14} />
            Editar
          </Button>
        )}
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {profile.initials}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                  onClick={() => toast.info("Upload de foto disponível em breve!")}
                >
                  <Camera size={14} />
                </Button>
              )}
            </div>
            <div className="text-center sm:text-left flex-1 space-y-2">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name" className="text-xs text-muted-foreground">Nome</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-xs text-muted-foreground">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <p className="text-muted-foreground">{profile.email}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                    <Badge className="bg-primary/10 text-primary">Nível {userProgress.level}</Badge>
                    <Badge variant="secondary">{profile.currentProgram}</Badge>
                  </div>
                </>
              )}
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
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
            if (stat.label === "Meta Semanal") {
              setShowGoalModal(true);
            }
          }}>
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
            Conquistas ({unlockedBadges.length}/{userProgress.badges.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {userProgress.badges.map((badge) => (
              <button 
                key={badge.id}
                onClick={() => {
                  if (badge.unlocked) {
                    toast.success(`${badge.name}: ${badge.description}`);
                  } else {
                    toast.info(`Complete "${badge.description}" para desbloquear!`);
                  }
                }}
                className={`p-3 rounded-lg border text-center transition-all ${
                  badge.unlocked 
                    ? "bg-card hover:shadow-md hover:border-primary/50" 
                    : "bg-muted/50 opacity-50 hover:opacity-75"
                }`}
              >
                <span className="text-2xl">{badge.icon}</span>
                <p className="font-medium text-sm mt-1 truncate">{badge.name}</p>
                <p className="text-xs text-muted-foreground truncate">{badge.description}</p>
              </button>
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
        <CardContent className="space-y-1">
          <button 
            onClick={() => {
              setSelectedProgram(profile.currentProgram);
              setSelectedFocus(profile.currentFocus);
              setShowProgramModal(true);
            }}
            className="flex items-center justify-between py-3 border-b w-full hover:bg-muted/50 px-2 -mx-2 rounded transition-colors"
          >
            <span className="text-muted-foreground">Programa Atual</span>
            <span className="font-medium flex items-center gap-2">
              {profile.currentProgram}
              <Edit size={14} className="text-muted-foreground" />
            </span>
          </button>
          <button 
            onClick={() => {
              setSelectedProgram(profile.currentProgram);
              setSelectedFocus(profile.currentFocus);
              setShowProgramModal(true);
            }}
            className="flex items-center justify-between py-3 border-b w-full hover:bg-muted/50 px-2 -mx-2 rounded transition-colors"
          >
            <span className="text-muted-foreground">Foco Atual</span>
            <span className="font-medium flex items-center gap-2">
              {profile.currentFocus}
              <Edit size={14} className="text-muted-foreground" />
            </span>
          </button>
          <button 
            onClick={() => setShowGoalModal(true)}
            className="flex items-center justify-between py-3 border-b w-full hover:bg-muted/50 px-2 -mx-2 rounded transition-colors"
          >
            <span className="text-muted-foreground">Meta Diária</span>
            <span className="font-medium flex items-center gap-2">
              {profile.dailyGoal} min/dia
              <Edit size={14} className="text-muted-foreground" />
            </span>
          </button>
          <div className="flex items-center justify-between py-3 px-2 -mx-2">
            <span className="text-muted-foreground">Membro desde</span>
            <span className="font-medium">{profile.memberSince}</span>
          </div>
        </CardContent>
      </Card>

      {/* Goal Modal */}
      <Dialog open={showGoalModal} onOpenChange={setShowGoalModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Alterar Meta Diária</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-4">
            {[30, 45, 60, 90, 120, 180].map((minutes) => (
              <Button
                key={minutes}
                variant={profile.dailyGoal === minutes ? "default" : "outline"}
                className="h-16 flex flex-col gap-1"
                onClick={() => handleUpdateGoal(minutes)}
              >
                <span className="text-lg font-bold">{minutes}</span>
                <span className="text-xs">minutos/dia</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Program Modal */}
      <Dialog open={showProgramModal} onOpenChange={setShowProgramModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Alterar Programa de Estudo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Programa</Label>
              <Select value={selectedProgram} onValueChange={(val) => {
                setSelectedProgram(val);
                const newFocuses = programs.find(p => p.value === val)?.focuses || [];
                setSelectedFocus(newFocuses[0] || "");
              }}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Selecione o programa" />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-lg z-50">
                  {programs.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Área de Foco</Label>
              <Select value={selectedFocus} onValueChange={setSelectedFocus}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Selecione o foco" />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-lg z-50">
                  {currentProgramFocuses.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProgramModal(false)}>Cancelar</Button>
            <Button onClick={() => handleUpdateProgram(selectedProgram, selectedFocus)}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
