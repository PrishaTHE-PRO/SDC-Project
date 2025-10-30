'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { getConversationsForUser, createOrGetConversation, getListingById, getUserById } from '@/lib/data';
import { ChatClient } from '@/components/messaging/ChatClient';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserProfile, Listing, PopulatedConversation } from '@/lib/types';
import { collection, query, where } from 'firebase/firestore';

export default function MessagesPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const firestore = useFirestore();
  const [conversations, setConversations] = useState<PopulatedConversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);

  const conversationsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'conversations'), where('participantIds', 'array-contains', user.uid));
  }, [firestore, user]);

  const { data: liveConversations, isLoading: isLoadingLiveConversations } = useCollection(conversationsQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?from=/messages');
    }
  }, [isUserLoading, user, router]);

  useEffect(() => {
    const processConversations = async () => {
      if (user && liveConversations) {
        setIsLoadingConversations(true);
        
        const listingId = searchParams.get('listingId');
        const sellerId = searchParams.get('sellerId');

        let convosToProcess = liveConversations;

        if (listingId && sellerId && user) {
            const newOrExistingConvo = await createOrGetConversation(listingId, user.uid, sellerId);
            if (newOrExistingConvo && !convosToProcess.some(c => c.id === newOrExistingConvo.id)) {
              convosToProcess = [newOrExistingConvo, ...convosToProcess];
            }
        }

        const populated = await Promise.all(convosToProcess.map(async (convo) => {
          const otherParticipantId = convo.participantIds.find(id => id !== user.uid);
          const [listing, otherParticipant] = await Promise.all([
            getListingById(convo.listingId),
            otherParticipantId ? getUserById(otherParticipantId) : Promise.resolve(undefined)
          ]);

          return {
            ...convo,
            listing,
            otherParticipant,
          };
        }));
        
        const validPopulated = populated.filter((c): c is PopulatedConversation => !!(c.listing && c.otherParticipant));

        setConversations(validPopulated);
        setIsLoadingConversations(false);
      }
    };
    processConversations();
  }, [user, liveConversations, searchParams, firestore]);

  if (isUserLoading || isLoadingConversations || isLoadingLiveConversations ||!user) {
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
