
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Palette, Save, Contrast, Text } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


export default function AppearancePage() {
    const { toast } = useToast();
    
    // Estados para cada configuração
    const [theme, setTheme] = useState('system'); // 'light', 'dark', 'system'
    const [accessibilityMode, setAccessibilityMode] = useState(false);

    const handleSaveChanges = () => {
        // Lógica para aplicar o tema e modo de acessibilidade
        console.log({ theme, accessibilityMode });
        toast({
            title: "Preferências Salvas!",
            description: "Suas configurações de aparência foram atualizadas.",
        });
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="mb-6">
                <h2 className="text-3xl font-bold">Aparência</h2>
                <p className="text-muted-foreground">Customize a aparência do aplicativo.</p>
            </div>
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="h-6 w-6" />
                        Tema e Acessibilidade
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4 p-4 border rounded-lg">
                         <Label className="flex items-center gap-2 text-lg font-semibold">
                            <Contrast /> Tema do Aplicativo
                        </Label>
                         <RadioGroup value={theme} onValueChange={setTheme} className="pl-6">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="light" id="r-light" />
                                <Label htmlFor="r-light">Claro</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="dark" id="r-dark" />
                                <Label htmlFor="r-dark">Escuro</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="system" id="r-system" />
                                <Label htmlFor="r-system">Padrão do Sistema</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-4 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="accessibility-switch" className="flex items-center gap-2 text-lg font-semibold">
                                <Text /> Modo Acessibilidade
                            </Label>
                            <Switch id="accessibility-switch" checked={accessibilityMode} onCheckedChange={setAccessibilityMode}/>
                        </div>
                        <p className="text-sm text-muted-foreground pl-6">
                            Ative para usar fontes maiores e maior contraste em todo o aplicativo.
                        </p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSaveChanges}>
                        <Save className="mr-2 h-4 w-4"/>
                        Salvar Preferências
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
