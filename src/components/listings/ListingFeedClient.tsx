'use client';

import type { ListingWithSeller } from '@/lib/types';
import ListingCard from './ListingCard';

interface ListingFeedClientProps {
  listings: ListingWithSeller[];
}

export default function ListingFeedClient({ listings }: ListingFeedClientProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {listings.map((listing) =>
        listing.seller ? <ListingCard key={listing.id} listing={listing} /> : null
      )}
    </div>
  );
}
