
"use client";

import { Card, CardDescription, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, FileText, Share2, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";


// Mock data
const mockAssessmentTemplates = [
    {
        id: 'template_1',
        name: 'Avaliação Inicial Completa',
        description: 'Modelo abrangente para novos alunos, cobrindo todos os aspectos essenciais.',
        itemsCount: 45,
        lastUpdated: '2024-07-20',
        isDefault: true,
    },
    {
        id: 'template_2',
        name: 'Acompanhamento Rápido',
        description: 'Modelo focado em medidas principais para reavaliações periódicas.',
        itemsCount: 15,
        lastUpdated: '2024-06-15',
        isDefault: false,
    }
];

export default function AssessmentsPage() {
    const { toast } = useToast();

    const handleApplyTemplate = (template: any) => {
        // Lógica para aplicar o template (ex: redirecionar para seleção de aluno)
         toast({
            title: "Modelo Selecionado!",
            description: `Você selecionou o modelo "${template.name}". Agora, escolha um aluno para aplicar.`,
        });
        // router.push(`/personal/new-assessment?templateId=${template.id}`);
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Avaliações</h2>
                 <Link href="/personal/assessment-template">
                    <Button>
                        <Plus className="mr-2 h-4 w-4"/>
                        Criar Novo Modelo
                    </Button>
                </Link>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Meus Modelos de Avaliação</CardTitle>
                    <CardDescription>Gerencie seus modelos de avaliação para aplicar aos seus alunos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {mockAssessmentTemplates.map((template) => (
                        <Card key={template.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="flex items-center gap-2">
                                            {template.name}
                                            {template.isDefault && <Badge>Padrão</Badge>}
                                        </CardTitle>
                                        <CardDescription>{template.description}</CardDescription>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Editar</DropdownMenuItem>
                                            <DropdownMenuItem><Share2 className="mr-2"/> Compartilhar</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2"/> Excluir</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            <CardFooter className="flex justify-between items-center">
                                <p className="text-xs text-muted-foreground">
                                    {template.itemsCount} itens | Atualizado em {new Date(template.lastUpdated + 'T00:00:00').toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                </p>
                                <Link href={`/personal/new-assessment?templateId=${template.id}&templateName=${encodeURIComponent(template.name)}`}>
                                    <Button>
                                        <FileText className="mr-2 h-4 w-4"/>
                                        Aplicar Modelo
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                    {mockAssessmentTemplates.length === 0 && (
                         <div className="text-center py-10 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground mb-4">Você ainda não criou modelos de avaliação.</p>
                             <Link href="/personal/assessment-template">
                                <Button variant="outline">
                                    <Plus className="mr-2 h-4 w-4"/>
                                    Criar Primeiro Modelo
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
