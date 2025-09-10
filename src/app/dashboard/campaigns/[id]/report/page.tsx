
"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Share2, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { toPng } from 'html-to-image';
import { useToast } from "@/hooks/use-toast";


const mockReportData = {
    campaignTitle: 'Desafio 30 Dias de Agachamento',
    initial: {
        date: '2024-08-01',
        photo: 'https://placehold.co/400x600.png',
        weight: 80,
        waist: 90,
        hips: 102,
        thighRight: 60,
    },
    final: {
        date: '2024-08-31',
        photo: 'https://placehold.co/400x600.png',
        weight: 77,
        waist: 85,
        hips: 104,
        thighRight: 62,
    }
};


const ResultCard = ({ title, before, after, unit }: { title: string; before: number; after: number; unit: string; }) => {
    const difference = after - before;
    const isPositive = difference > 0;
    const isNeutral = difference === 0;
    const Icon = isNeutral ? Sparkles : (isPositive ? TrendingUp : TrendingDown);
    const color = isNeutral ? 'text-blue-500' : (isPositive ? 'text-green-500' : 'text-red-500');

    return (
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="font-semibold">{title}</span>
            <div className="flex items-center gap-2 text-right">
                <span className="font-mono text-sm text-muted-foreground">{before}{unit} → {after}{unit}</span>
                <div className={`flex items-center gap-1 font-bold ${color}`}>
                    <Icon className="h-4 w-4" />
                    <span>{isPositive ? '+' : ''}{difference.toFixed(1)}{unit}</span>
                </div>
            </div>
        </div>
    );
};

export default function CampaignReportPage() {
    const router = useRouter();
    const params = useParams();
    const { id: campaignId } = params;
    const reportCardRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const [isSharing, setIsSharing] = useState(false);

    const { campaignTitle, initial, final } = mockReportData;
    
    // In a real app, you would fetch the report data based on campaignId and user
    if (!campaignId) {
        return <div>Carregando relatório...</div>
    }
    
    const handleShare = async () => {
        if (!reportCardRef.current || isSharing) return;

        setIsSharing(true);
        toast({ title: 'Gerando imagem para compartilhar...' });

        try {
            const dataUrl = await toPng(reportCardRef.current, { cacheBust: true, pixelRatio: 2 });
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], "resultado-desafio.png", { type: blob.type });

            const shareUrl = window.location.href;
            const shareText = `Confira meu resultado no ${campaignTitle}!`;

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: shareText,
                });
                toast({ title: 'Compartilhado com sucesso!' });
            } else if (navigator.share) {
                // Fallback for when image sharing is not supported, but text/url is.
                 await navigator.clipboard.writeText(shareUrl);
                toast({
                    title: 'Link copiado!',
                    description: 'O link para o seu resultado foi copiado. Cole-o no seu Story!',
                });
                await navigator.share({
                    title: shareText,
                    text: 'Para ver o resultado completo, arraste para cima!',
                    url: shareUrl,
                });
            } else {
                 await navigator.clipboard.writeText(shareUrl);
                toast({
                    variant: 'default',
                    title: 'Link copiado!',
                    description: 'Compartilhamento não suportado neste navegador. O link do seu resultado foi copiado para a área de transferência.'
                });
            }
        } catch (err) {
            console.error('Failed to share:', err);
            toast({
                variant: 'destructive',
                title: 'Erro ao compartilhar',
                description: 'Não foi possível gerar a imagem para compartilhamento. Tente novamente.',
            });
        } finally {
            setIsSharing(false);
        }
    };


    const handleDownload = async () => {
        if (!reportCardRef.current) return;
        toast({ title: 'Gerando imagem para download...' });

        try {
            const dataUrl = await toPng(reportCardRef.current, { cacheBust: true, pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = 'meu-resultado-protreining.png';
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to download image:', err);
            toast({
                variant: 'destructive',
                title: 'Erro ao baixar imagem',
                description: 'Não foi possível gerar a imagem. Tente novamente.',
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                 <Button variant="outline" onClick={() => router.push(`/dashboard/campaigns/${campaignId}`)} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Desafio
                </Button>
                <Card id="report-card" ref={reportCardRef} className="bg-white overflow-hidden shadow-2xl">
                    <CardHeader className="text-center bg-gradient-to-br from-primary to-blue-400 text-white p-6">
                        <div className="flex justify-center mb-2">
                           <Sparkles className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-3xl">{campaignTitle}</CardTitle>
                        <CardDescription className="text-primary-foreground/80">Confira seus resultados incríveis!</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="text-center">
                                <h3 className="text-lg font-bold mb-2">ANTES</h3>
                                <Image src={initial.photo} alt="Foto de antes" width={400} height={600} className="rounded-lg object-cover mx-auto" data-ai-hint="fitness before"/>
                                <p className="text-sm text-muted-foreground mt-2">{new Date(initial.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                            </div>
                             <div className="text-center">
                                <h3 className="text-lg font-bold mb-2">DEPOIS</h3>
                                <Image src={final.photo} alt="Foto de depois" width={400} height={600} className="rounded-lg object-cover mx-auto" data-ai-hint="fitness after"/>
                                <p className="text-sm text-muted-foreground mt-2">{new Date(final.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Resultados Incríveis</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                               <ResultCard title="Peso Corporal" before={initial.weight} after={final.weight} unit="kg" />
                               <ResultCard title="Cintura" before={initial.waist} after={final.waist} unit="cm" />
                               <ResultCard title="Quadril" before={initial.hips} after={final.hips} unit="cm" />
                               <ResultCard title="Coxa Direita" before={initial.thighRight} after={final.thighRight} unit="cm" />
                            </CardContent>
                        </Card>

                    </CardContent>
                </Card>
                 <div className="flex-col sm:flex-row flex gap-2 mt-4">
                    <Button size="lg" className="w-full flex-1" onClick={handleShare} disabled={isSharing}>
                        <Share2 className="mr-2"/>
                        {isSharing ? 'Gerando...' : 'Compartilhar Resultado'}
                    </Button>
                        <Button size="lg" variant="outline" className="w-full flex-1" onClick={handleDownload}>
                        <Download className="mr-2"/>
                        Baixar como Imagem
                    </Button>
                </div>
            </div>
        </div>
    );
}
