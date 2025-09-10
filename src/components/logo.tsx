
import { cn } from "@/lib/utils";
import Image from "next/image";

export const Logo = ({ className }: { className?: string }) => (
    <Image 
        src="/logo.png"
        alt="ProTreinRR Logo"
        width={150}
        height={42}
        className={cn(className)}
        priority
    />
);
