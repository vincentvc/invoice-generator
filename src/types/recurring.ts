export type RecurrenceFrequency = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface RecurrenceConfig {
  enabled: boolean;
  frequency: RecurrenceFrequency;
  startDate: string;
  endDate: string | null;
  nextDueDate: string;
  lastGeneratedDate: string | null;
}
