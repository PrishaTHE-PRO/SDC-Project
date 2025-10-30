'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';


export default function ProfilePage() {
  const { user: authUser, isLoading: isAuthLoading } = useUser();
  const router = useRouter();
  const { firestore, isLoading: isFirestoreLoading } = useFirestore();

  const userProfileRef = useMemo(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, 'users', authUser.uid);
  }, [firestore, authUser]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  useEffect(() => {
    if (!isAuthLoading && !authUser) {
      router.push('/login?from=/profile');
    }
  }, [isAuthLoading, authUser, router]);

  const isLoading = isAuthLoading || isFirestoreLoading || isProfileLoading;
  const user = userProfile;

  if (isLoading || !user) {
    return (
      <div className="container mx-auto max-w-2xl py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-64 mt-2" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Separator className="my-4" />
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-5 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.substring(0, 2);
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-bold">{user.name}</CardTitle>
              <CardDescription className="text-lg">{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-4" />
          <h3 className="text-xl font-semibold mb-2">My Information</h3>
          <p>This is where user profile information would go.</p>
        </CardContent>
      </Card>
    </div>
  );
}
