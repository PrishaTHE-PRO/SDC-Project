
import type { User, Listing, Conversation } from './types';
import { placeholderImages } from './placeholder-images.json';

const getImage = (id: string) => {
  return placeholderImages.find(img => img.id === id)?.imageUrl || 'https://picsum.photos/seed/error/600/400';
}

const users: User[] = [
  { id: 'user_1', name: 'Bucky Badger', email: 'bucky@wisc.edu', avatarUrl: getImage('user_bucky'), viewedTags: ['textbooks', 'electronics', 'furniture'], preferredCategories: ['electronics', 'furniture', 'bikes'] },
  { id: 'user_2', name: 'Jane Doe', email: 'jdoe@wisc.edu', avatarUrl: getImage('user_jane'), viewedTags: ['furniture', 'decor'], preferredCategories: ['furniture', 'decor', 'clothing'] },
  { id: 'user_3', name: 'Mike Smith', email: 'msmith@wisc.edu', avatarUrl: getImage('user_mike'), viewedTags: ['bikes', 'sports'], preferredCategories: ['bikes', 'sports', 'textbooks'] },
  { id: 'user_4', name: 'Sarah Lee', email: 'slee@wisc.edu', avatarUrl: getImage('user_sarah'), viewedTags: ['clothing', 'winter'], preferredCategories: ['clothing', 'winter', 'dorm'] },
  { id: 'user_5', name: 'Dave Davis', email: 'ddavis@wisc.edu', avatarUrl: getImage('user_dave'), viewedTags: ['music', 'electronics'], preferredCategories: ['music', 'electronics', 'instruments'] },
];

let listings: Listing[] = [
  {
    id: 'listing_1',
    title: 'CS 577 Textbook - Like New',
    description: "Barely used textbook for Algorithms. Save some money! Can meet on campus.",
    price: 60,
    tags: ['textbooks', 'academics', 'cs'],
    images: [getImage('img_textbook_1')],
    sellerId: 'user_2',
    createdAt: '2024-05-20T10:00:00Z',
    views: 150,
    lastViewedAt: '2024-05-28T10:00:00Z',
    status: 'active',
  },
  {
    id: 'listing_2',
    title: 'Road Bike for Campus',
    description: "Great for getting around campus quickly. Recently tuned up. Includes a lock.",
    price: 120,
    tags: ['bikes', 'transportation', 'sports'],
    images: [getImage('img_bike_1')],
    sellerId: 'user_3',
    createdAt: '2024-05-22T14:30:00Z',
    views: 250,
    lastViewedAt: '2024-05-28T11:00:00Z',
    status: 'active',
  },
  {
    id: 'listing_3',
    title: 'Mini-fridge for Dorm Room',
    description: "Perfect size for a dorm room. Works great, very clean inside.",
    price: 50,
    tags: ['furniture', 'dorm', 'electronics', 'appliances'],
    images: [getImage('img_minifridge_1')],
    sellerId: 'user_4',
    createdAt: '2024-05-25T09:00:00Z',
    views: 300,
    lastViewedAt: '2024-05-28T12:30:00Z',
    status: 'active',
  },
  {
    id: 'listing_4',
    title: 'Modern Desk Lamp',
    description: "Adjustable LED desk lamp with USB charging port. Great for late-night study sessions.",
    price: 25,
    tags: ['decor', 'dorm', 'electronics', 'furniture'],
    images: [getImage('img_lamp_1')],
    sellerId: 'user_2',
    createdAt: '2024-05-26T11:00:00Z',
    views: 80,
    lastViewedAt: '2024-05-28T09:00:00Z',
    status: 'active',
  },
  {
    id: 'listing_5',
    title: 'Comfy Futon/Couch',
    description: "Selling my futon. It's a couple of years old but in great condition. Folds down into a bed. Pickup only.",
    price: 150,
    tags: ['furniture', 'living room', 'apartment'],
    images: [getImage('img_couch_1')],
    sellerId: 'user_5',
    createdAt: '2024-05-19T18:00:00Z',
    views: 180,
    lastViewedAt: '2024-05-27T15:00:00Z',
    status: 'active',
  },
  {
    id: 'listing_6',
    title: 'Hardly Used Microwave',
    description: "Small microwave, perfect for an apartment or dorm. Clean and works perfectly.",
    price: 30,
    tags: ['appliances', 'kitchen', 'dorm'],
    images: [getImage('img_microwave_1')],
    sellerId: 'user_3',
    createdAt: '2024-05-27T12:00:00Z',
    views: 55,
    lastViewedAt: '2024-05-28T12:00:00Z',
    status: 'active',
  },
  {
    id: 'listing_7',
    title: '24-inch Dell Monitor',
    description: "1080p monitor, great for a dual-screen setup. HDMI and DisplayPort inputs. No dead pixels.",
    price: 80,
    tags: ['electronics', 'computers', 'cs'],
    images: [getImage('img_monitor_1')],
    sellerId: 'user_1',
    createdAt: '2024-05-24T16:00:00Z',
    views: 210,
    lastViewedAt: '2024-05-28T09:30:00Z',
    status: 'sold',
  },
  {
    id: 'listing_8',
    title: 'Ergonomic Office Chair',
    description: "Very comfortable chair, saved my back during finals. Adjustable height and armrests.",
    price: 75,
    tags: ['furniture', 'dorm', 'office'],
    images: [getImage('img_chair_1')],
    sellerId: 'user_4',
    createdAt: '2024-05-21T08:20:00Z',
    views: 120,
    lastViewedAt: '2024-05-27T20:00:00Z',
    status: 'active',
  },
  {
    id: 'listing_9',
    title: 'Bluetooth Speaker',
    description: "JBL Flip 5, great sound and waterproof. Battery still lasts a long time.",
    price: 45,
    tags: ['electronics', 'music', 'audio'],
    images: [getImage('img_speaker_1')],
    sellerId: 'user_5',
    createdAt: '2024-05-26T18:00:00Z',
    views: 95,
    lastViewedAt: '2024-05-28T08:15:00Z',
    status: 'active',
  },
  {
    id: 'listing_10',
    title: 'Acoustic Guitar',
    description: "Beginner acoustic guitar. Needs new strings but otherwise in good shape. Comes with a soft case.",
    price: 90,
    tags: ['music', 'hobby', 'instruments'],
    images: [getImage('img_guitar_1')],
    sellerId: 'user_1',
    createdAt: '2024-05-18T13:00:00Z',
    views: 60,
    lastViewedAt: '2024-05-26T13:00:00Z',
    status: 'active',
  },
];

