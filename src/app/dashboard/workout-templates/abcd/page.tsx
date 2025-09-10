
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

const initialTreinoA = [
    { id: 1, exercicio: "Supino reto com barra", series: 4, repeticoes: "8-10", descanso: "60" },
    { id: 2, exercicio: "Supino inclinado com halteres", series: 3, repeticoes: "10-12", descanso: "60" },
    { id: 3, exercicio: "Crucifixo inclinado com halteres", series: 3, repeticoes: 12, descanso: "45" },
    { id: 4, exercicio: "Crossover na polia", series: 3, repeticoes: 12, descanso: "45" },
    { id: 5, exercicio: "Abdominal supra com carga", series: 3, repeticoes: 15, descanso: "30" },
    { id: 6, exercicio: "Prancha Isométrica (tempo)", series: 3, repeticoes: "30-45 seg", descanso: "30" },
];

const initialTreinoB = [
    { id: 7, exercicio: "Barra fixa ou puxada frontal", series: 4, repeticoes: "8-10", descanso: "60" },
    { id: 8, exercicio: "Remada curvada com barra ou halteres", series: 3, repeticoes: "10-12", descanso: "60" },
    { id: 9, exercicio: "Remada baixa (cabo ou máquina)", series: 3, repeticoes: 12, descanso: "60" },
    { id: 10, exercicio: "Pulldown com pegada neutra", series: 3, repeticoes: 12, descanso: "60" },
    { id: 11, exercicio: "Encolhimento de ombros (trapézio)", series: 3, repeticoes: 15, descanso: "45" },
];

const initialTreinoC = [
    { id: 12, exercicio: "Agachamento livre", series: 4, repeticoes: "8-10", descanso: "90" },
    { id: 13, exercicio: "Leg press", series: 3, repeticoes: 12, descanso: "60" },
    { id: 14, exercicio: "Mesa flexora (posterior)", series: 3, repeticoes: 12, descanso: "60" },
    { id: 15, exercicio: "Cadeira abdutora ou afundo", series: 3, repeticoes: 12, descanso: "60" },
];

