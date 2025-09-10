
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Calendar, MessagesSquare, Settings, Megaphone, Wallet, Trophy, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/nutritionist/home", icon: Home, label: "Início" },
    { href: "/nutritionist/patients", icon: Users, label: "Pacientes" },
    { href: "/nutritionist/campaigns", icon: Megaphone, label: "Campanhas" },
    { href: "/nutritionist/ranking", icon: Trophy, label: "Ranking" },
    { href: "/nutritionist/settings", icon: Settings, label: "Ajustes" },
];

export function NutritionistBottomNavbar() {
    const pathname = usePathname();

    return (
        <footer className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
            <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
                {navItems.map((item) => {
                    const isActive = item.href === "/nutritionist/home" ? pathname === item.href : pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group",
                                isActive ? "text-primary" : "text-gray-500"
                            )}
                        >
                            <item.icon className="w-5 h-5 mb-1" />
                            <span className="text-xs text-center">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </footer>
    );
}
