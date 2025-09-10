
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy, MoreHorizontal, User, Utensils, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type UserType = 'aluno' | 'personal' | 'nutricionista';

const mockTickets = [
    {
        id: 'TKT-001',
        subject: 'Não consigo salvar meu treino',
        user: { name: 'Fabiana Silva', type: 'aluno' as UserType },
        date: '2024-08-01T10:30:00Z',
        status: 'open' as TicketStatus,
    },
    {
        id: 'TKT-002',
        subject: 'Dúvida sobre cobrança da assinatura',
        user: { name: 'João Carlos da Silva', type: 'personal' as UserType },
        date: '2024-07-31T15:00:00Z',
        status: 'in_progress' as TicketStatus,
    },
    {
        id: 'TKT-003',
        subject: 'Problema ao carregar foto no perfil',
        user: { name: 'Ana Beatriz', type: 'nutricionista' as UserType },
        date: '2024-07-30T11:45:00Z',
        status: 'resolved' as TicketStatus,
    },
];


const getStatusInfo = (status: TicketStatus) => {
    switch (status) {
        case 'open': return { label: 'Aberto', color: 'bg-red-500' };
        case 'in_progress': return { label: 'Em Andamento', color: 'bg-yellow-500' };
        case 'resolved': return { label: 'Resolvido', color: 'bg-green-500' };
        case 'closed': return { label: 'Fechado', color: 'bg-gray-500' };
    }
}

const getUserTypeIcon = (type: UserType) => {
    switch (type) {
        case 'aluno': return <User className="h-4 w-4" />;
        case 'personal': return <User className="h-4 w-4" />;
        case 'nutricionista': return <Utensils className="h-4 w-4" />;
    }
}

export default function AdminSupportPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Suporte</h1>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LifeBuoy className="h-6 w-6 text-primary"/>
                        Tickets de Suporte
                    </CardTitle>
                    <CardDescription>Gerencie as solicitações e problemas dos usuários da plataforma.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 mb-4">
                        <div className="relative flex-1">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                             <Input placeholder="Buscar por assunto ou nome..." className="pl-10"/>
                        </div>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filtrar por status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os Status</SelectItem>
                                <SelectItem value="open">Abertos</SelectItem>
                                <SelectItem value="in_progress">Em Andamento</SelectItem>
                                <SelectItem value="resolved">Resolvidos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='w-[120px]'>Status</TableHead>
                                    <TableHead>Assunto</TableHead>
                                    <TableHead>Usuário</TableHead>
                                    <TableHead className='w-[150px]'>Data</TableHead>
                                    <TableHead className='w-[50px]'></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockTickets.map(ticket => {
                                    const statusInfo = getStatusInfo(ticket.status);
                                    return (
                                        <TableRow key={ticket.id}>
                                            <TableCell>
                                                <Badge className={`${statusInfo.color} text-white`}>{statusInfo.label}</Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">{ticket.subject}</TableCell>
                                            <TableCell>
                                                <div className='flex items-center gap-2'>
                                                   {getUserTypeIcon(ticket.user.type)}
                                                   {ticket.user.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>{new Date(ticket.date).toLocaleDateString('pt-BR')}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                                                        <DropdownMenuItem>Responder</DropdownMenuItem>
                                                        <DropdownMenuItem>Marcar como Resolvido</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                     {mockTickets.length === 0 && (
                         <div className="text-center py-10 border-2 border-dashed rounded-lg mt-4">
                            <p className="text-muted-foreground">Nenhum ticket de suporte aberto.</p>
                        </div>
                     )}
                </CardContent>
            </Card>
        </div>
    );
}
