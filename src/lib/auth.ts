import 'server-only';
import { getUserById, type User } from './data';
import { cookies } from 'next/headers';

// In a real app, this would involve session management, JWTs, etc.
// For this mock, we'll use a simple cookie.
const MOCK_AUTH_COOKIE = 'mock_auth_user_id';

export async function getAuthenticatedUser(): Promise<User | null> {
  const cookieStore = cookies();
  const userId = cookieStore.get(MOCK_AUTH_COOKIE)?.value;

  if (!userId) {
    // To make the demo more interesting, let's log in user_1 by default.
    // In a real app, you'd return null here.
    return await getUserById('user_1');
  }
  
  const user = await getUserById(userId);
  return user || null;
}

export async function signInAction(email: string): Promise<{ success: boolean; message: string }> {
  // Mock sign-in logic
  if (!email.endsWith('@wisc.edu')) {
    return { success: false, message: 'Must use a valid @wisc.edu email.' };
  }

  // Find a user with this email, or default to user_1 for demo purposes
  const userIdToSignIn = email === 'bucky@wisc.edu' ? 'user_1' : 'user_2'; 

  cookies().set(MOCK_AUTH_COOKIE, userIdToSignIn, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
  
  return { success: true, message: 'Signed in successfully!' };
}

export async function signOutAction(): Promise<void> {
  cookies().delete(MOCK_AUTH_COOKIE);
}
