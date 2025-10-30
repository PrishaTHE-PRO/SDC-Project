
'use client';

import type { ListingWithSeller } from '@/lib/types';
import ListingCard from './ListingCard';

interface ListingFeedClientProps {
  listings: ListingWithSeller[];
}

export default function ListingFeedClient({ listings }: ListingFeedClientProps) {

  if (listings.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">No listings found.</h3>
          <p className="text-muted-foreground mt-2">Check back later for new items!</p>
      </div>
    );
  }
    
  return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {listings.map((listing) =>
          <ListingCard key={listing.id} listing={listing} />
        )}
      </div>
  );
}
