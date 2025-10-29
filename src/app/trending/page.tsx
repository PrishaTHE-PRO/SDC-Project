import ListingCard from '@/components/listings/ListingCard';
import { getAllListings } from '@/lib/data';
import type { Listing } from '@/lib/types';

export default async function TrendingPage() {
  const listings: Listing[] = await getAllListings();

  // Sort by lastViewedAt to determine "trending"
  const trendingListings = [...listings].sort(
    (a, b) => new Date(b.lastViewedAt).getTime() - new Date(a.lastViewedAt).getTime()
  );

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Trending Listings
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          See what&apos;s popular right now on BadgerExchange.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {trendingListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
