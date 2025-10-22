import Image from 'next/image';
import Link from 'next/link';
import type { ListingWithSeller } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MessageSquare, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FeedListingCardProps {
  listing: ListingWithSeller;
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

export default function FeedListingCard({ listing }: FeedListingCardProps) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  const timeAgo = listing.createdAt ? formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true }) : '';

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
        {listing.seller ? (
          <Avatar className="h-10 w-10">
            <AvatarImage src={listing.seller.avatarUrl} alt={listing.seller.name} />
            <AvatarFallback>{getInitials(listing.seller.name)}</AvatarFallback>
          </Avatar>
        ) : <div className="h-10 w-10 rounded-full bg-muted" />}
        <div className="flex-1">
          <p className="font-semibold">{listing.seller?.name || 'Anonymous'}</p>
          <p className="text-sm text-muted-foreground">{timeAgo}</p>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-5 w-5" />
                    <span className="sr-only">More options</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>View Profile</DropdownMenuItem>
                <DropdownMenuItem>Report Listing</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="px-4 pb-4 space-y-2">
            <Link href={`/listings/${listing.id}`}>
              <CardTitle className="text-xl font-headline font-bold leading-tight tracking-tight hover:underline">
                {listing.title}
              </CardTitle>
            </Link>
            <p className="text-2xl font-bold text-primary">
                {formatter.format(listing.price)}
            </p>
        </div>

        {listing.images.length > 0 && (
          <Carousel className="w-full bg-muted">
            <CarouselContent>
              {listing.images.map((img, index) => (
                <CarouselItem key={index}>
                  <Link href={`/listings/${listing.id}`} className="block">
                    <div className="aspect-video relative">
                      <Image
                        src={img}
                        alt={`${listing.title} - image ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            {listing.images.length > 1 && (
              <>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </>
            )}
          </Carousel>
        )}
        
        <div className="p-4 space-y-4">
          <p className="text-foreground/80 leading-relaxed line-clamp-3">
              {listing.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {listing.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="capitalize">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 border-t">
        <Button asChild className="w-full" size="lg">
            <Link href={listing.seller ? `/messages?listingId=${listing.id}&sellerId=${listing.seller.id}` : '#'}>
                <MessageSquare /> Message Seller
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
