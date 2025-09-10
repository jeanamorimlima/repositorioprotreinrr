
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send } from "lucide-react";

const mockProfessionals: any[] = [];

export default function ChatPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Chat</h2>
        <p className="text-muted-foreground">Converse com os profissionais que te acompanham.</p>
      </div>

      <div className="space-y-4">
        {mockProfessionals.map(prof => (
            <Card key={prof.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={prof.imageUrl} alt={prof.name} />
                            <AvatarFallback>{prof.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle>{prof.name}</CardTitle>
                            <CardDescription>{prof.type}</CardDescription>
                             <div className="flex flex-wrap gap-1 mt-2">
                                {prof.specialties.map((spec: any) => (
                                    <Badge key={spec} variant="secondary">{spec}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Button>
                        <Send className="mr-2 h-4 w-4"/>
                        Iniciar Conversa
                    </Button>
                </CardHeader>
            </Card>
        ))}
        {mockProfessionals.length === 0 && (
             <div className="text-center py-10 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Você ainda não tem profissionais para conversar.</p>
            </div>
        )}
      </div>
    </div>
  );
}
