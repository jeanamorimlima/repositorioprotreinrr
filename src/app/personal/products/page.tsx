"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Dumbbell, Video, ClipboardList, BookOpen, Trophy, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const productCategories = [
    {
        title: "Planos de Treino",
        description: "Crie e gerencie pacotes de treinos personalizados.",
        icon: Dumbbell,
        href: "/personal/products/workouts",
        enabled: true,
    },
    {
        title: "Consultorias Online",
        description: "Ofereça sessões de consultoria por vídeo.",
        icon: Video,
        href: "/personal/products/consulting",
        enabled: true,
    },
    {
        title: "Avaliações Físicas",
        description: "Venda pacotes de avaliações físicas detalhadas.",
        icon: ClipboardList,
        href: "/personal/products/assessments",
        enabled: true,
    },
    {
        title: "E-books e Materiais",
        description: "Venda guias, receitas e outros materiais digitais.",
        icon: BookOpen,
        href: "#",
        enabled: false,
    },
    {
        title: "Desafios",
        description: "Crie e gerencie desafios pagos para seus alunos.",
        icon: Trophy,
        href: "#",
        enabled: false,
    },
];

export default function PersonalProductsPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Meus Produtos e Serviços</h1>
                    <p className="text-muted-foreground mt-2">Gerencie as categorias de produtos que você oferece aos seus alunos.</p>
                </div>
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Novo Produto
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {productCategories.map((category) => (
                    <Link key={category.title} href={category.enabled ? category.href : '#'} className={!category.enabled ? "pointer-events-none" : ""}>
                        <Card className={`hover:border-primary transition-all h-full ${!category.enabled ? "bg-muted/50" : ""}`}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <category.icon className="h-8 w-8 text-primary" />
                                    <div>
                                        <CardTitle>{category.title}</CardTitle>
                                        <CardDescription>{category.description}</CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!category.enabled && <span className="text-xs font-semibold text-muted-foreground">Em breve</span>}
                                    <ArrowRight className="h-5 w-5 text-muted-foreground"/>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
