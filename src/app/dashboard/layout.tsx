
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { BottomNavbar } from "@/components/bottom-navbar";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut as firebaseSignOut } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/logo";

interface SerializableUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<SerializableUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        });

        // Check if user profile is complete
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            // Redirect to profile page if essential data is missing
            if (!userData.age || !userData.height || !userData.weight) {
                // Prevent redirecting if already on the profile page
                if (window.location.pathname !== '/dashboard/profile') {
                    router.replace('/dashboard/profile');
                }
            }
        } else {
             router.replace('/dashboard/profile');
        }

      } else {
        router.replace('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);
  
  const handleSignOut = async () => {
    try {
        await firebaseSignOut();
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

  if (loading) {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-40">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-9 w-9 rounded-full" />
            </header>
            <main className="flex-1 bg-gray-100 p-8">
                <Skeleton className="h-64 w-full" />
            </main>
        </div>
    )
  }

  if (!user) {
    return null; // ou um redirecionamento, já tratado no useEffect
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-40">
        <Link href="/dashboard/home" className="flex items-center space-x-2">
           <Logo className="h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName?.replace(' ', '+')}`} alt={user?.displayName || "User"} />
                            <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user?.displayName || "Usuário"}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user?.email || "email@example.com"}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     <Link href="/dashboard/profile">
                        <DropdownMenuItem>
                            Meu Perfil
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 bg-gray-100 pb-20">{children}</main>
      <BottomNavbar />
    </div>
  );
}
