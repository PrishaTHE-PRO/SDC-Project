
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import type { UserProfile, Listing, PopulatedConversation, Message } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { SendHorizonal, ArrowLeft, X, Loader2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { User as FirebaseAuthUser } from 'firebase/auth';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { deleteConversationAction } from '@/lib/listings.actions';
import { useToast } from '@/hooks/use-toast';

interface ChatClientProps {
  currentUser: FirebaseAuthUser;
  conversations: PopulatedConversation[];
  onConversationDeleted: (conversationId: string) => void;
}

const ConversationItem = ({
  convo,
  onSelect,
  isSelected,
  currentUser,
  onDelete,
}: {
  convo: PopulatedConversation,
  onSelect: (id: string) => void,
  isSelected: boolean,
  currentUser: FirebaseAuthUser,
  onDelete: (id: string) => Promise<void>
}) => {
  const { firestore } = useFirestore();
  const [isDeleting, setIsDeleting] = useState(false);

  const messagesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'conversations', convo.id, 'messages'), orderBy('createdAt', 'asc'));
  }, [firestore, convo.id]);

  const { data: messages, isLoading } = useCollection<Message>(messagesQuery);
  
  const getInitials = (name = '') => {
    const names = name.split(' ');
    if (names.length > 1) return names[0][0] + names[names.length - 1][0];
    return name.substring(0, 2) || '?';
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    await onDelete(convo.id);
    // isDeleting will remain true as the component unmounts
  };

  return (
    <div className="relative">
      <button
        onClick={() => onSelect(convo.id)}
        className={cn(
          "flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/50",
          isSelected && 'bg-muted'
        )}
        disabled={isDeleting}
      >
        <Avatar className="h-12 w-12">
          <AvatarImage src={convo.otherParticipant?.avatarUrl} />
          <AvatarFallback>{getInitials(convo.otherParticipant?.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 overflow-hidden">
          <p className="font-semibold truncate">{convo.otherParticipant?.name}</p>
          <p className="text-sm text-muted-foreground truncate">{convo.listing?.title}</p>
        </div>
      </button>
      {!isLoading && messages?.length === 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-muted-foreground hover:text-destructive"
            onClick={handleDeleteClick}
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          </Button>
      )}
    </div>
  );
};


