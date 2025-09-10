
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const workoutTemplates = [
  {
    id: "ab",
    title: "AB",
    description: "Treino dividido em dois dias: um para parte superior (empurrar) e outro para parte inferior e puxar. É ideal para iniciantes ou quem tem poucos dias na semana para treinar (2 a 3x por semana). Foco no básico bem feito, com volume equilibrado.",
    division: [
        "Treino A: Peito, Ombro, Tríceps",
        "Treino B: Costas, Bíceps, Pernas"
    ],
    exercisesPerGroup: [
      "Peito: 2",
      "Ombro: 2",
      "Tríceps: 2",
      "Costas: 2",
      "Bíceps: 2",
      "Pernas: 3",
      "Abdômen: 1 (em dias alternados ou ambos)",
    ],
  },
  {
    id: "abc",
    title: "ABC",
    description: "Treino dividido em três dias, com foco em separar bem os grupos musculares. Ideal para quem treina 3 a 5x por semana e já tem alguma experiência. Permite melhor recuperação muscular e mais volume por grupo.",
    division: [
        "Treino A: Peito, Tríceps",
        "Treino B: Costas, Bíceps",
        "Treino C: Pernas, Ombros, Abdômen"
    ],
    exercisesPerGroup: [
        "Peito: 3",
        "Tríceps: 2",
        "Costas: 3",
        "Bíceps: 2",
        "Pernas: 4",
        "Ombros: 2",
        "Abdômen: 1 ou 2"
    ],
  },
  {
    id: "abcd",
    title: "ABCD",
    description: "Divisão em 4 dias, ideal para quem busca mais volume por grupo muscular, com recuperação adequada. Cada grupo é trabalhado com maior intensidade e variedade. Indicado para praticantes intermediários e avançados.",
    division: [
        "Treino A: Peito e Abdômen",
        "Treino B: Costas e Trapézio",
        "Treino C: Pernas e Glúteos",
        "Treino D: Ombros e Braços (Bíceps + Tríceps)"
    ],
    exercisesPerGroup: [
        "Peito: 4",
        "Costas: 4",
        "Pernas: 4",
        "Ombros: 3",
        "Bíceps: 2",
        "Tríceps: 2",
        "Abdômen: 1–2",
        "Trapézio: 1"
    ],
  },
  {
    id: "abcd-2",
    title: "ABCD (Versão 2)",
    description: "Treino dividido em 4 dias, focando em combinar grupos musculares complementares para melhor recuperação e volume. Indicado para intermediários e avançados que buscam um treino mais focado e organizado.",
    division: [
        "Treino A: Peito e Tríceps",
        "Treino B: Costas e Bíceps",
        "Treino C: Pernas completo (quadríceps, posterior, glúteos)",
        "Treino D: Ombro e Trapézio"
    ],
    exercisesPerGroup: [
        "Peito: 4",
        "Tríceps: 3",
        "Costas: 4",
        "Bíceps: 3",
        "Pernas: 5 (completo)",
        "Ombros: 3",
        "Trapézio: 2"
    ],
  },
  {
    id: "abcde",
    title: "ABCDE",
    description: "Treino dividido em 5 dias, onde cada grupo muscular recebe atenção exclusiva em um dia específico. Indicado para praticantes avançados que treinam de 5 a 6 vezes por semana e querem maximizar volume, intensidade e recuperação.",
    division: [
        "Treino A: Peito",
        "Treino B: Costas",
        "Treino C: Pernas",
        "Treino D: Ombros",
        "Treino E: Braços (Bíceps e Tríceps)"
    ],
    exercisesPerGroup: [
        "Peito: 6",
        "Costas: 6",
        "Pernas: 6",
        "Ombros: 5",
        "Bíceps: 3",
        "Tríceps: 3"
    ],
  },
  {
    id: "full-body",
    title: "Full Body",
    description: "Treino que trabalha todos os grupos musculares no mesmo dia, ideal para quem tem pouco tempo ou está começando. Pode ser realizado de 2 a 4 vezes por semana, com variações na intensidade e exercícios para estimular o corpo todo.",
    division: [
      "Peito",
      "Costas",
      "Pernas",
      "Ombros",
      "Braços (bíceps e tríceps)",
      "Panturrilhas"
    ],
    exercisesPerGroup: [
      "Peito: 2–3",
      "Costas: 2–3",
      "Pernas: 3",
      "Ombros: 2",
      "Braços: 2–3",
      "Panturrilhas: 1–2",
    ],
  },
  {
    id: "upper-lower",
    title: "Upper/Lower",
    description: "Treino dividido em dois dias, focando membros superiores em um dia e membros inferiores no outro. Excelente para quem treina 4 vezes por semana, pois permite boa recuperação e equilíbrio entre força e resistência.",
    division: [
        "Upper (Superior): Peito, costas, ombros, braços (bíceps e tríceps)",
        "Lower (Inferior): Pernas, glúteos, panturrilhas"
    ],
    exercisesPerGroup: [
        "Peito, costas, ombros, braços: 2–3 exercícios por grupo",
        "Pernas, glúteos, panturrilhas: 3–4 exercícios por grupo"
    ],
  },
  {
    id: "push-pull-legs",
    title: "Push/Pull/Legs",
    description: "Treino dividido em três dias com base no tipo de movimento: Push (Empurrar), Pull (Puxar) e Legs (Pernas). Ideal para quem treina de 3 a 7 vezes por semana, permitindo foco intenso e boa recuperação.",
    division: [
        "Push (Empurrar): peito, ombros, tríceps",
        "Pull (Puxar): costas, bíceps",
        "Legs (Pernas): pernas, glúteos"
    ],
    exercisesPerGroup: [
        "Push: 3 exercícios por músculo (peito, ombro, tríceps)",
        "Pull: 3 exercícios por músculo (costas, bíceps)",
        "Legs: 3 exercícios por músculo (pernas, glúteos)"
    ],
  },
];

