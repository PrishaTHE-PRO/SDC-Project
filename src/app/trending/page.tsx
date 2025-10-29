
import ListingCard from '@/components/listings/ListingCard';
import { getActiveListings, getAllUsers } from '@/lib/data';
import type { Listing, ListingWithSeller } from '@/lib/types';

export default async function TrendingPage() {
  const listings: Listing[] = await getActiveListings(); // Use getActiveListings
  const users = await getAllUsers();

  const listingsWithSellers: ListingWithSeller[] = listings.map(listing => ({
    ...listing,
    seller: users.find(u => u.id === listing.sellerId)
  }));

  // Sort by lastViewedAt to determine "trending"
  const trendingListings = [...listingsWithSellers].sort(
    (a, b) => new Date(b.lastViewedAt).getTime() - new Date(a.lastViewedAt).getTime()
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Trending Listings
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          See what&apos;s popular right now on BadgerExchange.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {trendingListings.map((listing) => (
          listing.seller ? <ListingCard key={listing.id} listing={listing} /> : null
        ))}
      </div>
    </div>
  );
}
