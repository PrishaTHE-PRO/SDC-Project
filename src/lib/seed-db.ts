
import { initializeFirebase } from '../firebase/index';
import { collection, writeBatch } from 'firebase/firestore';
import placeholderImages from './placeholder-images.json';

const { firestore } = initializeFirebase();

const sampleUsers = [
  {
    id: 'user_bucky',
    name: 'Bucky Badger',
    email: 'bucky@wisc.edu',
    avatarUrl: placeholderImages.placeholderImages.find(p => p.id === 'user_bucky')?.imageUrl,
    preferredCategories: ['sports', 'dorm', 'textbooks'],
    viewedTags: [],
  },
  {
    id: 'user_jane',
    name: 'Jane Doe',
    email: 'jane.doe@wisc.edu',
    avatarUrl: placeholderImages.placeholderImages.find(p => p.id === 'user_jane')?.imageUrl,
    preferredCategories: ['electronics', 'furniture', 'clothing'],
    viewedTags: [],
  },
  {
    id: 'user_mike',
    name: 'Mike Smith',
    email: 'mike.smith@wisc.edu',
    avatarUrl: placeholderImages.placeholderImages.find(p => p.id === 'user_mike')?.imageUrl,
    preferredCategories: ['bikes', 'music', 'computers'],
    viewedTags: [],
  },
];

