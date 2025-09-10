
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Eye, UploadCloud, Save, Sparkles, Film } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type CampaignStatus = 'published' | 'draft';
type CampaignType = 'promocao' | 'oferta' | 'ebook' | 'evento_workshop' | 'desafio' | 'imagem_unica' | 'reels';

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
    participants?: { name: string; avatarUrl: string }[];
    requireMeasurements?: boolean;
    status: CampaignStatus;
    views?: number;
    clicks?: number;
    ctaButton?: string;
    ctaLink?: string;
};

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

export default function NewReelsCampaignPage() {
    const router = useRouter();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [campaignName, setCampaignName] = useState("");
    const [mediaUrl, setMediaUrl] = useState("");
    const [ctaLink, setCtaLink] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState<CampaignStatus>("draft");

    const saveCampaign = (campaignStatus: CampaignStatus) => {
        if (campaignStatus === 'published' && (!campaignName || !startDate || !endDate || !mediaUrl)) {
            toast({
                variant: 'destructive',
                title: 'Campos obrigatórios',
                description: 'Para publicar, preencha o Nome da Campanha, URL do Vídeo, Data de Início e Fim.',
            });
            return;
        }

        if (campaignStatus === 'draft' && !campaignName) {
            toast({
                variant: 'destructive',
                title: 'Campo obrigatório',
                description: 'Para salvar um rascunho, preencha pelo menos o Nome da Campanha.',
            });
            return;
        }


        const newCampaignData: Omit<Campaign, 'id'> = {
            title: campaignName,
            description: "Reels/Story", // Simplified description
            type: 'reels',
            startDate,
            endDate,
            imageUrl: mediaUrl,
            buttonText: "Ver no Instagram",
            status: campaignStatus,
            ctaLink,
            views: 0,
            clicks: 0,
            participants: [],
            isFree: true,
        };

        try {
            const existingCampaigns = JSON.parse(localStorage.getItem('personalCampaigns') || '[]');
            const campaignWithId = { ...newCampaignData, id: `campaign_${generateUUID()}` };
            const updatedCampaigns = [campaignWithId, ...existingCampaigns];
            localStorage.setItem('personalCampaigns', JSON.stringify(updatedCampaigns));

            toast({
                title: campaignStatus === 'published' ? "Campanha Publicada!" : "Rascunho Salvo!",
                description: `Sua campanha "${campaignWithId.title}" foi salva.`,
            });
            router.push("/personal/campaigns");

        } catch (error) {
            console.error("Failed to save campaign:", error);
            toast({
                variant: 'destructive',
                title: "Erro ao Salvar",
                description: "Não foi possível salvar a campanha. Tente novamente.",
            });
        }
    };


    const handlePublish = () => {
        saveCampaign('published');
    };

    const handleSaveDraft = () => {
        saveCampaign('draft');
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMediaUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        if(event.target) event.target.value = '';
    };
    
    const isInstagramReelsUrl = (url: string) => {
        try {
            const parsedUrl = new URL(url);
            return parsedUrl.hostname.includes('instagram.com') && parsedUrl.pathname.startsWith('/reel/');
        } catch (e) {
            return false;
        }
    }
    
    const getInstagramEmbedUrl = (url: string) => {
        if (!isInstagramReelsUrl(url)) return null;
        return `${url}embed/`;
    };

    const embedUrl = getInstagramEmbedUrl(mediaUrl);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="video/*"
                className="hidden"
            />
            <div className="mb-4">
                 <Link href="/personal/campaigns/new">
                    <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Voltar</Button>
                </Link>
            </div>
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configuração da Campanha (Stories/Reels)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="campaignName">Nome da Campanha (uso interno)</Label>
                                <Input id="campaignName" value={campaignName} onChange={e => setCampaignName(e.target.value)} placeholder="Ex: Reels de Exercícios de Mobilidade" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mediaUrl">URL do Vídeo (Reels)</Label>
                                <Input id="mediaUrl" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} placeholder="https://www.instagram.com/reel/C.../"/>
                                <p className="text-xs text-muted-foreground">Cole a URL completa de um vídeo do Instagram Reels.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Duração e Publicação</CardTitle>
                            <CardDescription>Defina quando sua campanha ficará ativa.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Data de Início</Label>
                                <Input id="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">Data de Fim</Label>
                                <Input id="endDate" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="secondary" onClick={handleSaveDraft}><Save className="mr-2 h-4 w-4"/> Salvar Rascunho</Button>
                            <Button onClick={handlePublish}><Sparkles className="mr-2 h-4 w-4"/> Publicar Campanha</Button>
                        </CardFooter>
                    </Card>

                </div>

                {/* Coluna de Pré-visualização */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                Pré-visualização
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="w-[280px] h-[500px] mx-auto rounded-xl bg-zinc-800 p-2 shadow-xl">
                               <div className="w-full h-full bg-black rounded-lg overflow-hidden relative">
                                    {embedUrl ? (
                                       <iframe 
                                            src={embedUrl}
                                            className="w-full h-full"
                                            frameBorder="0"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <div className="h-full w-full flex flex-col items-center justify-center text-center p-4">
                                            <Film className="h-16 w-16 text-muted-foreground mb-4"/>
                                            <p className="text-sm text-muted-foreground">A pré-visualização do seu Reels aparecerá aqui.</p>
                                        </div>
                                    )}
                               </div>
                           </div>
                           <Button className="w-full mt-4" disabled>
                            Ver no Instagram
                           </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
