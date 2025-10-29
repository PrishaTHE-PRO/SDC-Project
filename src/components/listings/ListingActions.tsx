
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { markAsSoldAction, deleteListingAction } from '@/lib/listings.actions';
import { Loader2, CheckCircle, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface ListingActionsProps {
  listingId: string;
  isSold: boolean;
}

export default function ListingActions({ listingId, isSold }: ListingActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isMarkingSold, setIsMarkingSold] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMarkAsSold = async () => {
    setIsMarkingSold(true);
    const result = await markAsSoldAction(listingId);
    if (result.success) {
      toast({
        title: 'Success!',
        description: 'Your listing has been marked as sold.',
      });
      router.refresh();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message || 'Could not mark listing as sold.',
      });
    }
    setIsMarkingSold(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteListingAction(listingId);
     if (result.success) {
      toast({
        title: 'Listing Deleted',
        description: 'Your listing has been successfully removed.',
      });
      router.push('/my-listings');
      router.refresh();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message || 'Could not delete listing.',
      });
      setIsDeleting(false);
    }
  };

  if (isSold) {
    return (
        <Button size="lg" className="w-full" disabled>
            <CheckCircle className="mr-2 h-5 w-5" /> Sold
        </Button>
    )
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <Button size="lg" className="w-full" onClick={handleMarkAsSold} disabled={isMarkingSold || isDeleting}>
        {isMarkingSold ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5" />}
        Mark as Sold
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="lg" variant="destructive" className="w-full" disabled={isDeleting || isMarkingSold}>
            {isDeleting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Trash2 className="mr-2 h-5 w-5" />}
            Delete Listing
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              listing and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
