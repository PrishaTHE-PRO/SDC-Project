import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function SettingsPage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect('/login?from=/settings');
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Settings</CardTitle>
          <CardDescription>
            Manage your account settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is where account settings would go.</p>
        </CardContent>
      </Card>
    </div>
  );
}
