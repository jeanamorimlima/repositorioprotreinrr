
"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

// Mock data, em um app real viria do banco de dados.
const mockStudents = [
    { id: 'aluno_1a2b3c4d', name: 'Fabiana Silva', email: 'fabiana.silva@example.com', goal: 'Perda de Gordura', avatarUrl: 'https://placehold.co/128x128.png' },
    { id: 'aluno_5e6f7g8h', name: 'Gustavo Pereira', email: 'gustavo.pereira@example.com', goal: 'Hipertrofia', avatarUrl: 'https://placehold.co/128x128.png' },
];


function NewAssessmentComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const templateId = searchParams.get('templateId');
    const templateName = searchParams.get('templateName');

    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    const handleStartAssessment = () => {
        if (!selectedStudentId) {
            alert("Por favor, selecione um aluno.");
            return;
        }
        // Futuramente, redirecionar para a página do formulário de avaliação
        // com o templateId e studentId
        router.push(`/personal/assessment/${selectedStudentId}?template=${templateId}`);
    }

    const selectedStudent = mockStudents.find(s => s.id === selectedStudentId);

    return (
        <div className="container mx-auto p-4 md:p-8">
             <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Nova Avaliação</h2>
                    <p className="text-muted-foreground">Aplicando o modelo: <span className="font-semibold text-primary">{templateName || 'Desconhecido'}</span></p>
                </div>
            </div>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Selecione o Aluno</CardTitle>
                    <CardDescription>Escolha para qual aluno esta avaliação será aplicada.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="student-select">Aluno</Label>
                        <Select onValueChange={setSelectedStudentId}>
                            <SelectTrigger id="student-select">
                                <SelectValue placeholder="Selecione um aluno da sua lista" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockStudents.map(student => (
                                    <SelectItem key={student.id} value={student.id}>
                                        {student.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedStudent && (
                        <Card className="bg-muted/50">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={selectedStudent.avatarUrl} alt={selectedStudent.name} />
                                    <AvatarFallback>{selectedStudent.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-lg">{selectedStudent.name}</CardTitle>
                                    <CardDescription>{selectedStudent.email}</CardDescription>
                                </div>
                            </CardHeader>
                             <CardFooter>
                                <Badge variant="outline" className="flex items-center gap-2"><Target className="h-4 w-4"/>{selectedStudent.goal}</Badge>
                            </CardFooter>
                        </Card>
                    )}
                </CardContent>
                <CardFooter className="justify-end">
                    <Button onClick={handleStartAssessment} disabled={!selectedStudentId}>
                        Iniciar Avaliação
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}


export default function NewAssessmentPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <NewAssessmentComponent />
        </Suspense>
    )
}
