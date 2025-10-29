'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { getAllListings, getAllUsers } from '@/lib/data';
import ListingCard from '@/components/listings/ListingCard';
import type { ListingWithSeller } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyListingsPage() {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const router = useRouter();
  const [listingsWithSellers, setListingsWithSellers] = useState<ListingWithSeller[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?from=/my-listings');
    }
  }, [isUserLoading, user, router]);

  useEffect(() => {
    if (user) {
      const fetchListings = async () => {
        setIsLoadingListings(true);
        const allListings = await getAllListings();
        const allUsers = await getAllUsers();
        
        const myListings = allListings.filter(listing => listing.sellerId === user.id);

        const populatedListings: ListingWithSeller[] = myListings.map(listing => ({
          ...listing,
          seller: allUsers.find(u => u.id === listing.sellerId)
        }));
        setListingsWithSellers(populatedListings);
        setIsLoadingListings(false);
      };
      fetchListings();
    }
  }, [user]);

  if (isUserLoading || isLoadingListings || !user) {
    return (
       <div className="container mx-auto max-w-7xl px-4 py-8">
         <div className="mb-8">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-6 w-1/2 mt-2" />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="aspect-square" />)}
        </div>
      </div>
    );
  }
  
  const activeListings = listingsWithSellers.filter(l => l.status === 'active');
  const soldListings = listingsWithSellers.filter(l => l.status === 'sold');

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          My Listings
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage your active and sold listings on BadgerExchange.
        </p>
      </div>
      
      <div>
        <h2 className="mb-4 font-headline text-2xl font-bold tracking-tight">Active Listings</h2>
        {activeListings.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {activeListings.map((listing) => (
              listing.seller ? <ListingCard key={listing.id} listing={listing} /> : null
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <h3 className="text-xl font-semibold">You have no active listings.</h3>
              <p className="text-muted-foreground mt-2">Click "Create Listing" to get started.</p>
          </div>
        )}
      </div>

      {soldListings.length > 0 && (
        <>
          <Separator className="my-12" />
          <div>
            <h2 className="mb-4 font-headline text-2xl font-bold tracking-tight">Sold Items</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {soldListings.map((listing) => (
                listing.seller ? <ListingCard key={listing.id} listing={listing} /> : null
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