let conversations: Conversation[] = [
  {
    id: 'convo_1',
    listingId: 'listing_1',
    participantIds: ['user_1', 'user_2'],
    lastMessageAt: '2024-05-21T11:05:00Z',
    messages: [
      { id: 'msg_1', text: "Hey! Is the CS 577 book still available?", senderId: 'user_1', createdAt: '2024-05-21T11:00:00Z' },
      { id: 'msg_2', text: "Hi, yes it is!", senderId: 'user_2', createdAt: '2024-05-21T11:05:00Z' },
    ]
  },
  {
    id: 'convo_2',
    listingId: 'listing_3',
    participantIds: ['user_1', 'user_4'],
    lastMessageAt: '2024-05-26T10:10:00Z',
    messages: [
      { id: 'msg_3', text: "Hi, I'm interested in the mini-fridge. Is the price negotiable?", senderId: 'user_1', createdAt: '2024-05-26T10:00:00Z' },
      { id: 'msg_4', text: "Hey, I could do $45 if you can pick it up this afternoon.", senderId: 'user_4', createdAt: '2024-05-26T10:10:00Z' },
    ]
  },
  {
    id: 'convo_3',
    listingId: 'listing_7',
    participantIds: ['user_5', 'user_1'],
    lastMessageAt: '2024-05-25T13:15:00Z',
    messages: [
      { id: 'msg_5', text: "Is the monitor still available?", senderId: 'user_5', createdAt: '2024-05-25T13:15:00Z' },
    ]
  }
];

// Simulate API calls
export const getAllListings = async (): Promise<Listing[]> => {
  return new Promise(resolve => setTimeout(() => resolve(listings), 200));
}

export const getActiveListings = async (): Promise<Listing[]> => {
    const activeListings = listings.filter(l => l.status === 'active');
    return new Promise(resolve => setTimeout(() => resolve(activeListings), 200));
};

export const getListingById = async (id: string): Promise<Listing | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(listings.find(l => l.id === id)), 100));
}

export const getUserById = async (id: string): Promise<User | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(users.find(u => u.id === id)), 50));
}

export const getAllUsers = async (): Promise<User[]> => {
  return new Promise(resolve => setTimeout(() => resolve(users), 50));
}

export const getConversationsForUser = async (userId: string): Promise<Conversation[]> => {
  const userConvos = conversations.filter(c => c.participantIds.includes(userId));
  return new Promise(resolve => setTimeout(() => resolve(userConvos), 150));
}

export const createOrGetConversation = async (listingId: string, buyerId: string, sellerId: string): Promise<Conversation | undefined> => {
  // Check if a conversation already exists for this listing between these users
  let conversation = conversations.find(c =>
    c.listingId === listingId &&
    c.participantIds.includes(buyerId) &&
    c.participantIds.includes(sellerId)
  );

  if (conversation) {
    return new Promise(resolve => setTimeout(() => resolve(conversation), 50));
  }

  // If not, create a new one
  const newConversation: Conversation = {
    id: `convo_${conversations.length + 1}`,
    listingId: listingId,
    participantIds: [buyerId, sellerId],
    messages: [],
    lastMessageAt: new Date().toISOString(),
  };

  conversations.push(newConversation);
  console.log('Created new conversation:', newConversation);

  return new Promise(resolve => setTimeout(() => resolve(newConversation), 50));
};

// Mock functions for mutations
export const markListingAsSold = (listingId: string): Promise<boolean> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const listingIndex = listings.findIndex(l => l.id === listingId);
      if (listingIndex !== -1) {
        listings[listingIndex].status = 'sold';
        console.log(`Listing ${listingId} marked as sold.`);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 100);
  });
};

export const deleteListingById = (listingId: string): Promise<boolean> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const initialLength = listings.length;
      listings = listings.filter(l => l.id !== listingId);
      if (listings.length < initialLength) {
        console.log(`Listing ${listingId} deleted.`);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 100);
  });
};

    