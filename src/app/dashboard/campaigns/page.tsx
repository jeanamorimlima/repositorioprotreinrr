
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Megaphone, ArrowRight, Tag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
    status?: 'published' | 'draft';
};

const getCampaignTypeLabel = (type: Campaign['type']) => {
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

const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
    const router = useRouter();
    const { label, color } = getCampaignTypeLabel(campaign.type);
    const endDate = campaign.endDate ? new Date(campaign.endDate + 'T23:59:59') : null;
    const isExpired = endDate && endDate < new Date();

    if (isExpired) return null;

    const handleNavigate = () => {
        router.push(`/dashboard/campaigns/${campaign.id}`);
    };

    return (
        <Card className="flex flex-col overflow-hidden w-full hover:border-primary transition-colors">
            <div className="relative w-full aspect-video">
                <Image 
                    src={campaign.imageUrl || "https://picsum.photos/1200/630"}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                    data-ai-hint="fitness campaign"
                />
                <Badge className={`${color} text-white absolute top-2 right-2`}>{label}</Badge>
            </div>
            <CardHeader>
                <CardTitle>{campaign.title}</CardTitle>
                <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary"/>
                    <p className="text-lg font-bold">
                        {campaign.isFree ? "Gratuito" : `R$ ${campaign.price?.toFixed(2).replace('.', ',')}`}
                    </p>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={handleNavigate}>
                    Ver Detalhes
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
};

export default function CampaignsPage() {
    const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const personalCampaignsData = localStorage.getItem('personalCampaigns');
            const nutritionistCampaignsData = localStorage.getItem('nutritionistCampaigns');
            const personalCampaigns = personalCampaignsData ? JSON.parse(personalCampaignsData) : [];
            const nutritionistCampaigns = nutritionistCampaignsData ? JSON.parse(nutritionistCampaignsData) : [];
            
            const combinedCampaigns = [...personalCampaigns, ...nutritionistCampaigns];

            const uniqueCampaigns = Array.from(new Map(combinedCampaigns.map(item => [item.id, item])).values());
            setAllCampaigns(uniqueCampaigns);
        }
    }, []);

    const activeCampaigns = allCampaigns.filter(c => {
        const endDate = c.endDate ? new Date(c.endDate + 'T23:59:59') : null;
        return c.status !== 'draft' && (!endDate || endDate >= new Date());
    });

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold flex items-center gap-2">
                    <Megaphone className="h-8 w-8 text-primary"/>
                    Campanhas e Novidades
                </h2>
                <p className="text-muted-foreground">Veja os desafios, promoções e eventos disponíveis para você.</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-8">
                {activeCampaigns.map(campaign => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
            </div>

             {activeCampaigns.length === 0 && (
                <div className="col-span-full text-center py-10 border-2 border-dashed rounded-lg mt-6">
                    <p className="text-muted-foreground">Nenhuma campanha ativa no momento. Volte em breve!</p>
                </div>
            )}
        </div>
    );
}
