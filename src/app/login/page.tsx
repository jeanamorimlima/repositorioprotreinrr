
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword as authSignIn } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (userType: 'aluno' | 'nutricionista' | 'personal') => {
    setIsLoading(true);

    try {
        const userCredential = await authSignIn(auth, email, password);
        const user = userCredential.user;

        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                throw new Error("Documento do usuário não encontrado. O cadastro pode não ter sido finalizado ou o usuário foi removido.");
            }

            const userData = userDoc.data();
            const userRole = userData.role;

            if (userRole !== userType) {
                throw new Error(`Você está tentando logar como ${userType}, mas sua conta é de ${userRole}.`);
            }
            
            // Se for um profissional, verifica se está ativo
            if ((userRole === 'personal' || userRole === 'nutricionista') && userData.status !== 'verified') {
                 throw new Error("Sua conta de profissional ainda não foi verificada pela administração. Aguarde a aprovação.");
            }


            toast({
                title: "Login bem-sucedido!",
                description: "Redirecionando para o seu painel...",
            });
            
            // Redirecionamento baseado no role verificado
            switch (userRole) {
                case 'aluno':
                    router.push('/dashboard/home');
                    break;
                case 'personal':
                    router.push('/personal/home');
                    break;
                case 'nutricionista':
                    router.push('/nutritionist/home');
                    break;
                default:
                     // Fallback, embora não deva acontecer
                    router.push('/dashboard/home');
                    break;
            }
        } else {
             throw new Error("Não foi possível autenticar o usuário.");
        }
    } catch (e: any) {
        let errorMessage = e.message || "Ocorreu um erro. Verifique suas credenciais e tente novamente.";
        if (e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password' || e.code === 'auth/user-not-found') {
            errorMessage = 'E-mail ou senha incorretos.';
        }
        
        toast({
            variant: "destructive",
            title: "Erro no Login",
            description: errorMessage,
        });
    } finally {
        setIsLoading(false);
    }
  };

  const renderLoginForm = (userType: 'aluno' | 'nutricionista' | 'personal') => (
    <Card className="border-t-0 rounded-t-none">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Login de {userType.charAt(0).toUpperCase() + userType.slice(1)}</CardTitle>
        <CardDescription>
          Entre com seu email e senha para acessar sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${userType}-email`}>Email</Label>
          <Input id={`${userType}-email`} type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${userType}-password`}>Senha</Label>
          <Input id={`${userType}-password`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button className="w-full" onClick={() => handleLogin(userType)} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Entrar como {userType.charAt(0).toUpperCase() + userType.slice(1)}
        </Button>
        <p className="text-sm text-center text-muted-foreground">
          Não tem uma conta?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </CardFooter>
    </Card>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center space-y-2 mb-6">
           <Logo className="h-12 w-auto" />
        </div>
        <Tabs defaultValue="aluno" className="w-full" onValueChange={() => { setEmail(''); setPassword(''); }}>
          <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 border-b rounded-none">
            <TabsTrigger value="aluno" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent">Sou Aluno</TabsTrigger>
            <TabsTrigger value="nutricionista" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent">Sou Nutricionista</TabsTrigger>
            <TabsTrigger value="personal" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent">Sou Personal</TabsTrigger>
          </TabsList>
          <TabsContent value="aluno">
            {renderLoginForm("aluno")}
          </TabsContent>
          <TabsContent value="nutricionista">
            {renderLoginForm("nutricionista")}
          </TabsContent>
          <TabsContent value="personal">
            {renderLoginForm("personal")}
          </TabsContent>
        </Tabs>
         <div className="mt-4 text-center text-sm">
            <Link href="/admin/login" className="text-muted-foreground hover:text-primary">
                Acesso Administrativo
            </Link>
        </div>
      </div>
    </div>
  );
}