const sampleListings = [
  {
    id: 'listing_01',
    title: 'Intro to CS Textbook (CS 200)',
    description: 'Barely used textbook for CS 200. No highlighting or writing. Perfect condition.',
    price: 45,
    tags: ['textbooks', 'academics', 'cs'],
    images: [placeholderImages.placeholderImages.find(p => p.id === 'img_textbook_1')?.imageUrl],
    sellerId: 'user_jane',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    condition: 'like-new',
    views: 120,
    lastViewedAt: new Date().toISOString(),
  },
  {
    id: 'listing_02',
    title: 'Road Bike - Great for Campus',
    description: 'Reliable road bike, perfect for getting around campus quickly. Recently tuned up.',
    price: 150,
    tags: ['bikes', 'transportation', 'sports'],
    images: [placeholderImages.placeholderImages.find(p => p.id === 'img_bike_1')?.imageUrl],
    sellerId: 'user_mike',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    condition: 'good',
    views: 250,
    lastViewedAt: new Date().toISOString(),
  },
  {
    id: 'listing_03',
    title: 'Mini-Fridge for Dorm Room',
    description: 'Compact mini-fridge, ideal for a dorm room or apartment. Works great, very clean.',
    price: 75,
    tags: ['dorm', 'appliances', 'furniture'],
    images: [placeholderImages.placeholderImages.find(p => p.id === 'img_minifridge_1')?.imageUrl],
    sellerId: 'user_bucky',
    createdAt: new Date().toISOString(),
    status: 'active',
    condition: 'excellent',
    views: 50,
    lastViewedAt: new Date().toISOString(),
  },
  {
    id: 'listing_04',
    title: 'Modern Desk Lamp',
    description: 'Sleek and modern LED desk lamp with adjustable brightness. Great for late-night study sessions.',
    price: 25,
    tags: ['dorm', 'decor', 'electronics'],
    images: [placeholderImages.placeholderImages.find(p => p.id === 'img_lamp_1')?.imageUrl],
    sellerId: 'user_jane',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    condition: 'like-new',
    views: 88,
    lastViewedAt: new Date().toISOString(),
  },
  {
    id: 'listing_05',
    title: 'Comfy Sofa for Living Room',
    description: 'A very comfortable three-seater sofa. Comes from a pet-free, smoke-free home. You must be able to pick it up.',
    price: 250,
    tags: ['furniture', 'living room', 'apartment'],
    images: [placeholderImages.placeholderImages.find(p => p.id === 'img_couch_1')?.imageUrl],
    sellerId: 'user_mike',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    condition: 'good',
    views: 310,
    lastViewedAt: new Date().toISOString(),
  },
  {
    id: 'listing_06',
    title: 'Kitchen Microwave',
    description: 'Standard kitchen microwave, works perfectly. Simple and reliable.',
    price: 40,
    tags: ['kitchen', 'appliances', 'apartment'],
    images: [placeholderImages.placeholderImages.find(p => p.id === 'img_microwave_1')?.imageUrl],
    sellerId: 'user_bucky',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'sold',
    condition: 'fair',
    views: 150,
    lastViewedAt: new Date().toISOString(),
  },
  {
    id: 'listing_07',
    title: '24-inch Computer Monitor',
    description: '1080p Full HD monitor. Great as a second screen for your laptop. HDMI and DisplayPort inputs.',
    price: 100,
    tags: ['electronics', 'computers', 'office'],
    images: [placeholderImages.placeholderImages.find(p => p.id === 'img_monitor_1')?.imageUrl],
    sellerId: 'user_jane',
     createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    condition: 'excellent',
    views: 190,
    lastViewedAt: new Date().toISOString(),
  },
   {
    id: 'listing_08',
    title: 'Ergonomic Office Chair',
    description: 'Supportive office chair with lumbar support and adjustable armrests. A must-have for long study hours.',
    price: 90,
    tags: ['furniture', 'office', 'dorm'],
    images: [placeholderImages.placeholderImages.find(p => p.id === 'img_chair_1')?.imageUrl],
    sellerId: 'user_mike',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    condition: 'good',
    views: 130,
    lastViewedAt: new Date().toISOString(),
  },
   {
    id: 'listing_09',
    title: 'Portable Bluetooth Speaker',
    description: 'Loud and clear portable speaker with great battery life. Connects easily to any device.',
    price: 35,
    tags: ['electronics', 'music', 'audio'],
    images: [placeholderImages.placeholderImages.find(p => p.id === 'img_speaker_1')?.imageUrl],
    sellerId: 'user_bucky',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    condition: 'excellent',
    views: 220,
    lastViewedAt: new Date().toISOString(),
  },
  {
    id: 'listing_10',
    title: 'Acoustic Guitar with Case',
    description: 'Beginner acoustic guitar in great shape. Includes a soft case and some extra picks.',
    price: 120,
    tags: ['music', 'hobby', 'instruments'],
    images: [placeholderImages.placeholderImages.find(p => p.id === 'img_guitar_1')?.imageUrl],
    sellerId: 'user_jane',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'sold',
    condition: 'good',
    views: 400,
    lastViewedAt: new Date().toISOString(),
  },
   {
    id: 'listing_11',
    title: 'North Face Winter Jacket',
    description: 'Men\'s medium North Face jacket. Very warm, perfect for Wisconsin winters. No tears or stains.',
    price: 110,
    tags: ['clothing', 'winter'],
    images: [placeholderImages.placeholderImages.find(p => p.id === 'img_winter_jacket_1')?.imageUrl],
    sellerId: 'user_mike',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    condition: 'excellent',
    views: 280,
    lastViewedAt: new Date().toISOString(),
  },
   {
    id: 'listing_12',
    title: '42-inch Smart TV',
    description: 'Great condition smart TV with built-in apps like Netflix and Hulu. Comes with remote.',
    price: 180,
    tags: ['electronics', 'living room', 'entertainment'],
    images: [placeholderImages.placeholderImages.find(p => p.id === 'img_tv_1')?.imageUrl],
    sellerId: 'user_bucky',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    condition: 'like-new',
    views: 175,
    lastViewedAt: new Date().toISOString(),
  },
];


async function seedDatabase() {
  console.log('Starting to seed database...');

  try {
    const batch = writeBatch(firestore);

    // Add users
    const usersCollection = collection(firestore, 'users');
    sampleUsers.forEach(user => {
      const { id, ...userData } = user;
      const docRef = collection(usersCollection).doc(id);
      batch.set(docRef, userData);
    });
    console.log(`Prepared ${sampleUsers.length} users for batch write.`);

    // Add listings
    const listingsCollection = collection(firestore, 'listings');
    sampleListings.forEach(listing => {
      const { id, ...listingData } = listing;
      const docRef = collection(listingsCollection).doc(id);
      batch.set(docRef, listingData);
    });
    console.log(`Prepared ${sampleListings.length} listings for batch write.`);

    // Commit the batch
    await batch.commit();
    console.log('Database seeded successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();
