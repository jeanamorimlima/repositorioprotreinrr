
"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ExerciseSearch } from "@/components/exercise-search";
import Image from "next/image";
import { exerciseList } from "@/lib/exercises";
import { useToast } from "@/hooks/use-toast";
import { Suspense } from "react";

const initialTreinoFullBody = [
    { id: 1, exercicio: "Supino reto com barra", series: 3, repeticoes: "8-12", descanso: "60" },
    { id: 2, exercicio: "Puxada frente (pulldown)", series: 3, repeticoes: "8-12", descanso: "60" },
    { id: 3, exercicio: "Agachamento livre", series: 3, repeticoes: "8-12", descanso: "90" },
    { id: 4, exercicio: "Desenvolvimento com halteres", series: 2, repeticoes: "10-12", descanso: "45" },
    { id: 5, exercicio: "Rosca direta com barra", series: 2, repeticoes: "12", descanso: "45" },
    { id: 6, exercicio: "Tríceps pulley com corda", series: 2, repeticoes: "12", descanso: "45" },
    { id: 7, exercicio: "Elevação de panturrilha em pé", series: 3, repeticoes: "15", descanso: "45" },
];
  
type Treino = {
    id: number;
    exercicio: string;
    series: number | string;
    repeticoes: number | string;
    descanso: string;
}

// Fallback para crypto.randomUUID
function generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback para ambientes sem crypto.randomUUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function WorkoutTemplateFullBodyContent() {
    const [treino, setTreino] = useState<Treino[]>(initialTreinoFullBody);
    const router = useRouter();
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const studentId = searchParams.get('studentId');
    const studentName = searchParams.get('studentName');


    const handleFieldChange = (index: number, field: keyof Treino, value: any) => {
        setTreino(prev => prev.map((ex, i) => i === index ? { ...ex, [field]: value } : ex));
    };

    const addExercise = () => {
        const newExercise: Treino = { id: Date.now(), exercicio: "Clique para selecionar", series: 3, repeticoes: 10, descanso: "60" };
        setTreino([...treino, newExercise]);
    };

    const removeExercise = (index: number) => {
        setTreino(prev => prev.filter((_, i) => i !== index));
    }
    
    const getExerciseDetails = (exerciseName: string) => {
        return exerciseList.find(e => e.label === exerciseName);
    }

    const handleSave = () => {
         if (studentId) {
             toast({
                title: "Treino Atribuído!",
                description: `O Treino Full Body foi atribuído para ${studentName}.`,
            });
            router.push('/personal');
            return;
        }

        const newWorkout = {
            id: generateUUID(),
            name: "Meu Treino Full Body",
            template: "Full Body",
            goal: "Personalizado",
            date: new Date().toISOString(),
            days: [
                { day: "Treino Full Body", exercises: treino },
            ]
        };

        const existingWorkouts = JSON.parse(localStorage.getItem('savedWorkouts') || '[]');
        localStorage.setItem('savedWorkouts', JSON.stringify([...existingWorkouts, newWorkout]));

        toast({
            title: "Treino Salvo!",
            description: "Seu novo treino foi adicionado à lista 'Meus Treinos'.",
        });
        
        router.push('/dashboard/my-workouts');
    };

    const renderWorkoutTable = (title: string, workout: Treino[]) => (
        <div>
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[300px]">Exercício</TableHead>
                            <TableHead className="text-center">Séries</TableHead>
                            <TableHead className="text-center">Reps</TableHead>
                            <TableHead>Descanso</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {workout.map((ex, index) => {
                            const details = getExerciseDetails(ex.exercicio);
                            return (
                                <TableRow key={ex.id}>
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
                                        <div className="flex-1">
                                            <ExerciseSearch
                                                value={ex.exercicio}
                                                onSelect={(newExercise) => handleFieldChange(index, 'exercicio', newExercise)}
                                            />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Input 
                                        value={ex.series} 
                                        onChange={(e) => handleFieldChange(index, 'series', e.target.value)}
                                        className="w-20 text-center"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input 
                                        value={ex.repeticoes} 
                                        onChange={(e) => handleFieldChange(index, 'repeticoes', e.target.value)}
                                        className="w-20 text-center"
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            value={ex.descanso} 
                                            onChange={(e) => handleFieldChange(index, 'descanso', e.target.value)} 
                                            className="w-16"
                                        />
                                        <span>segundos</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => removeExercise(index)}>
                                        <XCircle className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
            <Button variant="outline" size="sm" className="mt-4" onClick={addExercise}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Exercício
            </Button>
        </div>
    );

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h2 className="text-2xl font-bold mb-6">
                {studentName ? `Personalizar Treino Full Body para ${studentName}` : 'Personalizar Treino Full Body'}
            </h2>
            <div className="space-y-8">
                {renderWorkoutTable("Treino Full Body", treino)}
            </div>
            <div className="mt-8 flex justify-end">
                <Button onClick={handleSave}>
                     {studentId ? 'Atribuir Treino ao Aluno' : 'Salvar Treino'}
                </Button>
            </div>
        </div>
    );
}


export default function WorkoutTemplateFullBodyPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <WorkoutTemplateFullBodyContent />
        </Suspense>
    )
}
