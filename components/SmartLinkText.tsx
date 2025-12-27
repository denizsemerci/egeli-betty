'use client'

import React from 'react'

interface SmartLinkTextProps {
  text: string
}

/**
 * SmartLinkText component that automatically converts keywords like "zeytin" and "zeytinyağı"
 * into clickable links to the e-commerce site.
 */
export default function SmartLinkText({ text }: SmartLinkTextProps) {
  const shopUrl = 'https://shop.semercioglu.com/?utm_source=egelibetty&utm_medium=referral&utm_campaign=recipe_link'

  // Function to create link element
  const createLink = (matchedText: string, index: number) => {
    return (
      <a
        key={`link-${index}`}
        href={shopUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:text-primary-dark underline transition-colors font-medium"
      >
        {matchedText}
      </a>
    )
  }

  // Process text and convert keywords to links
  const processText = (inputText: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = []
    const matches: Array<{ start: number; end: number; text: string }> = []

    // First, find all "zeytinyağı" matches (longer word first)
    const zeytinyagiRegex = /zeytinyağı/gi
    let match
    zeytinyagiRegex.lastIndex = 0

    while ((match = zeytinyagiRegex.exec(inputText)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
      })
    }

    // Then, find all "zeytin" matches that don't overlap with "zeytinyağı"
    const zeytinRegex = /zeytin/gi
    zeytinRegex.lastIndex = 0

    while ((match = zeytinRegex.exec(inputText)) !== null) {
      const matchStart = match.index
      const matchEnd = match.index + match[0].length

      // Check if this match overlaps with any existing "zeytinyağı" match
      const overlaps = matches.some(
        (existing) =>
          (matchStart >= existing.start && matchStart < existing.end) ||
          (matchEnd > existing.start && matchEnd <= existing.end) ||
          (matchStart <= existing.start && matchEnd >= existing.end)
      )

      if (!overlaps) {
        matches.push({
          start: matchStart,
          end: matchEnd,
          text: match[0],
        })
      }
    }

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start)

    // Build the result array
    let lastIndex = 0
    let keyIndex = 0

    matches.forEach((match) => {
      // Add text before the match
      if (match.start > lastIndex) {
        parts.push(inputText.substring(lastIndex, match.start))
      }

      // Add the link
      parts.push(createLink(match.text, keyIndex++))
      lastIndex = match.end
    })

    // Add remaining text after the last match
    if (lastIndex < inputText.length) {
      parts.push(inputText.substring(lastIndex))
    }

    // If no matches found, return the original text
    if (parts.length === 0) {
      return [inputText]
    }

    return parts
  }

  const processedContent = processText(text)

  return <>{processedContent}</>
}
