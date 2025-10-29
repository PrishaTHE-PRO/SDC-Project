
export interface User {
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
  createdAt: string;
  views: number;
  lastViewedAt: string;
  status: 'active' | 'sold';
}

export type ListingWithSeller = Listing & { seller?: User };

export interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  listingId: string;
  participantIds: string[];
  messages: Message[];
  lastMessageAt: string;
}
