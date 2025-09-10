
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, User, Utensils, MapPin, LocateFixed, Star, Trophy } from "lucide-react";
import Link from "next/link";

const mockPersonals: any[] = [];
const mockNutritionists: any[] = [];
const topRatedProfessionals: any[] = [];


export default function ProfessionalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");

  const filterProfessionals = (professionals: any[]) => {
    return professionals.filter(p => {
        const nameOrSpecialtyMatch = searchTerm === "" ||
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.specialties.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const locationMatch = locationTerm === "" ||
            p.city.toLowerCase().includes(locationTerm.toLowerCase());

        return nameOrSpecialtyMatch && locationMatch;
    });
  }

  const filteredPersonals = filterProfessionals(mockPersonals);
  const filteredNutritionists = filterProfessionals(mockNutritionists);

  const ProfessionalCard = ({ id, name, specialties, imageUrl, city, state, type, rating }: any) => (
    <Card>
        <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
                <AvatarImage src={imageUrl} alt={name} />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle>{name}</CardTitle>
                <CardDescription className="flex items-center gap-1"><MapPin className="h-4 w-4"/> {city}, {state}</CardDescription>
                {rating && (
                    <div className="flex items-center gap-1 mt-1 font-bold text-yellow-500">
                        <Star className="h-4 w-4 fill-current"/> {rating.toFixed(1)}
                    </div>
                )}
            </div>
        </CardHeader>
        <CardContent>
            <div className="flex flex-wrap gap-2">
                {specialties.map((spec: string) => <Badge key={spec} variant="secondary">{spec}</Badge>)}
            </div>
        </CardContent>
        <CardFooter>
            <Link href={`/dashboard/professionals/${type}/${id}`} className="w-full">
                <Button className="w-full">Ver Perfil Completo</Button>
            </Link>
        </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
            <h2 className="text-3xl font-bold">Encontre Profissionais</h2>
            <p className="text-muted-foreground">Pesquise e conecte-se com os melhores especialistas.</p>
        </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                placeholder="Pesquisar por nome ou especialidade..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="relative">
             <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                placeholder="Cidade ou estado..."
                className="pl-10"
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
            />
        </div>
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
           <TabsTrigger value="search">
            <Search className="mr-2 h-4 w-4" />
            Pesquisar
          </TabsTrigger>
          <Link href="/dashboard/ranking" className="w-full">
             <TabsTrigger value="ranking" className="w-full">
                <Trophy className="mr-2 h-4 w-4" />
                Ranking
            </TabsTrigger>
          </Link>
        </TabsList>

        <TabsContent value="search" className="mt-6">
            <Tabs defaultValue="personals" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="personals">
                        <User className="mr-2 h-4 w-4" />
                        Personal Trainers
                    </TabsTrigger>
                    <TabsTrigger value="nutritionists">
                        <Utensils className="mr-2 h-4 w-4" />
                        Nutricionistas
                    </TabsTrigger>
                </TabsList>
                 <TabsContent value="personals" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPersonals.map(p => <ProfessionalCard key={p.id} {...p} type="personal"/>)}
                    </div>
                    {filteredPersonals.length === 0 && <p className="text-center text-muted-foreground mt-8">Nenhum personal trainer encontrado.</p>}
                </TabsContent>
                <TabsContent value="nutritionists" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredNutritionists.map(n => <ProfessionalCard key={n.id} {...n} type="nutritionist"/>)}
                    </div>
                    {filteredNutritionists.length === 0 && <p className="text-center text-muted-foreground mt-8">Nenhum nutricionista encontrado.</p>}
                </TabsContent>
            </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
