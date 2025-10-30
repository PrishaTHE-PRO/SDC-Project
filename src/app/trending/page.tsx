'use client';
import { useMemo } from 'react';
import ListingCard from '@/components/listings/ListingCard';
import { useCollection, useFirestore } from '@/firebase';
import type { Listing, UserProfile } from '@/lib/types';
import { collection, query, where, orderBy } from 'firebase/firestore';

type ListingWithSeller = Listing & { seller?: UserProfile };

export default function TrendingPage() {
  const firestore = useFirestore();

  const listingsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'listings'),
      where('status', '==', 'active'),
      orderBy('lastViewedAt', 'desc')
    );
  }, [firestore]);
  const { data: trendingListings, isLoading: isLoadingListings } = useCollection<Listing>(listingsQuery);
  
  const usersQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);
  const { data: users, isLoading: isLoadingUsers } = useCollection<UserProfile>(usersQuery);

  const listingsWithSellers: ListingWithSeller[] = useMemo(() => {
    if (!trendingListings || !users) return [];
    return trendingListings.map(listing => ({
      ...listing,
      seller: users.find(u => u.id === listing.sellerId)
    }));
  }, [trendingListings, users]);
  
  if (isLoadingListings || isLoadingUsers) {
      // Optional: Add a skeleton loader here
      return <div className="container mx-auto max-w-7xl px-4 py-8">Loading trending listings...</div>
  }

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
        {listingsWithSellers.map((listing) => (
          listing.seller ? <ListingCard key={listing.id} listing={listing} /> : null
        ))}
      </div>
    </div>
  );
}
