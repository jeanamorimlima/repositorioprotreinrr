
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Users, Percent, FileText, DollarSign } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Configurações Gerais</h1>
            
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Percent className="h-6 w-6 text-primary"/>
                            Taxas e Comissões
                        </CardTitle>
                        <CardDescription>Defina as taxas de comissão sobre as vendas da plataforma.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="personal-fee">Comissão Personal Trainer (%)</Label>
                            <Input id="personal-fee" type="number" defaultValue="15" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nutri-fee">Comissão Nutricionista (%)</Label>
                            <Input id="nutri-fee" type="number" defaultValue="15" />
                        </div>
                         <Button>Salvar Taxas</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-6 w-6 text-primary"/>
                            Planos de Assinatura
                        </CardTitle>
                        <CardDescription>Defina os valores mensais dos planos para profissionais.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="personal-plan">Valor Plano Personal (R$)</Label>
                            <Input id="personal-plan" type="number" defaultValue="99.90" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nutri-plan">Valor Plano Nutricionista (R$)</Label>
                            <Input id="nutri-plan" type="number" defaultValue="99.90" />
                        </div>
                         <Button>Salvar Valores</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-6 w-6 text-primary"/>
                            Gerenciamento de Equipe
                        </CardTitle>
                        <CardDescription>Adicione ou remova administradores da plataforma.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-10 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">Funcionalidade em breve...</p>
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-6 w-6 text-primary"/>
                            Políticas e Termos
                        </CardTitle>
                        <CardDescription>Gerencie os textos dos Termos de Uso e Políticas de Privacidade.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="text-center py-10 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">Funcionalidade em breve...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
