
"use client";

import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronRight, CreditCard, Bell, Shield, User, Palette, Link as LinkIcon, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const settingsGroups = [
    {
        title: 'Conta',
        options: [
            {
                href: '/dashboard/profile',
                icon: User,
                title: 'Meu Perfil',
                description: 'Edite seus dados pessoais, objetivos e profissionais.'
            },
            {
                href: '/dashboard/settings/subscription',
                icon: CreditCard,
                title: 'Assinatura',
                description: 'Gerencie seu plano, pagamentos e faturas.'
            },
            {
                href: '/dashboard/settings/payment-methods',
                icon: CreditCard,
                title: 'Formas de Pagamento',
                description: 'Adicione e gerencie seus cartões de crédito.'
            },
        ]
    },
    {
        title: 'App',
        options: [
            {
                href: '/dashboard/settings/notifications',
                icon: Bell,
                title: 'Notificações',
                description: 'Defina suas preferências de lembretes e avisos.'
            },
            {
                href: '/dashboard/settings/appearance',
                icon: Palette,
                title: 'Aparência',
                description: 'Customize o tema e a acessibilidade do app.'
            },
            {
                href: '/dashboard/settings/security',
                icon: Shield,
                title: 'Segurança e Privacidade',
                description: 'Altere sua senha e veja os termos de uso.'
            },
        ]
    },
     {
        title: 'Conexões',
        options: [
            {
                href: '#',
                icon: LinkIcon,
                title: 'Integrações (Em Breve)',
                description: 'Sincronize com Google Fit, Apple Health e mais.'
            },
        ]
    },
];

const SettingOption = ({ href, icon: Icon, title, description }: { href: string, icon: React.ElementType, title: string, description: string }) => (
     <Link href={href} className="block">
        <div className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
                <Icon className="h-6 w-6 text-primary" />
                <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
    </Link>
);


export default function SettingsPage() {
    const router = useRouter();
    const { toast } = useToast();

    const handleSignOut = async () => {
        try {
            await signOut();
            toast({
                title: "Você saiu da sua conta.",
            });
            router.push('/login');
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao sair",
                description: "Não foi possível fazer o logout. Tente novamente."
            })
        }
    }

  return (
    <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6">
            <h2 className="text-3xl font-bold">Ajustes</h2>
            <p className="text-muted-foreground">Gerencie as preferências da sua conta e do aplicativo.</p>
        </div>

        <div className="space-y-8">
           {settingsGroups.map(group => (
             <Card key={group.title}>
                <CardHeader>
                    <CardTitle>{group.title}</CardTitle>
                </CardHeader>
                <CardContent className="divide-y p-0">
                    {group.options.map(option => (
                        <SettingOption key={option.title} {...option} />
                    ))}
                </CardContent>
            </Card>
           ))}
        </div>

        <div className="mt-8">
            <Button variant="outline" className="w-full" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair da Conta
            </Button>
        </div>
    </div>
  );
}
