
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { User, Users, Plus, UserCircle, CheckCircle, MoreHorizontal, Trash2, ToggleLeft, ToggleRight, Target, Mail, Search, ScanLine, UserPlus, History, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CameraCapture } from "@/components/camera-capture";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getStudentsByPersonalId, Student } from "@/services/students";
import { Skeleton } from "@/components/ui/skeleton";


// Mock de um "banco de dados" de usuários da plataforma
const platformUsers: Student[] = [
    { id: 'aluno_1a2b3c4d', name: 'Fabiana Silva', email: 'fabiana.silva@example.com', goal: 'Perda de Gordura', avatarUrl: 'https://placehold.co/128x128.png', status: 'active', personalId: 'personal_123' },
    { id: 'aluno_5e6f7g8h', name: 'Gustavo Pereira', email: 'gustavo.pereira@example.com', goal: 'Hipertrofia', avatarUrl: 'https://placehold.co/128x128.png', status: 'active', personalId: 'personal_123' },
    { id: 'aluno_9i0j1k2l', name: 'Helena Costa', email: 'helena.costa@example.com', goal: 'Condicionamento', avatarUrl: 'https://placehold.co/128x128.png', status: 'active', personalId: 'personal_456' },
];

// Fallback para crypto.randomUUID
function generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback para ambientes sem crypto.randomUUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


