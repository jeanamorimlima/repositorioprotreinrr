
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Download, TrendingUp, WalletCards, Calendar as CalendarIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';

// Mock data
const mockTransactions = [
    { id: 'txn_1', date: '2024-08-01', description: 'Venda - Pacote de Verão com 20% OFF', studentName: 'Gustavo Pereira', type: 'sale', amount: 239.90 },
    { id: 'txn_2', date: '2024-07-25', description: 'Venda - Consultoria Online', studentName: 'Fabiana Silva', type: 'sale', amount: 150.00 },
    { id: 'txn_3', date: '2024-07-20', description: 'Saque para conta bancária', studentName: '', type: 'payout', amount: -300.00 },
    { id: 'txn_4', date: '2024-07-15', description: 'Venda - Avaliação Física', studentName: 'Ricardo Alves', type: 'sale', amount: 80.00 },
    { id: 'txn_5', date: '2024-06-30', description: 'Venda - Desafio 30 dias', studentName: 'Ana Clara', type: 'sale', amount: 50.00 },
];

const mockBalance = {
    available: 89.90,
    totalRevenueAllTime: 1250.70,
};

type FilterType = 'all' | 'sales' | 'payouts';

export default function WalletPage() {
    const [filter, setFilter] = useState<FilterType>('all');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(2024, 6, 1),
        to: new Date(2024, 7, 30),
    });

    const filteredTransactions = useMemo(() => {
        return mockTransactions.filter(t => {
            const transactionDate = new Date(t.date + 'T00:00:00Z');
            const typeMatch = filter === 'all' || (filter === 'sales' && t.type === 'sale') || (filter === 'payouts' && t.type === 'payout');
            
            if (!dateRange || (!dateRange.from && !dateRange.to)) {
                return typeMatch;
            }

            const dateMatch = 
                (!dateRange.from || transactionDate >= dateRange.from) &&
                (!dateRange.to || transactionDate <= dateRange.to);

            return typeMatch && dateMatch;
        });
    }, [filter, dateRange]);
    
    const revenueInPeriod = useMemo(() => {
        return filteredTransactions
            .filter(t => t.type === 'sale')
            .reduce((sum, t) => sum + t.amount, 0);
    }, [filteredTransactions]);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Minha Carteira</h2>
                <p className="text-muted-foreground">Gerencie seus ganhos e histórico de transações.</p>
            </div>

            {/* Cards de Resumo */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ {mockBalance.available.toFixed(2).replace('.', ',')}</div>
                        <Button className="mt-2" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Solicitar Saque
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                        <WalletCards className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ {mockBalance.totalRevenueAllTime.toFixed(2).replace('.', ',')}</div>
                         <p className="text-xs text-muted-foreground">Desde o início</p>
                    </CardContent>
                </Card>
            </div>

            {/* Histórico de Transações */}
            <Card>
                 <CardHeader className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                         <div className="flex-1">
                            <CardTitle>Histórico de Transações</CardTitle>
                            <CardDescription>Veja todas as suas movimentações financeiras.</CardDescription>
                        </div>
                        <Card className="w-full md:w-auto md:min-w-[250px]">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Receita no Período</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">R$ {revenueInPeriod.toFixed(2).replace('.', ',')}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                "w-full md:w-[300px] justify-start text-left font-normal",
                                !dateRange && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange?.from ? (
                                dateRange.to ? (
                                    <>
                                    {format(dateRange.from, "LLL dd, y", { locale: ptBR })} -{" "}
                                    {format(dateRange.to, "LLL dd, y", { locale: ptBR })}
                                    </>
                                ) : (
                                    format(dateRange.from, "LLL dd, y", { locale: ptBR })
                                )
                                ) : (
                                <span>Selecione um período</span>
                                )}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                                locale={ptBR}
                            />
                            </PopoverContent>
                        </Popover>
                            <div className="w-full md:w-48">
                            <Select onValueChange={(value: FilterType) => setFilter(value)} defaultValue="all">
                                <SelectTrigger>
                                    <SelectValue placeholder="Filtrar por tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas</SelectItem>
                                    <SelectItem value="sales">Vendas</SelectItem>
                                    <SelectItem value="payouts">Saques</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead className="text-right">Valor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTransactions.map((t) => (
                                    <TableRow key={t.id}>
                                        <TableCell>
                                            {new Date(t.date + 'T00:00:00Z').toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium">{t.description}</p>
                                            {t.studentName && <p className="text-xs text-muted-foreground">{t.studentName}</p>}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={t.type === 'sale' ? 'default' : 'secondary'}>
                                                {t.type === 'sale' ? 'Venda' : 'Saque'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className={`text-right font-semibold ${t.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {t.amount > 0 ? `+ R$ ${t.amount.toFixed(2).replace('.', ',')}` : `- R$ ${Math.abs(t.amount).toFixed(2).replace('.', ',')}`}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                     {filteredTransactions.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-muted-foreground">Nenhuma transação encontrada para este filtro.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
