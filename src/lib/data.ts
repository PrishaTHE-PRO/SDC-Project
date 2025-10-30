import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  addDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  DocumentData,
  Timestamp,
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { UserProfile, Listing, Conversation, Message } from './types';

// This is a server-side only initialization.
const { firestore } = initializeFirebase();

function snapshotToData<T>(snapshot: DocumentData): T {
    const data = snapshot.data();
    if (!data) {
        throw new Error("Document data is empty");
    }

    // Convert Firestore Timestamps to ISO strings
    Object.keys(data).forEach(key => {
        if (data[key] instanceof Timestamp) {
            data[key] = data[key].toDate().toISOString();
        }
    });

    return { ...data, id: snapshot.id } as T;
}


export const getAllListings = async (): Promise<Listing[]> => {
  const listingsCol = collection(firestore, 'listings');
  const snapshot = await getDocs(listingsCol);
  return snapshot.docs.map(doc => snapshotToData<Listing>(doc));
};

export const getActiveListings = async (): Promise<Listing[]> => {
  const listingsCol = collection(firestore, 'listings');
  const q = query(listingsCol, where('status', '==', 'active'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => snapshotToData<Listing>(doc));
};

export const getListingById = async (id: string): Promise<Listing | undefined> => {
  const docRef = doc(firestore, 'listings', id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return snapshotToData<Listing>(snapshot);
  }
  return undefined;
};

export const getUserById = async (id: string): Promise<UserProfile | undefined> => {
  const docRef = doc(firestore, 'users', id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return snapshotToData<UserProfile>(snapshot);
  }
  return undefined;
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const usersCol = collection(firestore, 'users');
  const snapshot = await getDocs(usersCol);
  return snapshot.docs.map(doc => snapshotToData<UserProfile>(doc));
};

export const getConversationsForUser = async (userId: string): Promise<Conversation[]> => {
    const convosCol = collection(firestore, 'conversations');
    const q = query(convosCol, where('participantIds', 'array-contains', userId));
    const snapshot = await getDocs(q);

    const conversations = await Promise.all(snapshot.docs.map(async (doc) => {
        const convoData = snapshotToData<Conversation>(doc);
        const messagesCol = collection(firestore, 'conversations', doc.id, 'messages');
        const messagesSnapshot = await getDocs(query(messagesCol, orderBy('createdAt', 'asc')));
        convoData.messages = messagesSnapshot.docs.map(msgDoc => snapshotToData<Message>(msgDoc));
        return convoData;
    }));

    return conversations;
};

export const createOrGetConversation = async (listingId: string, buyerId: string, sellerId: string): Promise<Conversation | undefined> => {
  const convosCol = collection(firestore, 'conversations');
  
  // Firestore doesn't support querying for two `array-contains` on the same field.
  // A common workaround is to store participant IDs in a sorted manner and query for equality.
  const participantIds = [buyerId, sellerId].sort();

  const q = query(
    convosCol,
    where('listingId', '==', listingId),
    where('participantIds', '==', participantIds)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const convoDoc = snapshot.docs[0];
    return snapshotToData<Conversation>(convoDoc);
  }

  // If not, create a new one
  const newConversationData = {
    listingId,
    participantIds,
    lastMessageAt: serverTimestamp(),
  };

  const docRef = await addDoc(convosCol, newConversationData);
  const newDoc = await getDoc(docRef);
  return snapshotToData<Conversation>(newDoc);
};

// Mock functions for mutations are now real Firestore mutations
export const markListingAsSold = async (listingId: string): Promise<boolean> => {
  const docRef = doc(firestore, 'listings', listingId);
  try {
    await updateDoc(docRef, { status: 'sold' });
    return true;
  } catch (e) {
    console.error("Error marking listing as sold: ", e);
    return false;
  }
};

export const deleteListingById = async (listingId: string): Promise<boolean> => {
  const docRef = doc(firestore, 'listings', listingId);
  try {
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    console.error("Error deleting listing: ", e);
    return false;
  }
};
