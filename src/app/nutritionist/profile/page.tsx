
"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Save, User, GraduationCap, Award, Building, Clock, Link as LinkIcon, Camera, ImageIcon, FileCheck, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { CameraCapture } from "@/components/camera-capture";


type RegistrationStatus = 'active' | 'expiring' | 'inactive';

export default function NutritionistProfilePage() {
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const registrationProofRef = useRef<HTMLInputElement>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [profile, setProfile] = useState({
        fullName: "Ana Beatriz",
        email: "ana.beatriz.nutri@example.com",
        avatarUrl: "https://placehold.co/128x128.png",
        whatsapp: "(41) 91234-5678",
        city: "Curitiba",
        state: "PR",
        crnNumber: "CRN-8 12345",
        crnUf: "PR",
        crnExpiry: "2025-06-30",
        crnProofUrl: "",
        crnStatus: 'active' as RegistrationStatus,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setProfile(prev => ({ ...prev, [id]: value }));
      };

    const handleSave = () => {
        // Lógica de salvamento
        console.log("Perfil salvo:", profile);
        toast({ title: "Perfil Atualizado!", description: "Suas informações foram salvas com sucesso." });
        setIsEditMode(false);
    };

    const handleRegistrationProofUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const dataUrl = URL.createObjectURL(file);
            setProfile(prev => ({ ...prev, crnProofUrl: dataUrl }));
            toast({
                title: "Comprovante enviado para análise!",
                description: "A validação pode levar até uma semana. Você será notificado.",
            });
        }
      };

    const handleAvatarChange = (dataUrl: string) => {
        setProfile(prev => ({...prev, avatarUrl: dataUrl}));
        toast({ title: "Foto de perfil atualizada!" });
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
        event.target.value = '';
    };

    const DataField = ({ label, value }: { label: string, value?: string | React.ReactNode }) => (
        <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <div className="text-base">{value || "Não informado"}</div>
        </div>
    );
    
    const CrnStatusBadge = ({ status }: { status: RegistrationStatus }) => {
        const statusMap = {
            active: { text: "Ativo", color: "bg-green-500" },
            expiring: { text: "Próximo do Vencimento", color: "bg-yellow-500" },
            inactive: { text: "Inativo/Vencido", color: "bg-red-500" },
        };
        const { text, color } = statusMap[status];
        return <Badge className={`${color} text-white`}>{text}</Badge>
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
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

             <div className="mb-6">
                <h2 className="text-2xl font-bold">Meu Perfil</h2>
                <p className="text-muted-foreground">Gerencie suas informações profissionais.</p>
            </div>
            
            <Card>
                <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
                            <AvatarFallback>{profile.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl">{profile.fullName}</CardTitle>
                            <CardDescription>Este é o seu perfil público como Nutricionista.</CardDescription>
                        </div>
                    </div>
                    <Button variant="outline" onClick={() => setIsEditMode(!isEditMode)}>
                        {isEditMode ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                        {isEditMode ? 'Salvar' : 'Editar Perfil'}
                    </Button>
                </CardHeader>
                <CardContent className="space-y-8 pt-6">
                    {isEditMode ? (
                         <>
                            <input
                                type="file"
                                ref={registrationProofRef}
                                onChange={handleRegistrationProofUpload}
                                accept="application/pdf,image/jpeg,image/png"
                                className="hidden"
                            />
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                  <Avatar className="h-32 w-32">
                                      <AvatarImage src={profile.avatarUrl} alt="Foto do perfil" />
                                      <AvatarFallback>{profile.fullName.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                    <Dialog open={isAvatarMenuOpen} onOpenChange={setIsAvatarMenuOpen}>
                                      <DialogTrigger asChild>
                                          <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full">
                                              <Camera className="h-4 w-4"/>
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
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-2 text-lg font-semibold"><User className="h-5 w-5" />Dados Pessoais</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1"><Label htmlFor="fullName">Nome completo</Label><Input id="fullName" value={profile.fullName} onChange={handleInputChange} /></div>
                                    <div className="space-y-1"><Label htmlFor="email">E-mail</Label><Input id="email" type="email" value={profile.email} onChange={handleInputChange} /></div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1"><Label htmlFor="whatsapp">WhatsApp</Label><Input id="whatsapp" value={profile.whatsapp} onChange={handleInputChange} /></div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1"><Label htmlFor="city">Cidade</Label><Input id="city" value={profile.city} onChange={handleInputChange} /></div>
                                    <div className="space-y-1"><Label htmlFor="state">Estado</Label><Input id="state" value={profile.state} onChange={handleInputChange} /></div>
                                </div>
                            </div>
                            <Separator/>
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-2 text-lg font-semibold"><Award className="h-5 w-5" />Registro Profissional (CRN)</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1"><Label htmlFor="crnNumber">Número do CRN</Label><Input id="crnNumber" value={profile.crnNumber} onChange={handleInputChange} /></div>
                                    <div className="space-y-1"><Label htmlFor="crnUf">UF do CRN</Label><Input id="crnUf" value={profile.crnUf} onChange={handleInputChange} /></div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1"><Label htmlFor="crnExpiry">Data de Validade</Label><Input id="crnExpiry" type="date" value={profile.crnExpiry} onChange={handleInputChange} /></div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Comprovante de Registro / Quitação</Label>
                                    <div className="flex items-center gap-4">
                                        <Button variant="outline" onClick={() => registrationProofRef.current?.click()}>
                                             <FileCheck className="mr-2 h-4 w-4" /> Anexar Comprovante (PDF/JPG)
                                        </Button>
                                        {profile.crnProofUrl && <a href={profile.crnProofUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">Ver Comprovante Atual</a>}
                                    </div>
                                    <Alert className="mt-4">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Documento em Análise</AlertTitle>
                                        <AlertDescription>
                                            Após o envio, seu comprovante será analisado por nossa equipe. Este processo pode levar até uma semana. Você será notificado sobre a aprovação.
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                             <div className="space-y-4">
                                <h3 className="flex items-center gap-2 text-lg font-semibold"><User className="h-5 w-5" />Dados Pessoais</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <DataField label="Nome completo" value={profile.fullName} />
                                    <DataField label="E-mail" value={profile.email} />
                                    <DataField label="Telefone/WhatsApp" value={profile.whatsapp} />
                                    <DataField label="Localização" value={`${profile.city}, ${profile.state}`} />
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-2 text-lg font-semibold"><Award className="h-5 w-5" />Registro Profissional (CRN)</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <DataField label="Número do CRN" value={profile.crnNumber} />
                                    <DataField label="Validade" value={new Date(profile.crnExpiry + 'T00:00:00').toLocaleDateString('pt-BR', { timeZone: 'UTC' })} />
                                </div>
                                <DataField label="Status" value={<CrnStatusBadge status={profile.crnStatus} />} />
                            </div>
                        </>
                    )}
                </CardContent>
                {isEditMode && (
                    <CardFooter className="justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsEditMode(false)}>Cancelar</Button>
                        <Button onClick={handleSave}>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Alterações
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
