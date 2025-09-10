
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
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "@/services/auth";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(email, password);
            // Idealmente, você validaria se o usuário é um admin aqui antes de redirecionar.
            // Por simplicidade, vamos redirecionar direto.
            if (userCredential) {
                toast({
                    title: "Login de Admin bem-sucedido!",
                    description: "Redirecionando para o painel.",
                });
                router.push('/admin/home');
            }
        } catch (error: any) {
            console.error("Erro no login de admin:", error);
            toast({
                variant: "destructive",
                title: "Erro no Login",
                description: error.message || "Ocorreu um erro. Verifique suas credenciais de admin e tente novamente.",
            });
        } finally {
            setIsLoading(false);
        }
    };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex flex-col items-center justify-center space-y-2 mb-6 group">
            <Logo className="h-12 w-auto" />
        </Link>
        <Card>
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl">Acesso Restrito</CardTitle>
                <CardDescription>
                Use suas credenciais de administrador para continuar.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input id="admin-email" type="email" placeholder="admin@protrein.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="admin-password">Senha</Label>
                    <Input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
                     {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Entrar
                </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
