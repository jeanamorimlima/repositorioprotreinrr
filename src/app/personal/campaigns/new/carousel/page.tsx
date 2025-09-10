
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Eye, UploadCloud, Save, Sparkles, PlusCircle, Trash2, GripVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"


type CarouselCard = {
    id: string;
    imageUrl: string;
    title: string;
    description: string;
    link: string;
    buttonText: string;
};

type CampaignStatus = 'published' | 'draft';

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

export default function NewCarouselCampaignPage() {
    const router = useRouter();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);

    const [campaignName, setCampaignName] = useState("");
    const [cards, setCards] = useState<CarouselCard[]>([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        // Initialize cards on the client side to avoid hydration mismatch
        setCards([
            { id: `card_${generateUUID()}`, imageUrl: 'https://placehold.co/1080x1080.png', title: 'Card 1', description: '', link: '', buttonText: 'Saiba Mais' },
            { id: `card_${generateUUID()}`, imageUrl: 'https://placehold.co/1080x1080.png', title: 'Card 2', description: '', link: '', buttonText: 'Ver Agora' },
        ]);
    }, []);


    const handleAddCard = () => {
        if (cards.length >= 10) {
            toast({ variant: 'destructive', title: 'Limite atingido', description: 'Você pode adicionar no máximo 10 cards.' });
            return;
        }
        setCards([...cards, { id: `card_${generateUUID()}`, imageUrl: 'https://placehold.co/1080x1080.png', title: `Card ${cards.length + 1}`, description: '', link: '', buttonText: 'Saiba Mais' }]);
    };
    
    const handleRemoveCard = (id: string) => {
        if (cards.length <= 2) {
             toast({ variant: 'destructive', title: 'Mínimo necessário', description: 'O carrossel deve ter no mínimo 2 cards.' });
            return;
        }
        setCards(cards.filter(card => card.id !== id));
    };

    const handleCardChange = (id: string, field: keyof Omit<CarouselCard, 'id'>, value: string) => {
        setCards(cards.map(card => card.id === id ? { ...card, [field]: value } : card));
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && activeCardIndex !== null) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleCardChange(cards[activeCardIndex].id, 'imageUrl', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        if(event.target) event.target.value = '';
        setActiveCardIndex(null);
    };

    const triggerFileUpload = (index: number) => {
        setActiveCardIndex(index);
        fileInputRef.current?.click();
    };
    
     const saveCampaign = (campaignStatus: CampaignStatus) => {
        if (campaignStatus === 'published' && (!campaignName || !startDate || !endDate)) {
            toast({
                variant: 'destructive',
                title: 'Campos obrigatórios',
                description: 'Para publicar, preencha o Nome da Campanha, Data de Início e Data de Fim.',
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
        
        // Em uma implementação real, os dados da campanha seriam enviados para um backend
        console.log({ campaignName, cards, startDate, endDate, status: campaignStatus });

        toast({
            title: campaignStatus === 'published' ? "Campanha Publicada!" : "Rascunho Salvo!",
            description: `Sua campanha de carrossel "${campaignName}" foi salva.`,
        });
        router.push("/personal/campaigns");
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
            />
            <div className="mb-4">
                <Link href="/personal/campaigns/new">
                    <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Voltar</Button>
                </Link>
            </div>
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Coluna de Configuração */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configuração da Campanha de Carrossel</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="campaignName">Nome da Campanha (uso interno)</Label>
                                <Input id="campaignName" value={campaignName} onChange={e => setCampaignName(e.target.value)} placeholder="Ex: Planos de Consultoria 2024" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Cards do Carrossel</CardTitle>
                            <CardDescription>Adicione e configure os cards que aparecerão no anúncio. Mínimo 2, máximo 10.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {cards.map((card, index) => (
                                <Card key={card.id} className="p-4 relative">
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <Button variant="ghost" size="icon" className="cursor-grab"><GripVertical className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveCard(card.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                    </div>
                                    <div className="grid md:grid-cols-[150px_1fr] gap-4">
                                        <div className="space-y-2">
                                            <Label>Imagem do Card {index + 1}</Label>
                                            <div 
                                                className="aspect-square w-full rounded-md border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-primary relative overflow-hidden"
                                                onClick={() => triggerFileUpload(index)}
                                            >
                                                <Image src={card.imageUrl} alt={`Card ${index + 1}`} layout="fill" objectFit="cover" />
                                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                    <UploadCloud className="h-8 w-8 text-white"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor={`title-${card.id}`}>Título</Label>
                                                <Input id={`title-${card.id}`} value={card.title} onChange={e => handleCardChange(card.id, 'title', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`description-${card.id}`}>Descrição (opcional)</Label>
                                                <Input id={`description-${card.id}`} value={card.description} onChange={e => handleCardChange(card.id, 'description', e.target.value)} />
                                            </div>
                                             <div className="space-y-2">
                                                <Label htmlFor={`link-${card.id}`}>Link de Destino</Label>
                                                <Input id={`link-${card.id}`} value={card.link} onChange={e => handleCardChange(card.id, 'link', e.target.value)} placeholder="https://..." />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`buttonText-${card.id}`}>Texto do Botão</Label>
                                                <Input id={`buttonText-${card.id}`} value={card.buttonText} onChange={e => handleCardChange(card.id, 'buttonText', e.target.value)} placeholder="Ex: Saiba Mais" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                            <Button variant="outline" onClick={handleAddCard}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Adicionar Card
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Duração e Publicação</CardTitle>
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
                            <Button variant="secondary" onClick={() => saveCampaign('draft')}><Save className="mr-2 h-4 w-4" /> Salvar Rascunho</Button>
                            <Button onClick={() => saveCampaign('published')}><Sparkles className="mr-2 h-4 w-4" /> Publicar Campanha</Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Coluna de Pré-visualização */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5" />Pré-visualização</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Carousel className="w-full max-w-xs mx-auto">
                                <CarouselContent>
                                    {cards.map((card, index) => (
                                        <CarouselItem key={card.id}>
                                            <Card className="overflow-hidden">
                                                <div className="aspect-square bg-muted relative">
                                                     <Image src={card.imageUrl} alt={card.title} layout="fill" objectFit="cover" />
                                                </div>
                                                <div className="p-4">
                                                    <h4 className="font-bold truncate">{card.title}</h4>
                                                    <p className="text-sm text-muted-foreground truncate">{card.description}</p>
                                                    <Button variant="outline" size="sm" className="w-full mt-2" disabled>{card.buttonText || "Saiba Mais"}</Button>
                                                </div>
                                            </Card>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
