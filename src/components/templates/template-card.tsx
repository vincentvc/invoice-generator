'use client';

import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Template } from '@/types/template';

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      {/* Colored Preview Area */}
      <CardHeader className="relative p-0">
        <div
          className="flex h-40 flex-col items-center justify-center gap-2"
          style={{ backgroundColor: template.colors.secondary }}
        >
          {/* Mini invoice preview mockup */}
          <div
            className="w-24 rounded-sm shadow-sm"
            style={{ backgroundColor: template.colors.background }}
          >
            <div
              className="h-6 rounded-t-sm"
              style={{ backgroundColor: template.colors.primary }}
            />
            <div className="space-y-1.5 p-2">
              <div
                className="h-1.5 w-full rounded-full opacity-30"
                style={{ backgroundColor: template.colors.text }}
              />
              <div
                className="h-1.5 w-3/4 rounded-full opacity-20"
                style={{ backgroundColor: template.colors.text }}
              />
              <div className="pt-1">
                <div
                  className="h-1 w-full rounded-full opacity-10"
                  style={{ backgroundColor: template.colors.text }}
                />
                <div
                  className="mt-0.5 h-1 w-full rounded-full opacity-10"
                  style={{ backgroundColor: template.colors.text }}
                />
                <div
                  className="mt-0.5 h-1 w-2/3 rounded-full opacity-10"
                  style={{ backgroundColor: template.colors.text }}
                />
              </div>
              <div
                className="mt-1 h-2 w-1/2 rounded-sm"
                style={{
                  backgroundColor: template.colors.accent,
                  opacity: 0.7,
                  marginLeft: 'auto',
                }}
              />
            </div>
          </div>

          {/* Premium lock overlay */}
          {template.isPremium && (
            <div className="absolute right-3 top-3">
              <Badge className="gap-1 bg-amber-100 text-amber-800 hover:bg-amber-100">
                <Lock className="h-3 w-3" />
                Pro
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="flex items-center gap-2">
          <h3 className="font-heading text-base font-semibold text-foreground">
            {template.name}
          </h3>
          {!template.isPremium && (
            <Badge variant="secondary" className="text-xs">
              Free
            </Badge>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {template.description}
        </p>
      </CardContent>

      <CardFooter className="pt-0">
        <Link
          href={`/invoice?template=${template.id}`}
          className="w-full"
        >
          <Button
            variant={template.isPremium ? 'outline' : 'default'}
            size="sm"
            className="w-full"
          >
            {template.isPremium ? 'Unlock Template' : 'Use This Template'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
