
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Edit, Trash2, Users, Copy, Check, Link as LinkIcon, Info, Eye, BarChart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";

type CampaignType = 'promocao' | 'oferta' | 'ebook' | 'evento_workshop' | 'desafio';

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
    participants: { name: string; avatarUrl: string }[];
    requireMeasurements?: boolean;
};

// Mock data
const initialCampaigns: Campaign[] = [
    { 
        id: 'nutri_1', 
        title: 'Plano Alimentar de Verão', 
        description: 'Receba um plano alimentar focado em alimentos leves e nutritivos para o verão. Inclui lista de compras e receitas.',
        type: 'promocao', 
        startDate: '2024-07-25', 
        endDate: '2024-08-25',
        imageUrl: 'https://placehold.co/600x400.png',
        price: 99.90,
        isFree: false,
        buttonText: 'Comprar por R$ 99,90',
        whatsappGroupUrl: '',
        participants: [
            { name: 'Juliana Mendes', avatarUrl: 'https://placehold.co/128x128.png' },
        ]
    },
    { 
        id: 'nutri_2', 
        title: 'E-book: Lanches Saudáveis', 
        description: 'Baixe gratuitamente nosso guia com 20 receitas de lanches saudáveis e práticos para o dia a dia.',
        type: 'ebook', 
        startDate: '2024-07-20', 
        endDate: '2024-12-31',
        imageUrl: 'https://placehold.co/600x400.png',
        isFree: true,
        buttonText: 'Baixar Agora',
        participants: [],
    },
];

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
        description: "Disponibilize conteúdo de valor, como guias de receitas, artigos sobre nutrição, etc. Pode ser gratuito para captar leads ou vendido como um produto digital."
    },
    evento_workshop: {
        title: "Eventos e Workshops",
        description: "Ex: 'Workshop sobre Leitura de Rótulos' ou 'Palestra sobre Nutrição Esportiva'."
    },
    desafio: {
        title: "Desafios",
        description: "Crie desafios para engajar e motivar seus pacientes. Ex: 'Desafio 7 dias sem açúcar', com ranking e recompensas."
    }
};

