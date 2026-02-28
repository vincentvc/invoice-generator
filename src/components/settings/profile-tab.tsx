'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from '@/hooks/use-toast';

export function ProfileTab() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const updatePassword = useAuthStore((s) => s.updatePassword);

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = async () => {
    await updateProfile({ displayName });
    toast({ title: 'Profile updated', description: 'Your name has been saved' });
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      toast({ title: 'Error', description: 'Password must be at least 8 characters' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match' });
      return;
    }
    await updatePassword(newPassword);
    setNewPassword('');
    setConfirmPassword('');
    toast({ title: 'Password updated', description: 'Your password has been changed' });
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">Sign in to manage your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold">Profile</h3>
        <div className="grid gap-3 max-w-md">
          <div>
            <Label className="text-xs">Display Name</Label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Email</Label>
            <Input value={user.email} disabled className="mt-1 bg-muted" />
          </div>
          <Button onClick={handleSaveProfile} size="sm" className="w-fit">
            Save Profile
          </Button>
        </div>
      </div>

      <div className="border-t pt-6 space-y-4">
        <h3 className="font-heading text-lg font-semibold">Change Password</h3>
        <div className="grid gap-3 max-w-md">
          <div>
            <Label className="text-xs">New Password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Confirm Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="mt-1"
            />
          </div>
          <Button onClick={handleChangePassword} size="sm" variant="outline" className="w-fit">
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
}