export function ChatClient({ currentUser, conversations, onConversationDeleted }: ChatClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedConvoId, setSelectedConvoId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { firestore, isLoading: isFirestoreLoading } = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    // On initial load, select a conversation based on URL or default to the most recent.
    const listingId = searchParams.get('listingId');
    if (listingId) {
      const convo = conversations.find(c => c.listing?.id === listingId);
      if (convo) {
        setSelectedConvoId(convo.id);
      }
    } else if (conversations.length > 0 && !selectedConvoId) {
       const sortedConversations = [...conversations].sort((a, b) => 
         new Date(b.lastMessageAt).getTime() - 
         new Date(a.lastMessageAt).getTime()
       );
       if (sortedConversations.length > 0) {
        setSelectedConvoId(sortedConversations[0].id);
       }
    }
  // We only want this effect to run once on initial load, so we have a limited dependency array.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations]);

  const selectedConvo = conversations.find(c => c.id === selectedConvoId);

  const messagesQuery = useMemo(() => {
    if (!firestore || !selectedConvoId) return null;
    return query(
      collection(firestore, 'conversations', selectedConvoId, 'messages'),
      orderBy('createdAt', 'asc')
    );
  }, [firestore, selectedConvoId]);

  const { data: messages, isLoading: isLoadingMessages } = useCollection(messagesQuery);

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // When a conversation is selected and the URL has params, clean it.
    if (selectedConvoId && searchParams.has('listingId')) {
      router.replace('/messages', { scroll: false });
    }
  }, [selectedConvoId, searchParams, router]);


  const getInitials = (name = '') => {
    const names = name.split(' ');
    if (names.length > 1) return names[0][0] + names[names.length - 1][0];
    return name.substring(0, 2) || '?';
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !firestore || !selectedConvoId) return;

    const messagesCol = collection(firestore, 'conversations', selectedConvoId, 'messages');
    await addDoc(messagesCol, {
      text: message,
      senderId: currentUser.uid,
      createdAt: serverTimestamp(),
    });

    const convoRef = doc(firestore, 'conversations', selectedConvoId);
    await updateDoc(convoRef, {
        lastMessageAt: serverTimestamp(),
    });

    setMessage('');
  };

  const handleSelectConversation = (convoId: string) => {
    setSelectedConvoId(convoId);
  }

  const handleDeleteConversation = async (conversationId: string) => {
    const result = await deleteConversationAction(conversationId);
    if (result.success) {
      toast({
        title: 'Conversation removed',
      });
      onConversationDeleted(conversationId);
      if (selectedConvoId === conversationId) {
        setSelectedConvoId(null);
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message || 'Could not remove conversation.',
      });
    }
  };


  const showConversationList = !isMobileView || (isMobileView && !selectedConvoId);
  const showChatView = !isMobileView || (isMobileView && selectedConvoId);

  return (
    <div className="flex h-full border-t">
      {showConversationList && (
        <div className={cn("w-full md:w-1/3 md:border-r", { 'flex-shrink-0': !isMobileView })}>
          <div className="p-4 border-b">
            <h2 className="font-headline text-2xl font-bold">Messages</h2>
          </div>
          <ScrollArea className="h-[calc(100%-65px)]">
            {conversations.map((convo) => (
              <ConversationItem
                key={convo.id}
                convo={convo}
                onSelect={handleSelectConversation}
                isSelected={selectedConvoId === convo.id}
                currentUser={currentUser}
                onDelete={handleDeleteConversation}
              />
            ))}
          </ScrollArea>
        </div>
      )}

      {showChatView && (
        <div className="flex flex-1 flex-col">
          {selectedConvo ? (
            <>
              <div className="flex items-center gap-4 border-b p-3">
                {isMobileView && (
                  <Button variant="ghost" size="icon" onClick={() => setSelectedConvoId(null)}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
                 <Avatar>
                  <AvatarImage src={selectedConvo.otherParticipant?.avatarUrl} />
                  <AvatarFallback>{getInitials(selectedConvo.otherParticipant?.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedConvo.otherParticipant?.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedConvo.listing?.title}</p>
                </div>
                {selectedConvo.listing?.images[0] && (
                  <div className="ml-auto h-12 w-12 relative rounded-md overflow-hidden hidden sm:block">
                     <Image src={selectedConvo.listing.images[0]} alt={selectedConvo.listing.title} fill className="object-cover"/>
                  </div>
                )}
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {isLoadingMessages ? <p>Loading messages...</p> : messages?.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex items-end gap-2",
                        msg.senderId === currentUser.uid ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {msg.senderId !== currentUser.uid && <Avatar className="h-8 w-8"><AvatarImage src={selectedConvo.otherParticipant?.avatarUrl} /><AvatarFallback>{getInitials(selectedConvo.otherParticipant?.name)}</AvatarFallback></Avatar>}
                      <div
                        className={cn(
                          "max-w-xs rounded-lg px-4 py-2 md:max-w-md",
                          msg.senderId === currentUser.uid
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {!isLoadingMessages && messages?.length === 0 && (
                     <div className="text-center text-sm text-muted-foreground py-8">
                       Start the conversation about "{selectedConvo.listing?.title}".
                     </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    autoComplete="off"
                    disabled={isFirestoreLoading}
                  />
                  <Button type="submit" size="icon" disabled={!message.trim() || isFirestoreLoading}>
                    <SendHorizonal className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="p-8">
                <h3 className="font-headline text-2xl font-bold">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the left to start chatting.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
