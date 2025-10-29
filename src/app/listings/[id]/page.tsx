
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getListingById, getUserById } from '@/lib/data';
import { getAuthenticatedUser } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import ListingActions from '@/components/listings/ListingActions';
import { MessageSquare, Tag } from 'lucide-react';
import Link from 'next/link';

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await getListingById(params.id);

  if (!listing) {
    notFound();
  }
  
  const currentUser = await getAuthenticatedUser();
  const isSeller = currentUser?.id === listing.sellerId;

  const seller = await getUserById(listing.sellerId);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.substring(0, 2);
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
              {isSeller ? (
                <ListingActions listingId={listing.id} isSold={listing.status === 'sold'} />
              ) : (
                <Button asChild size="lg" className="w-full" disabled={listing.status === 'sold'}>
                  <Link href={`/messages?listingId=${listing.id}&sellerId=${seller?.id}`}>
                    <MessageSquare className="mr-2 h-5 w-5" /> Message Seller
                  </Link>
                </Button>
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
