'use client';

import type { ListingWithSeller } from '@/lib/types';
import ListingCard from './ListingCard';

interface ListingFeedClientProps {
  listings: ListingWithSeller[];
}

export default function ListingFeedClient({ listings }: ListingFeedClientProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {listings.map((listing) =>
        listing.seller ? <ListingCard key={listing.id} listing={listing} /> : null
      )}
    </div>
  );
}
