
"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Info, Upload, Camera, ImageIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CameraCapture } from "@/components/camera-capture";
import { useToast } from "@/hooks/use-toast";


type MeasurementData = {
    [key: string]: string;
};

// Dados que viriam do perfil do usuário
const userProfileData = {
    name: "Usuário de Teste",
    email: "usuario@email.com",
    age: "30",
    gender: "male",
    experienceLevel: "intermediate",
    weeklyFrequency: "4",
    goal: "hypertrophy",
};

export default function NewMeasurementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    weight: "80",
    height: "1.80",
    neck: "40",
    armRelaxedRight: "35",
    armContractedRight: "38",
    armRelaxedLeft: "34.5",
    armContractedLeft: "37.5",
    chest: "105",
    waist: "80",
    abdomen: "85",
    hips: "100",
    thighRight: "60",
    thighLeft: "59",
    calfRight: "40",
    calfLeft: "39.5",
    photoFront: "https://placehold.co/200x300",
    photoBack: "https://placehold.co/200x300",
    photoSideLeft: "https://placehold.co/200x300",
    photoSideRight: "https://placehold.co/200x300",
    date: new Date().toISOString().split('T')[0], // Adiciona a data atual
  });
  
  const [imc, setImc] = useState<string>("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentPhotoId, setCurrentPhotoId] = useState<string | null>(null);

  useEffect(() => {
    const weight = parseFloat(measurementData.weight);
    const height = parseFloat(measurementData.height);
    if (weight > 0 && height > 0) {
      const imcValue = weight / (height * height);
      setImc(imcValue.toFixed(2));
    } else {
      setImc("");
    }
  }, [measurementData.weight, measurementData.height]);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setMeasurementData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePhotoChange = (id: string, dataUrl: string) => {
    setMeasurementData((prev) => ({ ...prev, [id]: dataUrl }));
  };
  
  const handleSaveChanges = () => {
    // Combina os dados do perfil com os dados da medição
    const fullReportData = { ...userProfileData, ...measurementData };
    
    toast({
        title: "Medição Salva!",
        description: "Seu relatório de análise corporal está sendo gerado."
    });
    const query = new URLSearchParams(fullReportData).toString();
    router.push(`/dashboard/my-analysis?${query}`);
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && currentPhotoId) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result as string;
            handlePhotoChange(currentPhotoId, dataUrl);
            setCurrentPhotoId(null); 
        };
        reader.readAsDataURL(file);
    }
     // Reset file input to allow selecting the same file again
    if(event.target) event.target.value = '';
  };

  const handleGalleryClick = (photoId: string) => {
    setCurrentPhotoId(photoId);
    fileInputRef.current?.click();
  };

  const renderMeasurementInput = (id: string, label: string, hint: string) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id}>{label}</Label>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                    <p className="max-w-xs">{hint}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </div>
      <Input 
        id={id} 
        type="number" 
        value={measurementData[id as keyof typeof measurementData]} 
        onChange={handleInputChange} 
        placeholder="cm"
      />
    </div>
  );
  
  const PhotoUploadBox = ({ id, label }: { id: string; label: string }) => (
    <div className="flex flex-col items-center">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="relative aspect-[2/3] w-full rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center p-2 cursor-pointer hover:border-primary transition-colors">
            <Image
              src={measurementData[id as keyof typeof measurementData]}
              alt={label}
              layout="fill"
              className="rounded-md object-cover z-0"
              data-ai-hint="fitness progress"
            />
            <div className="z-10 bg-black/30 absolute inset-0 rounded-md flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Upload className="h-8 w-8 text-white mb-2" />
              <span className="text-white font-semibold">Alterar Foto</span>
            </div>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alterar Foto de {label}</AlertDialogTitle>
            <AlertDialogDescription>
              Escolha como você quer adicionar uma nova foto.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
            <AlertDialogAction asChild>
                 <Button onClick={() => { 
                    setCurrentPhotoId(id);
                    setIsCameraOpen(true);
                }}>
                  <Camera className="mr-2 h-4 w-4" />
                  Tirar Foto com a Câmera
                </Button>
            </AlertDialogAction>
            <AlertDialogAction asChild>
                <Button variant="secondary" onClick={() => handleGalleryClick(id)}>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Escolher da Galeria
                </Button>
            </AlertDialogAction>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <p className="mt-2 text-sm font-semibold text-muted-foreground">{label}</p>
    </div>
  );

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
                <DialogTitle>Capturar Foto</DialogTitle>
            </DialogHeader>
            {currentPhotoId && (
                <CameraCapture 
                    onCapture={(dataUrl) => {
                        handlePhotoChange(currentPhotoId, dataUrl);
                        setIsCameraOpen(false);
                        setCurrentPhotoId(null);
                    }}
                    onClose={() => {
                        setIsCameraOpen(false);
                        setCurrentPhotoId(null);
                    }}
                />
            )}
        </DialogContent>
      </Dialog>


      <div className="container mx-auto p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Nova Medição Corporal</CardTitle>
            <CardDescription>
              Preencha seus dados para gerar um novo relatório de análise. A data de hoje será registrada.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Seção de Medidas Corporais */}
            <div className="space-y-6">
                <CardTitle className="pt-4 border-t">Medidas Corporais</CardTitle>

                <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="weight">Peso (kg)</Label>
                        <Input id="weight" type="number" step="0.1" value={measurementData.weight} onChange={handleInputChange} />
                    </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Altura (m)</Label>
                        <Input id="height" type="number" step="0.01" value={measurementData.height} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imc">IMC</Label>
                      <Input id="imc" value={imc} disabled placeholder="Cálculo automático"/>
                    </div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 border-t pt-4">
                  {renderMeasurementInput("neck", "Pescoço (cm)", "Medir na altura média do pescoço.")}
                  {renderMeasurementInput("chest", "Peitoral (cm)", "Medir na linha dos mamilos, sem estufar o peito.")}
                  {renderMeasurementInput("abdomen", "Abdômen (cm)", "Medir na altura do umbigo.")}
                  {renderMeasurementInput("waist", "Cintura (cm)", "Medir na parte mais estreita do tronco, acima do umbigo.")}
                  {renderMeasurementInput("hips", "Quadril (cm)", "Medir na parte mais larga dos glúteos.")}
                </div>

                <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
                  {renderMeasurementInput("armRelaxedRight", "Braço Direito Relax. (cm)", "Medir no meio entre o ombro e o cotovelo.")}
                  {renderMeasurementInput("armRelaxedLeft", "Braço Esquerdo Relax. (cm)", "Medir no meio entre o ombro e o cotovelo.")}
                  {renderMeasurementInput("armContractedRight", "Braço Direito Contr. (cm)", "Medir no pico do bíceps, com o músculo contraído.")}
                  {renderMeasurementInput("armContractedLeft", "Braço Esquerdo Contr. (cm)", "Medir no pico do bíceps, com o músculo contraído.")}
                </div>

                <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
                    {renderMeasurementInput("thighRight", "Coxa Direita (cm)", "Medir na parte superior da coxa, logo abaixo da virilha.")}
                    {renderMeasurementInput("thighLeft", "Coxa Esquerda (cm)", "Medir na parte superior da coxa, logo abaixo da virilha.")}
                    {renderMeasurementInput("calfRight", "Panturrilha Direita (cm)", "Medir na parte mais larga da panturrilha.")}
                    {renderMeasurementInput("calfLeft", "Panturrilha Esquerda (cm)", "Medir na parte mais larga da panturrilha.")}
                </div>
            </div>
            
            {/* Seção de Fotos */}
            <div className="space-y-6">
                <CardTitle className="pt-4 border-t">Fotos de Progresso</CardTitle>
                <CardDescription>Acompanhe sua evolução visual.</CardDescription>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <PhotoUploadBox id="photoFront" label="Frente" />
                    <PhotoUploadBox id="photoBack" label="Costas" />
                    <PhotoUploadBox id="photoSideRight" label="Lado Direito" />
                    <PhotoUploadBox id="photoSideLeft" label="Lado Esquerdo" />
                </div>
            </div>

          </CardContent>
          <CardFooter className="justify-end space-x-2">
              <Button variant="outline" onClick={() => router.push('/dashboard/progress')}>Cancelar</Button>
              <Button onClick={handleSaveChanges}>Salvar Medição e Ver Relatório</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
