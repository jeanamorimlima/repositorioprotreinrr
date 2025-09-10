
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminSidebar } from "@/components/admin-sidebar";
import { signOut } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc } from "firebase/firestore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists() && userDoc.data().role === 'admin') {
            setIsAuthorized(true);
          } else {
            toast({
                variant: "destructive",
                title: "Acesso Negado",
                description: "Sua conta não tem permissões de administrador."
            });
            await signOut();
            router.replace('/admin/login');
          }
        } catch (error: any) {
          console.error("Authentication check failed:", error);
           toast({
                variant: "destructive",
                title: "Erro de Autenticação",
                description: error.message || "Não foi possível verificar suas permissões."
            });
          await signOut();
          router.replace('/admin/login');
        } finally {
          setLoading(false);
        }
      } else {
        // No user is signed in
        router.replace('/admin/login');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, toast]);

  // Render the skeleton loader while authentication is in progress.
  if (loading) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar />
             <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="space-y-8">
                        <Skeleton className="h-10 w-1/3" />
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                        </div>
                        <div className="mt-8">
                            <Skeleton className="h-8 w-1/4 mb-4" />
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <Skeleton className="h-32 w-full" />
                                <Skeleton className="h-32 w-full" />
                                <Skeleton className="h-32 w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
  }
  
  // Render the children only if the user is authorized.
  // If not authorized and not loading, the user will have been redirected.
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
            {isAuthorized ? children : null}
        </div>
      </main>
    </div>
  );
}
