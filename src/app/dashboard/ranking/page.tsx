
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, ArrowUp, History, Star, Info, ShieldAlert, User, Utensils } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { cn } from '@/lib/utils';


// Mock data - em uma aplicação real, isso viria do backend
const mockRanking: any[] = [];
// ...seus imports...

type Professional = {
  points: number;
  id: string;
  name: string;
  type: string;
  avatarUrl: string;
  position: number;
};

const hallOfFame: Record<string, Professional[]> = {
  "Julho 2024": [],
  "Junho 2024": [],
};

const getTenthPlacePoints = (professionals: any[]) => {
    if (professionals.length < 10) return 0;
    return professionals[9].points;
}


const getTrophyColor = (index: number) => {
    if (index === 0) return "text-yellow-400";
    if (index === 1) return "text-gray-400";
    if (index === 2) return "text-yellow-600";
    return "";
}

const FormattedPoints = ({ points }: { points: number }) => {
    const [formatted, setFormatted] = useState(points.toString());
    useEffect(() => {
        setFormatted(points.toLocaleString());
    }, [points]);
    return <>{formatted}</>;
};

const RankingCard = ({ professional, index, tenthPlacePoints }: { professional: any, index: number, tenthPlacePoints: number }) => {
    const isTop3 = index < 3;
    const isTop10 = index < 10;
    const pointsToGo = tenthPlacePoints - professional.points;
    const profileType = professional.type.toLowerCase().includes('personal') ? 'personal' : 'nutritionist';

    return (
        <Link href={`/dashboard/professionals/${profileType}/${professional.id.replace('prof_', profileType === 'personal' ? 'personal' : 'nutri')}`}>
            <Card className={`
                hover:border-primary transition-colors
                ${isTop10 ? 'border-2' : ''}
                ${index === 0 ? 'border-yellow-400' : ''}
                ${index === 1 ? 'border-gray-400' : ''}
                ${index === 2 ? 'border-yellow-600' : ''}
                ${isTop10 && index > 2 ? 'border-primary/50' : ''}
            `}>
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-lg w-8 text-center">{professional.position}º</span>
                        {isTop3 && <Trophy className={`h-6 w-6 ${getTrophyColor(index)}`} />}
                        <Avatar>
                            <AvatarImage src={professional.avatarUrl} alt={professional.name} />
                            <AvatarFallback>{professional.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{professional.name}</p>
                            <p className="text-sm text-muted-foreground">{professional.type}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-primary"><FormattedPoints points={professional.points} /> pts</p>
                        {!isTop10 && pointsToGo > 0 && (
                            <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                                <ArrowUp className="h-3 w-3 text-green-500" /> {pointsToGo} para o Top 10
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

const RankingContent = ({ type }: { type: 'Personal Trainer' | 'Nutricionista' }) => {
    const filteredRanking = mockRanking
        .filter(p => p.type === type)
        .map((p, index) => ({...p, position: index + 1})); // Recalcula a posição aqui

    const tenthPlacePoints = getTenthPlacePoints(filteredRanking);

    const filteredHallOfFame = Object.entries(hallOfFame).reduce<Record<string, any[]>>(
  (acc, [month, professionals]) => {
    const filtered = (professionals as any[])
      .filter((p: any) => p.type === type)
      .sort((a: any, b: any) => b.points - a.points);

    if (filtered.length > 0) {
      acc[month] = filtered;
    }
    return acc;
  },
  {}
);

    return (
        <div className="space-y-6">
             <Accordion type="single" collapsible className="w-full">
                 <AccordionItem value="hall-of-fame">
                    <AccordionTrigger className="text-base font-semibold">
                        <div className="flex items-center gap-2">
                            <History className="h-5 w-5" />
                            Hall da Fama ({type})
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-muted/50 rounded-b-md space-y-4">
                       <Accordion type="single" collapsible className="w-full">
                            {Object.entries(filteredHallOfFame).map(([month, professionals]) => (
                                <AccordionItem value={month} key={month}>
                                    <AccordionTrigger>{month}</AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-2">
                                        {(professionals as any[]).slice(0, 3).map((prof, index) => (
                                             <Card key={prof.id} className={cn("p-2", index === 0 && "border-primary bg-primary/10")}>
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold w-6">{index + 1}º</span>
                                                         {index < 3 && <Trophy className={`h-4 w-4 ${getTrophyColor(index)}`} />}
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={prof.avatarUrl} alt={prof.name} />
                                                            <AvatarFallback>{prof.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <span>{prof.name}</span>
                                                    </div>
                                                    <span className="font-semibold"><FormattedPoints points={prof.points} /> pts</span>
                                                </div>
                                            </Card>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                         {Object.keys(filteredHallOfFame).length === 0 && <p className="text-sm text-muted-foreground text-center">Nenhum dado histórico para esta categoria.</p>}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
             <Card>
                <CardHeader>
                    <CardTitle>Ranking Atual de {type}s</CardTitle>
                    <CardDescription>Atualizado em tempo real.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    {filteredRanking.slice(0, 50).map((prof, index) => (
                        <RankingCard key={prof.id} professional={prof} index={index} tenthPlacePoints={tenthPlacePoints} />
                    ))}
                    {filteredRanking.length === 0 && <p className="text-muted-foreground text-center py-4">Nenhum profissional encontrado nesta categoria.</p>}
                </CardContent>
            </Card>
        </div>
    )
}

export default function RankingPage() {

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
                    <Trophy className="h-8 w-8 text-primary"/>
                    Ranking de Profissionais
                </h2>
                <p className="text-muted-foreground">Veja os profissionais mais bem avaliados e engajados da plataforma.</p>
            </div>

            <Accordion type="single" collapsible className="w-full mb-6 max-w-4xl mx-auto">
                <AccordionItem value="rules">
                    <AccordionTrigger className="text-base font-semibold">
                        <div className="flex items-center gap-2">
                            <Info className="h-5 w-5" />
                            Como funciona o Ranking?
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-muted/50 rounded-b-md space-y-4">
                         <div>
                            <h4 className="font-bold flex items-center gap-2"><Star className="h-4 w-4 text-green-500" /> Pontos Positivos</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                <li>Alunos/Pacientes ativos</li>
                                <li>Treinos/Planos entregues</li>
                                <li>Avaliação média alta</li>
                                <li>Resultados comprovados (melhora de medidas)</li>
                                <li>Engajamento no app</li>
                            </ul>
                        </div>
                        <div>
                             <h4 className="font-bold flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-red-500" /> Penalizações</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                <li>Reclamações confirmadas</li>
                                <li>Denúncias procedentes</li>
                                <li>Faltas graves (linguagem inapropriada, etc.)</li>
                            </ul>
                        </div>
                        <p className="text-xs text-muted-foreground italic">O ranking é atualizado em tempo real e o fechamento mensal ocorre no último dia do mês.</p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            
            <Tabs defaultValue="personals" className="w-full max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="personals">
                        <User className="mr-2 h-4 w-4" />
                        Personal Trainers
                    </TabsTrigger>
                    <TabsTrigger value="nutritionists">
                         <Utensils className="mr-2 h-4 w-4" />
                        Nutricionistas
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="personals" className="mt-6">
                    <RankingContent type="Personal Trainer" />
                </TabsContent>
                <TabsContent value="nutritionists" className="mt-6">
                    <RankingContent type="Nutricionista" />
                </TabsContent>
            </Tabs>

        </div>
    )
}