const campaignDurationGuidelines: Record<CampaignType, string> = {
    promocao: "Tempo recomendado: 7 a 15 dias no máximo para criar urgência.",
    oferta: "Tempo recomendado: 7 a 15 dias no máximo para criar urgência.",
    ebook: "Tempo padrão no ar: até 60 dias (renovável).",
    evento_workshop: "Divulgação permitida: até 30 dias antes da data do evento.",
    desafio: "Duração recomendada: entre 7 e 60 dias.",
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

export default function NutritionistCampaignsPage() {
    const { toast } = useToast();
    const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [hasCopied, setHasCopied] = useState(false);
    const [maxEndDate, setMaxEndDate] = useState<string | undefined>(undefined);
    
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
        if (!newCampaign.startDate) {
            setMaxEndDate(undefined);
            return;
        }

        const addDays = (date: Date, days: number) => {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        };
        
        const start = new Date(newCampaign.startDate + 'T00:00:00Z');
        let maxDate: Date;

        switch(newCampaign.type) {
            case 'promocao':
            case 'oferta':
                maxDate = addDays(start, 15);
                break;
            case 'ebook':
            case 'desafio':
                maxDate = addDays(start, 60);
                break;
            case 'evento_workshop':
                setMaxEndDate(undefined);
                return;
            default:
                setMaxEndDate(undefined);
                return;
        }

        setMaxEndDate(maxDate.toISOString().split('T')[0]);

    }, [newCampaign.type, newCampaign.startDate]);

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

        if (editingCampaign) {
            const updatedCampaigns = campaigns.map(c => 
                c.id === editingCampaign.id ? { ...editingCampaign, ...campaignData } : c
            );
            setCampaigns(updatedCampaigns);
            toast({ title: "Campanha atualizada com sucesso!" });
        } else {
            const newCampaignData: Campaign = {
                id: generateUUID(),
                ...campaignData,
                participants: [],
            };
            setCampaigns(prev => [newCampaignData, ...prev]);
            toast({ title: "Campanha criada com sucesso!" });
        }
        setIsFormOpen(false);
    };

    const handleDeleteCampaign = (id: string) => {
        setCampaigns(prev => prev.filter(c => c.id !== id));
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
        const status = new Date(campaign.endDate) < new Date() ? 'Encerrada' : 'Ativa';

        return (
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>{campaign.title}</CardTitle>
                            <CardDescription>
                                De {new Date(campaign.startDate + 'T00:00:00').toLocaleDateString('pt-BR')} a {new Date(campaign.endDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                            </CardDescription>
                        </div>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DialogTrigger asChild>
                                    <DropdownMenuItem>
                                        <Users className="mr-2" /> Ver Inscritos ({campaign.participants.length})
                                    </DropdownMenuItem>
                                </DialogTrigger>
                                <DropdownMenuItem onClick={() => handleOpenForm(campaign)}>
                                    <Edit className="mr-2"/> Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteCampaign(campaign.id)}>
                                    <Trash2 className="mr-2"/> Excluir
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                    <Badge className={`${color} text-white`}>{label}</Badge>
                    <div className="flex items-center gap-2">
                        <Link href={`/dashboard/campaigns/${campaign.id}`} target="_blank" rel="noopener noreferrer">
                           <Button variant="outline" size="sm">
                               <Eye className="mr-2 h-4 w-4" />
                               Visualizar
                           </Button>
                        </Link>
                         <Badge variant={status === 'Ativa' ? 'default' : 'destructive'}>{status}</Badge>
                    </div>
                </CardFooter>
            </Card>
        );
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Minhas Campanhas</h2>
                <Button onClick={() => handleOpenForm()}>
                    <Plus className="mr-2" /> Criar Campanha
                </Button>
            </div>
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingCampaign ? 'Editar Campanha' : 'Criar Nova Campanha'}</DialogTitle>
                        <DialogDescription>Preencha os dados abaixo para {editingCampaign ? 'atualizar' : 'criar'} sua campanha.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                        <div className="space-y-2">
                            <Label htmlFor="type">Categoria da Campanha</Label>
                            <Select value={newCampaign.type} onValueChange={(value) => setNewCampaign(p => ({...p, type: value as CampaignType, endDate: ''}))}>
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
                                <div className="space-y-2 mt-2">
                                    <Alert>
                                        <Info className="h-4 w-4" />
                                        <AlertTitle>{campaignTypeExplanations[newCampaign.type].title}</AlertTitle>
                                        <AlertDescription>
                                            {campaignTypeExplanations[newCampaign.type].description}
                                        </AlertDescription>
                                    </Alert>
                                     <Alert variant="destructive">
                                        <Info className="h-4 w-4" />
                                        <AlertTitle>Diretriz de Tempo</AlertTitle>
                                        <AlertDescription>
                                            {campaignDurationGuidelines[newCampaign.type]}
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Título da Campanha</Label>
                            <Input id="title" value={newCampaign.title} onChange={e => setNewCampaign(p => ({...p, title: e.target.value}))} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="description">Descrição detalhada</Label>
                            <Textarea id="description" value={newCampaign.description} onChange={e => setNewCampaign(p => ({...p, description: e.target.value}))} placeholder="Explique a campanha, regras, objetivos, local, etc."/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Link da Imagem ou Vídeo de Divulgação</Label>
                            <Input id="imageUrl" value={newCampaign.imageUrl} onChange={e => setNewCampaign(p => ({...p, imageUrl: e.target.value}))} placeholder="https://exemplo.com/imagem.png ou https://youtube.com/watch?v=..."/>
                             <p className="text-xs text-muted-foreground mt-1">
                                Cole o link de uma imagem ou de um vídeo do YouTube/Vimeo.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Preço (R$)</Label>
                                <Input id="price" type="number" value={newCampaign.price} onChange={e => setNewCampaign(p => ({...p, price: parseFloat(e.target.value)}))} disabled={newCampaign.isFree}/>
                            </div>
                            <div className="flex items-end pb-2">
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="isFree" checked={newCampaign.isFree} onChange={e => setNewCampaign(p => ({...p, isFree: e.target.checked}))} />
                                    <Label htmlFor="isFree">Gratuita</Label>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                             <Label>Período de Validade</Label>
                              <p className="text-xs text-muted-foreground">
                                A campanha ficará visível para os pacientes apenas entre essas datas.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-1">
                                    <Label htmlFor="startDate" className="text-xs text-muted-foreground">Data de Início</Label>
                                    <Input 
                                        id="startDate" 
                                        type="date" 
                                        value={newCampaign.startDate} 
                                        onChange={e => setNewCampaign(p => ({...p, startDate: e.target.value, endDate: '' }))} 
                                    />
                                </div>
                                 <div className="space-y-1">
                                    <Label htmlFor="endDate" className="text-xs text-muted-foreground">Data de Fim</Label>
                                    <Input 
                                        id="endDate" 
                                        type="date" 
                                        value={newCampaign.endDate} 
                                        onChange={e => setNewCampaign(p => ({...p, endDate: e.target.value}))} 
                                        disabled={!newCampaign.startDate}
                                        max={maxEndDate}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="buttonText">Texto do Botão de Ação</Label>
                            <Input id="buttonText" value={newCampaign.buttonText} onChange={e => setNewCampaign(p => ({...p, buttonText: e.target.value}))} placeholder="Ex: Comprar Agora, Quero Participar"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp">Link do Grupo de WhatsApp (Opcional)</Label>
                            <Input id="whatsapp" value={newCampaign.whatsappGroupUrl} onChange={e => setNewCampaign(p => ({...p, whatsappGroupUrl: e.target.value}))} placeholder="https://chat.whatsapp.com/..." />
                        </div>
                        {newCampaign.type === 'desafio' && (
                            <div className="space-y-2 p-4 border rounded-md">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="require-measurements" className="font-semibold flex items-center gap-2">
                                        <BarChart/> Acompanhamento de Resultados
                                    </Label>
                                    <Switch
                                        id="require-measurements"
                                        checked={newCampaign.requireMeasurements}
                                        onCheckedChange={(checked) => setNewCampaign(p => ({...p, requireMeasurements: checked}))}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Se ativo, o paciente precisará registrar medições e fotos no início e no fim do desafio para gerar um relatório de "antes e depois".
                                </p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancelar</Button>
                        </DialogClose>
                        <Button type="button" onClick={handleSaveCampaign}>Salvar Campanha</Button>
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
                                        <Button size="icon" variant="outline" onClick={() => copyToClipboard(campaign.whatsappGroupUrl)}>
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
                                <h4 className="font-semibold">Pacientes Inscritos ({campaign.participants.length})</h4>
                                {campaign.participants.length > 0 ? campaign.participants.map(p => (
                                    <div key={p.name} className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                                        <Avatar>
                                            <AvatarImage src={p.avatarUrl} alt={p.name} />
                                            <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{p.name}</span>
                                    </div>
                                )) : (
                                    <p className="text-sm text-muted-foreground">Ainda não há pacientes inscritos nesta campanha.</p>
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
                    <Button onClick={() => handleOpenForm()}>
                        <Plus className="mr-2" />
                        Criar Primeira Campanha
                    </Button>
                </div>
            )}
        </div>
    );
}
