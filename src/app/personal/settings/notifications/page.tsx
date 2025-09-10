
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Bell, Save, MessageSquare, CheckSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function NotificationsPage() {
    const { toast } = useToast();

    // Estados para cada configuração
    const [newStudentNotification, setNewStudentNotification] = useState(true);
    const [chatNotifications, setChatNotifications] = useState(true);
    const [assessmentCompleted, setAssessmentCompleted] = useState(true);

    const handleSaveChanges = () => {
        console.log({
            newStudentNotification,
            chatNotifications,
            assessmentCompleted,
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
                <p className="text-muted-foreground">Gerencie como e quando você recebe notificações.</p>
            </div>
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-6 w-6" />
                        Preferências de Notificação
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <Label htmlFor="new-student-switch" className="flex items-center gap-2 text-lg font-semibold">
                            <CheckSquare /> Novo Aluno
                        </Label>
                        <Switch id="new-student-switch" checked={newStudentNotification} onCheckedChange={setNewStudentNotification}/>
                    </div>
                    <p className="text-sm text-muted-foreground -mt-4 pl-6">
                        Receber uma notificação quando um novo aluno se conectar a você.
                    </p>
                    
                    <Separator />

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <Label htmlFor="chat-switch" className="flex items-center gap-2 text-lg font-semibold">
                            <MessageSquare /> Novas Mensagens
                        </Label>
                        <Switch id="chat-switch" checked={chatNotifications} onCheckedChange={setChatNotifications}/>
                    </div>
                     <p className="text-sm text-muted-foreground -mt-4 pl-6">
                        Receber notificações de novas mensagens no chat.
                    </p>

                    <Separator />
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <Label htmlFor="assessment-switch" className="flex items-center gap-2 text-lg font-semibold">
                            <CheckSquare /> Avaliação Preenchida
                        </Label>
                        <Switch id="assessment-switch" checked={assessmentCompleted} onCheckedChange={setAssessmentCompleted}/>
                    </div>
                     <p className="text-sm text-muted-foreground -mt-4 pl-6">
                        Receber um aviso quando um aluno preencher uma avaliação enviada.
                    </p>
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
