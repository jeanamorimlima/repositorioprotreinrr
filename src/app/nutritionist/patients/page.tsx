"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Plus } from "lucide-react";

// Mock data, em um app real viria do DB
const mockPatients = [
  { id: 'patient_1', name: 'Juliana Mendes', goal: 'Reeducação Alimentar', avatarUrl: 'https://placehold.co/128x128.png' },
  { id: 'patient_2', name: 'Ricardo Alves', goal: 'Nutrição Esportiva', avatarUrl: 'https://placehold.co/128x128.png' },
];

export default function PatientsPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Meus Pacientes</h2>
                <Button>
                    <Plus className="mr-2 h-4 w-4"/>
                    Adicionar Paciente
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Pacientes</CardTitle>
                    <CardDescription>Gerencie seus pacientes e planos alimentares.</CardDescription>
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
                                    <Button variant="outline">Ver Perfil</Button>
                                </CardHeader>
                            </Card>
                        ))}
                         {mockPatients.length === 0 && (
                            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                                <p className="text-muted-foreground">Você ainda não tem pacientes.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
