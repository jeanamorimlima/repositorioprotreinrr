
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, FileText, ArrowRight, PlusCircle, Megaphone, CheckCircle } from "lucide-react";
import Link from "next/link";


// Mock Data
const nutriData = {
    name: "Ana Beatriz",
    activePatients: 8,
    plansDelivered: 25,
    recentActivity: [
        { patient: "Juliana Mendes", event: "preencheu o diário alimentar" },
        { patient: "Ricardo Alves", event: "agendou um retorno" },
    ],
    activeCampaigns: [
        { id: "nutri_1", title: "Plano Alimentar de Verão" },
        { id: "nutri_2", title: "E-book: Lanches Saudáveis" },
    ]
}


export default function NutritionistHomePage() {

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
                    <h1 className="text-2xl font-bold">{nutriData.name}</h1>
                </div>
                 <Link href="/nutritionist/profile">
                    <Avatar className="h-12 w-12 cursor-pointer">
                        <AvatarImage src="https://placehold.co/128x128.png" alt={nutriData.name} />
                        <AvatarFallback>{nutriData.name.charAt(0)}</AvatarFallback>
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
                           <p className="text-2xl font-bold">{nutriData.activePatients}</p>
                           <p className="text-sm text-primary-foreground/80">Pacientes Ativos</p>
                       </div>
                    </div>
                     <div className="flex items-center gap-3">
                       <FileText className="h-8 w-8"/>
                       <div>
                           <p className="text-2xl font-bold">{nutriData.plansDelivered}</p>
                           <p className="text-sm text-primary-foreground/80">Planos Entregues</p>
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
                        <Link href="/nutritionist/patients">
                            <Button variant="outline" className="w-full justify-start"><PlusCircle className="mr-2"/> Adicionar Paciente</Button>
                        </Link>
                         <Link href="#">
                             <Button variant="outline" className="w-full justify-start"><FileText className="mr-2"/> Criar Novo Plano Alimentar</Button>
                        </Link>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Atividade Recente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                       {nutriData.recentActivity.map((activity, i) => (
                         <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500"/>
                            <p><span className="font-semibold">{activity.patient}</span> {activity.event}.</p>
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
                        {nutriData.activeCampaigns.map(campaign => (
                             <li key={campaign.id} className="flex justify-between items-center text-sm p-2 bg-muted/50 rounded-md">
                                <p>{campaign.title}</p>
                                <Link href={`/nutritionist/campaigns`}>
                                    <Button variant="ghost" size="sm">Ver</Button>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Link href="/nutritionist/campaigns" className="w-full">
                         <Button variant="outline" className="w-full">Ver todas as campanhas</Button>
                    </Link>
                </CardFooter>
            </Card>

        </div>
    );
}
