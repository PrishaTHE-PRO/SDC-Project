
'use client';

import { useState } from 'react';
import type { ListingWithSeller } from '@/lib/types';
import ListingCard from './ListingCard';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface ListingFeedClientProps {
  listings: ListingWithSeller[];
  categories: string[];
}

export default function ListingFeedClient({ listings, categories }: ListingFeedClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredListings = selectedCategory
    ? listings.filter(listing => listing.tags.includes(selectedCategory))
    : listings;
    
  if (listings.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">No listings found.</h3>
          <p className="text-muted-foreground mt-2">Check back later for new items!</p>
      </div>
    );
  }
    
  return (
    <div className="space-y-6">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-2 pb-4">
          <Button
            variant={selectedCategory === null ? 'default' : 'secondary'}
            onClick={() => setSelectedCategory(null)}
            className="rounded-full"
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'secondary'}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredListings.map((listing) =>
          listing.seller ? <ListingCard key={listing.id} listing={listing} /> : null
        )}
      </div>
    </div>
  );
}
