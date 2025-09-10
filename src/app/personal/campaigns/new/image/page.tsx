
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Eye, UploadCloud, Save, Sparkles, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type CampaignStatus = 'published' | 'draft';
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
    participants?: { name: string; avatarUrl: string }[];
    requireMeasurements?: boolean;
    status: CampaignStatus;
    views?: number;
    clicks?: number;
    ctaButton?: string;
    ctaLink?: string;
};


export default function NewImageCampaignPage() {
    const router = useRouter();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [campaignName, setCampaignName] = useState("");
    const [mediaUrl, setMediaUrl] = useState("https://placehold.co/1080x1080.png");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ctaButton, setCtaButton] = useState("saiba_mais");
    const [customCtaButtonText, setCustomCtaButtonText] = useState("");
    const [ctaLink, setCtaLink] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState<CampaignStatus>("draft");

    const getButtonText = () => {
        if (ctaButton === 'personalizado') {
            return customCtaButtonText;
        }
        return {
            "saiba_mais": "Saiba Mais",
            "agendar": "Agendar",
            "comprar": "Comprar",
            "contato_whatsapp": "Contato no WhatsApp"
        }[ctaButton] || "Saiba Mais";
    }

    const saveCampaign = (campaignStatus: CampaignStatus) => {
        const finalTitle = campaignName || title;

        if (campaignStatus === 'published' && (!finalTitle || !startDate || !endDate)) {
            toast({
                variant: 'destructive',
                title: 'Campos obrigatórios',
                description: 'Para publicar, preencha o Nome da Campanha (ou Título), Data de Início e Data de Fim.',
            });
            return;
        }

        if (campaignStatus === 'draft' && !finalTitle) {
            toast({
                variant: 'destructive',
                title: 'Campo obrigatório',
                description: 'Para salvar um rascunho, preencha pelo menos o Nome da Campanha.',
            });
            return;
        }


        const newCampaignData: Omit<Campaign, 'id'> = {
            title: finalTitle,
            description,
            type: 'imagem_unica',
            startDate,
            endDate,
            imageUrl: mediaUrl,
            buttonText: getButtonText(),
            status: campaignStatus,
            ctaButton,
            ctaLink,
            views: 0,
            clicks: 0,
            participants: [],
            isFree: true, // Adicionando valores padrão para compatibilidade
        };

        try {
            const existingCampaigns = JSON.parse(localStorage.getItem('personalCampaigns') || '[]');
            const campaignWithId = { ...newCampaignData, id: `campaign_${crypto.randomUUID()}` };
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
        // Reset file input to allow selecting the same file again
        if(event.target) event.target.value = '';
    };

    const isValidUrl = (string: string) => {
        try {
            new URL(string);
            return string.startsWith('http://') || string.startsWith('https://') || string.startsWith('data:image');
        } catch (_) {
            return false;
        }
    }


    return (
        <div className="container mx-auto p-4 md:p-8">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,video/*"
                className="hidden"
            />
            <div className="mb-4">
                 <Link href="/personal/campaigns/new">
                    <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Voltar</Button>
                </Link>
            </div>
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Coluna de Configuração */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configuração da Campanha</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="campaignName">Nome da Campanha (uso interno)</Label>
                                <Input id="campaignName" value={campaignName} onChange={e => setCampaignName(e.target.value)} placeholder="Ex: Promoção de Inverno" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Mídia do Anúncio</CardTitle>
                            <CardDescription>Use uma imagem ou vídeo que chame a atenção.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="mediaUrl">URL da Imagem/Vídeo</Label>
                                <Input id="mediaUrl" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} placeholder="https://exemplo.com/imagem.png"/>
                            </div>
                             <div 
                                className="p-4 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <UploadCloud className="h-10 w-10 text-muted-foreground mb-2"/>
                                <h4 className="font-semibold">Fazer Upload</h4>
                                <p className="text-xs text-muted-foreground">Arraste e solte ou clique para enviar</p>
                                <p className="text-xs text-muted-foreground mt-2">Recomendado: 1080x1080px</p>
                            </div>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Conteúdo do Anúncio</CardTitle>
                            <CardDescription>Insira os textos e o link de destino.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="title">Título (máx. 50 caracteres)</Label>
                                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} maxLength={50} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="description">Descrição (máx. 200 caracteres)</Label>
                                <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} maxLength={200} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ctaButton">Botão de Ação (CTA)</Label>
                                    <Select value={ctaButton} onValueChange={setCtaButton}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="saiba_mais">Saiba Mais</SelectItem>
                                            <SelectItem value="agendar">Agendar</SelectItem>
                                            <SelectItem value="comprar">Comprar</SelectItem>
                                            <SelectItem value="contato_whatsapp">Contato no WhatsApp</SelectItem>
                                            <SelectItem value="personalizado">Personalizado...</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ctaLink">Link de Destino</Label>
                                    <Input id="ctaLink" value={ctaLink} onChange={e => setCtaLink(e.target.value)} placeholder="https://wa.me/..." />
                                </div>
                            </div>
                             {ctaButton === 'personalizado' && (
                                <div className="space-y-2">
                                    <Label htmlFor="customCtaButtonText">Texto do Botão Personalizado</Label>
                                    <Input id="customCtaButtonText" value={customCtaButtonText} onChange={e => setCustomCtaButtonText(e.target.value)} placeholder="Ex: Ver Planos" />
                                </div>
                            )}
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
                           <div className="aspect-square w-full rounded-lg bg-muted overflow-hidden relative">
                                {isValidUrl(mediaUrl) ? (
                                    <Image src={mediaUrl} alt="Pré-visualização" layout="fill" objectFit="cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <ImageIcon className="h-16 w-16 text-muted-foreground"/>
                                    </div>
                                )}
                           </div>
                           <div className="mt-4">
                                <h3 className="font-bold text-lg truncate">{title || "Título da Campanha"}</h3>
                                <p className="text-sm text-muted-foreground h-10 line-clamp-2">{description || "Descrição da campanha aparecerá aqui. Use um texto atrativo."}</p>
                           </div>
                           <Button className="w-full mt-4" disabled>
                            {getButtonText()}
                           </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
