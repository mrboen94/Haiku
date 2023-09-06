import {syllable} from "syllable";

export function verifyHaiku(haiku: string): string[] {
  const lines = haiku.trim().split("\n");
  const syllableCounts = lines.map((line) => countSyllables(line));

  const errors: string[] = [];

  // Haiku should have three lines
  if (lines.length !== 3) {
    errors.push("1");
  }
  // Haiku should have 5, 7, and 5 syllables respectively
  if (syllableCounts[0] !== 5) {
    errors.push("2");
  }
  if (syllableCounts[1] !== 7) {
    errors.push("3");
  }
  if (syllableCounts[2] !== 5) {
    errors.push("4");
  }
  errors.length > 0 ? errors : errors.push("5");

  return errors;
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
  return syllable(word);
}
