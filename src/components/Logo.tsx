import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
        <span className="font-headline text-xl font-bold text-primary-foreground">
          B
        </span>
      </div>
      <span className="hidden font-headline text-xl font-bold sm:inline-block">
        BadgerExchange
      </span>
    </Link>
  );
}
