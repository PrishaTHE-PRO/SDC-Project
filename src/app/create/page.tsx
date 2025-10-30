'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import CreateListingForm from '@/components/listings/CreateListingForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CreateListingPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?from=/create');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
       <div className="container mx-auto max-w-2xl py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-5 w-full mt-2" />
            <Skeleton className="h-5 w-full mt-2" />
          </CardHeader>
          <CardContent>
             <div className="space-y-8">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-10 w-full" />
                <div className="grid grid-cols-2 gap-8">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <Skeleton className="h-24 w-full" />
             </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl font-bold">Create a new listing</CardTitle>
          <CardDescription>
            Fill out the details below to sell your item on BadgerExchange.
          </CardDescription>
          <CardDescription className="pt-2 text-foreground/80">
            Please take quality photos of your product and{' '}
            <span className="font-semibold">
              make sure that you are able to bring the product to the UW-Madison campus.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateListingForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
