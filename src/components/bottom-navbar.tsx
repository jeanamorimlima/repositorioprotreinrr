
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Settings, Megaphone, UserSearch } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard/home", icon: Home, label: "Início" },
    { href: "/dashboard/my-workouts", icon: ClipboardList, label: "Treinos" },
    { href: "/dashboard/campaigns", icon: Megaphone, label: "Campanhas" },
    { href: "/dashboard/professionals", icon: UserSearch, label: "Profissionais" },
    { href: "/dashboard/settings", icon: Settings, label: "Ajustes" },
];

export function BottomNavbar() {
    const pathname = usePathname();

    return (
        <footer className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
            <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
                {navItems.map((item) => {
                    // Make the check more specific for the home tab
                    const isActive = item.href === "/dashboard/home" ? pathname === item.href : pathname.startsWith(item.href);
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
