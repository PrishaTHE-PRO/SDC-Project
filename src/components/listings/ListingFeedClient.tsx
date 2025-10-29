'use client';

import { useState } from 'react';
import type { ListingWithSeller } from '@/lib/types';
import ListingCard from './ListingCard';
import { Button } from '@/components/ui/button';

interface ListingFeedClientProps {
  listings: ListingWithSeller[];
  categories: string[];
}

export default function ListingFeedClient({ listings, categories }: ListingFeedClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredListings = selectedCategory
    ? listings.filter(listing => listing.tags.includes(selectedCategory))
    : listings;
    
  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
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
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredListings.map((listing) =>
          listing.seller ? <ListingCard key={listing.id} listing={listing} /> : null
        )}
      </div>
    </div>
  );
}
