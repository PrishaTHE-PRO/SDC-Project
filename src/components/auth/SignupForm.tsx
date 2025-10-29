
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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const categories = [
  "textbooks", "electronics", "furniture", "academics",
  "cs", "bikes", "transportation", "sports",
  "dorm", "appliances", "decor", "living room",
  "apartment", "kitchen", "computers", "office",
  "music", "audio", "hobby", "instruments",
  "clothing", "winter"
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }).refine(email => email.endsWith('@wisc.edu'), {
    message: 'You must use a valid @wisc.edu email address to sign up.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long.',
  }),
  confirmPassword: z.string(),
  preferredCategories: z.array(z.string()).refine(value => value.length > 0, {
    message: 'Please select at least one category.',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ['confirmPassword'],
});

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      preferredCategories: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Mock signup logic
    console.log("New user signup:", {
      name: values.name,
      email: values.email,
      preferredCategories: values.preferredCategories
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Account Created!',
      description: "We've sent a verification link to your email.",
    });

    router.push('/login');
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Bucky Badger" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preferredCategories"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Tell us what you're interested in</FormLabel>
                <FormDescription>
                  Select a few categories to personalize your feed.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="preferredCategories"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {item}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
           {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
           Create Account
        </Button>
      </form>
    </Form>
  );
}
