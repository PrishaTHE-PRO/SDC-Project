'use server';

/**
 * @fileOverview Generates a personalized listing feed based on user interactions and message history.
 *
 * - generatePersonalizedFeed - A function that generates a personalized listing feed.
 * - PersonalizedFeedInput - The input type for the generatePersonalizedFeed function.
 * - PersonalizedFeedOutput - The return type for the generatePersonalizedFeed function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedFeedInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
  listingTags: z.array(z.string()).describe('Tags associated with each listing'),
  userHistory: z.array(z.string()).describe('The user history of the tags user has looked at'),
  currentListings: z.array(z.string()).describe('The current listings available'),
});
export type PersonalizedFeedInput = z.infer<typeof PersonalizedFeedInputSchema>;

const PersonalizedFeedOutputSchema = z.object({
  recommendedListings: z.array(z.string()).describe('An array of listing ids recommended for the user.'),
});
export type PersonalizedFeedOutput = z.infer<typeof PersonalizedFeedOutputSchema>;

export async function getRecommendations(
  input: PersonalizedFeedInput
): Promise<PersonalizedFeedOutput> {
  return personalizedListingFeedFlow(input);
}

const personalizedListingFeedPrompt = ai.definePrompt({
  name: 'personalizedListingFeedPrompt',
  input: {schema: PersonalizedFeedInputSchema},
  output: {schema: PersonalizedFeedOutputSchema},
  prompt: `You are an expert recommendation system.

  Based on the user's ID, their listing tags, and their user history, you will generate a personalized listing feed.

  User ID: {{{userId}}}
  Listing Tags: {{{listingTags}}}
  User History: {{{userHistory}}}
  Current Listings: {{{currentListings}}}

  Return only listing IDs that the user would be interested in based on tags they have interacted with in the past.
  Make sure that the response is only listing IDs, no other text.
  Return an array of listing ids recommended for the user. Do not include any listings that the user has already seen.
`, 
});

const personalizedListingFeedFlow = ai.defineFlow(
  {
    name: 'personalizedListingFeedFlow',
    inputSchema: PersonalizedFeedInputSchema,
    outputSchema: PersonalizedFeedOutputSchema,
  },
  async input => {
    const {output} = await personalizedListingFeedPrompt(input);
    return output!;
  }
);

export type {PersonalizedFeedInput, PersonalizedFeedOutput};
