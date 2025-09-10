
"use client";

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ArrowDown, ArrowUp, CheckCircle, Scale, BarChart, TrendingUp, DraftingCompass, Aperture, HeartPulse, UserCheck, Percent, Bone, Ruler } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type AnalysisData = {
    [key: string]: string;
};

const AnalysisPageContent = () => {
    const searchParams = useSearchParams();
    const [data, setData] = useState<AnalysisData>({});
    const [formattedDate, setFormattedDate] = useState<string | null>(null);

    useEffect(() => {
        const paramsData: AnalysisData = {};
        searchParams.forEach((value, key) => {
            paramsData[key] = value;
        });
        setData(paramsData);
        
        if (paramsData.date) {
            // Adding a 'Z' to the date string treats it as UTC and avoids timezone issues.
            setFormattedDate(new Date(paramsData.date + 'T00:00:00Z').toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC' 
            }));
        }
    }, [searchParams]);

    const weight = parseFloat(data.weight);
    const height = parseFloat(data.height);
    const cintura = parseFloat(data.waist);
    const quadril = parseFloat(data.hips);
    const neck = parseFloat(data.neck);
    const gender = data.gender;
    const armContractedRight = parseFloat(data.armContractedRight);
    const armContractedLeft = parseFloat(data.armContractedLeft);
    const thighRight = parseFloat(data.thighRight);
    const thighLeft = parseFloat(data.thighLeft);
    const experienceLevel = data.experienceLevel;
    const weeklyFrequency = parseInt(data.weeklyFrequency);


    // 1. IMC
    const getImc = () => {
        if (!weight || !height) return { value: 'N/A', classification: 'Dados insuficientes', color: 'bg-gray-400' };
        const imc = weight / (height * height);
        let classification = '';
        let color = '';
        if (imc < 18.5) {
            classification = 'Abaixo do peso';
            color = 'bg-blue-500';
        } else if (imc >= 18.5 && imc <= 24.9) {
            classification = 'Peso ideal';
            color = 'bg-green-500';
        } else if (imc >= 25.0 && imc <= 29.9) {
            classification = 'Sobrepeso';
            color = 'bg-yellow-500';
        } else if (imc >= 30.0 && imc <= 34.9) {
            classification = 'Obesidade grau I';
            color = 'bg-orange-500';
        } else if (imc >= 35.0 && imc <= 39.9) {
            classification = 'Obesidade grau II';
            color = 'bg-red-500';
        } else {
            classification = 'Obesidade grau III';
            color = 'bg-red-700';
        }
        return { value: imc.toFixed(2), classification, color };
    };

    // 2. RCQ
    const getRcq = () => {
        if (!cintura || !quadril || !gender) return { value: 'N/A', risk: 'Dados insuficientes', color: 'bg-gray-400' };
        const rcq = cintura / quadril;
        let risk = '';
        let color = 'bg-gray-400';
        if (gender === 'male') {
            if (rcq > 0.90) { risk = 'Risco Alto'; color = 'bg-red-500'; }
            else if (rcq >= 0.86) { risk = 'Risco Moderado'; color = 'bg-orange-500'; }
            else { risk = 'Risco Baixo'; color = 'bg-green-500'; }
        } else { // female
            if (rcq > 0.85) { risk = 'Risco Alto'; color = 'bg-red-500'; }
            else if (rcq >= 0.81) { risk = 'Risco Moderado'; color = 'bg-orange-500'; }
            else { risk = 'Risco Baixo'; color = 'bg-green-500'; }
        }
        return { value: rcq.toFixed(2), risk, color };
    };

    // 3. RCE
    const getRce = () => {
        if (!cintura || !height) return { value: 'N/A', risk: 'Dados insuficientes', color: 'bg-gray-400' };
        const rce = cintura / (height * 100);
        let risk = '';
        let color = 'bg-gray-400';
        if (rce < 0.5) { risk = 'Ideal'; color = 'bg-green-500'; }
        else { risk = 'Risco aumentado'; color = 'bg-red-500'; }
        return { value: rce.toFixed(2), risk, color };
    };
    
    // 4. % Gordura (Marinha)
    const getBodyFatNavy = () => {
        if (!height || !neck || !cintura || !gender) return { value: 'N/A', classification: 'Dados insuficientes', color: 'bg-gray-400' };
        const heightCm = height * 100;
        let bodyFat = 0;
        if (gender === 'male') {
            if (cintura <= neck) return { value: 'N/A', classification: 'Medidas inválidas', color: 'bg-gray-400' };
            bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(cintura - neck) + 0.15456 * Math.log10(heightCm)) - 450;
        } else { // female
            if (!quadril || (cintura + quadril) <= neck) return { value: 'N/A', classification: 'Medidas inválidas', color: 'bg-gray-400' };
            bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(cintura + quadril - neck) + 0.22100 * Math.log10(heightCm)) - 450;
        }

        let classification = '';
        let color = 'bg-gray-400';
        if (gender === 'male') {
            if (bodyFat < 6) { classification = 'Muito Baixo'; color = 'bg-blue-500'; }
            else if (bodyFat <= 13) { classification = 'Atleta'; color = 'bg-green-500'; }
            else if (bodyFat <= 17) { classification = 'Bom'; color = 'bg-green-400'; }
            else if (bodyFat <= 24) { classification = 'Normal'; color = 'bg-yellow-500'; }
            else { classification = 'Alto'; color = 'bg-red-500'; }
        } else { // female
            if (bodyFat < 14) { classification = 'Muito Baixo'; color = 'bg-blue-500'; }
            else if (bodyFat <= 20) { classification = 'Atleta'; color = 'bg-green-500'; }
            else if (bodyFat <= 24) { classification = 'Bom'; color = 'bg-green-400'; }
            else if (bodyFat <= 31) { classification = 'Normal'; color = 'bg-yellow-500'; }
            else { classification = 'Alto'; color = 'bg-red-500'; }
        }
        return { value: bodyFat.toFixed(2) + '%', classification, color };
    };

    // 5. Simetria
    const getSymmetry = () => {
        if (!armContractedRight || !armContractedLeft || !thighRight || !thighLeft) {
            return { armMessage: 'Dados insuficientes para análise de simetria dos braços.', thighMessage: 'Dados insuficientes para análise de simetria das pernas.', isSymmetric: true };
        }
        const armDiff = Math.abs(armContractedRight - armContractedLeft);
        const thighDiff = Math.abs(thighRight - thighLeft);
        const armSymmetric = armDiff <= 1;
        const thighSymmetric = thighDiff <= 1.5;

        const armMessage = armSymmetric 
            ? `Seus braços estão bem simétricos (${armContractedRight}cm vs ${armContractedLeft}cm). Ótimo trabalho!` 
            : `Seu braço direito e esquerdo têm uma diferença de ${armDiff.toFixed(1)}cm. Considere focar no equilíbrio.`;
        const thighMessage = thighSymmetric
            ? `Suas coxas estão bem simétricas (${thighRight}cm vs ${thighLeft}cm). Ótimo trabalho!`
            : `Sua coxa direita e esquerda têm uma diferença de ${thighDiff.toFixed(1)}cm. Considere focar no equilíbrio.`;
        
        return { armMessage, thighMessage, armSymmetric, thighSymmetric };
    }
    
     // 6. Nível de experiência
    const getExperienceClassification = () => {
        if (!experienceLevel || !weeklyFrequency) {
            return { level: 'N/A', focus: 'Dados insuficientes', recommendedSplit: 'N/A' };
        }

        if (experienceLevel === 'beginner' || (weeklyFrequency >= 1 && weeklyFrequency <= 3)) {
            return {
                level: 'Iniciante',
                focus: 'Aprender técnica e adaptar o corpo. Progressão rápida (ganhos iniciais).',
                recommendedSplit: 'Full Body, AB',
            };
        } else if (experienceLevel === 'intermediate' || (weeklyFrequency >= 3 && weeklyFrequency <= 5)) {
            return {
                level: 'Intermediário',
                focus: 'Progredir carga e volume. Progressão estável e consistente.',
                recommendedSplit: 'AB, ABC, ABCD',
            };
        } else { // advanced
            return {
                level: 'Avançado',
                focus: 'Atingir metas específicas (performance, estética). Progressão lenta e estratégica.',
                recommendedSplit: 'ABCD, ABCDE, PPL, Upper/Lower',
            };
        }
    };
    
    const imcResult = getImc();
    const rcqResult = getRcq();
    const rceResult = getRce();
    const bodyFatNavyResult = getBodyFatNavy();
    const symmetryResult = getSymmetry();
    const experience = getExperienceClassification();

    const MetricCard = ({ title, value, classification, color, icon: Icon, explanation, children }: any) => (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Icon className="h-6 w-6" />
                        {title}
                    </CardTitle>
                    <Badge className={`${color} text-white`}>{classification}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold mb-2">{value}</p>
                <p className="text-sm text-muted-foreground">{explanation}</p>
                {children}
            </CardContent>
        </Card>
    );

    const MeasurementRow = ({ label, value }: { label: string, value: string | undefined }) => (
         <div className="flex justify-between items-center text-sm p-2 bg-muted rounded-md">
           <span>{label}</span>
           <span className="font-bold">{value ? `${value} cm` : 'N/A'}</span>
        </div>
    )

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold">Relatório de Análise Corporal</h2>
                    {formattedDate && <Badge variant="secondary" className="mt-1">{formattedDate}</Badge>}
                </div>
                 <Link href="/dashboard/my-workouts">
                    <Button variant="outline">Voltar ao Histórico</Button>
                </Link>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                <MetricCard title="IMC (Índice de Massa Corporal)" value={imcResult.value} classification={imcResult.classification} color={imcResult.color} icon={Scale} explanation="Mostra se o seu peso está adequado para sua altura.">
                    <div className="mt-2 text-xs p-2 bg-muted rounded-md">
                        <p><span className="font-bold">Referência Ideal:</span> 18.5 a 24.9</p>
                        <p><span className="font-bold">Fórmula:</span> Peso (kg) / Altura² (m)</p>
                    </div>
                </MetricCard>
                <MetricCard title="RCQ (Relação Cintura/Quadril)" value={rcqResult.value} classification={rcqResult.risk} color={rcqResult.color} icon={HeartPulse} explanation="Mede a gordura acumulada na barriga, um indicador de risco para doenças cardíacas.">
                     <div className="mt-2 text-xs p-2 bg-muted rounded-md">
                        <p><span className="font-bold">Referência Ideal:</span> {gender === 'male' ? 'Abaixo de 0.85' : 'Abaixo de 0.80'}</p>
                        <p><span className="font-bold">Fórmula:</span> Cintura (cm) / Quadril (cm)</p>
                    </div>
                </MetricCard>
                <MetricCard title="RCE (Relação Cintura/Estatura)" value={rceResult.value} classification={rceResult.risk} color={rceResult.color} icon={Aperture} explanation="Avalia se sua cintura está proporcional à sua altura, relacionado a riscos metabólicos.">
                     <div className="mt-2 text-xs p-2 bg-muted rounded-md">
                        <p><span className="font-bold">Referência Ideal:</span> Abaixo de 0.5</p>
                        <p><span className="font-bold">Fórmula:</span> Cintura (cm) / Altura (cm)</p>
                    </div>
                </MetricCard>
                <MetricCard title="% Gordura (Marinha)" value={bodyFatNavyResult.value} classification={bodyFatNavyResult.classification} color={bodyFatNavyResult.color} icon={Percent} explanation="Estimativa do percentual de gordura (fórmula da Marinha dos EUA).">
                     <div className="mt-2 text-xs p-2 bg-muted rounded-md">
                        <p><span className="font-bold">Referência Normal:</span> {gender === 'male' ? '18 a 24%' : '25 a 31%'}</p>
                        <p><span className="font-bold">Fórmula:</span> Baseada em logs de altura, pescoço, cintura e quadril.</p>
                    </div>
                </MetricCard>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                           <UserCheck className="h-6 w-6" />
                            Nível de Experiência
                        </CardTitle>
                         <CardDescription>Sua classificação com base nos dados fornecidos.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-2xl font-bold">{experience.level}</p>
                        <div>
                            <p className="font-semibold">Foco Principal</p>
                            <p className="text-sm text-muted-foreground">{experience.focus}</p>
                        </div>
                         <div>
                            <p className="font-semibold">Divisões de Treino Recomendadas</p>
                            <p className="text-sm text-muted-foreground">{experience.recommendedSplit}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                           <DraftingCompass className="h-6 w-6" />
                            Simetria Corporal
                        </CardTitle>
                         <CardDescription>Avalia o equilíbrio entre os lados do seu corpo. Diferenças de até 1cm (braços) e 1.5cm (pernas) são consideradas normais.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-2">
                           {symmetryResult.armSymmetric ? <CheckCircle className="h-5 w-5 text-green-500 mt-1"/> : <AlertCircle className="h-5 w-5 text-orange-500 mt-1"/>}
                           <div>
                            <p className="font-semibold">Braços</p>
                            <p className="text-sm text-muted-foreground">{symmetryResult.armMessage}</p>
                           </div>
                        </div>
                         <div className="flex items-start gap-2">
                            {symmetryResult.thighSymmetric ? <CheckCircle className="h-5 w-5 text-green-500 mt-1"/> : <AlertCircle className="h-5 w-5 text-orange-500 mt-1"/>}
                             <div>
                                <p className="font-semibold">Pernas</p>
                                <p className="text-sm text-muted-foreground">{symmetryResult.thighMessage}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                 <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                           <Ruler className="h-6 w-6" />
                            Medidas Corporais (Circunferências)
                        </CardTitle>
                        <CardDescription>Suas medidas registradas nesta data.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-x-8 gap-y-2 md:grid-cols-3">
                       <MeasurementRow label="Pescoço" value={data.neck} />
                       <MeasurementRow label="Peitoral" value={data.chest} />
                       <MeasurementRow label="Abdômen" value={data.abdomen} />
                       <MeasurementRow label="Cintura" value={data.waist} />
                       <MeasurementRow label="Quadril" value={data.hips} />
                       <MeasurementRow label="Braço Dir. Relax." value={data.armRelaxedRight} />
                       <MeasurementRow label="Braço Esq. Relax." value={data.armRelaxedLeft} />
                       <MeasurementRow label="Braço Dir. Contr." value={data.armContractedRight} />
                       <MeasurementRow label="Braço Esq. Contr." value={data.armContractedLeft} />
                       <MeasurementRow label="Coxa Direita" value={data.thighRight} />
                       <MeasurementRow label="Coxa Esquerda" value={data.thighLeft} />
                       <MeasurementRow label="Panturrilha Dir." value={data.calfRight} />
                       <MeasurementRow label="Panturrilha Esq." value={data.calfLeft} />
                    </CardContent>
                </Card>

            </div>
            
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Fotos de Progresso</CardTitle>
                    <CardDescription>Sua evolução visual registrada nesta data.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex flex-col items-center">
                            <Image src={data.photoFront || "https://placehold.co/200x300"} width={200} height={300} alt="Foto de frente" className="rounded-md object-cover" data-ai-hint="fitness progress" />
                            <p className="mt-2 font-semibold">Frente</p>
                        </div>
                         <div className="flex flex-col items-center">
                            <Image src={data.photoBack || "https://placehold.co/200x300"} width={200} height={300} alt="Foto de costas" className="rounded-md object-cover" data-ai-hint="fitness progress" />
                            <p className="mt-2 font-semibold">Costas</p>
                        </div>
                         <div className="flex flex-col items-center">
                            <Image src={data.photoSideRight || "https://placehold.co/200x300"} width={200} height={300} alt="Foto do lado direito" className="rounded-md object-cover" data-ai-hint="fitness progress" />
                            <p className="mt-2 font-semibold">Lado Direito</p>
                        </div>
                         <div className="flex flex-col items-center">
                            <Image src={data.photoSideLeft || "https://placehold.co/200x300"} width={200} height={300} alt="Foto do lado esquerdo" className="rounded-md object-cover" data-ai-hint="fitness progress" />
                            <p className="mt-2 font-semibold">Lado Esquerdo</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
};

export default function MyAnalysisPage() {
    return (
        <Suspense fallback={<div>Carregando relatório...</div>}>
            <AnalysisPageContent />
        </Suspense>
    );
}
