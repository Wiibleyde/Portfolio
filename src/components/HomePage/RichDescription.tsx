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
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let lastIndex = 0;
        let match = linkRegex.exec(input);

        while (match !== null) {
            if (match.index > lastIndex) {
                segments.push({
                    type: 'text',
                    content: input.slice(lastIndex, match.index),
                });
            }

            segments.push({
                type: 'link',
                content: match[1],
                url: match[2],
            });

            lastIndex = match.index + match[0].length;
            match = linkRegex.exec(input);
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
                <Fragment key={`${segment.type}-${segment.content.slice(0, 20)}-${index}`}>
                    {segment.type === 'text' ? (
                        segment.content
                    ) : (
                        <a
                            href={segment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline decoration-blue-400/50 transition-colors duration-200 hover:text-blue-300 hover:decoration-blue-300"
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
