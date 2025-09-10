
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Tag, Info, ExternalLink, CreditCard, Camera, Trophy, CheckCircle, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

type CampaignType = 'promocao' | 'oferta' | 'ebook' | 'evento_workshop' | 'desafio' | 'imagem_unica';

type Campaign = {
    id: string;
    title: string;
    description: string;
    type: CampaignType;
    startDate: string;
    endDate: string;
    imageUrl?: string;
    price?: number;
    isFree: boolean;
    buttonText?: string;
    whatsappGroupUrl?: string;
    requireMeasurements?: boolean;
    ctaLink?: string;
};

const getCampaignTypeLabel = (type: string) => {
    switch (type) {
        case 'promocao': return { label: 'Promoção', color: 'bg-blue-500' };
        case 'oferta': return { label: 'Oferta', color: 'bg-orange-500' };
        case 'ebook': return { label: 'E-book', color: 'bg-purple-500' };
        case 'evento_workshop': return { label: 'Evento/Workshop', color: 'bg-teal-500' };
        case 'desafio': return { label: 'Desafio', color: 'bg-yellow-500' };
        case 'imagem_unica': return { label: 'Oportunidade', color: 'bg-indigo-500' };
        default: return { label: 'Campanha', color: 'bg-gray-500' };
    }
};

const isYoutubeVideo = (url: string) => {
    if (!url) return false;
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
};

const getYoutubeEmbedUrl = (url: string) => {
    if (!isYoutubeVideo(url)) return '';
    const videoIdMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
}

