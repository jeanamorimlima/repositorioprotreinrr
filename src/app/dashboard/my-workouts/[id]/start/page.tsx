
"use client";

import { useEffect, useState, useMemo, useRef } from 'react';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { exerciseList } from "@/lib/exercises";
import { ArrowLeft, ArrowRight, Check, Play, Pause, RefreshCw, X, Wind } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Timer } from '@/components/timer';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Exercise = {
    id: number;
    exercicio: string;
    series: number | string;
    repeticoes: number | string;
    descanso: string;
};

type WorkoutDay = {
    day: string;
    exercises: Exercise[];
};

type Workout = {
    id: string;
    name: string;
    days: WorkoutDay[];
};

export default function StartWorkoutPage() {
    const pathname = usePathname();
    const router = useRouter();
    const id = pathname.split('/')[3]; 
    const { toast } = useToast();
    
    const [workout, setWorkout] = useState<Workout | null>(null);
    const [loading, setLoading] = useState(true);
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);
    const [allSetsCompleted, setAllSetsCompleted] = useState<Record<string, boolean[]>>({});
    const [isResting, setIsResting] = useState<Record<string, boolean>>({});
    const [currentRestTime, setCurrentRestTime] = useState<Record<string, number>>({});

    const allExercises = useMemo(() => {
        if (!workout) return [];
        return workout.days.flatMap(day => day.exercises.map(ex => ({ ...ex, dayTitle: day.day })));
    }, [workout]);

     // Function to get the storage key for the current workout
    const getStorageKey = () => `workoutProgress_${id}`;

    useEffect(() => {
        if (id) {
            const workoutsFromStorage = JSON.parse(localStorage.getItem('savedWorkouts') || '[]');
            const currentWorkout = workoutsFromStorage.find((w: Workout) => w.id === id);
            setWorkout(currentWorkout || null);
            if (currentWorkout) {
                 const storageKey = getStorageKey();
                 const savedProgress = JSON.parse(localStorage.getItem(storageKey) || '{}');
                 
                const initialSetsState: Record<string, boolean[]> = {};
                const initialRestingState: Record<string, boolean> = {};
                const initialRestTimeState: Record<string, number> = {};

                currentWorkout.days.flatMap((day: WorkoutDay) => day.exercises).forEach((ex: Exercise) => {
                    const numSeries = typeof ex.series === 'string' ? parseInt(ex.series) || 3 : ex.series;
                    // Use saved progress if available, otherwise initialize to false
                    initialSetsState[String(ex.id)] = savedProgress[ex.id] || Array(numSeries).fill(false);
                    initialRestingState[String(ex.id)] = false;
                    initialRestTimeState[String(ex.id)] = typeof ex.descanso === 'string' ? parseInt(ex.descanso) : 60;
                });
                setAllSetsCompleted(initialSetsState);
                setIsResting(initialRestingState);
                setCurrentRestTime(initialRestTimeState);
            }
        }
        setLoading(false);
    }, [id]);

    useEffect(() => {
        if (!api) return;
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api, allExercises.length]);
    
    // Save progress to localStorage whenever it changes
    useEffect(() => {
        if (id && Object.keys(allSetsCompleted).length > 0) {
            localStorage.setItem(getStorageKey(), JSON.stringify(allSetsCompleted));
        }
    }, [allSetsCompleted, id]);

    const handleSetToggle = (exerciseId: string, setIndex: number) => {
        const setsForExercise = allSetsCompleted[exerciseId];
        const isCurrentlyCompleted = setsForExercise[setIndex];

        if (!isCurrentlyCompleted) {
            if (setIndex > 0 && !setsForExercise[setIndex - 1]) {
                toast({
                    variant: "destructive",
                    title: "Calma, apressadinho!",
                    description: `Você precisa concluir a série ${setIndex} antes de marcar a série ${setIndex + 1}.`,
                });
                return;
            }
            
            const numSeries = setsForExercise.length;
            if (setIndex < numSeries - 1) {
                setIsResting(prev => ({...prev, [exerciseId]: true }));
            }
        }
        
        setAllSetsCompleted(prev => {
            const newSets = [...(prev[exerciseId] || [])];
            newSets[setIndex] = !isCurrentlyCompleted;

            if (isCurrentlyCompleted) {
                for (let i = setIndex + 1; i < newSets.length; i++) {
                    newSets[i] = false;
                }
            }

            return { ...prev, [exerciseId]: newSets };
        });
    };
    
    const handleTimerEnd = (exerciseId: string) => {
        setIsResting(prev => ({...prev, [exerciseId]: false}));
    };

    const handleSkipRest = (exerciseId: string) => {
        setIsResting(prev => ({...prev, [exerciseId]: false}));
    }
    
    const handleFinishWorkout = () => {
        if(id) {
            localStorage.removeItem(getStorageKey());
        }
        router.push(`/dashboard/my-workouts`);
    }

    if (loading) {
        return <div className="container mx-auto p-8 text-center">Carregando treino...</div>;
    }
    if (!workout) {
        return <div className="container mx-auto p-8 text-center">Treino não encontrado.</div>;
    }

    const progressPercentage = count > 0 ? (current / count) * 100 : 0;
    const isWorkoutFinished = allExercises.every(ex => allSetsCompleted[String(ex.id)]?.every(Boolean));
    
    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            <header className="flex items-center justify-between p-4 border-b border-gray-700">
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="ghost" size="icon"><X/></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Se você sair agora, seu progresso neste treino será salvo para você continuar depois. Para finalizar completamente, vá até o final.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Continuar Treino</AlertDialogCancel>
                            <AlertDialogAction onClick={() => router.push(`/dashboard/my-workouts/${id}`)} className="bg-destructive hover:bg-destructive/90">Sair do Treino</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <div className="text-center">
                    <h1 className="text-lg font-bold">{workout.name}</h1>
                    <p className="text-xs text-muted-foreground">Exercício {current} de {count}</p>
                </div>
                <div className="w-8"></div>
            </header>
            
            <div className="w-full">
                <Progress value={progressPercentage} className="h-1 bg-primary/20" />
            </div>

            <main className="flex-1 flex flex-col">
                 <Carousel setApi={setApi} className="w-full flex-1 flex flex-col">
                    <CarouselContent className="flex-1">
                        {allExercises.map((ex, index) => {
                            const details = exerciseList.find(e => e.label === ex.exercicio);
                            const numSeries = typeof ex.series === 'string' ? parseInt(ex.series) || 3 : ex.series;
                            const isExerciseCompleted = allSetsCompleted[String(ex.id)]?.every(Boolean);

                            return (
                                <CarouselItem key={index} className="flex flex-col">
                                    <div className="p-4 md:p-8 flex-1 flex flex-col justify-between">
                                        <Card className="flex-1 flex flex-col bg-gray-800 border-gray-700 text-white">
                                            <CardContent className="p-4 flex flex-col items-center justify-center flex-1">
                                                <Image 
                                                    src={details?.imageUrl || "https://placehold.co/300x300.png"} 
                                                    alt={`Ilustração do exercício ${ex.exercicio}`}
                                                    width={250}
                                                    height={250}
                                                    className="rounded-lg object-cover mb-4"
                                                    data-ai-hint={details?.aiHint || "exercise"}
                                                />
                                                <h2 className="text-xl md:text-2xl font-bold text-center">{ex.exercicio}</h2>
                                                <p className="text-sm text-muted-foreground">{ex.dayTitle}</p>
                                            </CardContent>
                                        </Card>
                                        
                                        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                                            <div className="grid grid-cols-3 text-center mb-4">
                                                <div><p className="font-bold text-2xl">{ex.series}</p><p className="text-xs text-muted-foreground">SÉRIES</p></div>
                                                <div><p className="font-bold text-2xl">{ex.repeticoes}</p><p className="text-xs text-muted-foreground">REPS</p></div>
                                                <div><p className="font-bold text-2xl">{ex.descanso}s</p><p className="text-xs text-muted-foreground">DESCANSO</p></div>
                                            </div>

                                            {isResting[String(ex.id)] ? (
                                                <Timer 
                                                    key={`${ex.id}-timer`}
                                                    duration={currentRestTime[String(ex.id)]} 
                                                    onTimerEnd={() => handleTimerEnd(String(ex.id))}
                                                    onSkip={() => handleSkipRest(String(ex.id))}
                                                />
                                            ) : (
                                                <div className="flex flex-wrap items-center justify-center gap-2">
                                                    {Array.from({ length: numSeries }).map((_, i) => {
                                                        const isSetCompleted = allSetsCompleted[String(ex.id)]?.[i];
                                                        const isPreviousSetCompleted = i === 0 || allSetsCompleted[String(ex.id)]?.[i - 1];
                                                        const isDisabled = !isSetCompleted && !isPreviousSetCompleted;

                                                        return (
                                                            <div key={i} 
                                                                 className={cn(
                                                                    "flex flex-col items-center justify-center p-3 rounded-md transition-colors w-24 h-24",
                                                                    isSetCompleted ? 'bg-green-500/20 text-green-400' : 'bg-gray-700',
                                                                    isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                                                 )} 
                                                                 onClick={() => !isDisabled && handleSetToggle(String(ex.id), i)}>
                                                                <Label htmlFor={`set-${ex.id}-${i}`} className="font-semibold text-lg cursor-pointer">
                                                                    Série {i + 1}
                                                                </Label>
                                                                <Checkbox 
                                                                    id={`set-${ex.id}-${i}`}
                                                                    checked={isSetCompleted}
                                                                    disabled={isDisabled}
                                                                    onCheckedChange={() => !isDisabled && handleSetToggle(String(ex.id), i)}
                                                                    className="h-6 w-6 border-gray-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white mt-2"
                                                                />
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}

                                            {isExerciseCompleted && !isResting[String(ex.id)] && (
                                                <div className="mt-4 p-4 flex justify-center">
                                                    <Button 
                                                        size="lg" 
                                                        className="w-full md:w-1/2"
                                                        onClick={() => api?.scrollNext()}
                                                        disabled={!isExerciseCompleted}
                                                    >
                                                        Próximo Exercício
                                                        <ArrowRight className="ml-2 h-5 w-5" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CarouselItem>
                            )
                        })}
                         {isWorkoutFinished && (
                               <CarouselItem className="flex flex-col h-full">
                                   <div className="p-4 md:p-8 flex flex-col flex-1 items-center justify-center text-center">
                                       <h2 className="text-4xl font-bold text-primary mb-2">Parabéns!</h2>
                                       <p className="text-lg text-muted-foreground mb-6">Você concluiu o treino de hoje. Ótimo trabalho!</p>
                                        <Button size="lg" onClick={handleFinishWorkout}>Finalizar Treino</Button>
                                   </div>
                               </CarouselItem>
                         )}
                    </CarouselContent>
                </Carousel>
            </main>
        </div>
    );
}
