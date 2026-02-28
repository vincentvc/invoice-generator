export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  provider: string;
  createdAt: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';
