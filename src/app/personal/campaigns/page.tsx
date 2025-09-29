
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Edit, Trash2, Users, Copy, Check, Link as LinkIcon, Eye, BarChart, Info, ExternalLink, CreditCard, Calendar } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";


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
    status: 'published' | 'draft';
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

const campaignTypeExplanations: Record<CampaignType, { title: string; description: string; }> = {
    promocao: {
        title: "Promoções",
        description: "Estratégias com prazo definido para gerar urgência e estimular decisões rápidas. Ideal para aumentar vendas em um período curto. Ex: 'Plano de Verão com 20% OFF'."
    },
    oferta: {
        title: "Ofertas",
        description: "Condições especiais ou pacotes que podem existir de forma contínua para agregar valor. Ex: 'Plano anual com parcelamento em 12x' ou 'Combo Consulta + Retorno'."
    },
    ebook: {
        title: "E-books e Materiais Digitais",
        description: "Disponibilize conteúdo de valor, como guias ou vídeos. Pode ser gratuito para captar leads ou vendido como um produto digital."
    },
    evento_workshop: {
        title: "Eventos e Workshops",
        description: "Divulgue eventos presenciais ou online. Ex: 'Workshop de Mobilidade' ou 'Palestra sobre Hipertrofia'."
    },
    desafio: {
        title: "Desafios",
        description: "Crie desafios para engajar e motivar seus alunos. Ex: 'Desafio 30 dias de prancha', com ranking e recompensas."
    },
    imagem_unica: {
        title: "Imagem Única",
        description: "Um anúncio rápido e direto com uma imagem e um botão de ação. Ideal para divulgações pontuais."
    },
    reels: {
        title: "Stories / Reels",
        description: "Use um vídeo vertical para engajar em formato de stories. Ótimo para desafios e workshops."
    }
};

const getCampaignStorage = () => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('personalCampaigns');
    try {
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.error("Failed to parse personalCampaigns from localStorage", e);
        return [];
    }
    return [];
}

const CampaignPreview = ({ campaign }: { campaign: Campaign }) => {

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

    const isYoutubeVideo = (url?: string) => {
        if (!url) return false;
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
        return youtubeRegex.test(url);
    };

    const getYoutubeEmbedUrl = (url?: string) => {
        if (!url || !isYoutubeVideo(url)) return '';
        const videoIdMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;
        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }

    const { label, color } = getCampaignTypeLabel(campaign.type);
    const embedUrl = getYoutubeEmbedUrl(campaign.imageUrl);

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
            <Button size="lg" className="w-full md:w-auto flex-1">
                {campaign.buttonText || "Participar"}
            </Button>
        );
    };

    return (
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
                        />
                    )}
                    <Badge className={`${color} text-white absolute top-4 right-4 text-sm`}>{label}</Badge>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <CardTitle className="text-3xl font-bold">{campaign.title}</CardTitle>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <CreditCard className="h-5 w-5 text-primary" />
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
    );
};


