
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, User, Utensils, CheckCircle, AlertCircle, Clock, ExternalLink, FileText, Download, UserCheck } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ProfessionalStatus = 'verified' | 'pending' | 'rejected' | 'expired';

// Mock do admin logado. Em um app real, isso viria da sessão de autenticação.
const currentAdmin = { id: "admin_01", name: "Admin Master" };

const mockProfessionals = [
    { 
        id: "personal1", 
        name: "João Carlos da Silva", 
        type: "Personal Trainer", 
        cref: "123456-G/SP", 
        status: "verified" as ProfessionalStatus, 
        avatarUrl: "https://picsum.photos/seed/person1/128/128",
        documentUrl: "#", // Link para o documento no Storage
        email: "joao.silva@example.com",
        registrationDate: "2024-07-30T15:30:00Z",
        analyzedBy: "Admin Master",
        analysisDate: "2024-07-31T10:00:00Z",
    },
    { 
        id: "nutri1", 
        name: "Ana Beatriz", 
        type: "Nutricionista", 
        cref: "CRN-8 12345", 
        status: "pending" as ProfessionalStatus, 
        avatarUrl: "https://picsum.photos/seed/person2/128/128",
        documentUrl: "#",
        email: "ana.beatriz@example.com",
        registrationDate: "2024-08-01T10:00:00Z",
        analyzedBy: null,
        analysisDate: null,
    },
     { 
        id: "personal2", 
        name: "Maria Oliveira", 
        type: "Personal Trainer", 
        cref: "654321-G/RJ", 
        status: "rejected" as ProfessionalStatus, 
        avatarUrl: "https://picsum.photos/seed/person3/128/128",
        documentUrl: "#",
        email: "maria.oliveira@example.com",
        registrationDate: "2024-07-29T11:00:00Z",
        analyzedBy: "Funcionario_02",
        analysisDate: "2024-07-29T18:00:00Z",
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

export default function AdminUsersPage() {
    const { toast } = useToast();
    const [professionals, setProfessionals] = useState(mockProfessionals);
    const [searchTerm, setSearchTerm] = useState("");

    const handleApprove = (id: string) => {
        setProfessionals(prev => prev.map(p => p.id === id ? { ...p, status: 'verified', analyzedBy: currentAdmin.name, analysisDate: new Date().toISOString() } : p));
        toast({ title: "Profissional Aprovado", description: "O registro foi verificado e aprovado com sucesso." });
    };

    const handleReject = (id: string) => {
        setProfessionals(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected', analyzedBy: currentAdmin.name, analysisDate: new Date().toISOString() } : p));
        toast({ variant: "destructive", title: "Profissional Rejeitado", description: "O registro foi marcado como rejeitado." });
    };
    
    const filterAndSortProfessionals = (type: string, status?: ProfessionalStatus | 'all') => {
        return professionals.filter(p => {
            const typeMatch = p.type === type;
            const statusMatch = status === 'all' || !status || p.status === status;
            const searchMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.cref.toLowerCase().includes(searchTerm.toLowerCase());
            return typeMatch && statusMatch && searchMatch;
        }).sort((a,b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
    }

    const DataField = ({ label, value }: { label: string, value: string | null }) => (
        <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-base font-semibold">{value || 'N/A'}</p>
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
                        <Badge variant={professional.status === 'verified' ? 'default' : professional.status === 'pending' ? 'secondary' : 'destructive'} className="flex items-center gap-1">
                            <statusInfo.icon className={`h-4 w-4 ${statusInfo.color}`} />
                            {statusInfo.label}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                     {professional.analyzedBy && (
                        <div className="text-xs text-muted-foreground bg-muted p-2 rounded-md">
                            <p className="flex items-center gap-1">
                                <UserCheck className="h-3 w-3"/>
                                Analisado por: <span className="font-semibold">{professional.analyzedBy}</span>
                            </p>
                            {professional.analysisDate && (
                                <p>Em: {new Date(professional.analysisDate).toLocaleString('pt-BR')}</p>
                            )}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    {professional.status === 'pending' && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">
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
                                            <Image src="https://picsum.photos/seed/document1/400/600" alt="Exemplo de documento" layout="fill" objectFit="contain" data-ai-hint="document certificate"/>
                                        </div>
                                         <Button variant="secondary" asChild className="w-full">
                                            <a href={professional.documentUrl} download><Download className="mr-2 h-4 w-4"/> Baixar Documento</a>
                                         </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                    <Link href={`/dashboard/professionals/${professional.type === 'Personal Trainer' ? 'personal' : 'nutritionist'}/${professional.id}`} target="_blank">
                        <Button variant="ghost" size="icon">
                            <ExternalLink className="h-4 w-4"/>
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        )
    };
    
    const RenderProfessionalList = ({ type, status } : { type: string, status?: ProfessionalStatus | 'all' }) => {
        const list = filterAndSortProfessionals(type, status);
        if (list.length === 0) {
            return (
                 <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Nenhum profissional encontrado com os filtros atuais.</p>
                </div>
            )
        }
        return (
            <div className="grid gap-4 md:grid-cols-2">
                {list.map(p => <ProfessionalCard key={p.id} professional={p} />)}
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Gerenciamento de Usuários</h1>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Busca e Filtros</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Buscar por nome ou registro..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline"><SlidersHorizontal className="mr-2 h-4 w-4"/>Filtros</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Filtros Avançados</DialogTitle>
                                <DialogDescription>
                                    Refine sua busca por usuários da plataforma.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="filter-status">Status do Cadastro</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos os status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos os Status</SelectItem>
                                            <SelectItem value="verified">Verificado</SelectItem>
                                            <SelectItem value="pending">Pendente</SelectItem>
                                            <SelectItem value="rejected">Rejeitado</SelectItem>
                                            <SelectItem value="expired">Expirado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="filter-type">Tipo de Profissional</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos os tipos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos os Tipos</SelectItem>
                                            <SelectItem value="personal">Personal Trainer</SelectItem>
                                            <SelectItem value="nutritionist">Nutricionista</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost">Limpar Filtros</Button>
                                <Button type="submit">Aplicar Filtros</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            <Tabs defaultValue="personals">
                 <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="personals"><User className="mr-2 h-4 w-4"/>Personal Trainers</TabsTrigger>
                    <TabsTrigger value="nutritionists"><Utensils className="mr-2 h-4 w-4"/>Nutricionistas</TabsTrigger>
                 </TabsList>
                 <TabsContent value="personals" className="mt-6"><RenderProfessionalList type="Personal Trainer" /></TabsContent>
                 <TabsContent value="nutritionists" className="mt-6"><RenderProfessionalList type="Nutricionista" /></TabsContent>
            </Tabs>
        </div>
    )
}