export default function StudentsPage() {
    const { toast } = useToast();
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [studentSearchId, setStudentSearchId] = useState('');
    const [foundStudent, setFoundStudent] = useState<Student | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isQrCameraOpen, setIsQrCameraOpen] = useState(false);
    const [manualStudent, setManualStudent] = useState({ name: '', email: '', goal: ''});

    useEffect(() => {
        const fetchStudents = async () => {
            setIsLoading(true);
            try {
                // Hardcoded personal ID for demonstration. In a real app, this would come from the logged-in user.
                const personalId = "personal_123";
                const fetchedStudents = await getStudentsByPersonalId(personalId);
                setStudents(fetchedStudents);
            } catch (error) {
                console.error("Error fetching students:", error);
                toast({
                    variant: "destructive",
                    title: "Erro ao buscar alunos",
                    description: "Não foi possível carregar a lista de alunos. Tente novamente mais tarde."
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, [toast]);


    const handleSearchStudent = () => {
        setIsSearching(true);
        setTimeout(() => {
            const student = platformUsers.find(user => user.id === studentSearchId);
            if (student) {
                setFoundStudent(student);
            } else {
                toast({ variant: "destructive", title: "Aluno não encontrado", description: "Verifique o código e tente novamente." });
                setFoundStudent(null);
            }
            setIsSearching(false);
        }, 1000);
    };

    const handleAddStudent = () => {
        if (foundStudent) {
            if(students.some(s => s.id === foundStudent.id)) {
                toast({ variant: "destructive", title: "Aluno já cadastrado", description: "Este aluno já está na sua lista." });
                return;
            }
            // Here you would typically call a service to add the student to the personal's list in Firestore
            setStudents(prev => [...prev, foundStudent]);
            setFoundStudent(null);
            setStudentSearchId('');
            toast({ title: "Aluno Adicionado!", description: `${foundStudent.name} foi adicionado à sua lista.` });
        }
    };

    const handleAddManualStudent = () => {
        if (!manualStudent.name || !manualStudent.email || !manualStudent.goal) {
            toast({ variant: "destructive", title: "Campos obrigatórios", description: "Preencha todos os campos para adicionar o aluno." });
            return;
        }
        const newStudent: Student = {
            id: `manual_${generateUUID().slice(0, 8)}`,
            name: manualStudent.name,
            email: manualStudent.email,
            goal: manualStudent.goal,
            avatarUrl: `https://ui-avatars.com/api/?name=${manualStudent.name.replace(' ', '+')}&background=random`,
            status: 'active',
            personalId: 'personal_123' // Assign to the current personal
        };
        // Here you would typically call a service to create the student in Firestore
        setStudents(prev => [...prev, newStudent]);
        setManualStudent({ name: '', email: '', goal: '' });
        toast({ title: "Aluno Adicionado!", description: `${newStudent.name} foi adicionado manualmente.` });
    };

    const handleQrScan = (dataUrl: string) => {
        setStudentSearchId(dataUrl);
        setIsQrCameraOpen(false);
        toast({ title: "Código Escaneado!", description: "Buscando aluno..." });
        setTimeout(() => {
            document.getElementById('search-student-button')?.click();
        }, 500);
    };

    const handleToggleStudentStatus = (studentId: string) => {
        // In a real app, this would be an update call to Firestore.
        setStudents(prev => 
            prev.map(student => {
                if (student.id === studentId) {
                    const newStatus = student.status === 'active' ? 'inactive' : 'active';
                    toast({
                        title: `Status do Aluno Alterado`,
                        description: `${student.name} foi marcado como ${newStatus === 'active' ? 'ativo' : 'inativo'}.`
                    });
                    return { ...student, status: newStatus };
                }
                return student;
            })
        );
    };

    const activeStudents = students.filter(s => s.status === 'active');
    const inactiveStudents = students.filter(s => s.status === 'inactive');

    const StudentCard = ({ student }: { student: Student }) => (
        <Card key={student.id} className={student.status === 'inactive' ? 'bg-muted/50' : ''}>
           <CardHeader className="flex flex-row items-center justify-between">
               <div className="flex items-center gap-4">
                   <Avatar>
                       <AvatarImage src={student.avatarUrl} alt={student.name} />
                       <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                   </Avatar>
                   <div>
                       <CardTitle className="text-lg">{student.name}</CardTitle>
                       <CardDescription className="flex items-center gap-1 text-xs"><Mail className="h-3 w-3"/>{student.email}</CardDescription>
                   </div>
               </div>
                <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                       <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="end">
                       <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                       <DropdownMenuItem asChild>
                          <Link href={`/dashboard/workout-templates?studentId=${student.id}&studentName=${encodeURIComponent(student.name)}`}>Criar Treino</Link>
                       </DropdownMenuItem>
                       <DropdownMenuSeparator/>
                       <DropdownMenuItem onClick={() => handleToggleStudentStatus(student.id)}>
                           {student.status === 'active' ? <ToggleLeft className="mr-2" /> : <ToggleRight className="mr-2" />}
                           {student.status === 'active' ? 'Desativar Aluno' : 'Reativar Aluno'}
                       </DropdownMenuItem>
                       <DropdownMenuItem className="text-destructive">Excluir Aluno</DropdownMenuItem>
                   </DropdownMenuContent>
               </DropdownMenu>
           </CardHeader>
           <CardFooter>
               <Badge variant="outline" className="flex items-center gap-2 w-full"><Target className="h-4 w-4"/> {student.goal}</Badge>
           </CardFooter>
       </Card>
    );

    const StudentSkeleton = () => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-3 w-[180px]" />
                    </div>
                </div>
                <Skeleton className="h-8 w-8" />
            </CardHeader>
            <CardFooter>
                <Skeleton className="h-6 w-full" />
            </CardFooter>
        </Card>
    );

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Dialog open={isQrCameraOpen} onOpenChange={setIsQrCameraOpen}>
                <DialogContent className="max-w-md p-0">
                    <DialogHeader className="p-4 pb-0">
                        <DialogTitle>Escanear QR Code do Aluno</DialogTitle>
                    </DialogHeader>
                    <CameraCapture
                        onCapture={handleQrScan}
                        onClose={() => setIsQrCameraOpen(false)}
                        isQrScanner={true}
                    />
                </DialogContent>
            </Dialog>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Meus Alunos</h2>
                 <Dialog onOpenChange={() => { setFoundStudent(null); setStudentSearchId(''); }}>
                    <DialogTrigger asChild>
                         <Button>
                            <Plus className="mr-2 h-4 w-4"/>
                            Adicionar Aluno
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                       <Tabs defaultValue="search" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="search"><Search className="mr-2 h-4 w-4"/>Buscar Aluno</TabsTrigger>
                                <TabsTrigger value="manual"><UserPlus className="mr-2 h-4 w-4"/>Cadastro Manual</TabsTrigger>
                            </TabsList>
                            <TabsContent value="search">
                                <DialogHeader className="mt-4">
                                    <DialogTitle>Adicionar Aluno Existente</DialogTitle>
                                    <DialogDescription>Peça ao aluno o seu código único e insira abaixo para encontrá-lo, ou escaneie o QR code.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="flex items-center space-x-2">
                                        <Input 
                                            id="studentSearchId" 
                                            placeholder="Insira o código do aluno"
                                            value={studentSearchId}
                                            onChange={(e) => setStudentSearchId(e.target.value)}
                                        />
                                        <Button id="search-student-button" type="button" onClick={handleSearchStudent} disabled={isSearching || !studentSearchId}>
                                            <Search className="mr-2 h-4 w-4" />
                                            {isSearching ? 'Buscando...' : 'Buscar'}
                                        </Button>
                                        <Button type="button" variant="outline" size="icon" onClick={() => setIsQrCameraOpen(true)}>
                                            <ScanLine />
                                        </Button>
                                    </div>
                                    {foundStudent && (
                                        <Card>
                                            <CardHeader className="flex flex-row items-center gap-4">
                                                 <Avatar>
                                                    <AvatarImage src={foundStudent.avatarUrl} alt={foundStudent.name} />
                                                    <AvatarFallback>{foundStudent.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <CardTitle className="text-lg">{foundStudent.name}</CardTitle>
                                                    <CardDescription>{foundStudent.email}</CardDescription>
                                                </div>
                                            </CardHeader>
                                            <CardFooter>
                                                <DialogClose asChild>
                                                    <Button className="w-full" onClick={handleAddStudent}>
                                                        <CheckCircle className="mr-2 h-4 w-4"/>
                                                        Confirmar e Adicionar Aluno
                                                    </Button>
                                                </DialogClose>
                                            </CardFooter>
                                        </Card>
                                    )}
                                </div>
                            </TabsContent>
                            <TabsContent value="manual">
                                 <DialogHeader className="mt-4">
                                    <DialogTitle>Adicionar Aluno Manualmente</DialogTitle>
                                    <DialogDescription>Para alunos que não possuem cadastro na plataforma.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="manualName">Nome Completo</Label>
                                        <Input id="manualName" value={manualStudent.name} onChange={(e) => setManualStudent({...manualStudent, name: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="manualEmail">E-mail</Label>
                                        <Input id="manualEmail" type="email" value={manualStudent.email} onChange={(e) => setManualStudent({...manualStudent, email: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="manualGoal">Objetivo Principal</Label>
                                        <Input id="manualGoal" value={manualStudent.goal} onChange={(e) => setManualStudent({...manualStudent, goal: e.target.value})} />
                                    </div>
                                </div>
                                 <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">Cancelar</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button onClick={handleAddManualStudent}>Adicionar Aluno</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </TabsContent>
                       </Tabs>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Alunos Ativos</CardTitle>
                    <CardDescription>Gerencie seus alunos, treinos e progresso.</CardDescription>
                </CardHeader>
                <CardContent>
                     {isLoading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <StudentSkeleton />
                            <StudentSkeleton />
                            <StudentSkeleton />
                        </div>
                    ) : (
                        <>
                             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {activeStudents.map(student => (
                                        <StudentCard key={student.id} student={student} />
                                ))}
                            </div>
                            {activeStudents.length === 0 && (
                                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                                    <p className="text-muted-foreground">Você ainda não tem alunos ativos.</p>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {inactiveStudents.length > 0 && (
                 <Accordion type="single" collapsible className="w-full mt-6">
                    <AccordionItem value="item-1">
                        <Card>
                            <AccordionTrigger className="p-6 w-full">
                               <div className="flex items-center gap-2">
                                 <History className="h-5 w-5" />
                                 <h3 className="text-lg font-semibold">Histórico de Alunos Inativos ({inactiveStudents.length})</h3>
                               </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-6 pt-0">
                                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {inactiveStudents.map(student => (
                                        <StudentCard key={student.id} student={student} />
                                    ))}
                                </div>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                </Accordion>
            )}
        </div>
    )
}
