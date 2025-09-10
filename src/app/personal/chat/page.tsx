"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";

type Student = {
    id: string;
    name: string;
    email: string;
    goal: string;
    avatarUrl: string;
    status: 'active' | 'inactive';
};

const initialStudents: Student[] = [
    { id: 'aluno_1a2b3c4d', name: 'Fabiana Silva', email: 'fabiana.silva@example.com', goal: 'Perda de Gordura', avatarUrl: 'https://placehold.co/128x128.png', status: 'active' },
    { id: 'aluno_5e6f7g8h', name: 'Gustavo Pereira', email: 'gustavo.pereira@example.com', goal: 'Hipertrofia', avatarUrl: 'https://placehold.co/128x128.png', status: 'active' },
    { id: 'aluno_inactive_1', name: 'Carlos Andrade', email: 'carlos.andrade@example.com', goal: 'Manutenção', avatarUrl: 'https://placehold.co/128x128.png', status: 'inactive' },
];

export default function PersonalChatPage() {
    const [students, setStudents] = useState<Student[]>(initialStudents);
    const activeStudents = students.filter(s => s.status === 'active');

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Chat com Alunos</h2>
                <p className="text-muted-foreground">Converse com seus alunos ativos para dar suporte e tirar dúvidas.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Alunos Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {activeStudents.map(student => (
                            <Card key={student.id}>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src={student.avatarUrl} alt={student.name} />
                                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle>{student.name}</CardTitle>
                                            <CardDescription>{student.goal}</CardDescription>
                                        </div>
                                    </div>
                                    <Button>
                                        <Send className="mr-2 h-4 w-4"/>
                                        Iniciar Conversa
                                    </Button>
                                </CardHeader>
                            </Card>
                        ))}
                         {activeStudents.length === 0 && (
                            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                                <p className="text-muted-foreground">Você ainda não tem alunos ativos para conversar.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