const getTemplateHref = (id: string, studentId?: string | null, studentName?: string | null) => {
    let baseHref = '#';
    switch (id) {
        case 'ab': baseHref = '/dashboard/workout-templates/ab'; break;
        case 'abc': baseHref = '/dashboard/workout-templates/abc'; break;
        case 'abcd': baseHref = '/dashboard/workout-templates/abcd'; break;
        case 'abcd-2': baseHref = '/dashboard/workout-templates/abcd-2'; break;
        case 'abcde': baseHref = '/dashboard/workout-templates/abcde'; break;
        case 'full-body': baseHref = '/dashboard/workout-templates/full-body'; break;
        case 'upper-lower': baseHref = '/dashboard/workout-templates/upper-lower'; break;
        case 'push-pull-legs': baseHref = '/dashboard/workout-templates/push-pull-legs'; break;
    }

    if (studentId) {
        return `${baseHref}?studentId=${studentId}&studentName=${encodeURIComponent(studentName || '')}`;
    }
    return baseHref;
}

function WorkoutTemplatesContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');
  const studentName = searchParams.get('studentName');

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6">
        {studentName ? `Selecionar Modelo para ${studentName}` : 'Modelos de Treinos'}
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {workoutTemplates.map((template) => (
          <AccordionItem value={template.id} key={template.id}>
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              {template.title}
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-white rounded-md mt-2">
              <p className="mb-4 text-muted-foreground">{template.description}</p>
              
              <div className="mb-4">
                <h4 className="font-bold mb-2">Divisão Proposta:</h4>
                <div className="flex flex-wrap gap-2">
                    {template.division.map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">{item}</Badge>
                    ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold mb-2">Nº de Exercícios por Grupo:</h4>
                <div className="flex flex-wrap gap-2">
                    {template.exercisesPerGroup.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-sm">{item}</Badge>
                    ))}
                </div>
              </div>

              <Link href={getTemplateHref(template.id, studentId, studentName)}>
                <Button>Usar como Modelo</Button>
              </Link>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}


export default function WorkoutTemplatesPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <WorkoutTemplatesContent />
        </Suspense>
    )
}
