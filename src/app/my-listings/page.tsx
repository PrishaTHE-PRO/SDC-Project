import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import { getAllListings, getAllUsers } from '@/lib/data';
import ListingCard from '@/components/listings/ListingCard';
import type { ListingWithSeller } from '@/lib/types';

export default async function MyListingsPage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect('/login?from=/my-listings');
  }

  const allListings = await getAllListings();
  const allUsers = await getAllUsers();
  
  const myListings = allListings.filter(listing => listing.sellerId === user.id);

  const listingsWithSellers: ListingWithSeller[] = myListings.map(listing => ({
    ...listing,
    seller: allUsers.find(u => u.id === listing.sellerId)
  }));

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          My Listings
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage your active listings on BadgerExchange.
        </p>
      </div>
      {listingsWithSellers.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {listingsWithSellers.map((listing) => (
            listing.seller ? <ListingCard key={listing.id} listing={listing} /> : null
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">You haven't posted any listings yet.</h3>
            <p className="text-muted-foreground mt-2">Click "Create Listing" to get started.</p>
        </div>
      )}
    </div>
  );
}
