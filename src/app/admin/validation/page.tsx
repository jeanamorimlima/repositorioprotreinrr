
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Utensils, CheckCircle, AlertCircle, Clock, FileText, Download, ShieldCheck } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";


type ProfessionalStatus = 'verified' | 'pending' | 'rejected' | 'expired';

const mockProfessionals = [
    { 
        id: "nutri1", 
        name: "Ana Beatriz", 
        type: "Nutricionista", 
        cref: "CRN-8 12345", 
        status: "pending" as ProfessionalStatus, 
        avatarUrl: "https://picsum.photos/seed/person2/128/128",
        documentUrl: "#",
        registrationDate: "2024-08-01T10:00:00Z",
        email: "ana.beatriz@example.com"
    },
    { 
        id: "personal1", 
        name: "João Carlos da Silva", 
        type: "Personal Trainer", 
        cref: "123456-G/SP", 
        status: "verified" as ProfessionalStatus, 
        avatarUrl: "https://picsum.photos/seed/person1/128/128",
        documentUrl: "#",
        registrationDate: "2024-07-30T15:30:00Z",
        email: "joao.silva@example.com"
    },
     { 
        id: "personal2", 
        name: "Maria Oliveira", 
        type: "Personal Trainer", 
        cref: "654321-G/RJ", 
        status: "rejected" as ProfessionalStatus, 
        avatarUrl: "https://picsum.photos/seed/person3/128/128",
        documentUrl: "#",
        registrationDate: "2024-07-29T11:00:00Z",
        email: "maria.oliveira@example.com"
    },
    { 
        id: "personal3", 
        name: "Carlos Andrade", 
        type: "Personal Trainer", 
        cref: "987654-G/BA", 
        status: "pending" as ProfessionalStatus, 
        avatarUrl: "https://picsum.photos/seed/person4/128/128",
        documentUrl: "#",
        registrationDate: "2024-08-02T09:00:00Z",
        email: "carlos.andrade@example.com"
    },
];

const getStatusInfo = (status: ProfessionalStatus) => {
    switch (status) {
        case 'verified':
            return { icon: CheckCircle, color: 'text-green-500', label: 'Verificado' };
        case 'pending':
            return { icon: Clock, color: 'text-yellow-500', label: 'Pendente' };
        case 'rejected':
            return { icon: AlertCircle, color: 'text-red-500', label: 'Rejeitado' };
        case 'expired':
            return { icon: AlertCircle, color: 'text-orange-500', label: 'Expirado' };
    }
}

