import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Sign In | InvoiceForge',
  description: 'Sign in to your InvoiceForge account.',
};

export default function Page() {
  return <LoginForm />;
}
