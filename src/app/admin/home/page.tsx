
"use client";

import { useEffect, useState } from "react";
import DashboardClient, { DashboardStats } from "./dashboard-client";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

async function getStats(): Promise<DashboardStats> {
    try {
        const usersCollection = collection(db, 'users');
        
        // Fetch all users once
        const allUsersSnapshot = await getDocs(usersCollection);
        const allUsers = allUsersSnapshot.docs.map(doc => doc.data());

        const totalUsers = allUsers.length;
        const activePersonals = allUsers.filter(u => u.role === 'personal' && u.status === 'verified').length;
        const activeNutritionists = allUsers.filter(u => u.role === 'nutricionista' && u.status === 'verified').length;
        const pendingDocuments = allUsers.filter(u => (u.role === 'personal' || u.role === 'nutricionista') && u.status === 'pending').length;

        // Mocked data for revenue and trials, as it's more complex to calculate and not stored directly
        const monthlyRevenue = 1450.75; // Mocked
        const trialingProfessionals = allUsers.filter(u => (u.role === 'personal' || u.role === 'nutricionista') && u.subscription?.status === 'trial').length;
        const subscribedAfterTrial = 2; // Mocked
        const churnedAfterTrial = 3; // Mocked
        const conversionRate = (subscribedAfterTrial + churnedAfterTrial) > 0 ? (subscribedAfterTrial / (subscribedAfterTrial + churnedAfterTrial)) * 100 : 0;

        return {
            totalUsers,
            activePersonals,
            activeNutritionists,
            pendingDocuments,
            monthlyRevenue,
            trialingProfessionals,
            subscribedAfterTrial,
            conversionRate,
            churnedAfterTrial,
        };
    } catch (error) {
        console.error("Error fetching stats: ", error);
        // Propagate the error to be caught by the component
        throw error;
    }
}


export default function AdminHomePage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);
                const fetchedStats = await getStats();
                setStats(fetchedStats);
            } catch (e: any) {
                console.error("Failed to load dashboard stats:", e);
                setError("Falha ao carregar as estatísticas. Verifique as permissões do Firestore e se você está logado como administrador.");
                toast({
                    variant: "destructive",
                    title: "Erro ao Carregar Dados",
                    description: "Não foi possível buscar os dados do dashboard. As regras do Firestore podem estar impedindo o acesso."
                })
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [toast]);

    if (loading) {
        return (
             <div className="space-y-8">
                <Skeleton className="h-10 w-1/3" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
                <div className="mt-8">
                    <Skeleton className="h-8 w-1/4 mb-4" />
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </div>
            </div>
        );
    }
    
    if (error) {
        return <div className="text-red-500 bg-red-100 p-4 rounded-md">{error}</div>
    }

    if (!stats) {
        return <div>Nenhuma estatística para exibir.</div>;
    }

    return <DashboardClient initialStats={stats} />;
}
