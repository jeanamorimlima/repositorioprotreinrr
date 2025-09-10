
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Image as ImageIcon, Film, Rows, ShoppingBag, ListChecks } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const campaignTypes = [
    {
        type: 'image',
        title: 'Imagem ou Vídeo Único',
        description: 'Anúncio com uma única imagem ou vídeo. Ideal para promoções rápidas e ofertas diretas.',
        icon: ImageIcon,
        href: '/personal/campaigns/new/image',
        enabled: true,
    },
    {
        type: 'carousel',
        title: 'Carrossel',
        description: 'Mostre vários produtos ou serviços em um único anúncio. Cada card pode ter seu próprio link.',
        icon: Rows,
        href: '/personal/campaigns/new/carousel',
        enabled: true,
    },
    {
        type: 'reels',
        title: 'Stories / Reels',
        description: 'Use um vídeo vertical para engajar em formato de stories. Ótimo para desafios e workshops.',
        icon: Film,
        href: '/personal/campaigns/new/reels',
        enabled: true,
    },
    {
        type: 'collection',
        title: 'Coleção / Catálogo',
        description: 'Destaque uma coleção de produtos ou serviços com uma imagem de capa e itens clicáveis.',
        icon: ShoppingBag,
        href: '#',
        enabled: false,
    },
    {
        type: 'lead',
        title: 'Captação de Contatos',
        description: 'Crie um formulário para capturar informações de potenciais alunos interessados.',
        icon: ListChecks,
        href: '#',
        enabled: false,
    },
];

export default function NewCampaignPage() {
    const router = useRouter();

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Crie uma nova campanha</h1>
                    <p className="text-muted-foreground mt-2">Escolha um objetivo para sua campanha. Isso determinará os formatos e recursos disponíveis.</p>
                </div>
                <div className="space-y-4">
                    {campaignTypes.map((campaign) => (
                         <Link key={campaign.type} href={campaign.enabled ? campaign.href : '#'} className={!campaign.enabled ? "pointer-events-none" : ""}>
                            <Card className={`hover:border-primary transition-all ${!campaign.enabled ? "bg-muted/50" : ""}`}>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <campaign.icon className="h-8 w-8 text-primary" />
                                        <div>
                                            <CardTitle>{campaign.title}</CardTitle>
                                            <CardDescription>{campaign.description}</CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!campaign.enabled && <span className="text-xs font-semibold text-muted-foreground">Em breve</span>}
                                        <ArrowRight className="h-5 w-5 text-muted-foreground"/>
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
