import Link from 'next/link';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/auth/UserNav';
import { Logo } from '@/components/Logo';
import { PlusCircle } from 'lucide-react';
import { HeaderNav } from '@/components/layout/HeaderNav';
import { getUserById } from '@/lib/data';
import { CurrentUserProvider } from '@/hooks/use-current-user';

export default async function Header() {
  const cookieStore = cookies();
  const userId = cookieStore.get('mock_auth_user_id')?.value;
  const user = userId ? await getUserById(userId) : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <HeaderNav />
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <CurrentUserProvider user={user}>
              <Button asChild>
                <Link href="/create">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Listing
                </Link>
              </Button>
              <UserNav user={user} />
            </CurrentUserProvider>
          ) : (
            <Button asChild variant="secondary">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
