
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Video } from 'lucide-react';

const mockEvents = {
    '2024-08-15': [
        { time: '08:00', title: 'Avaliação Física - Fabiana Silva', type: 'assessment' },
        { time: '09:00', title: 'Treino Presencial - Gustavo Pereira', type: 'training' },
    ],
    '2024-08-20': [
        { time: '18:00', title: 'Consulta Online - Novo Aluno', type: 'consultation' },
    ]
};

type Event = {
    time: string;
    title: string;
    type: 'assessment' | 'training' | 'consultation';
};

export default function SchedulePage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    
    const selectedDateString = date ? date.toISOString().split('T')[0] : '';
    const selectedEvents: Event[] = (mockEvents as any)[selectedDateString] || [];

    const getEventTypeStyle = (type: Event['type']) => {
        switch(type) {
            case 'assessment': return { color: 'bg-blue-500', label: 'Avaliação'};
            case 'training': return { color: 'bg-green-500', label: 'Treino'};
            case 'consultation': return { color: 'bg-purple-500', label: 'Consulta'};
            default: return { color: 'bg-gray-500', label: 'Evento'};
        }
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Agenda</h2>
                <Button>
                    <Plus className="mr-2 h-4 w-4"/>
                    Agendar Evento
                </Button>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Calendário</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md"
                            initialFocus
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Compromissos do Dia</CardTitle>
                        <CardDescription>
                            {date ? date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Nenhuma data selecionada'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {selectedEvents.length > 0 ? (
                            selectedEvents.map((event, index) => {
                                const style = getEventTypeStyle(event.type);
                                return (
                                <div key={index} className="flex items-center gap-4 p-3 rounded-md bg-muted/50">
                                    <div className="flex flex-col items-center">
                                         <Badge className={`${style.color} text-white mb-1`}>{style.label}</Badge>
                                        <span className="font-mono text-sm">{event.time}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold">{event.title}</p>
                                    </div>
                                    {event.type === 'consultation' && <Button variant="outline" size="icon"><Video className="h-4 w-4"/></Button>}
                                </div>
                            )})
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-muted-foreground">Nenhum compromisso para este dia.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

