import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Clock, Target, BookOpen } from "lucide-react";

const upcomingEvents = [
  {
    id: "1",
    title: "Simulado Parcial - Quant",
    date: "25/01/2026",
    time: "14:00",
    type: "simulado",
  },
  {
    id: "2",
    title: "Revisão: Probability Concepts",
    date: "26/01/2026",
    time: "10:00",
    type: "revisao",
  },
  {
    id: "3",
    title: "Meta: Concluir módulo TVM",
    date: "28/01/2026",
    time: "Dia todo",
    type: "meta",
  },
];

const getEventIcon = (type: string) => {
  switch (type) {
    case "simulado": return Target;
    case "revisao": return BookOpen;
    case "meta": return Clock;
    default: return Clock;
  }
};

export default function Calendario() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground">
          Calendário
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Organize suas sessões e compromissos de estudo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md w-full"
            />
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Próximos Eventos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.map((event) => {
              const EventIcon = getEventIcon(event.type);
              return (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <EventIcon size={18} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.date} • {event.time}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">
                    {event.type}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
