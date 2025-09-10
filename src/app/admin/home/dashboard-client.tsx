
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileCheck, DollarSign, BarChart2 } from "lucide-react";

export interface DashboardStats {
    totalUsers: number;
    activePersonals: number;
    activeNutritionists: number;
    pendingDocuments: number;
    monthlyRevenue: number;
    trialingProfessionals: number;
    subscribedAfterTrial: number;
    conversionRate: number;
    churnedAfterTrial: number;
}

const StatCard = ({ title, value, icon: Icon, change }: { title: string, value: string | number, icon: React.ElementType, change?: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {change && <p className="text-xs text-muted-foreground">{change}</p>}
        </CardContent>
    </Card>
);

export default function DashboardClient({ initialStats }: { initialStats: DashboardStats }) {
    // This component now only receives the data and displays it.
    // No fetch or useEffect logic is needed here.
    const stats = initialStats;
    
    const statsCards = [
        { title: "Usuários Totais", value: stats.totalUsers, icon: Users, change: "Usuários na plataforma" },
        { title: "Personais Ativos", value: stats.activePersonals, icon: Users, change: "Profissionais verificados" },
        { title: "Nutricionistas Ativos", value: stats.activeNutritionists, icon: Users, change: "Profissionais verificados" },
        { title: "Documentos Pendentes", value: stats.pendingDocuments, icon: FileCheck, change: "Aguardando verificação" },
        { title: "Receita (Mês)", value: `R$ ${stats.monthlyRevenue.toFixed(2).replace('.', ',')}`, icon: DollarSign, change: "Faturamento do mês atual" },
    ];
    
     const trialStatsCards = [
        { title: "Em Teste Gratuito", value: stats.trialingProfessionals, icon: Users, change: "Profissionais em período de 15 dias" },
        { title: "Conversão (%)", value: `${stats.conversionRate.toFixed(1)}%`, icon: FileCheck, change: "Testes que viraram assinantes" },
        { title: "Churn Pós-Teste", value: stats.churnedAfterTrial, icon: Users, change: "Não assinaram após o teste" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-6">Dashboard do Administrador</h1>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                    {statsCards.map(stat => (
                       <StatCard key={stat.title} {...stat} />
                    ))}
                </div>
            </div>
            
            <div>
                <h2 className="text-2xl font-bold mb-4">Métricas do Período de Teste</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                     {trialStatsCards.map(stat => (
                        <StatCard key={stat.title} {...stat} />
                    ))}
                </div>
            </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Atividade Recente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Feed de atividades em breve...</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Gráfico de Crescimento</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="h-64 bg-gray-200 rounded-md flex items-center justify-center">
                            <BarChart2 className="h-12 w-12 text-gray-400"/>
                         </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
