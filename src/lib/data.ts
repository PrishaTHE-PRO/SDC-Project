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
  orderBy,
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { UserProfile, Listing, Conversation, Message } from './types';

// This is a server-side only initialization.
const { firestore } = initializeFirebase();

function snapshotToData<T>(snapshot: DocumentData): T | undefined {
    if (!snapshot.exists()) {
        return undefined;
    }
    const data = snapshot.data();
    if (!data) {
        return undefined;
    }

    // Convert Firestore Timestamps to ISO strings
    for (const key in data) {
        if (data[key] instanceof Timestamp) {
            data[key] = data[key].toDate().toISOString();
        }
    }

    return { ...data, id: snapshot.id } as T;
}


export const getAllListings = async (): Promise<Listing[]> => {
  if (!firestore) return [];
  const listingsCol = collection(firestore, 'listings');
  const snapshot = await getDocs(listingsCol);
  return snapshot.docs.map(doc => snapshotToData<Listing>(doc)).filter((l): l is Listing => l !== undefined);
};

export const getActiveListings = async (): Promise<Listing[]> => {
  if (!firestore) return [];
  const listingsCol = collection(firestore, 'listings');
  const q = query(listingsCol, where('status', '==', 'active'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => snapshotToData<Listing>(doc)).filter((l): l is Listing => l !== undefined);
};

export const getListingById = async (id: string): Promise<Listing | undefined> => {
  if (!firestore) return undefined;
  const docRef = doc(firestore, 'listings', id);
  const snapshot = await getDoc(docRef);
  return snapshotToData<Listing>(snapshot);
};

export const getUserById = async (id: string): Promise<UserProfile | undefined> => {
  if (!firestore) return undefined;
  const docRef = doc(firestore, 'users', id);
  const snapshot = await getDoc(docRef);
  return snapshotToData<UserProfile>(snapshot);
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  if (!firestore) return [];
  const usersCol = collection(firestore, 'users');
  const snapshot = await getDocs(usersCol);
  return snapshot.docs.map(doc => snapshotToData<UserProfile>(doc)).filter((u): u is UserProfile => u !== undefined);
};

export const getConversationsForUser = async (userId: string): Promise<Conversation[]> => {
    if (!firestore) return [];
    const convosCol = collection(firestore, 'conversations');
    const q = query(convosCol, where('participantIds', 'array-contains', userId));
    const snapshot = await getDocs(q);

    const conversations = await Promise.all(snapshot.docs.map(async (d) => {
        const convoData = snapshotToData<Conversation>(d);
        if (!convoData) return null;

        const messagesCol = collection(firestore, 'conversations', d.id, 'messages');
        const messagesSnapshot = await getDocs(query(messagesCol, orderBy('createdAt', 'asc')));
        convoData.messages = messagesSnapshot.docs.map(msgDoc => snapshotToData<Message>(msgDoc)).filter((m): m is Message => m !== undefined);
        return convoData;
    }));

    return conversations.filter((c): c is Conversation => c !== null);
};

export const createOrGetConversation = async (listingId: string, buyerId: string, sellerId: string): Promise<Conversation | undefined> => {
  if (!firestore) return undefined;
  const convosCol = collection(firestore, 'conversations');
  
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

  const newConversationData = {
    listingId,
    participantIds,
    lastMessageAt: serverTimestamp(),
  };

  const docRef = await addDoc(convosCol, newConversationData);
  const newDoc = await getDoc(docRef);
  return snapshotToData<Conversation>(newDoc);
};

export const markListingAsSold = async (listingId: string): Promise<boolean> => {
  if (!firestore) return false;
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
  if (!firestore) return false;
  const docRef = doc(firestore, 'listings', listingId);
  try {
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    console.error("Error deleting listing: ", e);
    return false;
  }
};
