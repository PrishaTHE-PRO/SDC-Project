
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { ChatClient } from '@/components/messaging/ChatClient';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserProfile, Listing, PopulatedConversation } from '@/lib/types';
import { collection, query, where, getDocs, getDoc, addDoc, serverTimestamp, doc } from 'firebase/firestore';

async function getListing(firestore: any, id: string): Promise<Listing | undefined> {
  if (!firestore) return undefined;
  const snapshot = await getDoc(doc(firestore, 'listings', id));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as Listing : undefined;
}

async function getUser(firestore: any, id: string): Promise<UserProfile | undefined> {
  if (!firestore) return undefined;
  const snapshot = await getDoc(doc(firestore, 'users', id));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as UserProfile : undefined;
}


export default function MessagesPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { firestore, isLoading: isFirestoreLoading } = useFirestore();
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
      if (user && liveConversations && firestore) {
        setIsLoadingConversations(true);
        
        const listingId = searchParams.get('listingId');
        const sellerId = searchParams.get('sellerId');

        let convosToProcess = liveConversations;

        // If the user is coming from a listing page, we might need to create a new conversation
        if (listingId && sellerId && user && user.uid !== sellerId) {
            const participantIds = [user.uid, sellerId].sort();
            const q = query(
              collection(firestore, 'conversations'),
              where('listingId', '==', listingId),
              where('participantIds', '==', participantIds)
            );
            const snapshot = await getDocs(q);

            let newOrExistingConvo;

            if (!snapshot.empty) {
                newOrExistingConvo = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
            } else {
                 const newConversationData = {
                    listingId,
                    participantIds,
                    lastMessageAt: serverTimestamp(),
                 };
                 const docRef = await addDoc(collection(firestore, 'conversations'), newConversationData);
                 const newDoc = await getDoc(docRef);
                 newOrExistingConvo = { id: newDoc.id, ...newDoc.data() };
            }

            if (newOrExistingConvo && !convosToProcess.some(c => c.id === newOrExistingConvo.id)) {
              // This is a new or newly fetched conversation, add it to the list to be processed.
              convosToProcess = [newOrExistingConvo, ...convosToProcess];
            }
        }

        const populated = await Promise.all(convosToProcess.map(async (convo: any) => {
          const otherParticipantId = convo.participantIds.find((id: string) => id !== user.uid);
          
          const [listing, otherParticipant] = await Promise.all([
            getListing(firestore, convo.listingId),
            otherParticipantId ? getUser(firestore, otherParticipantId) : Promise.resolve(undefined)
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
      } else if (!isLoadingLiveConversations && liveConversations?.length === 0) {
        setIsLoadingConversations(false);
      }
    };
    processConversations();
  }, [user, liveConversations, searchParams, firestore, isLoadingLiveConversations]);

  if (isUserLoading || isFirestoreLoading || isLoadingConversations || isLoadingLiveConversations ||!user) {
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
