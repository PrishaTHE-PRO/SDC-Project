import 'server-only';
import { getUserById } from './data';
import { cookies } from 'next/headers';
import { unstable_noStore as noStore } from 'next/cache';

// In a real app, this would involve session management, JWTs, etc.
// For this mock, we'll use a simple cookie.
const MOCK_AUTH_COOKIE = 'mock_auth_user_id';

export async function getAuthenticatedUser() {
  // Opt out of caching to ensure we always get the latest cookie.
  noStore();
  
  const cookieStore = cookies();
  const userId = cookieStore.get(MOCK_AUTH_COOKIE)?.value;

  if (!userId) {
    return null;
  }
  
  const user = await getUserById(userId);
  return user || null;
}
