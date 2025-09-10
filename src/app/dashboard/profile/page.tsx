
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { PlusCircle, User, Bell, Camera, ImageIcon, Save, Copy, Check, QrCode, Edit, Link as LinkIcon, UserPlus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { CameraCapture } from '@/components/camera-capture';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const goalsData = [
    { value: 'hypertrophy', label: 'Ganho de Massa Muscular (Hipertrofia)' },
    { value: 'fat_loss', label: 'Perda de Gordura / Emagrecimento' },
    { value: 'definition', label: 'Definição Muscular' },
    { value: 'recomposition', label: 'Recomposição Corporal' },
    { value: 'conditioning', label: 'Condicionamento Físico Geral' },
    { value: 'aesthetics', label: 'Melhoria da Estética Corporal' },
    { value: 'event_prep', label: 'Preparação para Eventos' },
    { value: 'sports_performance', label: 'Melhorar o Desempenho em Esportes' },
    { value: 'joint_strengthening', label: 'Fortalecimento Articular / Prevenção de Lesões' },
    { value: 'rehab_posture', label: 'Reabilitação / Postura / Mobilidade' },
    { value: 'mental_health', label: 'Saúde Mental e Bem-estar' },
    { value: 'seniors', label: 'Musculação para Idosos / Manutenção da autonomia' },
    { value: 'disease_prevention', label: 'Prevenção de Doenças / Saúde geral' },
];

export default function ProfilePage() {
    const router = useRouter();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        goal: "",
        avatarUrl: "",
        age: "",
        height: "",
        weight: "",
        gender: "male",
        personalTrainer: "",
        nutritionist: "",
    });
    
    const [isProfileComplete, setIsProfileComplete] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const dbData = userDoc.data();
                    const name = currentUser.displayName || dbData.name || "";
                    const age = dbData.age || "";
                    const height = dbData.height || "";
                    const weight = dbData.weight || "";

                    setProfileData({
                        name: name,
                        email: currentUser.email || dbData.email || "",
                        avatarUrl: currentUser.photoURL || dbData.avatarUrl || `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}`,
                        goal: dbData.goal || 'hypertrophy',
                        age: age,
                        height: height,
                        weight: weight,
                        gender: dbData.gender || "male",
                        personalTrainer: dbData.personalTrainer || "",
                        nutritionist: dbData.nutritionist || "",
                    });
                    
                    const profileComplete = !!(age && height && weight);
                    setIsProfileComplete(profileComplete);
                    if(!profileComplete) {
                        setIsEditMode(true);
                    }

                } else {
                    // Profile doesn't exist, force edit mode
                    setIsProfileComplete(false);
                    setIsEditMode(true);
                    setProfileData(prev => ({
                        ...prev,
                        name: currentUser.displayName || "",
                        email: currentUser.email || "",
                        avatarUrl: currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.displayName?.replace(' ', '+')}`,
                    }));
                }
            } else {
                router.push('/login');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setProfileData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (id: string) => (value: string) => {
        setProfileData((prev) => ({ ...prev, [id]: value }));
    };

    const handleAvatarChange = async (dataUrl: string) => {
        if (!user) return;
        try {
            // This is a temporary URL for display. In a real app, you'd upload this to Firebase Storage.
            // For simplicity, we'll just update the auth profile and Firestore with the data URL.
            // Note: Data URLs can be very long and are not ideal for storing in Firestore directly in production.
            await updateProfile(user, { photoURL: dataUrl });
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, { avatarUrl: dataUrl }, { merge: true });
            setProfileData(prev => ({ ...prev, avatarUrl: dataUrl }));
            toast({ title: "Foto de perfil atualizada!" });
        } catch (error) {
            toast({ variant: 'destructive', title: "Erro ao atualizar foto", description: "Não foi possível salvar a nova foto." });
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        try {
            await updateProfile(user, { displayName: profileData.name });
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                name: profileData.name,
                goal: profileData.goal,
                age: profileData.age,
                height: profileData.height,
                weight: profileData.weight,
                gender: profileData.gender,
            }, { merge: true });

            toast({
                title: "Perfil Atualizado!",
                description: "Suas informações foram salvas com sucesso."
            });
            setIsEditMode(false);
            const profileComplete = !!(profileData.age && profileData.height && profileData.weight);
            setIsProfileComplete(profileComplete);
            if(profileComplete){
                router.push('/dashboard/home');
            }

        } catch (error) {
            toast({ variant: 'destructive', title: "Erro ao salvar", description: "Não foi possível salvar as alterações." });
        }
    }

    const handleCopyId = () => {
        if (user) {
            navigator.clipboard.writeText(user.uid).then(() => {
                setHasCopied(true);
                toast({
                    title: "Código Copiado!",
                    description: "Seu código de aluno foi copiado para a área de transferência."
                });
                setTimeout(() => setHasCopied(false), 2000);
            });
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleAvatarChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        if(event.target) event.target.value = '';
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4 md:p-8">
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Skeleton className="h-96 w-full" />
                    </div>
                    <div className="space-y-8">
                        <Skeleton className="h-48 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
            />
            <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
                <DialogContent className="max-w-md p-0">
                    <DialogHeader className="p-4 pb-0">
                        <DialogTitle>Capturar Foto de Perfil</DialogTitle>
                    </DialogHeader>
                    <CameraCapture
                        onCapture={(dataUrl) => {
                            handleAvatarChange(dataUrl);
                            setIsCameraOpen(false);
                        }}
                        onClose={() => setIsCameraOpen(false)}
                    />
                </DialogContent>
            </Dialog>
            <div className="container mx-auto p-4 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Meu Perfil</h2>
                    {!isProfileComplete && isEditMode && (
                         <Button variant="ghost" onClick={() => router.push('/dashboard/home')}>
                            Deixar para depois <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>

                {!isProfileComplete && isEditMode && (
                     <Card className="mb-6 bg-blue-50 border-blue-200">
                        <CardHeader>
                            <CardTitle className="text-blue-800">Complete seu Perfil</CardTitle>
                            <CardDescription className="text-blue-700">
                                Preencha seus dados para ter uma experiência completa e personalizada no app!
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}


                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className='flex items-center gap-2'>
                                        <User className="h-6 w-6" />
                                        <CardTitle>Informações Pessoais</CardTitle>
                                    </div>
                                    {!isEditMode && (
                                        <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Editar Perfil
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="relative">
                                        <Avatar className="h-32 w-32">
                                            <AvatarImage src={profileData.avatarUrl} alt="Foto do perfil" />
                                            <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {isEditMode && (
                                            <Dialog open={isAvatarMenuOpen} onOpenChange={setIsAvatarMenuOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full">
                                                        <Camera className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-xs">
                                                    <DialogHeader>
                                                        <DialogTitle>Alterar Foto de Perfil</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="flex flex-col gap-2 pt-4">
                                                        <Button onClick={() => { setIsAvatarMenuOpen(false); setIsCameraOpen(true); }}>
                                                            <Camera className="mr-2 h-4 w-4" />
                                                            Tirar Foto com a Câmera
                                                        </Button>
                                                        <Button variant="secondary" onClick={() => { setIsAvatarMenuOpen(false); fileInputRef.current?.click(); }}>
                                                            <ImageIcon className="mr-2 h-4 w-4" />
                                                            Escolher da Galeria
                                                        </Button>
                                                        <DialogClose asChild>
                                                            <Button variant="ghost">Cancelar</Button>
                                                        </DialogClose>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </div>
                                </div>

                                {isEditMode ? (
                                    <>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Nome</Label>
                                                <Input id="name" value={profileData.name} onChange={handleInputChange} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="age">Idade</Label>
                                                <Input id="age" type="number" value={profileData.age} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Sexo</Label>
                                                <Select value={profileData.gender} onValueChange={handleSelectChange("gender")}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="male">Masculino</SelectItem>
                                                        <SelectItem value="female">Feminino</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="height">Altura (m)</Label>
                                                <Input id="height" type="number" step="0.01" value={profileData.height} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="weight">Peso (kg)</Label>
                                                <Input id="weight" type="number" step="0.1" value={profileData.weight} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="goal">Objetivo Atual</Label>
                                            <Select value={profileData.goal} onValueChange={handleSelectChange("goal")}>
                                                <SelectTrigger id="goal">
                                                    <SelectValue placeholder="Selecione seu objetivo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {goalsData.map((g) => (
                                                        <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-x-4 gap-y-6">
                                        <div><p className="font-semibold">Nome</p><p className="text-muted-foreground">{profileData.name}</p></div>
                                        <div><p className="font-semibold">Idade</p><p className="text-muted-foreground">{profileData.age || 'Não informado'}</p></div>
                                        <div><p className="font-semibold">Sexo</p><p className="text-muted-foreground">{profileData.gender === 'male' ? 'Masculino' : 'Feminino'}</p></div>
                                        <div><p className="font-semibold">Altura</p><p className="text-muted-foreground">{profileData.height ? `${profileData.height} m` : 'Não informado'}</p></div>
                                        <div><p className="font-semibold">Peso</p><p className="text-muted-foreground">{profileData.weight ? `${profileData.weight} kg` : 'Não informado'}</p></div>
                                        <div className="md:col-span-2"><p className="font-semibold">Objetivo Atual</p><p className="text-muted-foreground">{goalsData.find(g => g.value === profileData.goal)?.label || 'Não definido'}</p></div>
                                    </div>
                                )}
                            </CardContent>
                            {isEditMode && (
                                <CardFooter className="justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setIsEditMode(false)}>Cancelar</Button>
                                    <Button onClick={handleSaveProfile}><Save className="mr-2 h-4 w-4" />Salvar Alterações</Button>
                                </CardFooter>
                            )}
                        </Card>
                    </div>
                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Código de Aluno</CardTitle>
                                <CardDescription>Compartilhe este código com seu personal trainer ou nutricionista para que eles possam te acompanhar.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                                    <span className="font-mono text-lg truncate">{user?.uid || 'Carregando...'}</span>
                                    <div className="flex items-center">
                                        <Button size="icon" variant="ghost" onClick={handleCopyId} disabled={!user?.uid}>
                                            {hasCopied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                                        </Button>
                                        {user?.uid && (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button size="icon" variant="ghost">
                                                        <QrCode className="h-5 w-5" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-xs">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-center">Seu QR Code de Aluno</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="flex flex-col items-center justify-center p-4 gap-4">
                                                        <Image
                                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${user.uid}`}
                                                            width={200}
                                                            height={200}
                                                            alt={`QR Code para ${user.uid}`}
                                                            className="rounded-md"
                                                        />
                                                        <p className="text-sm text-muted-foreground text-center">Peça para seu profissional escanear este código para te adicionar.</p>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
