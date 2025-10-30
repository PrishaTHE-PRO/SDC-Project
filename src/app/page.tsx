'use client';
import { useMemo } from 'react';
import ListingFeedClient from '@/components/listings/ListingFeedClient';
import { useUser, useFirestore, useCollection, useDoc } from '@/firebase';
import type { Listing, UserProfile } from '@/lib/types';
import { collection, query, where, doc } from 'firebase/firestore';
import CategoryRow from '@/components/listings/CategoryRow';

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

  // 3. Sort listings and separate them by category
  const { preferredCategoryListings, remainingListings, allCategoriesForFeed } = useMemo(() => {
    if (!activeListings) {
      return { preferredCategoryListings: [], remainingListings: [], allCategoriesForFeed: [] };
    }

    const sorted = [...activeListings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const preferredCategories = userProfile?.preferredCategories || [];
    const preferredCategoryMap = new Map<string, Listing[]>();
    const remaining: Listing[] = [];
    const preferredListingIds = new Set<string>();

    // Initialize map for preferred categories
    preferredCategories.forEach(cat => preferredCategoryMap.set(cat, []));

    // Populate the map and remaining listings
    for (const listing of sorted) {
      let inPreferred = false;
      for (const tag of listing.tags) {
        if (preferredCategoryMap.has(tag)) {
          preferredCategoryMap.get(tag)!.push(listing);
          inPreferred = true;
          preferredListingIds.add(listing.id);
        }
      }
    }

    const finalRemainingListings = sorted.filter(l => !preferredListingIds.has(l.id));

    const allTags = [...new Set(finalRemainingListings.flatMap(l => l.tags) || [])];
    const feedCategories = allTags.filter(c => !preferredCategories.includes(c));


    return { 
      preferredCategoryListings: Array.from(preferredCategoryMap.entries())
                                        .map(([category, listings]) => ({ category, listings }))
                                        .filter(group => group.listings.length > 0),
      remainingListings: finalRemainingListings,
      allCategoriesForFeed: feedCategories
    };

  }, [activeListings, userProfile]);
  

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
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-12">
      <div>
        <h1 className="mb-2 font-headline text-4xl font-bold tracking-tight">For You</h1>
        <p className="mb-6 text-lg text-muted-foreground">Buy and sell from verified UW-Madison students</p>
      </div>

      {preferredCategoryListings.map(({ category, listings }) => (
        <CategoryRow key={category} title={category} listings={listings} />
      ))}
      
      <ListingFeedClient listings={remainingListings} categories={allCategoriesForFeed} />
    </div>
  );
}
