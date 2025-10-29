
import { getRecommendations } from '@/ai/flows/personalized-listing-feed';
import ListingFeedClient from '@/components/listings/ListingFeedClient';
import { getAuthenticatedUser } from '@/lib/auth';
import { getActiveListings, getAllUsers } from '@/lib/data';
import type { ListingWithSeller } from '@/lib/types';

export default async function Home() {
  const allListings = await getActiveListings();
  const allUsers = await getAllUsers();
  const user = await getAuthenticatedUser();

  const listingsWithSellers: ListingWithSeller[] = allListings.map(listing => ({
    ...listing,
    seller: allUsers.find(u => u.id === listing.sellerId)
  })).filter(l => l.status === 'active');
  
  let sortedListings: ListingWithSeller[] = [...listingsWithSellers].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (user) {
    try {
      const allTags = allListings.map((l) => l.tags).flat();
      const uniqueTags = [...new Set(allTags)];
      
      const recommendations = await getRecommendations({
        userId: user.id,
        listingTags: uniqueTags,
        userHistory: user.viewedTags,
        currentListings: allListings.map(l => l.id),
      });

      const recommendedIds = recommendations.recommendedListings;

      if (recommendedIds && recommendedIds.length > 0) {
        sortedListings = [...listingsWithSellers].sort((a, b) => {
          const aIndex = recommendedIds.indexOf(a.id);
          const bIndex = recommendedIds.indexOf(b.id);

          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }
          if (aIndex !== -1) {
            return -1;
          }
          if (bIndex !== -1) {
            return 1;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      }
    } catch (error) {
      console.error("Failed to get AI recommendations, falling back to chronological sort:", error);
    }
  }

  const allTags = [...new Set(allListings.flatMap(l => l.tags))];
  const preferredCategories = user?.preferredCategories || [];
  const otherCategories = allTags.filter(c => !preferredCategories.includes(c));
  const categories = [...preferredCategories, ...otherCategories];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 font-headline text-4xl font-bold tracking-tight">For You</h1>
      <p className="mb-6 text-lg text-muted-foreground">Buy and sell from verified UW-Madison students</p>
      
      <ListingFeedClient listings={sortedListings} categories={categories} />
    </div>
  );
}
