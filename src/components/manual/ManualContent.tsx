'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

type ManualContentProps = {
  content: string;
  className?: string;
};

export function ManualContent({ content, className }: ManualContentProps) {
  return (
    <div
      className={cn(
        'prose dark:prose-invert max-w-none',
        'prose-headings:font-orbitron prose-headings:text-primary',
        'prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl',
        'prose-p:text-base prose-p:leading-relaxed',
        'prose-a:text-primary hover:prose-a:underline',
        'prose-ul:list-disc prose-ul:pl-6',
        'prose-ol:list-decimal prose-ol:pl-6',
        'prose-li:mb-2',
        'prose-strong:font-bold',
        'prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic',
        className
      )}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
