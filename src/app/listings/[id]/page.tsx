'use client';

import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import ListingActions from '@/components/listings/ListingActions';
import { Tag } from 'lucide-react';
import MessageSellerButton from '@/components/listings/MessageSellerButton';
import { useEffect, useState, useMemo } from 'react';
import type { Listing, UserProfile } from '@/lib/types';
import { useDoc, useFirestore, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const listingId = params.id;

  const listingRef = useMemo(() => {
    if (!firestore || !listingId) return null;
    return doc(firestore, 'listings', listingId);
  }, [firestore, listingId]);

  const { data: listing, isLoading: isListingLoading } = useDoc<Listing>(listingRef);

  const sellerRef = useMemo(() => {
    if (!firestore || !listing?.sellerId) return null;
    return doc(firestore, 'users', listing.sellerId);
  }, [firestore, listing]);

  const { data: seller, isLoading: isSellerLoading } = useDoc<UserProfile>(sellerRef);

  useEffect(() => {
    if (!isListingLoading && !listing) {
      notFound();
    }
  }, [isListingLoading, listing]);

  if (isListingLoading || isSellerLoading || !listing) {
    // You can add a loading skeleton here
    return <div className="container mx-auto max-w-6xl p-4 py-8 md:p-8">Loading...</div>;
  }

  const isSeller = currentUser?.uid === listing.sellerId;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const getInitials = (name?: string) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.substring(0, 2);
  };

  const handleMessageSeller = () => {
    if (seller) {
      router.push(`/messages?listingId=${listing.id}&sellerId=${seller.id}`);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl p-4 py-8 md:p-8">
       {listing.status === 'sold' && (
        <div className="mb-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4 text-yellow-800">
          <p className="font-semibold">This item has been sold.</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Carousel className="w-full overflow-hidden rounded-lg border">
            <CarouselContent>
              {listing.images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-video relative bg-muted">
                    <Image
                      src={img}
                      alt={`${listing.title} - image ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        <div className="flex flex-col space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl font-bold tracking-tighter">
                {listing.title}
              </CardTitle>
              <p className="text-4xl font-bold text-primary">
                {formatter.format(listing.price)}
              </p>
            </CardHeader>
            <CardContent>
              {currentUser && isSeller ? (
                <ListingActions listingId={listing.id} isSold={listing.status === 'sold'} />
              ) : (
                <MessageSellerButton 
                  onClick={handleMessageSeller}
                  disabled={listing.status === 'sold' || !currentUser}
                />
              )}
            </CardContent>
          </Card>
          
          {seller && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About the Seller</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-4">
                 <Avatar className="h-16 w-16">
                    <AvatarImage src={seller.avatarUrl} alt={seller.name} />
                    <AvatarFallback>{getInitials(seller.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{seller.name}</p>
                    <p className="text-sm text-muted-foreground">{seller.email}</p>
                  </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Separator className="my-8" />

      <div>
        <h2 className="mb-4 font-headline text-2xl font-bold">Description</h2>
        <p className="text-foreground/80 leading-relaxed">{listing.description}</p>
        
        <div className="mt-6 flex items-center gap-4">
           <Tag className="h-5 w-5 text-muted-foreground" />
           <div className="flex flex-wrap gap-2">
              {listing.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm capitalize">
                  {tag}
                </Badge>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}
