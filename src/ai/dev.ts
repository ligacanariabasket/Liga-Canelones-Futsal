import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-news-article.ts';
import '@/ai/flows/summarize-futsal-news.ts';
import '@/ai/flows/generate-season-flow';
import '@/ai/flows/generate-blog-post-flow';
import '@/ai/flows/generate-match-chronicle-flow';
