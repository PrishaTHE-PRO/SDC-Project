
import Image from 'next/image';
import Link from 'next/link';
import type { ListingWithSeller } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { useMemo } from 'react';

interface ListingCardProps {
  listing: ListingWithSeller;
}

function getHint(imageUrl: string): string {
  const image = placeholderImages.find(img => img.imageUrl === imageUrl);
  return image?.imageHint || "listing image";
}

const getInitials = (name = '') => {
  const names = name.split(' ');
  if (names.length > 1) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
  if (name.length > 0) {
    return name.substring(0, 2).toUpperCase();
  }
  return '??';
};

export default function ListingCard({ listing }: ListingCardProps) {
  const { firestore } = useFirestore();
  const isSold = listing.status === 'sold';
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  const sellerRef = useMemo(() => {
    if (!firestore || !listing.sellerId) return null;
    return doc(firestore, 'users', listing.sellerId);
  }, [firestore, listing.sellerId]);

  const { data: seller } = useDoc<UserProfile>(sellerRef);


  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300 ease-in-out flex flex-col",
      isSold && "opacity-60 hover:opacity-80"
    )}>
      <Link href={`/listings/${listing.id}`} className="block">
        <div className="aspect-square relative">
           {isSold && (
            <Badge variant="destructive" className="absolute top-2 left-2 z-10">SOLD</Badge>
          )}
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            data-ai-hint={getHint(listing.images[0])}
          />
        </div>
      </Link>
      <CardContent className="p-3 flex flex-col flex-1">
        <div className="flex-1">
          <Link href={`/listings/${listing.id}`}>
            <h3 className="font-semibold leading-tight tracking-tight truncate hover:underline">
              {listing.title}
            </h3>
          </Link>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-bold text-primary">
            {formatter.format(listing.price)}
          </p>
          {seller && (
             <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground truncate">{seller.name}</span>
              <Avatar className="h-6 w-6">
                <AvatarImage src={seller.avatarUrl} alt={seller.name} />
                <AvatarFallback>{getInitials(seller.name)}</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
