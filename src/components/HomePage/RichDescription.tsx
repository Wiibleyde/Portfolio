'use client';
import { Fragment } from 'react';

interface RichDescriptionProps {
    text: string;
    className?: string;
}

interface ParsedSegment {
    type: 'text' | 'link';
    content: string;
    url?: string;
}

/**
 * Component that parses and renders text with markdown-style links [text](url)
 * Example: "Check out [my repo](https://github.com/user/repo) for more info"
 */
export function RichDescription({ text, className = '' }: RichDescriptionProps) {
    const parseText = (input: string): ParsedSegment[] => {
        const segments: ParsedSegment[] = [];
        // Regex to match [text](url) pattern
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let lastIndex = 0;
        let match;

        while ((match = linkRegex.exec(input)) !== null) {
            // Add text before the link
            if (match.index > lastIndex) {
                segments.push({
                    type: 'text',
                    content: input.slice(lastIndex, match.index),
                });
            }

            // Add the link
            segments.push({
                type: 'link',
                content: match[1], // Text inside []
                url: match[2], // URL inside ()
            });

            lastIndex = match.index + match[0].length;
        }

        // Add remaining text after last link
        if (lastIndex < input.length) {
            segments.push({
                type: 'text',
                content: input.slice(lastIndex),
            });
        }

        return segments.length > 0 ? segments : [{ type: 'text', content: input }];
    };

    const segments = parseText(text);

    return (
        <span className={className}>
            {segments.map((segment, index) => (
                <Fragment key={index}>
                    {segment.type === 'text' ? (
                        segment.content
                    ) : (
                        <a
                            href={segment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 transition-colors duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {segment.content}
                        </a>
                    )}
                </Fragment>
            ))}
        </span>
    );
}
