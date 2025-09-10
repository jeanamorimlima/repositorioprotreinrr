
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ClipboardList, User, Dumbbell, HeartPulse, Ruler, Brain, BarChart, Camera } from 'lucide-react';
import { useRouter } from "next/navigation";

const assessmentSections = [
    { 
        id: 'personalData', 
        title: 'Dados Pessoais', 
        icon: User,
        fields: [
            { id: 'fullName', label: 'Nome completo' },
            { id: 'birthDate', label: 'Data de nascimento' },
            { id: 'age', label: 'Idade' },
            { id: 'gender', label: 'Sexo' },
            { id: 'height', label: 'Altura' },
            { id: 'currentWeight', label: 'Peso atual' },
            { id: 'bloodType', label: 'Tipo sanguíneo (opcional)' },
            { id: 'contact', label: 'Contato (telefone / e-mail / WhatsApp)' },
        ]
    },
    { 
        id: 'goals', 
        title: 'Objetivos', 
        icon: Dumbbell,
        fields: [
            { id: 'fatLoss', label: 'Emagrecimento' },
            { id: 'hypertrophy', label: 'Hipertrofia (ganho de massa muscular)' },
            { id: 'muscleDefinition', label: 'Definição muscular' },
            { id: 'conditioning', label: 'Melhora do condicionamento físico' },
            { id: 'rehabilitation', label: 'Reabilitação' },
            { id: 'qualityOfLife', label: 'Qualidade de vida / saúde geral' },
            { id: 'otherGoal', label: 'Outro (campo aberto)' },
        ]
    },
    { 
        id: 'trainingHistory', 
        title: 'Histórico de Treino', 
        icon: ClipboardList,
        fields: [
            { id: 'hasTrained', label: 'Já treinou antes?' },
            { id: 'experienceTime', label: 'Quanto tempo de experiência?' },
            { id: 'trainingFrequency', label: 'Frequência atual ou desejada (ex: 3x por semana)' },
            { id: 'pastActivities', label: 'Tipo de atividade física já praticada' },
            { id: 'currentLevel', label: 'Nível atual: Iniciante / Intermediário / Avançado' },
        ]
    },
    {
        id: 'healthConditions',
        title: 'Condições de Saúde',
        icon: HeartPulse,
        fields: [
            { id: 'currentPastInjury', label: 'Alguma lesão atual ou passada?' },
            { id: 'physicalLimitation', label: 'Alguma limitação física ou articular?' },
            { id: 'medicalDiagnosis', label: 'Diagnóstico médico (ex: hipertensão, diabetes, asma, etc.)' },
            { id: 'continuousMedication', label: 'Usa medicamentos contínuos?' },
            { id: 'surgeryHistory', label: 'Histórico de cirurgias?' },
            { id: 'medicalCertificate', label: 'Atestado médico recente?' },
        ]
    },
    {
        id: 'lifestyle',
        title: 'Estilo de Vida e Hábitos',
        icon: Brain,
        fields: [
            { id: 'dailyRoutine', label: 'Rotina diária (trabalho, estudo, sono)' },
            { id: 'stressLevel', label: 'Nível de estresse' },
            { id: 'trainingTime', label: 'Tempo disponível para treino' },
            { id: 'eatingHabits', label: 'Hábitos alimentares' },
            { id: 'supplementation', label: 'Suplementação (proteína, creatina, etc.)' },
            { id: 'alcoholConsumption', label: 'Consome álcool?' },
            { id: 'smoker', label: 'Fuma?' },
        ]
    },
    {
        id: 'bodyMeasurements',
        title: 'Medidas Corporais (Circunferências)',
        icon: Ruler,
        fields: [
            { id: 'chest', label: 'Peitoral' },
            { id: 'waist', label: 'Cintura' },
            { id: 'abdomen', label: 'Abdômen' },
            { id: 'hips', label: 'Quadril' },
            { id: 'arms', label: 'Braços (direito e esquerdo)' },
            { id: 'thighs', label: 'Coxas (direita e esquerda)' },
            { id: 'calves', label: 'Panturrilhas' },
        ]
    },
    {
        id: 'physicalAssessments',
        title: 'Avaliações Físicas e Índices',
        icon: BarChart,
        fields: [
            { id: 'imc', label: 'IMC (Índice de Massa Corporal)' },
            { id: 'waistHeightRatio', label: 'Relação Cintura/Estatura' },
            { id: 'waistHipRatio', label: 'RCQ (Relação Cintura/Quadril)' },
            { id: 'bodySymmetry', label: 'Simetria corporal' },
            { id: 'strengthResistance', label: 'Resistência e força (exercícios básicos)' },
            { id: 'jointMobility', label: 'Mobilidade articular' },
            { id: 'cardioCapacity', label: 'Capacidade cardiorrespiratória (testes)' },
        ]
    },
    {
        id: 'otherAssessments',
        title: 'Outras Avaliações (opcional)',
        icon: Camera,
        fields: [
            { id: 'progressPhotos', label: 'Fotos de antes (com consentimento)' },
            { id: 'posturalAnalysis', label: 'Análise postural' },
            { id: 'bioimpedance', label: 'Bioimpedância (se tiver disponível)' },
        ]
    },
];

export default function AssessmentTemplatePage() {
    const { toast } = useToast();
    const router = useRouter();

    const handleSaveTemplate = () => {
        // Lógica para salvar os campos selecionados
        toast({
            title: "Modelo Salvo!",
            description: "Seu novo modelo de avaliação foi criado com sucesso."
        });
        router.push('/personal');
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Criar Modelo de Avaliação</h2>
                 <Button onClick={handleSaveTemplate}>Salvar Modelo</Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Construtor de Avaliação</CardTitle>
                    <CardDescription>Selecione os campos que você deseja incluir em seu modelo de avaliação. Este modelo poderá ser aplicado aos seus alunos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="templateName">Nome do Modelo</Label>
                        <Input id="templateName" placeholder="Ex: Avaliação Inicial Completa" />
                    </div>
                    
                    <Separator />

                    {assessmentSections.map(section => (
                        <div key={section.id}>
                            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                <section.icon className="h-5 w-5 text-primary"/>
                                {section.title}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-7">
                                {section.fields.map(field => (
                                    <div key={field.id} className="flex items-center space-x-2">
                                        <Checkbox id={`${section.id}-${field.id}`} />
                                        <Label htmlFor={`${section.id}-${field.id}`} className="font-normal">
                                            {field.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <Separator className="mt-6"/>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveTemplate}>Salvar Modelo</Button>
            </div>
        </div>
    );
}


    