export default function AdminValidationPage() {
    const { toast } = useToast();
    const [professionals, setProfessionals] = useState(mockProfessionals);

    const handleApprove = (id: string) => {
        setProfessionals(prev => prev.map(p => p.id === id ? { ...p, status: 'verified' } : p));
        toast({ title: "Profissional Aprovado", description: "O registro foi verificado e aprovado com sucesso." });
    };

    const handleReject = (id: string) => {
        setProfessionals(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
        toast({ variant: "destructive", title: "Profissional Rejeitado", description: "O registro foi marcado como rejeitado." });
    };

    const getPendingProfessionals = (type: string) => {
        return professionals
            .filter(p => p.type === type && p.status === 'pending')
            .sort((a, b) => new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime());
    }

    const DataField = ({ label, value }: { label: string, value: string }) => (
        <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-base font-semibold">{value}</p>
        </div>
    );

    const ProfessionalCard = ({ professional }: { professional: (typeof mockProfessionals)[0] }) => {
        const statusInfo = getStatusInfo(professional.status);
        return (
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={professional.avatarUrl} alt={professional.name}/>
                                <AvatarFallback>{professional.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle>{professional.name}</CardTitle>
                                <CardDescription>{professional.cref}</CardDescription>
                            </div>
                        </div>
                        <Badge variant={professional.status === 'verified' ? 'default' : 'secondary'} className="flex items-center gap-1">
                            <statusInfo.icon className={`h-4 w-4 ${statusInfo.color}`} />
                            {statusInfo.label}
                        </Badge>
                    </div>
                </CardHeader>
                 <CardFooter className="flex justify-between items-center">
                     <p className="text-xs text-muted-foreground">
                        Cadastrado em: {new Date(professional.registrationDate).toLocaleDateString('pt-BR')}
                    </p>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <FileText className="mr-2 h-4 w-4"/>
                                Verificar Documento
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                            <DialogHeader>
                                <DialogTitle>Análise de Documento</DialogTitle>
                                <DialogDescription>Analise os dados e o documento para aprovar ou rejeitar o cadastro.</DialogDescription>
                            </DialogHeader>
                            <div className="grid md:grid-cols-2 gap-6 mt-4">
                                <div className="space-y-4 pr-6 border-r">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src={professional.avatarUrl} alt={professional.name}/>
                                            <AvatarFallback>{professional.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold text-lg">{professional.name}</h3>
                                            <p className="text-sm text-muted-foreground">{professional.type}</p>
                                        </div>
                                    </div>
                                    <Separator />
                                    <h3 className="font-semibold text-lg">Dados Cadastrais</h3>
                                    <DataField label="Nome Completo" value={professional.name} />
                                    <DataField label="E-mail" value={professional.email} />
                                    <DataField label="Tipo de Profissional" value={professional.type} />
                                    <DataField label="Registro (CREF/CRN)" value={professional.cref} />
                                    <DataField label="Data de Cadastro" value={new Date(professional.registrationDate).toLocaleString('pt-BR')} />
                                    <Separator className="my-4"/>
                                    <div className="flex justify-start gap-2">
                                        <Button variant="destructive" onClick={() => handleReject(professional.id)}>Rejeitar Cadastro</Button>
                                        <Button onClick={() => handleApprove(professional.id)}>Aprovar Cadastro</Button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                     <h3 className="font-semibold text-lg">Documento Anexado</h3>
                                     <div className="h-96 bg-gray-200 rounded-md flex items-center justify-center relative overflow-hidden">
                                        <Image src="https://picsum.photos/seed/document2/400/600" alt="Exemplo de documento" layout="fill" objectFit="contain" data-ai-hint="document certificate"/>
                                    </div>
                                     <Button variant="secondary" asChild className="w-full">
                                        <a href={professional.documentUrl} download><Download className="mr-2 h-4 w-4"/> Baixar Documento</a>
                                     </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>
        )
    };

    const personalsPending = getPendingProfessionals("Personal Trainer");
    const nutritionistsPending = getPendingProfessionals("Nutricionista");

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Validação de Documentos</h1>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-primary"/>
                        Fila de Validação
                    </CardTitle>
                    <CardDescription>Documentos pendentes de análise, ordenados por data de cadastro.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="personals">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="personals">
                                <User className="mr-2 h-4 w-4"/>
                                Personal Trainers ({personalsPending.length})
                            </TabsTrigger>
                            <TabsTrigger value="nutritionists">
                                <Utensils className="mr-2 h-4 w-4"/>
                                Nutricionistas ({nutritionistsPending.length})
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="personals" className="mt-6">
                            {personalsPending.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {personalsPending.map(p => <ProfessionalCard key={p.id} professional={p} />)}
                                </div>
                            ) : (
                                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                                    <p className="text-muted-foreground">Nenhum documento de personal trainer pendente no momento.</p>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="nutritionists" className="mt-6">
                            {nutritionistsPending.length > 0 ? (
                                 <div className="grid gap-4 md:grid-cols-2">
                                    {nutritionistsPending.map(p => <ProfessionalCard key={p.id} professional={p} />)}
                                </div>
                            ) : (
                                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                                    <p className="text-muted-foreground">Nenhum documento de nutricionista pendente no momento.</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
             </Card>
        </div>
    );
}
