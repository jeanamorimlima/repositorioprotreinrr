
"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, ArrowRight, TrendingUp, Sparkles, UserSearch, ClipboardList, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase";


const latestCampaigns: any[] = [];

export default function HomePage() {
    const [user, setUser] = useState<User | null>(null);
    const [lastWorkout, setLastWorkout] = useState<any | null>(null);
    const [lastWeight, setLastWeight] = useState<any | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        // Mock fetching data - replace with actual data fetching logic
        const workouts = JSON.parse(localStorage.getItem('savedWorkouts') || '[]');
        if (workouts.length > 0) {
            const latestWorkout = workouts[workouts.length - 1];
            setLastWorkout({
                id: latestWorkout.id,
                name: latestWorkout.name,
                nextTraining: latestWorkout.days[0]?.day || 'Próximo treino'
            });
        }

        const measurements = JSON.parse(localStorage.getItem('measurementHistory') || '[]');
         if (measurements.length > 0) {
            const latestMeasurement = measurements[0];
            setLastWeight({
                value: `${latestMeasurement.weight} kg`,
                date: new Date(latestMeasurement.date).toLocaleDateString('pt-BR')
            });
        }


        return () => unsubscribe();
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Bom dia";
        if (hour < 18) return "Boa tarde";
        return "Boa noite";
    };

    const isNewUser = !lastWorkout && !lastWeight;

    if (isNewUser) {
        return (
             <div className="container mx-auto p-4 md:p-8 space-y-6">
                <div className="text-center py-10">
                    <Sparkles className="mx-auto h-12 w-12 text-primary mb-4" />
                    <h1 className="text-3xl font-bold">Bem-vindo(a) ao ProTreinRR!</h1>
                    <p className="text-muted-foreground mt-2">Parece que você é novo por aqui. Vamos começar a sua jornada?</p>
                </div>
                 <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    <Card className="hover:border-primary transition-colors">
                        <CardHeader>
                            <CardTitle>Crie seu Primeiro Treino</CardTitle>
                            <CardDescription>
                                Escolha um dos nossos modelos prontos ou personalize um treino do zero para atingir seus objetivos.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Link href="/dashboard/workout-templates" className="w-full">
                                <Button className="w-full"><PlusCircle className="mr-2"/>Criar Treino</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                     <Card className="hover:border-primary transition-colors">
                        <CardHeader>
                            <CardTitle>Encontre um Profissional</CardTitle>
                            <CardDescription>
                                Conecte-se com personais e nutricionistas para ter um acompanhamento especializado e otimizar seus resultados.
                            </CardDescription>
                        </CardHeader>
                         <CardFooter>
                            <Link href="/dashboard/professionals" className="w-full">
                                <Button className="w-full"><UserSearch className="mr-2"/>Buscar Profissionais</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-6">
            
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-muted-foreground">{getGreeting()},</p>
                    <h1 className="text-2xl font-bold">{user?.displayName || 'Usuário'}</h1>
                </div>
            </div>

            {lastWorkout && (
                <Card className="bg-primary text-primary-foreground">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Dumbbell /> Próximo Treino
                        </CardTitle>
                        <CardDescription className="text-primary-foreground/80">{lastWorkout.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-semibold">{lastWorkout.nextTraining}</p>
                    </CardContent>
                    <CardFooter>
                        <Link href={`/dashboard/my-workouts/${lastWorkout.id}/start`} className="w-full">
                            <Button variant="secondary" className="w-full">
                                Começar a treinar <ArrowRight className="ml-2"/>
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">

                {lastWeight && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <TrendingUp className="h-5 w-5" /> Meu Progresso
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Último peso registrado</p>
                            <p className="text-3xl font-bold">{lastWeight.value}</p>
                            <p className="text-xs text-muted-foreground">em {lastWeight.date}</p>
                        </CardContent>
                        <CardFooter>
                            <Link href="/dashboard/my-workouts" className="w-full">
                                <Button variant="outline" className="w-full">Ver histórico completo</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                )}

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <ClipboardList className="h-5 w-5" /> Meus Treinos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-muted-foreground">
                            Acesse sua lista completa de treinos salvos para visualizar ou iniciar uma nova sessão.
                       </p>
                    </CardContent>
                    <CardFooter>
                        <Link href="/dashboard/my-workouts" className="w-full">
                            <Button variant="outline" className="w-full">Ver todos os treinos</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>

            {latestCampaigns.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary"/> Novidades para você
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {latestCampaigns.map(campaign => (
                            <Link href={`/dashboard/campaigns/${campaign.id}`} key={campaign.id}>
                                <Card className="overflow-hidden group">
                                    <div className="relative aspect-video">
                                        <Image 
                                            src={campaign.imageUrl}
                                            alt={campaign.title}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                            data-ai-hint="fitness campaign"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <h3 className="absolute bottom-2 left-2 text-white font-bold">{campaign.title}</h3>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                    <Link href="/dashboard/campaigns" className="w-full">
                        <Button variant="link" className="w-full mt-2">Ver todas as campanhas <ArrowRight className="ml-2"/></Button>
                    </Link>
                </div>
            )}


            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                       <UserSearch /> Encontre Profissionais
                    </CardTitle>
                    <CardDescription>
                        Conecte-se com personais e nutricionistas para otimizar seus resultados.
                    </CardDescription>
                </CardHeader>
                 <CardFooter>
                    <Link href="/dashboard/professionals" className="w-full">
                        <Button variant="outline" className="w-full">Buscar agora</Button>
                    </Link>
                </CardFooter>
            </Card>

        </div>
    );
}
