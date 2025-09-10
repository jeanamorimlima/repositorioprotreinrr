
"use client"

import React, { useEffect, useState, useRef } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { exerciseList } from "@/lib/exercises";
import { ArrowLeft, PlayCircle, Download } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toPng } from 'html-to-image';
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/logo";


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

// Componente para o layout de impressão
const PrintableWorkout = React.forwardRef<HTMLDivElement, { workout: Workout }>(({ workout }, ref) => {
    return (
      <div ref={ref} className="p-8 bg-white text-black relative">
         <div 
            className="absolute inset-0 z-0 opacity-5 flex items-center justify-center"
        >
            <Logo className="w-1/2 h-auto" />
        </div>
        <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6 text-center">{workout.name}</h2>
            <div className="space-y-8">
                {workout.days.map((day) => (
                <div key={day.day}>
                    <h3 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">{day.day}</h3>
                    <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2 w-2/4">Exercício</th>
                            <th className="p-2 text-center">Séries</th>
                            <th className="p-2 text-center">Reps</th>
                            <th className="p-2">Descanso</th>
                        </tr>
                    </thead>
                    <tbody>
                        {day.exercises.map((ex, index) => (
                        <tr key={index} className="border-b last:border-b-0">
                            <td className="p-2 font-medium">{ex.exercicio}</td>
                            <td className="p-2 text-center font-mono">{ex.series}</td>
                            <td className="p-2 text-center font-mono">{ex.repeticoes}</td>
                            <td className="p-2 font-mono">{ex.descanso}s</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                ))}
            </div>
        </div>
      </div>
    );
});
PrintableWorkout.displayName = 'PrintableWorkout';


export default function ViewWorkoutPage() {
    const pathname = usePathname();
    const id = pathname.split('/').pop();
    const [workout, setWorkout] = useState<Workout | null>(null);
    const [loading, setLoading] = useState(true);
    const printableRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (id) {
            const workoutsFromStorage = JSON.parse(localStorage.getItem('savedWorkouts') || '[]');
            const currentWorkout = workoutsFromStorage.find((w: Workout) => w.id === id);
            setWorkout(currentWorkout || null);
        }
        setLoading(false);
    }, [id]);
    
    const handleDownload = async () => {
        if (!printableRef.current) return;
        
        toast({ title: 'Gerando imagem do treino...' });

        try {
            const dataUrl = await toPng(printableRef.current, {
                backgroundColor: 'white',
                cacheBust: true,
                pixelRatio: 2,
            });
            const link = document.createElement('a');
            link.download = `treino-${workout?.name.replace(/ /g, '_').toLowerCase()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('oops, something went wrong!', err);
            toast({
                variant: 'destructive',
                title: 'Erro ao gerar imagem',
                description: 'Não foi possível baixar o treino como imagem. Tente novamente.'
            });
        }
    };

    if (loading) {
        return <div className="container mx-auto p-8 text-center">Carregando treino...</div>;
    }

    if (!workout) {
        return <div className="container mx-auto p-8 text-center">Treino não encontrado.</div>;
    }
    
    const getExerciseDetails = (exerciseName: string) => {
        return exerciseList.find(e => e.label === exerciseName);
    }

    const renderWorkoutTable = (title: string, exercises: any[]) => (
        <div className="bg-card rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 p-6 pb-2">{title}</h3>
            <div className="rounded-md overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[250px]">Exercício</TableHead>
                            <TableHead className="text-center">Séries</TableHead>
                            <TableHead className="text-center">Reps</TableHead>
                            <TableHead>Descanso</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {exercises.map((ex, index) => {
                            const details = getExerciseDetails(ex.exercicio);
                            return (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-4">
                                            <Image 
                                                src={details?.imageUrl || "https://placehold.co/100x100"} 
                                                alt={`Ilustração do exercício ${ex.exercicio}`}
                                                width={60}
                                                height={60}
                                                className="rounded-md object-cover"
                                                data-ai-hint={details?.aiHint || "exercise"}
                                            />
                                            <span>{ex.exercicio}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-mono">{ex.series}</TableCell>
                                    <TableCell className="text-center font-mono">{ex.repeticoes}</TableCell>
                                    <TableCell className="font-mono">{ex.descanso}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-4 md:p-8 bg-gray-100 text-gray-900">
            {/* Div oculta para impressão */}
            <div className="fixed -left-[9999px] top-0">
                <PrintableWorkout ref={printableRef} workout={workout} />
            </div>

            <div className="flex justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/my-workouts">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4"/>
                        </Button>
                    </Link>
                    <h2 className="text-2xl font-bold">{workout.name}</h2>
                </div>
                <div className="flex gap-2">
                     <Button variant="outline" onClick={handleDownload}>
                        <Download className="mr-2 h-5 w-5"/>
                        Baixar
                    </Button>
                    <Link href={`/dashboard/my-workouts/${id}/start`}>
                        <Button size="lg" className="bg-primary hover:bg-primary/90">
                            <PlayCircle className="mr-2 h-5 w-5"/>
                            Iniciar Treino
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="space-y-8">
                {workout.days.map((day) => (
                    <div key={day.day}>
                        {renderWorkoutTable(day.day, day.exercises)}
                    </div>
                ))}
            </div>
        </div>
    );
}
