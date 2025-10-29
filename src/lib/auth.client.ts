'use client';
import { signInAction, signOutAction } from './auth.server';

// These are client-side wrappers for our server actions.
// This allows us to call them from client components.

export async function signIn(email: string) {
    return await signInAction(email);
}

export async function signOut() {
    await signOutAction();
}
