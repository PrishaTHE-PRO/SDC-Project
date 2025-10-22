'use client';

import type { ListingWithSeller } from '@/lib/types';
import FeedListingCard from './FeedListingCard';

interface ListingFeedClientProps {
  listings: ListingWithSeller[];
}

export default function ListingFeedClient({ listings }: ListingFeedClientProps) {
  return (
    <div className="space-y-6">
      {listings.map((listing) => (
        listing.seller ? <FeedListingCard key={listing.id} listing={listing} /> : null
      ))}
    </div>
  );
}
