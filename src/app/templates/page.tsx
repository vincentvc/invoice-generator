'use client';

import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TEMPLATES } from '@/lib/templates';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { TemplateId } from '@/types/invoice';

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useLocalStorage<TemplateId>(
    'invoice-generator-template',
    'modern'
  );

  const handleSelect = (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
  };

  return (
    <div className="max-w-[1000px] mx-auto p-4 pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Invoice Templates</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a template style for your invoices
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TEMPLATES.map((template) => {
          const isSelected = selectedTemplate === template.id;
          return (
            <Card
              key={template.id}
              className={`relative cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleSelect(template.id)}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              )}

              {/* Template Preview */}
              <div className="p-4">
                <div className="aspect-[8.5/11] bg-white rounded border overflow-hidden mb-3">
                  {/* Mini preview */}
                  <div className="p-3 scale-[0.5] origin-top-left w-[200%] h-[200%]">
                    <div className="flex justify-between mb-4">
                      <div>
                        <div
                          className="text-sm font-bold"
                          style={{ color: template.primaryColor }}
                        >
                          Company Name
                        </div>
                        <div className="text-[6px] text-gray-400">
                          123 Street, City
                        </div>
                      </div>
                      <div
                        className="text-lg font-bold uppercase"
                        style={{ color: template.primaryColor }}
                      >
                        Invoice
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="text-[5px] font-bold uppercase mb-1" style={{ color: template.primaryColor }}>
                        Bill To
                      </div>
                      <div className="text-[6px] text-gray-600">Client Name</div>
                    </div>
                    <div className="mb-2">
                      <div
                        className="flex text-[5px] font-bold text-white px-1 py-0.5 rounded-t-sm"
                        style={{ backgroundColor: template.primaryColor }}
                      >
                        <span className="flex-1">Description</span>
                        <span className="w-8 text-right">Qty</span>
                        <span className="w-10 text-right">Rate</span>
                        <span className="w-12 text-right">Amount</span>
                      </div>
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`flex text-[5px] px-1 py-0.5 ${
                            i % 2 === 0 ? 'bg-gray-50' : ''
                          }`}
                        >
                          <span className="flex-1 text-gray-600">
                            Service item {i}
                          </span>
                          <span className="w-8 text-right text-gray-600">
                            {i}
                          </span>
                          <span className="w-10 text-right text-gray-600">
                            $100
                          </span>
                          <span className="w-12 text-right text-gray-800 font-medium">
                            ${i * 100}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <div className="text-right">
                        <div
                          className="text-[6px] font-bold pt-1 border-t"
                          style={{
                            borderColor: template.primaryColor,
                            color: template.primaryColor,
                          }}
                        >
                          Total: $600.00
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="font-semibold text-sm">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {template.description}
                  </p>
                  <div
                    className="h-1 w-12 rounded-full mx-auto mt-2"
                    style={{ backgroundColor: template.primaryColor }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Button onClick={() => router.push('/')} size="lg" className="gap-2">
          Start Creating Invoice
        </Button>
      </div>
    </div>
  );
}
