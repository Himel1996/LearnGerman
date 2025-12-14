/**
 * Segments German text into separate sentences.
 * Handles abbreviations, decimal numbers, and quotes.
 */
export function segmentSentences(text: string): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Remove extra whitespace
  const cleaned = text.trim().replace(/\s+/g, ' ');

  // Common German abbreviations that shouldn't end a sentence
  const abbreviations = [
    'z.B.', 'd.h.', 'u.a.', 'u.U.', 'vgl.', 'usw.', 'etc.', 'bzw.', 'evtl.',
    'ca.', 'ggf.', 'inkl.', 'exkl.', 'max.', 'min.', 'Prof.', 'Dr.', 'etc.',
    'bzw', 'u.a', 'u.U', 'z.B', 'd.h'
  ];

  // Pattern to match sentence endings: . ! ? followed by space and capital letter or end of string
  // But exclude decimal numbers and abbreviations
  const sentences: string[] = [];
  let currentSentence = '';
  let i = 0;

  while (i < cleaned.length) {
    currentSentence += cleaned[i];
    
    // Check for sentence ending
    if (cleaned[i] === '.' || cleaned[i] === '!' || cleaned[i] === '?') {
      // Check if next character is end of string or space followed by capital
      if (i === cleaned.length - 1) {
        // End of text
        sentences.push(currentSentence.trim());
        currentSentence = '';
      } else if (cleaned[i + 1] === ' ') {
        // Space after punctuation - check if next is capital or end
        let nextCharIdx = i + 2;
        while (nextCharIdx < cleaned.length && cleaned[nextCharIdx] === ' ') {
          nextCharIdx++;
        }
        
        if (nextCharIdx >= cleaned.length) {
          // End of text
          sentences.push(currentSentence.trim());
          currentSentence = '';
        } else {
          const nextChar = cleaned[nextCharIdx];
          const isCapital = /[A-ZÄÖÜ]/.test(nextChar);
          
          // Check if this might be an abbreviation
          const beforePunctuation = currentSentence.trim().split(/\s+/).pop()?.toLowerCase() || '';
          const isAbbreviation = abbreviations.some(abbr => 
            beforePunctuation.includes(abbr.toLowerCase())
          );
          
          // Also check for decimal numbers (digit before period)
          const isDecimal = /\d\.$/.test(currentSentence.trim());
          
          if (isCapital && !isAbbreviation && !isDecimal) {
            // New sentence starts
            sentences.push(currentSentence.trim());
            currentSentence = '';
          }
        }
      }
    }
    
    i++;
  }

  // Add remaining text as last sentence if any
  if (currentSentence.trim().length > 0) {
    sentences.push(currentSentence.trim());
  }

  // Filter out empty sentences
  return sentences.filter(s => s.length > 0);
}

