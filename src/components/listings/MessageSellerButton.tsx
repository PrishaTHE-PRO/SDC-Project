
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, MessageSquare } from 'lucide-react';

interface MessageSellerButtonProps {
  listingId: string;
  sellerId?: string;
  disabled?: boolean;
}

export default function MessageSellerButton({ listingId, sellerId, disabled }: MessageSellerButtonProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [canConfirm, setCanConfirm] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!isDialogOpen) {
      setCanConfirm(false);
      setCountdown(3);
      return;
    }

    const timer = setTimeout(() => {
      setCanConfirm(true);
    }, 3000);

    const countdownInterval = setInterval(() => {
        setCountdown(prev => (prev > 1 ? prev - 1 : 1));
    }, 1000);


    return () => {
        clearTimeout(timer)
        clearInterval(countdownInterval)
    };
  }, [isDialogOpen]);

  const handleContinue = () => {
    setIsDialogOpen(false);
    if (sellerId) {
      router.push(`/messages?listingId=${listingId}&sellerId=${sellerId}`);
    }
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button size="lg" className="w-full" disabled={disabled}>
          <MessageSquare className="mr-2 h-5 w-5" /> Message Seller
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex flex-col items-center text-center">
            <AlertTriangle className="h-16 w-16 text-yellow-400 mb-4" />
            <AlertDialogTitle className="font-bold text-2xl">Scam Warning</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-center text-base py-4">
            Watch out for scams. Do not send payment until you have received the item.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handleContinue}
            disabled={!canConfirm}
            className="w-full"
          >
            {canConfirm ? 'OK' : `OK (${countdown})`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
