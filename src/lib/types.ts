
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  viewedTags: string[];
  preferredCategories: string[];
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  sellerId: string;
  createdAt: string; // Should be ISO string date
  views: number;
  lastViewedAt: string; // Should be ISO string date
  status: 'active' | 'sold';
  condition: string;
}

export type ListingWithSeller = Listing & { seller?: UserProfile };

export interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: string; // Should be ISO string date
}

export interface Conversation {
  id: string;
  listingId: string;
  participantIds: string[];
  messages: Message[];
  lastMessageAt: string; // Should be ISO string date
}

export type PopulatedConversation = Omit<Conversation, 'messages'> & {
  listing?: Listing;
  otherParticipant?: UserProfile;
};
