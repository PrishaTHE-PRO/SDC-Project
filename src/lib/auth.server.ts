'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const MOCK_AUTH_COOKIE = 'mock_auth_user_id';

export async function signInAction(email: string): Promise<{ success: boolean; message: string }> {
  // Mock sign-in logic
  if (!email.endsWith('@wisc.edu')) {
    return { success: false, message: 'Must use a valid @wisc.edu email.' };
  }

  // Find a user with this email, or default to user_1 for demo purposes
  // A real implementation would query a database.
  const userIdToSignIn = email === 'bucky@wisc.edu' ? 'user_1' : 'user_2'; 

  cookies().set(MOCK_AUTH_COOKIE, userIdToSignIn, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
  
  revalidatePath('/', 'layout');
  return { success: true, message: 'Signed in successfully!' };
}

export async function signOutAction(): Promise<void> {
  cookies().delete(MOCK_AUTH_COOKIE);
  revalidatePath('/', 'layout');
}
