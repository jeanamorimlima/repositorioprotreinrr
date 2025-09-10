
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';


const mockCards = [
    {
        id: 'card_1_nutri',
        brand: 'Elo',
        last4: '1234',
        isDefault: true,
    }
];

export default function PaymentMethodsPage() {
    const { toast } = useToast();

    const handleSaveCard = () => {
        toast({
            title: "Cartão Adicionado!",
            description: "Seu novo cartão foi salvo com sucesso.",
        });
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
             <div className="mb-6">
                <h2 className="text-3xl font-bold">Formas de Pagamento</h2>
                <p className="text-muted-foreground">Adicione e gerencie os cartões para pagamento da sua assinatura.</p>
            </div>
            
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-6 w-6" />
                        Meus Cartões
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {mockCards.map(card => (
                        <div key={card.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <CreditCard className="h-8 w-8 text-muted-foreground" />
                                <div>
                                    <p className="font-semibold">{card.brand} final {card.last4}</p>
                                    <p className="text-sm text-muted-foreground">Expira em 02/2026</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {card.isDefault && <Badge>Padrão</Badge>}
                                <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {mockCards.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">Nenhum cartão cadastrado.</p>
                    )}
                </CardContent>
                <CardFooter>
                    <Dialog>
                        <DialogTrigger asChild>
                             <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Novo Cartão
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Adicionar Novo Cartão</DialogTitle>
                                <DialogDescription>
                                    Insira os dados do seu cartão de crédito.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                                    <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="cardName">Nome no Cartão</Label>
                                    <Input id="cardName" placeholder="Seu nome como aparece no cartão" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                        <Label htmlFor="cardExpiry">Validade (MM/AA)</Label>
                                        <Input id="cardExpiry" placeholder="MM/AA" />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="cardCvv">CVV</Label>
                                        <Input id="cardCvv" placeholder="123" />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">Cancelar</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button type="button" onClick={handleSaveCard}>Salvar Cartão</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>
        </div>
    )
}
