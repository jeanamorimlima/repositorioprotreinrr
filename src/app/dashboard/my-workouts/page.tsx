
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoreHorizontal, PlusCircle, Megaphone, ClipboardList, BarChart2, History } from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { differenceInDays, parseISO } from 'date-fns';

type Workout = {
    id: string;
    name: string;
    template: string;
    date: string;
    goal: string;
}

type CampaignType = 'promocao' | 'desafio' | 'evento' | 'educativo';
type SubscribedCampaign = {
    id: string;
    title: string;
    description: string;
    type: CampaignType;
    startDate: string;
    endDate: string;
};

type CampaignStatusKey = 'all' | 'active' | 'upcoming' | 'finished';

const subscribedCampaigns: SubscribedCampaign[] = [];

const getCampaignTypeLabel = (type: CampaignType) => {
    switch (type) {
        case 'promocao': return { label: 'Promoção', color: 'bg-blue-500' };
        case 'desafio': return { label: 'Desafio', color: 'bg-yellow-500' };
        case 'evento': return { label: 'Evento', color: 'bg-green-500' };
        case 'educativo': return { label: 'Educativo', color: 'bg-purple-500' };
        default: return { label: 'Campanha', color: 'bg-gray-500' };
    }
};

const getCampaignStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T23:59:59');

    if (now < start) {
        return { key: 'upcoming', label: 'A iniciar', color: 'bg-gray-500' };
    }
    if (now > end) {
        return { key: 'finished', label: 'Finalizada', color: 'bg-red-500' };
    }
    return { key: 'active', label: 'Em andamento', color: 'bg-green-600' };
}

const ProgressContent = () => {
    const router = useRouter();
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('measurementHistory') || '[]');
        setHistory(savedHistory);
    }, []);

    const handleNavigateToAnalysis = (data: any) => {
        const query = new URLSearchParams(data).toString();
        router.push(`/dashboard/my-analysis?${query}`);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History className="h-6 w-6" />
                    Histórico de Análises
                </CardTitle>
                <CardDescription>
                    Acompanhe seu progresso ao longo do tempo. Clique para ver o relatório detalhado de cada data.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                    {history.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-md border hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => handleNavigateToAnalysis(item)}
                    >
                        <div>
                        <p className="font-bold text-lg">
                            Análise de {new Date(item.date + 'T00:00:00Z').toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Peso: {item.weight} kg  •  Cintura: {item.waist} cm
                        </p>
                        </div>
                        <Button variant="outline" size="sm">Ver Relatório</Button>
                    </div>
                    ))}
                    {history.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">Nenhuma medição encontrada. Comece fazendo uma nova medição!</p>
                    )}
                </div>
                </CardContent>
                 <CardFooter>
                    <Link href="/dashboard/profile/new-measurement" className="w-full">
                        <Button className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Fazer Nova Medição
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}

const CampaignsContent = () => {
    const [filter, setFilter] = useState<CampaignStatusKey>('active');

    const filteredCampaigns = subscribedCampaigns.filter(campaign => {
        if (filter === 'all') return true;
        const status = getCampaignStatus(campaign.startDate, campaign.endDate);
        return status.key === filter;
    });

    const filterButtons: { label: string, value: CampaignStatusKey }[] = [
        { label: 'Em andamento', value: 'active'},
        { label: 'A iniciar', value: 'upcoming'},
        { label: 'Finalizadas', value: 'finished'},
        { label: 'Todas', value: 'all'},
    ];

    return (
        <div className="space-y-4">
             <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {filterButtons.map(btn => (
                     <Button 
                        key={btn.value}
                        variant={filter === btn.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter(btn.value)}
                        className="shrink-0"
                    >
                        {btn.label}
                    </Button>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                 {filteredCampaigns.map((campaign) => {
                     const typeInfo = getCampaignTypeLabel(campaign.type);
                     const statusInfo = getCampaignStatus(campaign.startDate, campaign.endDate);
                     return (
                        <Card key={campaign.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>{campaign.title}</CardTitle>
                                    <Badge className={`${typeInfo.color} text-white`}>{typeInfo.label}</Badge>
                                </div>
                                <CardDescription>{campaign.description}</CardDescription>
                            </CardHeader>
                             <CardFooter className="flex justify-between items-center">
                                 <p className="text-xs text-muted-foreground">Válido até: {new Date(campaign.endDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                                 <Badge className={`${statusInfo.color} text-white`}>{statusInfo.label}</Badge>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
            
            {filteredCampaigns.length === 0 && subscribedCampaigns.length > 0 && (
                <div className="col-span-full text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-2">Nenhuma campanha encontrada com este filtro.</p>
                </div>
            )}

            {subscribedCampaigns.length === 0 && (
                <div className="col-span-full text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-2">Você não está inscrito em nenhuma campanha no momento.</p>
                    <Link href="/dashboard/campaigns">
                        <Button variant="outline">Ver Campanhas Disponíveis</Button>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default function MyWorkoutsPage() {
    const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const workoutsFromStorage = JSON.parse(localStorage.getItem('savedWorkouts') || '[]');
        setSavedWorkouts(workoutsFromStorage);
        setLoading(false);
    }, []);

    const handleDelete = (workoutId: string) => {
        const updatedWorkouts = savedWorkouts.filter(w => w.id !== workoutId);
        localStorage.setItem('savedWorkouts', JSON.stringify(updatedWorkouts));
        setSavedWorkouts(updatedWorkouts);
    }

  if (loading) {
    return <div className="container mx-auto p-4 md:p-8 text-center">Carregando seus treinos...</div>
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Minha Área</h2>
        <Link href="/dashboard/workout-templates">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar Novo Treino
            </Button>
        </Link>
      </div>

      <Tabs defaultValue="workouts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workouts">
            <ClipboardList className="mr-2 h-4 w-4" />
            Meus Treinos
          </TabsTrigger>
           <TabsTrigger value="progress">
             <BarChart2 className="mr-2 h-4 w-4" />
            Meu Progresso
          </TabsTrigger>
          <TabsTrigger value="campaigns">
             <Megaphone className="mr-2 h-4 w-4" />
            Minhas Campanhas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workouts" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedWorkouts.map((workout) => (
                <Link key={workout.id} href={`/dashboard/my-workouts/${workout.id}`}>
                    <Card className="h-full hover:border-primary transition-colors flex flex-col">
                        <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>{workout.name}</CardTitle>
                                <CardDescription>
                                    Baseado no modelo {workout.template} - Criado em {new Date(workout.date).toLocaleDateString('pt-BR')}
                                </CardDescription>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                    <DropdownMenuItem onClick={() => alert('Função de editar em desenvolvimento.')}>Editar</DropdownMenuItem>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">Excluir</DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Esta ação não pode ser desfeita. Isso excluirá permanentemente o seu treino.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(workout.id)} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <Badge>{workout.goal}</Badge>
                        </CardContent>
                    </Card>
              </Link>
            ))}

            {savedWorkouts.length === 0 && (
                <div className="col-span-full text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">Você ainda não tem treinos salvos.</p>
                    <Link href="/dashboard/workout-templates">
                      <Button variant="outline">
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        Criar meu primeiro treino
                      </Button>
                    </Link>
                </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="progress" className="mt-6">
            <ProgressContent />
        </TabsContent>

        <TabsContent value="campaigns" className="mt-6">
           <CampaignsContent />
        </TabsContent>

      </Tabs>
    </div>
  );
}
