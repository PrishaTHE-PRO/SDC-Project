'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useFirebaseApp } from '@/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }).refine(email => email.endsWith('@wisc.edu'), {
    message: 'Please use your @wisc.edu email to sign in.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long.',
  }),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { app: firebaseApp, isLoading: isAppLoading } = useFirebaseApp();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (!firebaseApp) {
        toast({
          variant: 'destructive',
          title: 'An error occurred',
          description: 'Firebase is not available. Please try again later.',
        });
        setIsLoading(false);
        return;
    }
    
    try {
      const auth = getAuth(firebaseApp);
      await signInWithEmailAndPassword(auth, values.email, values.password);
      
      toast({
        title: 'Login Successful',
        description: "Welcome back!",
      });
      
      const from = searchParams.get('from') || '/';
      router.push(from);
      router.refresh(); // Forces a server-side rerender of the layout to get new user state

    } catch (error: any) {
       toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: error.message || 'An unknown error occurred.',
        });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wisc Email</FormLabel>
              <FormControl>
                <Input placeholder="your-net-id@wisc.edu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading || isAppLoading}>
           {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
           Sign In
        </Button>
      </form>
    </Form>
  );
}
