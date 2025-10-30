'use client';
import { useMemo } from 'react';
import { getRecommendations } from '@/ai/flows/personalized-listing-feed';
import ListingFeedClient from '@/components/listings/ListingFeedClient';
import { useUser, useFirestore, useCollection, useDoc } from '@/firebase';
import type { Listing, UserProfile } from '@/lib/types';
import { collection, query, where, doc } from 'firebase/firestore';

type ListingWithSeller = Listing & { seller?: UserProfile };

export default function Home() {
  const { user: authUser } = useUser();
  const { firestore, isLoading: isFirestoreLoading } = useFirestore();

  // 1. Fetch all active listings
  const listingsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'listings'), where('status', '==', 'active'));
  }, [firestore]);
  const { data: activeListings, isLoading: isLoadingListings } = useCollection<Listing>(listingsQuery);

  // 2. Fetch the current user's profile
  const userProfileRef = useMemo(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, 'users', authUser.uid);
  }, [firestore, authUser]);
  const { data: userProfile, isLoading: isLoadingUserProfile } = useDoc<UserProfile>(userProfileRef);

  // 3. Sort listings chronologically
  const sortedListings: ListingWithSeller[] = useMemo(() => {
    if (!activeListings) return [];
    // The seller data is not available here anymore, which is fine for the card component.
    return [...activeListings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [activeListings]);


  const allTags = useMemo(() => {
    return [...new Set(activeListings?.flatMap(l => l.tags) || [])];
  }, [activeListings]);

  const categories = useMemo(() => {
    const preferredCategories = userProfile?.preferredCategories || [];
    const otherCategories = allTags.filter(c => !preferredCategories.includes(c));
    return [...preferredCategories, ...otherCategories];
  }, [allTags, userProfile]);
  

  if (isFirestoreLoading || isLoadingListings || isLoadingUserProfile) {
    return (
        <div className="container mx-auto max-w-7xl px-4 py-8">
            <h1 className="mb-2 font-headline text-4xl font-bold tracking-tight">For You</h1>
            <p className="mb-6 text-lg text-muted-foreground">Loading personalized feed...</p>
            {/* You could add a skeleton loader for the feed here */}
        </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 font-headline text-4xl font-bold tracking-tight">For You</h1>
      <p className="mb-6 text-lg text-muted-foreground">Buy and sell from verified UW-Madison students</p>
      
      <ListingFeedClient listings={sortedListings} categories={categories} />
    </div>
  );
}
