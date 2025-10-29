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
