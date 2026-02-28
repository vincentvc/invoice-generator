import { Metadata } from 'next';
import { SignupForm } from '@/components/auth/signup-form';

export const metadata: Metadata = {
  title: 'Sign Up | InvoiceForge',
  description: 'Create your InvoiceForge account.',
};

export default function Page() {
  return <SignupForm />;
}
