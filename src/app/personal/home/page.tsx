
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Dumbbell, ArrowRight, PlusCircle, Megaphone, CheckCircle } from "lucide-react";
import Link from "next/link";


// Mock Data
const personalData = {
    name: "João Carlos",
    activeStudents: 15,
    workoutsSent: 42,
    recentActivity: [
        { student: "Fabiana Silva", event: "concluiu o Treino A" },
        { student: "Gustavo Pereira", event: "preencheu a avaliação" },
    ],
    activeCampaigns: [
        { id: "1", title: "Desafio 30 Dias de Agachamento" },
        { id: "2", title: "Pacote de Verão com 20% OFF" },
    ]
}


export default function PersonalHomePage() {

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Bom dia";
        if (hour < 18) return "Boa tarde";
        return "Boa noite";
    };

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-6">
            
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-muted-foreground">{getGreeting()},</p>
                    <h1 className="text-2xl font-bold">{personalData.name}</h1>
                </div>
                 <Link href="/personal/profile">
                    <Avatar className="h-12 w-12 cursor-pointer">
                        <AvatarImage src="https://placehold.co/128x128.png" alt={personalData.name} />
                        <AvatarFallback>{personalData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </Link>
            </div>

            <Card className="bg-primary text-primary-foreground">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Resumo Rápido
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                       <Users className="h-8 w-8"/>
                       <div>
                           <p className="text-2xl font-bold">{personalData.activeStudents}</p>
                           <p className="text-sm text-primary-foreground/80">Alunos Ativos</p>
                       </div>
                    </div>
                     <div className="flex items-center gap-3">
                       <Dumbbell className="h-8 w-8"/>
                       <div>
                           <p className="text-2xl font-bold">{personalData.workoutsSent}</p>
                           <p className="text-sm text-primary-foreground/80">Treinos Enviados</p>
                       </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                     <CardHeader>
                        <CardTitle>Ações Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <Link href="/personal/students">
                            <Button variant="outline" className="w-full justify-start"><PlusCircle className="mr-2"/> Adicionar Aluno</Button>
                        </Link>
                        <Link href="/dashboard/workout-templates">
                             <Button variant="outline" className="w-full justify-start"><Dumbbell className="mr-2"/> Criar Novo Treino</Button>
                        </Link>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Atividade Recente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                       {personalData.recentActivity.map((activity, i) => (
                         <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500"/>
                            <p><span className="font-semibold">{activity.student}</span> {activity.event}.</p>
                         </div>
                       ))}
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Megaphone className="h-5 w-5"/>
                        Campanhas Ativas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {personalData.activeCampaigns.map(campaign => (
                             <li key={campaign.id} className="flex justify-between items-center text-sm p-2 bg-muted/50 rounded-md">
                                <p>{campaign.title}</p>
                                <Link href={`/personal/campaigns`}>
                                    <Button variant="ghost" size="sm">Ver</Button>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Link href="/personal/campaigns" className="w-full">
                         <Button variant="outline" className="w-full">Ver todas as campanhas</Button>
                    </Link>
                </CardFooter>
            </Card>

        </div>
    );
}
