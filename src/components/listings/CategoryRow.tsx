'use client';

import type { Listing } from '@/lib/types';
import ListingCard from './ListingCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CategoryRowProps {
  title: string;
  listings: Listing[];
}

export default function CategoryRow({ title, listings }: CategoryRowProps) {
  if (listings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-headline text-2xl font-bold tracking-tight capitalize">{title}</h2>
        <Button variant="ghost" asChild>
            <Link href={`/category/${title}`}>
                See all <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </div>
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {listings.slice(0, 10).map(listing => (
              <div key={listing.id} className="w-64">
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
