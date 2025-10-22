import { getRecommendations } from '@/ai/flows/personalized-listing-feed';
import ListingFeedClient from '@/components/listings/ListingFeedClient';
import { getAuthenticatedUser } from '@/lib/auth';
import { getAllListings, getAllUsers } from '@/lib/data';
import type { ListingWithSeller } from '@/lib/types';

export default async function Home() {
  const allListings = await getAllListings();
  const allUsers = await getAllUsers();
  const user = await getAuthenticatedUser();

  const listingsWithSellers: ListingWithSeller[] = allListings.map(listing => ({
    ...listing,
    seller: allUsers.find(u => u.id === listing.sellerId)
  }));
  
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
            return aIndex - bIndex; // Sort by recommendation order
          }
          if (aIndex !== -1) {
            return -1; // a is recommended, b is not
          }
          if (bIndex !== -1) {
            return 1; // b is recommended, a is not
          }
          // Both are not recommended, sort by date
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      }
    } catch (error) {
      console.error("Failed to get AI recommendations, falling back to chronological sort:", error);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 font-headline text-4xl font-bold tracking-tight">
        For You
      </h1>
      <ListingFeedClient listings={sortedListings} />
    </div>
  );
}
