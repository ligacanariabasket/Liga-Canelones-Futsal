"use server";

import { z } from "zod";
import {
  summarizeNewsArticle,
  type SummarizeNewsArticleOutput,
} from "@/ai/flows/summarize-news-article";

const SummarizeSchema = z.object({
  url: z.string().url(),
});

type SummarizeResult = SummarizeNewsArticleOutput | { error: string };

export async function summarizeArticleAction(
  values: z.infer<typeof SummarizeSchema>
): Promise<SummarizeResult> {
  const validatedFields = SummarizeSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid URL provided." };
  }

  try {
    const result = await summarizeNewsArticle({ url: validatedFields.data.url });
    return result;
  } catch (e) {
    console.error(e);
    return { error: "Failed to summarize the article." };
  }
}
