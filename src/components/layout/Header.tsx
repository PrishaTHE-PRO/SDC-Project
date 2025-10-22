import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getAuthenticatedUser } from '@/lib/auth';
import { UserNav } from '@/components/auth/UserNav';
import { Logo } from '@/components/Logo';
import { PlusCircle } from 'lucide-react';

export default async function Header() {
  const user = await getAuthenticatedUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <nav className="ml-6 flex items-center space-x-4 text-sm font-medium">
          <Link
            href="/"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Home
          </Link>
          <Link
            href="/trending"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Trending
          </Link>
          <Link
            href="/messages"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Messages
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <>
              <Button asChild>
                <Link href="/create">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Listing
                </Link>
              </Button>
              <UserNav user={user} />
            </>
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
