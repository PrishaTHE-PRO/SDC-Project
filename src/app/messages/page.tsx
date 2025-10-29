'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { getConversationsForUser, getAllListings, getAllUsers, createOrGetConversation } from '@/lib/data';
import { ChatClient } from '@/components/messaging/ChatClient';
import { Skeleton } from '@/components/ui/skeleton';
import type { User, Listing, Conversation } from '@/lib/types';

type PopulatedConversation = {
  id: string;
  listing?: Listing;
  otherParticipant?: User;
  messages: {
    id: string;
    text: string;
    senderId: string;
    createdAt: string;
  }[];
};

export default function MessagesPage() {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<PopulatedConversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?from=/messages');
    }
  }, [isUserLoading, user, router]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (user) {
        setIsLoadingConversations(true);
        const listingId = searchParams.get('listingId');
        const sellerId = searchParams.get('sellerId');
        
        let userConversations = await getConversationsForUser(user.id);

        if (typeof listingId === 'string' && typeof sellerId === 'string') {
          const newOrExistingConvo = await createOrGetConversation(listingId, user.id, sellerId);
          if (newOrExistingConvo && !userConversations.some(c => c.id === newOrExistingConvo.id)) {
            userConversations.unshift(newOrExistingConvo);
          }
        }
        
        const listings = await getAllListings();
        const users = await getAllUsers();
        
        const populated = userConversations.map(convo => {
          const otherParticipantId = convo.participantIds.find(id => id !== user.id);
          return {
            ...convo,
            listing: listings.find(l => l.id === convo.listingId),
            otherParticipant: users.find(u => u.id === otherParticipantId),
          };
        }).filter((c): c is PopulatedConversation => !!(c.listing && c.otherParticipant));

        setConversations(populated);
        setIsLoadingConversations(false);
      }
    };
    fetchConversations();
  }, [user, searchParams]);

  if (isUserLoading || isLoadingConversations || !user) {
    return (
      <div className="h-[calc(100vh-4rem)] flex border-t">
        <div className="w-full md:w-1/3 md:border-r">
           <div className="p-4 border-b">
              <Skeleton className="h-8 w-1/2" />
           </div>
           <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
              ))}
           </div>
        </div>
        <div className="hidden md:flex flex-1 flex-col items-center justify-center">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-5 w-1/2 mt-2" />
        </div>
      </div>
    );
  }

  return (
     <div className="h-[calc(100vh-4rem)]">
        <ChatClient
          currentUser={user}
          conversations={conversations}
        />
    </div>
  );
}
