
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Plano Personal Pro',
    price: 'R$ 99,90/mês',
    features: [
      'Alunos ilimitados',
      'Criação de modelos de avaliação',
      'Criação de campanhas',
      'Agenda completa',
      'Suporte prioritário',
    ],
    isCurrent: true,
  },
   {
    name: 'Plano Personal Básico',
    price: 'Grátis',
    features: [
      'Até 5 alunos ativos',
      'Modelos de avaliação padrão',
      'Agenda simplificada',
    ],
    isCurrent: false,
  },
];

export default function SubscriptionPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
       <div className="mb-6">
            <h2 className="text-3xl font-bold">Gerenciar Assinatura</h2>
            <p className="text-muted-foreground">Veja os detalhes do seu plano atual e explore outras opções.</p>
        </div>

      <div className="grid gap-8 md:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.isCurrent ? 'border-primary' : ''}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription className="text-2xl font-bold">{plan.price}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.isCurrent ? (
                <Button disabled className="w-full">Seu Plano Atual</Button>
              ) : (
                <Button variant="outline" className="w-full">Mudar para este plano</Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
