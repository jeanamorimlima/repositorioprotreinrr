
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Bell, Save, Clock, Droplets, Trophy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export default function NotificationsPage() {
    const { toast } = useToast();

    // Estados para cada configuração
    const [trainingReminders, setTrainingReminders] = useState({
        enabled: true,
        time: "08:00"
    });
    const [hydrationReminders, setHydrationReminders] = useState({
        enabled: false,
        interval: "120" // em minutos
    });
    const [goalWarnings, setGoalWarnings] = useState(true);
    const [measurementReminders, setMeasurementReminders] = useState({
        enabled: true,
        interval: "30" // em dias
    });


    const handleSaveChanges = () => {
        console.log({
            trainingReminders,
            hydrationReminders,
            goalWarnings,
            measurementReminders
        });
        toast({
            title: "Preferências Salvas!",
            description: "Suas configurações de notificação foram atualizadas.",
        });
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="mb-6">
                <h2 className="text-3xl font-bold">Notificações</h2>
                <p className="text-muted-foreground">Gerencie suas preferências de lembretes e avisos.</p>
            </div>
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-6 w-6" />
                        Preferências de Notificação
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Lembretes de Treino */}
                    <div className="space-y-4 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="training-switch" className="flex items-center gap-2 text-lg font-semibold">
                                <Clock /> Lembretes de treino
                            </Label>
                            <Switch id="training-switch" checked={trainingReminders.enabled} onCheckedChange={(c) => setTrainingReminders(p => ({...p, enabled: c}))}/>
                        </div>
                        {trainingReminders.enabled && (
                             <div className="space-y-2 pl-6">
                                <Label htmlFor="training-time">Horário do lembrete</Label>
                                <Input 
                                    id="training-time" 
                                    type="time" 
                                    value={trainingReminders.time}
                                    onChange={(e) => setTrainingReminders(p => ({...p, time: e.target.value}))}
                                    className="w-40"
                                />
                            </div>
                        )}
                    </div>
                    
                    <Separator />

                    {/* Lembretes de Hidratação */}
                    <div className="space-y-4 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                             <Label htmlFor="hydration-switch" className="flex items-center gap-2 text-lg font-semibold">
                                <Droplets /> Lembrete de hidratação
                            </Label>
                            <Switch id="hydration-switch" checked={hydrationReminders.enabled} onCheckedChange={(c) => setHydrationReminders(p => ({...p, enabled: c}))}/>
                        </div>
                       {hydrationReminders.enabled && (
                             <div className="space-y-2 pl-6">
                                <Label htmlFor="hydration-interval">Lembrar a cada:</Label>
                                <Select value={hydrationReminders.interval} onValueChange={(v) => setHydrationReminders(p => ({...p, interval: v}))}>
                                    <SelectTrigger id="hydration-interval" className="w-48">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="60">1 hora</SelectItem>
                                        <SelectItem value="90">1 hora e 30 min</SelectItem>
                                        <SelectItem value="120">2 horas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <Separator />
                    
                    {/* Lembretes de Medição */}
                    <div className="space-y-4 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="measurement-switch" className="flex items-center gap-2 text-lg font-semibold">
                                <Trophy /> Lembretes de medição
                            </Label>
                            <Switch id="measurement-switch" checked={measurementReminders.enabled} onCheckedChange={(c) => setMeasurementReminders(p => ({...p, enabled: c}))}/>
                        </div>
                        {measurementReminders.enabled && (
                            <div className="space-y-2 pl-6">
                                <Label>Lembrar a cada:</Label>
                                <RadioGroup value={measurementReminders.interval} onValueChange={(v) => setMeasurementReminders(p => ({...p, interval: v}))}>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="15" id="r1" /><Label htmlFor="r1">15 dias</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="30" id="r2" /><Label htmlFor="r2">30 dias</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="60" id="r3" /><Label htmlFor="r3">60 dias</Label></div>
                                </RadioGroup>
                            </div>
                        )}
                    </div>

                </CardContent>
                <CardFooter>
                    <Button onClick={handleSaveChanges}>
                        <Save className="mr-2 h-4 w-4"/>
                        Salvar Preferências
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
