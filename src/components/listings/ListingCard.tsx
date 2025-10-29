import Image from 'next/image';
import Link from 'next/link';
import type { Listing } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { placeholderImages } from '@/lib/placeholder-images.json';

interface ListingCardProps {
  listing: Listing;
}

function getHint(imageUrl: string): string {
  const image = placeholderImages.find(img => img.imageUrl === imageUrl);
  return image?.imageHint || "listing image";
}

export default function ListingCard({ listing }: ListingCardProps) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300 ease-in-out">
      <Link href={`/listings/${listing.id}`} className="block">
        <CardHeader className="p-0">
          <div className="aspect-square relative">
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              data-ai-hint={getHint(listing.images[0])}
            />
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <CardTitle className="mb-1 text-base font-headline font-semibold leading-tight tracking-tight truncate">
            {listing.title}
          </CardTitle>
          <p className="text-lg font-bold text-primary">
            {formatter.format(listing.price)}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
