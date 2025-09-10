
"use client";

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, GraduationCap, Building, Clock, Link as LinkIcon, Mail, Phone, MapPin, Send, Megaphone, ArrowRight, Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mocked campaigns for this professional
const mockPersonalCampaigns: any[] = [];
const mockNutriCampaigns: any[] = [];

const mockPersonalProfile = {
    id: "personal1",
    name: "Profissional Não Encontrado",
    email: "email@example.com",
    phone: "",
    city: "",
    state: "",
    imageUrl: "",
    cref: "",
    formation: "",
    specializations: "",
    areasOfExpertise: "",
    workHistory: "",
    availability: "",
    socialLink: "",
    services: [],
    campaigns: mockPersonalCampaigns,
};

const mockNutriProfile = {
    id: "nutri1",
    name: "Profissional Não Encontrado",
    email: "email@example.com",
    phone: "",
    city: "",
    state: "",
    imageUrl: "",
    crn: "",
    formation: "",
    specializations: "",
    areasOfExpertise: "",
    workHistory: "",
    availability: "",
    socialLink: "",
    services: [],
    campaigns: mockNutriCampaigns,
};

const getCampaignTypeLabel = (type: string) => {
    switch (type) {
        case 'promocao': return { label: 'Promoção', color: 'bg-blue-500' };
        case 'desafio': return { label: 'Desafio', color: 'bg-yellow-500' };
        case 'evento': return { label: 'Evento', color: 'bg-green-500' };
        case 'educativo': return { label: 'Educativo', color: 'bg-purple-500' };
        default: return { label: 'Campanha', color: 'bg-gray-500' };
    }
};

export default function ProfessionalProfilePage() {
    const params = useParams();
    const { type, id } = params;

    // In a real app, you would fetch from a database.
    // For now, we return a default "not found" state.
    const profile = type === 'personal' ? mockPersonalProfile : mockNutriProfile;
    
    // As there is no data, we always show the "not found" state.
    return (
            <div className="container mx-auto p-4 md:p-8 text-center">
            <h2 className="text-2xl font-bold">Perfil não encontrado</h2>
            <p className="text-muted-foreground">O profissional que você está tentando visualizar não foi encontrado ou não existe.</p>
            <Link href="/dashboard/professionals" className='mt-4 inline-block'>
                <Button>Voltar para a busca</Button>
            </Link>
        </div>
    )
}
