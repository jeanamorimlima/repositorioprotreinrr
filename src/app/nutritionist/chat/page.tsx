"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

// Mock data, em um app real viria do DB
const mockPatients = [
  { id: 'patient_1', name: 'Juliana Mendes', goal: 'Reeducação Alimentar', avatarUrl: 'https://placehold.co/128x128.png' },
  { id: 'patient_2', name: 'Ricardo Alves', goal: 'Nutrição Esportiva', avatarUrl: 'https://placehold.co/128x128.png' },
];

export default function NutritionistChatPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Chat com Pacientes</h2>
                <p className="text-muted-foreground">Converse com seus pacientes para dar suporte e tirar dúvidas.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Meus Pacientes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {mockPatients.map(patient => (
                            <Card key={patient.id}>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                                            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle>{patient.name}</CardTitle>
                                            <CardDescription>{patient.goal}</CardDescription>
                                        </div>
                                    </div>
                                    <Button>
                                        <Send className="mr-2 h-4 w-4"/>
                                        Iniciar Conversa
                                    </Button>
                                </CardHeader>
                            </Card>
                        ))}
                         {mockPatients.length === 0 && (
                            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                                <p className="text-muted-foreground">Você ainda não tem pacientes para conversar.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
