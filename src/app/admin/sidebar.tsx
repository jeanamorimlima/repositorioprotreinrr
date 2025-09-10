
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Users, ShieldCheck, LifeBuoy, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { signOut } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "../logo";

const navItems = [
    { href: "/admin/home", icon: Home, label: "Dashboard" },
    { href: "/admin/users", icon: Users, label: "Usuários" },
    { href: "/admin/validation", icon: ShieldCheck, label: "Validação" },
    { href: "/admin/support", icon: LifeBuoy, label: "Suporte" },
    { href: "/admin/settings", icon: Settings, label: "Configurações" },
];

export function AdminSidebar() {
    const pathname = usePathname();
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
        <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col">
            <div className="h-16 flex items-center justify-center space-x-2 border-b border-gray-700 px-4">
                <Logo className="h-8 w-auto" />
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                 {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors",
                                isActive && "bg-primary text-white"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-gray-700">
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white" onClick={handleSignOut}>
                    <LogOut className="mr-3 w-5 h-5"/>
                    Sair
                </Button>
            </div>
        </aside>
    );
}
