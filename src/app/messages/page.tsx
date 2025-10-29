
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import { getConversationsForUser, getAllListings, getAllUsers, createOrGetConversation } from '@/lib/data';
import { ChatClient } from '@/components/messaging/ChatClient';

export default async function MessagesPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect('/login?from=/messages');
  }

  const { listingId, sellerId } = searchParams;
  let conversations = await getConversationsForUser(user.id);

  if (typeof listingId === 'string' && typeof sellerId === 'string') {
    const newOrExistingConvo = await createOrGetConversation(listingId, user.id, sellerId);
    // Add to conversations list if it's not already there
    if (newOrExistingConvo && !conversations.some(c => c.id === newOrExistingConvo.id)) {
      conversations.unshift(newOrExistingConvo);
    }
  }
  
  const listings = await getAllListings();
  const users = await getAllUsers();
  
  // Augment conversations with full user and listing details
  const populatedConversations = conversations.map(convo => {
    const otherParticipantId = convo.participantIds.find(id => id !== user.id);
    return {
      ...convo,
      listing: listings.find(l => l.id === convo.listingId),
      otherParticipant: users.find(u => u.id === otherParticipantId),
    };
  }).filter(c => c.listing && c.otherParticipant);

  return (
     <div className="h-[calc(100vh-4rem)]">
        <ChatClient
          currentUser={user}
          conversations={populatedConversations}
        />
    </div>
  );
}
