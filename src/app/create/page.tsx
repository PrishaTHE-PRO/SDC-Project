import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import CreateListingForm from '@/components/listings/CreateListingForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function CreateListingPage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect('/login?from=/create');
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl font-bold">Create a new listing</CardTitle>
          <CardDescription>
            Fill out the details below to sell your item on BadgerExchange.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateListingForm />
        </CardContent>
      </Card>
    </div>
  );
}
