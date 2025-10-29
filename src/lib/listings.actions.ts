
'use server';

import { revalidatePath } from 'next/cache';
import { markListingAsSold, deleteListingById } from './data';
import { getAuthenticatedUser } from './auth';

export async function markAsSoldAction(listingId: string) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, message: 'Authentication required.' };
  }
  
  // In a real app, you'd also check if the user is the owner of the listing here.
  
  const success = await markListingAsSold(listingId);
  
  if (success) {
    revalidatePath(`/listings/${listingId}`);
    revalidatePath('/my-listings');
    revalidatePath('/');
    revalidatePath('/trending');
    return { success: true, message: 'Listing marked as sold.' };
  }
  return { success: false, message: 'Failed to mark as sold.' };
}

export async function deleteListingAction(listingId: string) {
    const user = await getAuthenticatedUser();
    if (!user) {
      return { success: false, message: 'Authentication required.' };
    }

    // In a real app, you'd also check if the user is the owner of the listing here.

    const success = await deleteListingById(listingId);

    if (success) {
        revalidatePath('/my-listings');
        revalidatePath('/');
        revalidatePath('/trending');
        // We don't revalidate the listing page itself, as it will be gone.
        return { success: true, message: 'Listing deleted.' };
    }
    return { success: false, message: 'Failed to delete listing.' };
}
