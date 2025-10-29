'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function HeaderNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/trending', label: 'Trending' },
    { href: '/messages', label: 'Messages' },
  ];

  return (
    <nav className="ml-6 flex items-center space-x-4 text-sm font-medium">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === link.href ? 'font-bold text-foreground' : 'text-foreground/60'
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
