
'use server';

import { revalidatePath } from 'next/cache';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { initializeServerFirebase } from '@/firebase/server';

// This is a server-side only initialization.
const { firestore } = initializeServerFirebase();


export async function markAsSoldAction(listingId: string) {
  // In a real app, you'd also check if the user is the owner of the listing here.
  // This will be enforced by Firestore security rules.
  try {
    const listingRef = doc(firestore, 'listings', listingId);
    await updateDoc(listingRef, { status: 'sold' });

    revalidatePath(`/listings/${listingId}`);
    revalidatePath('/my-listings');
    revalidatePath('/');
    revalidatePath('/trending');
    return { success: true, message: 'Listing marked as sold.' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to mark as sold.' };
  }
}

export async function deleteListingAction(listingId: string) {
    // In a real app, you'd also check if the user is the owner of the listing here.
    // This will be enforced by Firestore security rules.
    try {
        const listingRef = doc(firestore, 'listings', listingId);
        await deleteDoc(listingRef);

        revalidatePath('/my-listings');
        revalidatePath('/');
        revalidatePath('/trending');
        // We don't revalidate the listing page itself, as it will be gone.
        return { success: true, message: 'Listing deleted.' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Failed to delete listing.' };
    }
}


export async function deleteConversationAction(conversationId: string) {
  // In a real app, you'd also check if the user is part of the conversation.
  // This will be enforced by Firestore security rules.
  try {
    const conversationRef = doc(firestore, 'conversations', conversationId);
    await deleteDoc(conversationRef);

    revalidatePath('/messages');
    return { success: true, message: 'Conversation deleted.' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to delete conversation.' };
  }
}
