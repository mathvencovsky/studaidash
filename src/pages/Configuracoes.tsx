import { useState } from "react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, LogOut } from "lucide-react";

export default function Configuracoes() {
  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [language, setLanguage] = useState("pt-BR");
  const [studyGoal, setStudyGoal] = useState("60");
  
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const handleDarkModeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Preferências.
        </p>
      </div>

      {/* Notifications */}
      <section className="border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-medium text-foreground">Notificações</h2>
        </div>
        <div className="divide-y">
          <div className="flex items-center justify-between p-4">
            <div>
              <Label htmlFor="notifications" className="text-sm">Push</Label>
              <p className="text-xs text-muted-foreground">Alertas no dispositivo</p>
            </div>
            <Switch 
              id="notifications" 
              checked={notifications} 
              onCheckedChange={setNotifications} 
            />
          </div>
          <div className="flex items-center justify-between p-4">
            <div>
              <Label htmlFor="reminder" className="text-sm">Lembrete diário</Label>
              <p className="text-xs text-muted-foreground">Hora de estudar</p>
            </div>
            <Switch 
              id="reminder" 
              checked={dailyReminder} 
              onCheckedChange={setDailyReminder} 
            />
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-medium text-foreground">Aparência</h2>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="darkMode" className="text-sm">Modo escuro</Label>
              <p className="text-xs text-muted-foreground">Tema claro/escuro</p>
            </div>
            <Switch 
              id="darkMode" 
              checked={isDarkMode} 
              onCheckedChange={handleDarkModeToggle} 
            />
          </div>
        </div>
      </section>

      {/* Study Preferences */}
      <section className="border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-medium text-foreground">Estudo</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Meta diária</Label>
            <Select value={studyGoal} onValueChange={setStudyGoal}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="45">45 min</SelectItem>
                <SelectItem value="60">60 min</SelectItem>
                <SelectItem value="90">90 min</SelectItem>
                <SelectItem value="120">120 min</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Idioma</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Other Options */}
      <section className="border rounded-lg bg-card overflow-hidden">
        <button className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left">
          <span className="text-sm text-foreground">Privacidade</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="border-t" />
        <button className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left">
          <span className="text-sm text-foreground">Ajuda</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </section>

      {/* Logout */}
      <Button variant="outline" className="w-full text-muted-foreground h-9 text-sm">
        <LogOut className="w-4 h-4 mr-2" />
        Sair
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        v1.0.0
      </p>
    </div>
  );
}
