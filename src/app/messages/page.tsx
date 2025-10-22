import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import { getConversationsForUser, getAllListings, getAllUsers } from '@/lib/data';
import { ChatClient } from '@/components/messaging/ChatClient';

export default async function MessagesPage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect('/login?from=/messages');
  }

  const conversations = await getConversationsForUser(user.id);
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
