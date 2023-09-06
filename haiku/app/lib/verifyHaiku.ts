import { syllable } from "syllable";

export function verifyHaiku(haiku: string): string[] | null {
  const lines = haiku.trim().split("\n");
  const syllableCounts = lines.map((line) => countSyllables(line));

  const errors: string[] = [];

  // Haiku should have three lines
  if (lines.length !== 3) {
    errors.push("Haiku should have exactly three lines.");
  }

  // Haiku should have 5, 7, and 5 syllables respectively
  if (syllableCounts[0] !== 5) {
    errors.push("First line should have 5 syllables.");
  }
  if (syllableCounts[1] !== 7) {
    errors.push("Second line should have 7 syllables.");
  }
  if (syllableCounts[2] !== 5) {
    errors.push("Third line should have 5 syllables.");
  }

  return errors.length > 0 ? errors : null;
}

function countSyllables(line: string): number {
  const words = line.trim().split(" ");
  let count = 0;
  words.forEach((word) => {
    count += countSyllablesInWord(word);
  });
  return count;
}

// Helper function to count syllables in a word (naive implementation)
function countSyllablesInWord(word: string): number {
  const syllableCount = syllable(word);

  return syllableCount;
}