const initialTreinoD = [
    { id: 16, exercicio: "Desenvolvimento com halteres ou barra", series: 3, repeticoes: 10, descanso: "60" },
    { id: 17, exercicio: "Elevação lateral com halteres", series: 3, repeticoes: 15, descanso: "45" },
    { id: 18, exercicio: "Elevação frontal com halteres", series: 3, repeticoes: 12, descanso: "45" },
    { id: 19, exercicio: "Rosca direta com barra (biceps)", series: 3, repeticoes: 12, descanso: "45" },
    { id: 20, exercicio: "Rosca martelo (biceps)", series: 3, repeticoes: 12, descanso: "45" },
    { id: 21, exercicio: "Tríceps corda (ou testa)", series: 3, repeticoes: 12, descanso: "45" },
    { id: 22, exercicio: "Tríceps banco (ou mergulho)", series: 3, repeticoes: 12, descanso: "45" },
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

function WorkoutTemplateABCDContent() {
    const [treinoA, setTreinoA] = useState<Treino[]>(initialTreinoA);
    const [treinoB, setTreinoB] = useState<Treino[]>(initialTreinoB);
    const [treinoC, setTreinoC] = useState<Treino[]>(initialTreinoC);
    const [treinoD, setTreinoD] = useState<Treino[]>(initialTreinoD);
    const router = useRouter();
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const studentId = searchParams.get('studentId');
    const studentName = searchParams.get('studentName');

    const handleWorkoutUpdate = (workoutId: 'A' | 'B' | 'C' | 'D', updatedWorkout: Treino[]) => {
        switch(workoutId) {
            case 'A': setTreinoA(updatedWorkout); break;
            case 'B': setTreinoB(updatedWorkout); break;
            case 'C': setTreinoC(updatedWorkout); break;
            case 'D': setTreinoD(updatedWorkout); break;
        }
    };
    
    const handleFieldChange = (index: number, field: keyof Treino, value: any, workoutId: 'A' | 'B' | 'C' | 'D') => {
        const workoutMap = {'A': treinoA, 'B': treinoB, 'C': treinoC, 'D': treinoD};
        const updatedWorkout = workoutMap[workoutId].map((ex, i) => i === index ? { ...ex, [field]: value } : ex);
        handleWorkoutUpdate(workoutId, updatedWorkout);
    };

    const addExercise = (workoutId: 'A' | 'B' | 'C' | 'D') => {
        const newExercise: Treino = { id: Date.now(), exercicio: "Clique para selecionar", series: 3, repeticoes: 10, descanso: "60" };
        const workoutMap = {'A': treinoA, 'B': treinoB, 'C': treinoC, 'D': treinoD};
        const updatedWorkout = [...workoutMap[workoutId], newExercise];
        handleWorkoutUpdate(workoutId, updatedWorkout);
    };

    const removeExercise = (index: number, workoutId: 'A' | 'B' | 'C' | 'D') => {
        const workoutMap = {'A': treinoA, 'B': treinoB, 'C': treinoC, 'D': treinoD};
        const updatedWorkout = workoutMap[workoutId].filter((_, i) => i !== index);
        handleWorkoutUpdate(workoutId, updatedWorkout);
    }
    
    const getExerciseDetails = (exerciseName: string) => {
        return exerciseList.find(e => e.label === exerciseName);
    }

    const handleSave = () => {
         if (studentId) {
             toast({
                title: "Treino Atribuído!",
                description: `O Treino ABCD foi atribuído para ${studentName}.`,
            });
            router.push('/personal');
            return;
        }

        const newWorkout = {
            id: generateUUID(),
            name: "Meu Treino ABCD",
            template: "ABCD",
            goal: "Personalizado",
            date: new Date().toISOString(),
            days: [
                { day: "Treino A - Peito e Abdômen", exercises: treinoA },
                { day: "Treino B - Costas e Trapézio", exercises: treinoB },
                { day: "Treino C - Pernas e Glúteos", exercises: treinoC },
                { day: "Treino D - Ombros e Braços", exercises: treinoD },
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

    const renderWorkoutTable = (title: string, workout: Treino[], workoutId: 'A' | 'B' | 'C' | 'D') => {
        return (
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
                                                onSelect={(newExercise) => handleFieldChange(index, 'exercicio', newExercise, workoutId)}
                                            />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Input 
                                        value={ex.series} 
                                        onChange={(e) => handleFieldChange(index, 'series', e.target.value, workoutId)}
                                        className="w-20 text-center"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input 
                                        value={ex.repeticoes} 
                                        onChange={(e) => handleFieldChange(index, 'repeticoes', e.target.value, workoutId)}
                                        className="w-20 text-center"
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            value={ex.descanso} 
                                            onChange={(e) => handleFieldChange(index, 'descanso', e.target.value, workoutId)} 
                                            className="w-16"
                                        />
                                        <span>segundos</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => removeExercise(index, workoutId)}>
                                        <XCircle className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
             <Button variant="outline" size="sm" className="mt-4" onClick={() => addExercise(workoutId)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Exercício
            </Button>
        </div>
    )};

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h2 className="text-2xl font-bold mb-6">
                {studentName ? `Personalizar Treino ABCD para ${studentName}` : 'Personalizar Treino ABCD'}
            </h2>
            <div className="space-y-8">
                {renderWorkoutTable("Treino A - Peito e Abdômen", treinoA, 'A')}
                {renderWorkoutTable("Treino B - Costas e Trapézio", treinoB, 'B')}
                {renderWorkoutTable("Treino C - Pernas e Glúteos", treinoC, 'C')}
                {renderWorkoutTable("Treino D - Ombros e Braços", treinoD, 'D')}
            </div>
            <div className="mt-8 flex justify-end">
                <Button onClick={handleSave}>
                     {studentId ? 'Atribuir Treino ao Aluno' : 'Salvar Treino'}
                </Button>
            </div>
        </div>
    );
}


export default function WorkoutTemplateABCDPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <WorkoutTemplateABCDContent />
        </Suspense>
    )
}
