
"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { User, GraduationCap, Award, Building, Clock, Link as LinkIcon, Edit, Save, Camera, ImageIcon, FileCheck, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CameraCapture } from "@/components/camera-capture";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


type Availability = {
    [key: string]: {
        active: boolean;
        start: string;
        end: string;
    }
}

type RegistrationStatus = 'active' | 'expiring' | 'inactive';

const daysOfWeek = {
    seg: "Segunda-feira",
    ter: "Terça-feira",
    qua: "Quarta-feira",
    qui: "Quinta-feira",
    sex: "Sexta-feira",
    sab: "Sábado",
    dom: "Domingo"
};


export default function PersonalProfilePage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const registrationProofRef = useRef<HTMLInputElement>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [profile, setProfile] = useState({
    fullName: "João Carlos da Silva",
    email: "joao.silva.personal@example.com",
    avatarUrl: "https://placehold.co/128x128.png",
    whatsapp: "(11) 98765-4321",
    city: "São Paulo",
    state: "SP",
    institution: "Universidade de São Paulo (USP)",
    course: "Educação Física",
    specializations: "Pós-graduação em Fisiologia do Exercício\nCurso de Treinamento Funcional",
    crefNumber: "123456-G/SP",
    crefUf: "SP",
    crefExpiry: "2024-12-31",
    crefProofUrl: "",
    crefStatus: 'active' as RegistrationStatus,
    areasOfExpertise: "Musculação, Treinamento Funcional, Preparação Física",
    workHistory: "Academia Bodytech (2015-2020) - Personal Trainer\nAcademia SmartFit (2020-Presente) - Coordenador Técnico",
    availability: {
        seg: { active: true, start: "06:00", end: "21:00" },
        ter: { active: true, start: "06:00", end: "21:00" },
        qua: { active: true, start: "06:00", end: "21:00" },
        qui: { active: true, start: "06:00", end: "21:00" },
        sex: { active: true, start: "06:00", end: "21:00" },
        sab: { active: false, start: "08:00", end: "12:00" },
        dom: { active: false, start: "", end: "" }
    },
    services: {
        personal: true,
        avaliacao: true,
        funcional: true,
        consultoria: true,
        condicionamento: false,
        reabilitacao: false,
    },
    socialLinks: "https://www.instagram.com/joaocarlospersonal",
  });
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfile(prev => ({ ...prev, [id]: value }));
  };

  const handleAvailabilityChange = (day: keyof Availability, field: 'active' | 'start' | 'end', value: string | boolean) => {
    setProfile(prev => ({
        ...prev,
        availability: {
            ...prev.availability,
            [day]: {
                ...prev.availability[day],
                [field]: value,
            }
        }
    }));
  };

  const handleCheckboxChange = (id: keyof typeof profile.services, checked: boolean) => {
    setProfile(prev => ({
        ...prev,
        services: {
            ...prev.services,
            [id]: checked
        }
    }));
  };

  const handleSave = () => {
    console.log("Perfil salvo:", profile);
    toast({
        title: "Perfil Atualizado!",
        description: "Suas informações foram salvas com sucesso."
    });
    setIsEditMode(false);
  }

  const handleAvatarChange = (dataUrl: string) => {
    setProfile(prev => ({...prev, avatarUrl: dataUrl}));
    toast({ title: "Foto de perfil atualizada!" });
  };

  const handleRegistrationProofUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const dataUrl = URL.createObjectURL(file);
        setProfile(prev => ({ ...prev, crefProofUrl: dataUrl }));
        toast({
            title: "Comprovante enviado para análise!",
            description: "A validação pode levar até uma semana. Você será notificado.",
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
    event.target.value = '';
  };
  
  const DataField = ({ label, value }: { label: string, value?: string | React.ReactNode }) => (
    <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="text-base">{value || "Não informado"}</div>
    </div>
    );

    const renderServiceBadges = () => {
        const serviceLabels: { [key: string]: string } = {
            personal: 'Personal trainer',
            avaliacao: 'Avaliação física',
            funcional: 'Treinamento funcional',
            consultoria: 'Consultoria online',
            condicionamento: 'Condicionamento físico',
            reabilitacao: 'Reabilitação',
        };
        const offered = Object.entries(profile.services)
            .filter(([, value]) => value)
            .map(([key]) => serviceLabels[key]);
        
        return (
            <div className="flex flex-wrap gap-2 mt-2">
                {offered.map((service) => (
                    <Badge key={service} variant="secondary">{service}</Badge>
                ))}
            </div>
        )
    };

    const formatAvailability = (availability: Availability) => {
        const activeDays = Object.entries(availability)
          .filter(([, details]) => details.active)
          .map(([day, details]) => {
            const dayName = daysOfWeek[day as keyof typeof daysOfWeek];
            return `${dayName}: ${details.start} às ${details.end}`;
          });
    
        if (activeDays.length === 0) return "Nenhum horário disponível.";
        return <div className="flex flex-col">{activeDays.map(line => <span key={line}>{line}</span>)}</div>
    };
    
    const CrefStatusBadge = ({ status }: { status: RegistrationStatus }) => {
        const statusMap = {
            active: { text: "Ativo", color: "bg-green-500" },
            expiring: { text: "Próximo do Vencimento", color: "bg-yellow-500" },
            inactive: { text: "Inativo/Vencido", color: "bg-red-500" },
        };
        const { text, color } = statusMap[status];
        return <Badge className={`${color} text-white`}>{text}</Badge>
    }

  const renderViewProfile = () => (
     <Card className="mt-4">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
                    <AvatarFallback>{profile.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-2xl">{profile.fullName}</CardTitle>
                    <CardDescription>Este é o seu perfil público.</CardDescription>
                </div>
            </div>
            <Button variant="outline" onClick={() => setIsEditMode(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Perfil
            </Button>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
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
                <h3 className="flex items-center gap-2 text-lg font-semibold"><Award className="h-5 w-5" />Registro Profissional (CREF)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <DataField label="Número do CREF" value={profile.crefNumber} />
                     <DataField label="Validade" value={new Date(profile.crefExpiry + 'T00:00:00').toLocaleDateString('pt-BR', { timeZone: 'UTC' })} />
                </div>
                 <DataField label="Status" value={<CrefStatusBadge status={profile.crefStatus} />} />
            </div>

            <Separator />
            
             <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold"><GraduationCap className="h-5 w-5" />Formação e Certificações</h3>
                 <DataField label="Formação Principal" value={`${profile.course} em ${profile.institution}`} />
                 <DataField label="Especializações" value={<p className="whitespace-pre-wrap">{profile.specializations}</p>} />
             </div>
            
            <Separator />

            <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold"><Building className="h-5 w-5" />Experiência Profissional</h3>
                 <DataField label="Áreas de atuação" value={profile.areasOfExpertise} />
                 <DataField label="Histórico Profissional" value={<p className="whitespace-pre-wrap">{profile.workHistory}</p>} />
            </div>

             <Separator />

             <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold"><Clock className="h-5 w-5" />Serviços e Disponibilidade</h3>
                 <DataField label="Horários disponíveis" value={formatAvailability(profile.availability)} />
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Tipos de serviços oferecidos:</p>
                    {renderServiceBadges()}
                </div>
            </div>

             <Separator />

             <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold"><LinkIcon className="h-5 w-5" />Redes e Portfólio</h3>
                <DataField label="Rede Social / Portfólio" value={<a href={profile.socialLinks} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1"><LinkIcon className="h-4 w-4"/>{profile.socialLinks}</a>} />
            </div>
        </CardContent>
    </Card>
  );
  
  const renderEditProfile = () => (
    <Card className="mt-4">
        <input
            type="file"
            ref={registrationProofRef}
            onChange={handleRegistrationProofUpload}
            accept="application/pdf,image/jpeg,image/png"
            className="hidden"
        />
        <CardHeader>
            <CardTitle>Editar Perfil Profissional</CardTitle>
            <CardDescription>Mantenha suas informações sempre atualizadas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
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
            
            <Separator />

             <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold"><GraduationCap className="h-5 w-5" />Formação Acadêmica</h3>
                <div className="space-y-1"><Label htmlFor="institution">Nome da instituição de ensino</Label><Input id="institution" value={profile.institution} onChange={handleInputChange}/></div>
                <div className="space-y-1"><Label htmlFor="course">Curso</Label><Input id="course" value={profile.course} onChange={handleInputChange} /></div>
                <div className="space-y-1"><Label htmlFor="specializations">Especializações / Pós-graduações</Label><Textarea id="specializations" value={profile.specializations} onChange={handleInputChange} /></div>
            </div>
            
            <Separator />

             <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold"><Award className="h-5 w-5" />Registro Profissional (CREF)</h3>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1"><Label htmlFor="crefNumber">Número do CREF</Label><Input id="crefNumber" value={profile.crefNumber} onChange={handleInputChange} /></div>
                    <div className="space-y-1"><Label htmlFor="crefUf">UF do CREF</Label><Input id="crefUf" value={profile.crefUf} onChange={handleInputChange} /></div>
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                     <div className="space-y-1"><Label htmlFor="crefExpiry">Data de Validade</Label><Input id="crefExpiry" type="date" value={profile.crefExpiry} onChange={handleInputChange} /></div>
                 </div>
                 <div className="space-y-2">
                    <Label>Comprovante de Registro / Quitação</Label>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={() => registrationProofRef.current?.click()}>
                             <FileCheck className="mr-2 h-4 w-4" /> Anexar Comprovante (PDF/JPG)
                        </Button>
                        {profile.crefProofUrl && <a href={profile.crefProofUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">Ver Comprovante Atual</a>}
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

            <Separator />

            <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold"><Building className="h-5 w-5" />Experiência Profissional</h3>
                 <div className="space-y-1"><Label htmlFor="areasOfExpertise">Áreas de atuação (academia, escola, personal, etc.)</Label><Input id="areasOfExpertise" value={profile.areasOfExpertise} onChange={handleInputChange} /></div>
                 <div className="space-y-1"><Label htmlFor="workHistory">Instituições onde trabalhou/trabalha, cargos e tempo de atuação</Label><Textarea id="workHistory" value={profile.workHistory} onChange={handleInputChange} /></div>
            </div>

             <Separator />

             <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold"><Clock className="h-5 w-5" />Disponibilidade e Atendimento</h3>
                <div className="space-y-2">
                    <Label>Horários disponíveis</Label>
                    <Card className="p-4">
                        <div className="space-y-4">
                            {Object.entries(daysOfWeek).map(([dayKey, dayLabel]) => {
                                const key = dayKey as keyof Availability;
                                const dayAvailability = profile.availability[key];
                                return (
                                    <div key={key} className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="flex items-center w-full sm:w-40">
                                            <Checkbox
                                                id={`check-${key}`}
                                                checked={dayAvailability.active}
                                                onCheckedChange={(checked) => handleAvailabilityChange(key, 'active', checked as boolean)}
                                            />
                                            <Label htmlFor={`check-${key}`} className="ml-2 font-semibold">{dayLabel}</Label>
                                        </div>
                                        {dayAvailability.active && (
                                            <div className="flex items-center gap-2 w-full">
                                                <Input
                                                    type="time"
                                                    value={dayAvailability.start}
                                                    onChange={(e) => handleAvailabilityChange(key, 'start', e.target.value)}
                                                />
                                                <span>até</span>
                                                <Input
                                                    type="time"
                                                    value={dayAvailability.end}
                                                    onChange={(e) => handleAvailabilityChange(key, 'end', e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </Card>
                </div>
                <div>
                    <Label>Tipos de serviços oferecidos:</Label>
                    <div className="grid md:grid-cols-2 gap-2 mt-2">
                        <div className="flex items-center space-x-2"><Checkbox id="s-personal" checked={profile.services.personal} onCheckedChange={(c) => handleCheckboxChange('personal', c as boolean)}/> <Label htmlFor="s-personal">Personal trainer</Label></div>
                        <div className="flex items-center space-x-2"><Checkbox id="s-avaliacao" checked={profile.services.avaliacao} onCheckedChange={(c) => handleCheckboxChange('avaliacao', c as boolean)}/> <Label htmlFor="s-avaliacao">Avaliação física</Label></div>
                        <div className="flex items-center space-x-2"><Checkbox id="s-funcional" checked={profile.services.funcional} onCheckedChange={(c) => handleCheckboxChange('funcional', c as boolean)}/> <Label htmlFor="s-funcional">Treinamento funcional</Label></div>
                        <div className="flex items-center space-x-2"><Checkbox id="s-consultoria" checked={profile.services.consultoria} onCheckedChange={(c) => handleCheckboxChange('consultoria', c as boolean)}/> <Label htmlFor="s-consultoria">Consultoria online</Label></div>
                        <div className="flex items-center space-x-2"><Checkbox id="s-condicionamento" checked={profile.services.condicionamento} onCheckedChange={(c) => handleCheckboxChange('condicionamento', c as boolean)}/> <Label htmlFor="s-condicionamento">Condicionamento físico</Label></div>
                        <div className="flex items-center space-x-2"><Checkbox id="s-reabilitacao" checked={profile.services.reabilitacao} onCheckedChange={(c) => handleCheckboxChange('reabilitacao', c as boolean)}/> <Label htmlFor="s-reabilitacao">Reabilitação</Label></div>
                    </div>
                </div>
            </div>

             <Separator />

             <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold"><LinkIcon className="h-5 w-5" />Identidade Profissional</h3>
                <div className="space-y-1"><Label htmlFor="socialLinks">Link para redes sociais ou portfólio</Label><Input id="socialLinks" value={profile.socialLinks} onChange={handleInputChange} /></div>
            </div>

        </CardContent>
        <CardFooter className="justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditMode(false)}>Cancelar</Button>
            <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
            </Button>
        </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Meu Perfil</h2>
        <p className="text-muted-foreground">Gerencie suas informações profissionais.</p>
      </div>

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

      {isEditMode ? renderEditProfile() : renderViewProfile()}
    </div>
  );
}
