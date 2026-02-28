'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText?: string;
  onSelect?: () => void;
}

export function PricingCard({
  name,
  price,
  description,
  features,
  highlighted = false,
  buttonText = 'Get Started',
  onSelect,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        'relative flex flex-col',
        highlighted &&
          'border-indigo-500/50 shadow-lg ring-1 ring-indigo-500/20'
      )}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-xs font-semibold text-white">
            Most Popular
          </span>
        </div>
      )}

      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-foreground">{price}</span>
          {price !== '$0' && (
            <span className="text-sm text-muted-foreground">/mo</span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <ul className="space-y-2.5">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <Check
                className={cn(
                  'mt-0.5 h-4 w-4 shrink-0',
                  highlighted ? 'text-indigo-500' : 'text-muted-foreground'
                )}
              />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className={cn(
            'w-full',
            highlighted &&
              'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
          )}
          variant={highlighted ? 'default' : 'outline'}
          onClick={onSelect}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
