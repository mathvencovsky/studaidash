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
    title: "Concluir módulo TVM",
    date: "28/01/2026",
    time: "Dia todo",
    type: "meta",
  },
];

export default function Calendario() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">Calendário</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Sessões e prazos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <section className="border rounded-lg bg-card p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md w-full"
          />
        </section>

        {/* Upcoming Events */}
        <section className="border rounded-lg bg-card overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-medium text-foreground">Próximos eventos</h2>
          </div>
          <div className="divide-y">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 p-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{event.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {event.date} · {event.time}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground capitalize">
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