export default function CampaignsPage() {
    const { toast } = useToast();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [hasCopied, setHasCopied] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [previewCampaign, setPreviewCampaign] = useState<Campaign | null>(null);
    
    const [newCampaign, setNewCampaign] = useState({
        title: '',
        description: '',
        type: 'promocao' as CampaignType,
        startDate: '',
        endDate: '',
        imageUrl: '',
        price: 0,
        isFree: true,
        buttonText: '',
        whatsappGroupUrl: '',
        requireMeasurements: false,
    });


    useEffect(() => {
        setCampaigns(getCampaignStorage());
    }, []);

    const handleOpenForm = (campaign: Campaign | null = null) => {
        if (campaign) {
            setEditingCampaign(campaign);
            setNewCampaign({
                title: campaign.title,
                description: campaign.description,
                type: campaign.type,
                startDate: campaign.startDate,
                endDate: campaign.endDate,
                imageUrl: campaign.imageUrl || '',
                price: campaign.price || 0,
                isFree: campaign.isFree,
                buttonText: campaign.buttonText || '',
                whatsappGroupUrl: campaign.whatsappGroupUrl || '',
                requireMeasurements: campaign.requireMeasurements || false,
            });
        } else {
            setEditingCampaign(null);
            setNewCampaign({
                title: '',
                description: '',
                type: 'promocao',
                startDate: '',
                endDate: '',
                imageUrl: '',
                price: 0,
                isFree: true,
                buttonText: '',
                whatsappGroupUrl: '',
                requireMeasurements: false,
            });
        }
        setIsFormOpen(true);
    };

    const handleSaveCampaign = () => {
        if (!newCampaign.title || !newCampaign.type || !newCampaign.startDate || !newCampaign.endDate) {
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Preencha todos os campos obrigatórios (Título, Categoria, Data de Início e Fim).',
            });
            return;
        }

        const campaignData = {
            ...newCampaign,
            price: newCampaign.isFree ? 0 : newCampaign.price,
        };

        let updatedCampaigns;
        if (editingCampaign) {
            updatedCampaigns = campaigns.map(c => 
                c.id === editingCampaign.id ? { ...editingCampaign, ...campaignData, participants: c.participants || [] } : c
            );
            toast({ title: "Campanha atualizada com sucesso!" });
        } else {
            const newFullCampaign: Campaign = {
                id: `personal_${generateUUID()}`,
                ...campaignData,
                participants: [],
                status: 'published',
            };
            updatedCampaigns = [newFullCampaign, ...campaigns];
            toast({ title: "Campanha criada com sucesso!" });
        }
        localStorage.setItem('personalCampaigns', JSON.stringify(updatedCampaigns));
        setCampaigns(updatedCampaigns);
        setIsFormOpen(false);
    };

    const handleDeleteCampaign = (id: string) => {
        const updatedCampaigns = campaigns.filter(c => c.id !== id);
        localStorage.setItem('personalCampaigns', JSON.stringify(updatedCampaigns));
        setCampaigns(updatedCampaigns);
        toast({
            variant: 'destructive',
            title: "Campanha excluída.",
        });
    };

    const getCampaignTypeLabel = (type: Campaign['type']) => {
        switch (type) {
            case 'promocao': return { label: 'Promoção', color: 'bg-blue-500' };
            case 'oferta': return { label: 'Oferta', color: 'bg-orange-500' };
            case 'ebook': return { label: 'E-book', color: 'bg-purple-500' };
            case 'evento_workshop': return { label: 'Evento/Workshop', color: 'bg-teal-500' };
            case 'desafio': return { label: 'Desafio', color: 'bg-yellow-500' };
            case 'imagem_unica': return { label: 'Imagem Única', color: 'bg-indigo-500' };
            default: return { label: 'Campanha', color: 'bg-gray-500' };
        }
    };
    
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setHasCopied(true);
            setTimeout(() => setHasCopied(false), 2000);
        });
    };

    const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
        const { label, color } = getCampaignTypeLabel(campaign.type);
        
        let statusLabel = 'Agendada';
        let statusColor = 'bg-blue-500';
        const now = new Date();
        const startDate = campaign.startDate ? new Date(campaign.startDate + 'T00:00:00') : null;
        const endDate = campaign.endDate ? new Date(campaign.endDate + 'T23:59:59') : null;

        if (campaign.status === 'draft') {
            statusLabel = 'Rascunho';
            statusColor = 'bg-gray-500';
        } else if (startDate && endDate && now >= startDate && now <= endDate) {
            statusLabel = 'Ativa';
            statusColor = 'bg-green-500';
        } else if (endDate && now > endDate) {
            statusLabel = 'Encerrada';
            statusColor = 'bg-red-500';
        }

        return (
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>{campaign.title}</CardTitle>
                            <CardDescription>
                                {campaign.startDate && campaign.endDate ? `De ${new Date(campaign.startDate + 'T00:00:00').toLocaleDateString('pt-BR')} a ${new Date(campaign.endDate + 'T00:00:00').toLocaleDateString('pt-BR')}` : 'Duração não definida'}
                            </CardDescription>
                        </div>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setPreviewCampaign(campaign)}>
                                    <Eye className="mr-2 h-4 w-4"/> Pré-visualizar Anúncio
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOpenForm(campaign)}><Edit className="mr-2"/> Editar</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteCampaign(campaign.id)}>
                                    <Trash2 className="mr-2"/> Excluir
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                             <Eye className="h-4 w-4" />
                             <span>{campaign.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                             <BarChart className="h-4 w-4" />
                             <span>{campaign.clicks || 0} cliques</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{campaign.participants?.length || 0} inscritos</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <Badge className={`${color} text-white`}>{label}</Badge>
                    <Badge className={`${statusColor} text-white`}>{statusLabel}</Badge>
                </CardFooter>
            </Card>
        );
    };

    const isCampaignFormValid = newCampaign.title && newCampaign.type && newCampaign.startDate && newCampaign.endDate;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Gerenciador de Campanhas</h2>
                <Link href="/personal/campaigns/new">
                    <Button>
                        <Plus className="mr-2" /> Criar Campanha
                    </Button>
                </Link>
            </div>

            {/* Preview Dialog */}
            <Dialog open={!!previewCampaign} onOpenChange={(isOpen) => !isOpen && setPreviewCampaign(null)}>
                <DialogContent className="max-w-2xl p-0">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle>Pré-visualização da Campanha</DialogTitle>
                    </DialogHeader>
                    {previewCampaign && <CampaignPreview campaign={previewCampaign} />}
                </DialogContent>
            </Dialog>

            {/* Edit/Create Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingCampaign ? 'Editar Campanha' : 'Criar Nova Campanha'}</DialogTitle>
                        <DialogDescription>Preencha os dados abaixo para {editingCampaign ? 'atualizar' : 'criar'} sua campanha.</DialogDescription>
                    </DialogHeader>
                     <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                        <div className="space-y-2">
                            <Label htmlFor="type">Categoria da Campanha</Label>
                            <Select value={newCampaign.type} onValueChange={(value) => setNewCampaign(p => ({...p, type: value as CampaignType}))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="promocao">Promoção</SelectItem>
                                    <SelectItem value="oferta">Oferta</SelectItem>
                                    <SelectItem value="ebook">eBook</SelectItem>
                                    <SelectItem value="evento_workshop">Evento/Workshop</SelectItem>
                                    <SelectItem value="desafio">Desafio</SelectItem>
                                </SelectContent>
                            </Select>
                            {newCampaign.type && (
                                <Alert className="mt-2">
                                    <Info className="h-4 w-4" />
                                    <AlertTitle>{campaignTypeExplanations[newCampaign.type].title}</AlertTitle>
                                    <AlertDescription>{campaignTypeExplanations[newCampaign.type].description}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Título da Campanha</Label>
                            <Input id="title" value={newCampaign.title} onChange={e => setNewCampaign(p => ({...p, title: e.target.value}))} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="description">Descrição detalhada</Label>
                            <Textarea id="description" value={newCampaign.description} onChange={e => setNewCampaign(p => ({...p, description: e.target.value}))} placeholder="Explique a campanha, regras, objetivos, etc."/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Link da Imagem ou Vídeo de Divulgação (YouTube)</Label>
                            <Input id="imageUrl" value={newCampaign.imageUrl} onChange={e => setNewCampaign(p => ({...p, imageUrl: e.target.value}))} placeholder="https://exemplo.com/imagem.png"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Preço (R$)</Label>
                                <Input id="price" type="number" value={newCampaign.price} onChange={e => setNewCampaign(p => ({...p, price: parseFloat(e.target.value)}))} disabled={newCampaign.isFree}/>
                            </div>
                            <div className="flex items-end pb-2">
                                <div className="flex items-center space-x-2">
                                    <Switch id="isFree" checked={newCampaign.isFree} onCheckedChange={e => setNewCampaign(p => ({...p, isFree: e}))} />
                                    <Label htmlFor="isFree">Gratuita</Label>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <Label htmlFor="startDate">Data de Início</Label>
                                <Input id="startDate" type="date" value={newCampaign.startDate} onChange={e => setNewCampaign(p => ({...p, startDate: e.target.value}))} />
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor="endDate">Data de Fim</Label>
                                <Input id="endDate" type="date" value={newCampaign.endDate} onChange={e => setNewCampaign(p => ({...p, endDate: e.target.value}))} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="buttonText">Texto do Botão de Ação</Label>
                            <Input id="buttonText" value={newCampaign.buttonText} onChange={e => setNewCampaign(p => ({...p, buttonText: e.target.value}))} placeholder="Ex: Comprar Agora, Quero Participar"/>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="whatsappGroupUrl">Link do Grupo de WhatsApp (Opcional)</Label>
                            <Input id="whatsappGroupUrl" value={newCampaign.whatsappGroupUrl} onChange={e => setNewCampaign(p => ({...p, whatsappGroupUrl: e.target.value}))} />
                        </div>
                        {newCampaign.type === 'desafio' && (
                            <div className="flex items-center space-x-2 rounded-md border p-4">
                                <Switch id="requireMeasurements" checked={newCampaign.requireMeasurements} onCheckedChange={(e) => setNewCampaign(p => ({...p, requireMeasurements: e}))}/>
                                <Label htmlFor="requireMeasurements" className="flex flex-col">
                                    <span className="font-semibold">Exigir medições de início e fim</span>
                                    <span className="text-xs text-muted-foreground">O aluno precisará registrar fotos/medidas para gerar um relatório de progresso ao final.</span>
                                </Label>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                        <Button type="button" onClick={handleSaveCampaign} disabled={!isCampaignFormValid}>Salvar Campanha</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {campaigns.map(campaign => (
                    <Dialog key={campaign.id}>
                        <CampaignCard campaign={campaign} />
                         <DialogContent className="sm:max-w-md">
                             <DialogHeader>
                                <DialogTitle>Inscritos em "{campaign.title}"</DialogTitle>
                                <DialogDescription>
                                    Veja os participantes e gerencie o grupo da campanha.
                                </DialogDescription>
                            </DialogHeader>
                            {campaign.whatsappGroupUrl && (
                                <div className="space-y-2 mt-4">
                                    <Label>Link do Grupo de WhatsApp</Label>
                                    <div className="flex items-center space-x-2">
                                        <Input value={campaign.whatsappGroupUrl} readOnly />
                                        <Button size="icon" variant="outline" onClick={() => copyToClipboard(campaign.whatsappGroupUrl ?? "")}>
                                            {hasCopied ? <Check className="text-green-500" /> : <Copy />}
                                        </Button>
                                         <a href={campaign.whatsappGroupUrl} target="_blank" rel="noopener noreferrer">
                                            <Button size="icon">
                                                <LinkIcon />
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            )}
                            <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
                                <h4 className="font-semibold">Alunos Inscritos ({campaign.participants?.length || 0})</h4>
                                {campaign.participants && campaign.participants.length > 0 ? campaign.participants.map(p => (
                                    <div key={p.name} className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                                        <Avatar>
                                            <AvatarImage src={p.avatarUrl} alt={p.name} />
                                            <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{p.name}</span>
                                    </div>
                                )) : (
                                    <p className="text-sm text-muted-foreground">Ainda não há alunos inscritos nesta campanha.</p>
                                )}
                            </div>
                             <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">Fechar</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                ))}
            </div>

            {campaigns.length === 0 && (
                 <div className="col-span-full text-center py-10 border-2 border-dashed rounded-lg mt-6">
                    <p className="text-muted-foreground mb-4">Você ainda não criou nenhuma campanha.</p>
                    <Link href="/personal/campaigns/new">
                        <Button>
                            <Plus className="mr-2" />
                            Criar Primeira Campanha
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
