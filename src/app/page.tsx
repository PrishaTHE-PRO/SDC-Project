
import { getRecommendations } from '@/ai/flows/personalized-listing-feed';
import ListingCard from '@/components/listings/ListingCard';
import ListingFeedClient from '@/components/listings/ListingFeedClient';
import { getAuthenticatedUser } from '@/lib/auth';
import { getAllListings, getAllUsers } from '@/lib/data';
import type { ListingWithSeller } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

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

  const allTags = allListings.flatMap(l => l.tags);
  const allCategories = [...new Set(allTags)];

  const preferredCategories = user?.preferredCategories || [];
  const otherCategories = allCategories.filter(c => !preferredCategories.includes(c));

  const listingsByPreferredCategory: { category: string, listings: ListingWithSeller[] }[] = preferredCategories.map(category => ({
    category,
    listings: sortedListings.filter(l => l.tags.includes(category)),
  })).filter(group => group.listings.length > 0);

  const otherListings = sortedListings.filter(listing => 
    !listing.tags.some(tag => preferredCategories.includes(tag))
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {user && listingsByPreferredCategory.length > 0 ? (
        <>
          <ListingFeedClient listings={sortedListings} categories={[...preferredCategories, ...otherCategories]} />
          
          <div className="mt-8 space-y-12">
            {listingsByPreferredCategory.map(({ category, listings }) => (
              <div key={category}>
                <h2 className="mb-4 font-headline text-2xl font-bold capitalize tracking-tight">
                  {category}
                </h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {listings.map((listing) => (
                    listing.seller ? <ListingCard key={listing.id} listing={listing} /> : null
                  ))}
                </div>
              </div>
            ))}
          </div>

          {otherListings.length > 0 && (
             <>
              <Separator className="my-12" />
              <div>
                <h2 className="mb-4 font-headline text-2xl font-bold tracking-tight">
                  More For You
                </h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {otherListings.map((listing) => (
                    listing.seller ? <ListingCard key={listing.id} listing={listing} /> : null
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <h1 className="mb-4 font-headline text-4xl font-bold tracking-tight">
            For You
          </h1>
          <ListingFeedClient listings={sortedListings} categories={allCategories} />
        </>
      )}
    </div>
  );
}
