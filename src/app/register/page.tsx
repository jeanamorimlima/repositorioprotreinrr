
"use client";

import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpWithEmailAndPassword, UserRole } from "@/services/auth";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/logo";

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('aluno');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro de Validação",
        description: "As senhas não coincidem.",
      });
      return;
    }

    if (!name || !email || !password) {
         toast({
            variant: "destructive",
            title: "Erro de Validação",
            description: "Por favor, preencha todos os campos.",
        });
        return;
    }

    setIsLoading(true);
    try {
      await signUpWithEmailAndPassword({ name, email, role }, password);
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Enviamos um e-mail de confirmação para você. Verifique sua caixa de entrada e spam.",
        duration: 8000,
      });
      router.push('/login');
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      toast({
        variant: "destructive",
        title: "Erro no Cadastro",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        duration: 8000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
         <div className="flex flex-col items-center justify-center space-y-2 mb-6">
           <Logo className="h-12 w-auto" />
        </div>
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Crie sua Conta</CardTitle>
            <CardDescription>
              Junte-se à nossa comunidade e comece a treinar de forma inteligente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
            </div>
            <div className="space-y-2">
                <Label>Eu sou:</Label>
                <RadioGroup defaultValue="aluno" className="flex gap-4" onValueChange={(value) => setRole(value as UserRole)} value={role}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="aluno" id="r-aluno" />
                        <Label htmlFor="r-aluno">Aluno</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="personal" id="r-personal" />
                        <Label htmlFor="r-personal">Personal Trainer</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nutricionista" id="r-nutri" />
                        <Label htmlFor="r-nutri">Nutricionista</Label>
                    </div>
                </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" onClick={handleRegister} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cadastrar
            </Button>
             <p className="text-sm text-center text-muted-foreground">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Faça Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
