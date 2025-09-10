
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, KeyRound, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function SecurityPage() {
    const { toast } = useToast();

    const handlePasswordChange = () => {
        // Lógica para alterar a senha
        toast({
            title: "Senha Alterada!",
            description: "Sua senha foi atualizada com sucesso.",
        });
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="mb-6">
                <h2 className="text-3xl font-bold">Segurança e Privacidade</h2>
                <p className="text-muted-foreground">Gerencie sua senha e acesse nossos termos.</p>
            </div>
            <div className="max-w-2xl space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <KeyRound className="h-6 w-6" />
                            Alterar Senha
                        </CardTitle>
                        <CardDescription>
                            Recomendamos usar uma senha forte que você não usa em outro lugar.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Senha Atual</Label>
                            <Input id="current-password" type="password" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="new-password">Nova Senha</Label>
                            <Input id="new-password" type="password" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                            <Input id="confirm-password" type="password" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handlePasswordChange}>
                            <Save className="mr-2 h-4 w-4"/>
                            Salvar Nova Senha
                        </Button>
                    </CardFooter>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-6 w-6" />
                            Políticas e Termos
                        </CardTitle>
                         <CardDescription>
                            Acesse nossos documentos para entender como seus dados são utilizados.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Link href="#"><Button variant="link" className="p-0 h-auto">Política de Privacidade</Button></Link>
                        <br/>
                        <Link href="#"><Button variant="link" className="p-0 h-auto">Termos de Uso do Profissional</Button></Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
