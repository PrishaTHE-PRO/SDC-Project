import Image from 'next/image';
import Link from 'next/link';
import type { Listing } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
          <div className="aspect-video relative">
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={getHint(listing.images[0])}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="mb-2 text-lg font-headline font-bold leading-tight tracking-tight truncate">
            {listing.title}
          </CardTitle>
          <p className="text-2xl font-semibold text-primary">
            {formatter.format(listing.price)}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <div className="flex flex-wrap gap-2">
          {listing.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="capitalize">
              {tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
