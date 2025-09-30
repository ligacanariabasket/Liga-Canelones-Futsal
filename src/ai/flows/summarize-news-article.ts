// Summarize the news article at a given URL.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {extractNewsArticle} from '@/services/news-extraction-service';

const SummarizeNewsArticleInputSchema = z.object({
  url: z.string().url().describe('The URL of the news article to summarize.'),
});
export type SummarizeNewsArticleInput = z.infer<typeof SummarizeNewsArticleInputSchema>;

const SummarizeNewsArticleOutputSchema = z.object({
  summary: z.string().describe('The summarized version of the news article.'),
});
export type SummarizeNewsArticleOutput = z.infer<typeof SummarizeNewsArticleOutputSchema>;

export async function summarizeNewsArticle(input: SummarizeNewsArticleInput): Promise<SummarizeNewsArticleOutput> {
  return summarizeNewsArticleFlow(input);
}

const summarizeNewsArticlePrompt = ai.definePrompt({
  name: 'summarizeNewsArticlePrompt',
  input: {schema: SummarizeNewsArticleInputSchema},
  output: {schema: SummarizeNewsArticleOutputSchema},
  prompt: `You are an expert news summarizer.  You will be given the content of a news article and you will summarize it into a few sentences.

News Article Content:
{{{articleContent}}}
`,
});

const summarizeNewsArticleFlow = ai.defineFlow(
  {
    name: 'summarizeNewsArticleFlow',
    inputSchema: SummarizeNewsArticleInputSchema,
    outputSchema: SummarizeNewsArticleOutputSchema,
  },
  async input => {
    const articleContent = await extractNewsArticle(input.url);
    const {output} = await summarizeNewsArticlePrompt({articleContent, url: input.url});
    return output!;
  }
);