const ChallengeTracker = ({ campaignId }: { campaignId: string }) => {
    // Mocked state. In a real app, this would come from user data.
    const hasInitialMeasurement = true;
    const hasFinalMeasurement = false;

    const allStepsCompleted = hasInitialMeasurement && hasFinalMeasurement;

    return (
        <Card className="mt-6 bg-muted/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="text-primary"/>
                    Acompanhamento do Desafio
                </CardTitle>
                <CardDescription>
                    Registre suas medições e fotos no início e no fim do desafio para liberar seu relatório de resultados.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center justify-between p-4 rounded-lg bg-background">
                    <div className="flex items-center gap-3">
                         {hasInitialMeasurement ? <CheckCircle className="h-6 w-6 text-green-500"/> : <div className="h-6 w-6 rounded-full border-2 border-primary flex items-center justify-center font-bold text-primary">1</div>}
                        <div>
                            <h4 className="font-semibold">Medição Inicial</h4>
                            <p className="text-sm text-muted-foreground">Registre seus dados de agora.</p>
                        </div>
                    </div>
                    <Link href="/dashboard/profile/new-measurement">
                        <Button variant={hasInitialMeasurement ? "secondary" : "default"}>
                             <Camera className="mr-2 h-4 w-4"/> {hasInitialMeasurement ? "Ver/Editar" : "Registrar Agora"}
                        </Button>
                    </Link>
                </div>
                 <div className="flex items-center justify-between p-4 rounded-lg bg-background">
                     <div className="flex items-center gap-3">
                         {hasFinalMeasurement ? <CheckCircle className="h-6 w-6 text-green-500"/> : <div className="h-6 w-6 rounded-full border-2 border-muted-foreground flex items-center justify-center font-bold text-muted-foreground">2</div>}
                        <div>
                            <h4 className="font-semibold">Medição Final</h4>
                            <p className="text-sm text-muted-foreground">Registre ao final do desafio.</p>
                        </div>
                    </div>
                     <Link href="/dashboard/profile/new-measurement">
                        <Button variant={hasFinalMeasurement ? "secondary" : "default"} disabled={!hasInitialMeasurement}>
                            <Camera className="mr-2 h-4 w-4"/> {hasFinalMeasurement ? "Ver/Editar" : "Registrar Agora"}
                        </Button>
                    </Link>
                </div>
            </CardContent>
            <CardFooter>
                 <Link href={`/dashboard/campaigns/${campaignId}/report`} className="w-full">
                    <Button size="lg" className="w-full" disabled={!allStepsCompleted}>
                        Ver meu Relatório de Evolução
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
};


export default function CampaignDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const { id } = params;

    const [campaign, setCampaign] = useState<Campaign | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && id) {
            const campaignMap = new Map<string, Campaign>();

            try {
                const personalCampaignsData = localStorage.getItem('personalCampaigns');
                if (personalCampaignsData) {
                    const personalCampaigns: Campaign[] = JSON.parse(personalCampaignsData);
                    personalCampaigns.forEach(c => campaignMap.set(c.id, c));
                }
            } catch (e) { console.error("Failed to parse personalCampaigns", e); }

            try {
                const nutritionistCampaignsData = localStorage.getItem('nutritionistCampaigns');
                if (nutritionistCampaignsData) {
                    const nutritionistCampaigns: Campaign[] = JSON.parse(nutritionistCampaignsData);
                    nutritionistCampaigns.forEach(c => campaignMap.set(c.id, c));
                }
            } catch (e) { console.error("Failed to parse nutritionistCampaigns", e); }
            
            const foundCampaign = campaignMap.get(id as string);
            
            setCampaign(foundCampaign || null);
        }
    }, [id]);


    if (!campaign) {
        return (
            <div className="container mx-auto p-4 md:p-8 text-center">
                <h2 className="text-2xl font-bold">Campanha não encontrada</h2>
                <p className="text-muted-foreground">A campanha que você está tentando visualizar não existe ou foi removida.</p>
                <Button onClick={() => router.push('/dashboard/campaigns')} className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Campanhas
                </Button>
            </div>
        )
    }

    const handlePaymentSuccess = () => {
         toast({
            title: "Pagamento Aprovado!",
            description: `Sua inscrição na campanha "${campaign.title}" foi confirmada.`,
        });
    }
    
    const { label, color } = getCampaignTypeLabel(campaign.type);
    const embedUrl = campaign.imageUrl ? getYoutubeEmbedUrl(campaign.imageUrl) : '';

    const MainCtaButton = () => {
        if (campaign.type === 'imagem_unica' && campaign.ctaLink) {
            return (
                <a href={campaign.ctaLink} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                    <Button size="lg" className="w-full md:w-auto flex-1">
                        {campaign.buttonText || "Ver Detalhes"}
                        <LinkIcon className="ml-2 h-4 w-4" />
                    </Button>
                </a>
            );
        }

        if (campaign.isFree) {
             if (campaign.ctaLink) {
                 return (
                    <a href={campaign.ctaLink} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                        <Button size="lg" className="w-full md:w-auto flex-1">
                            {campaign.buttonText || "Acessar"}
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                    </a>
                );
             }
            return (
                <Button size="lg" className="w-full md:w-auto flex-1">
                    {campaign.buttonText || "Acessar Gratuitamente"}
                    <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
            );
        }

        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button size="lg" className="w-full md:w-auto flex-1">
                        {campaign.buttonText || "Participar"}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirmar Pagamento</DialogTitle>
                        <DialogDescription>
                            Você está prestes a comprar o acesso para a campanha: <strong>{campaign.title}</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                         <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total</span>
                            <span>R$ {campaign.price?.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Forma de Pagamento</h4>
                            <div className="flex items-center justify-between p-3 border rounded-md bg-muted">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    <span>Visa final 4242</span>
                                </div>
                                 <Button variant="link" size="sm" onClick={() => router.push('/dashboard/settings/payment-methods')}>Trocar</Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => (document.querySelector('[data-state="open"] [aria-label="Close"]') as HTMLElement)?.click()}>Cancelar</Button>
                        <Button type="button" onClick={handlePaymentSuccess}>Confirmar Pagamento</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
             <Button variant="outline" onClick={() => router.push('/dashboard/campaigns')} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Campanhas
            </Button>
            <Card className="overflow-hidden">
                <CardHeader className="p-0">
                    <div className="relative w-full aspect-video bg-gray-200">
                        {embedUrl ? (
                             <iframe
                                width="100%"
                                height="100%"
                                src={embedUrl}
                                title={campaign.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="object-cover"
                            ></iframe>
                        ) : (
                            <Image 
                                src={campaign.imageUrl || "https://picsum.photos/1200/630"}
                                alt={campaign.title}
                                fill
                                className="object-cover"
                                data-ai-hint="fitness campaign header"
                            />
                        )}
                        <Badge className={`${color} text-white absolute top-4 right-4 text-sm`}>{label}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <CardTitle className="text-3xl font-bold">{campaign.title}</CardTitle>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Tag className="h-5 w-5 text-primary" />
                            <span className="text-lg font-bold text-card-foreground">
                                {campaign.isFree ? "Gratuito" : `R$ ${campaign.price?.toFixed(2).replace('.', ',')}`}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-5 w-5 text-primary" />
                             <span className="font-semibold">
                                Válido de {new Date(campaign.startDate + 'T00:00:00').toLocaleDateString('pt-BR')} a {new Date(campaign.endDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Info className="h-5 w-5 text-primary"/> Descrição e Detalhes</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{campaign.description}</p>
                    </div>

                    {campaign.type === 'desafio' && campaign.requireMeasurements && <ChallengeTracker campaignId={campaign.id} />}
                </CardContent>
                <CardFooter className="flex-col md:flex-row gap-2">
                    <MainCtaButton />

                    {campaign.whatsappGroupUrl && campaign.isFree && (
                        <a href={campaign.whatsappGroupUrl} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                            <Button size="lg" variant="secondary" className="w-full bg-green-500 hover:bg-green-600 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                Entrar no Grupo
                            </Button>
                        </a>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
