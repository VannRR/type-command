#!/usr/bin/env node
import { promises as fs } from "fs";
import { profanity } from "@2toad/profanity";

/*
  CAUTION, you are generating a json with an amount of strings equal to:
  (CHAR_COUNT_MAX - CHAR_COUNT_MIN) * WORD_COUNT
*/

const CHAR_COUNT_MIN = 3;
const CHAR_COUNT_MAX = 12;
const WORD_COUNT = 500;
const DICT_PATH = "/usr/share/dict/american-english"; // words 2.1-8, A collection of International 'words' files for /usr/share/dict

const JSON_OUTPUT_PATH = "./words.json";
const JSON_INDENT = "    ";

async function main() {
  const dictArray = await getDictArray();
  const allSortedWords: string[][] = [];

  for (let len = CHAR_COUNT_MIN; len <= CHAR_COUNT_MAX; len++) {
    const filtered = filterDictArray(dictArray, len);
    const sortedRandomWords = getSortedRandomWords(filtered);
    allSortedWords.push(sortedRandomWords);
  }

  await fs.writeFile(
    JSON_OUTPUT_PATH,
    JSON.stringify(allSortedWords, null, JSON_INDENT),
    "utf8",
  );
  console.log(`Wrote ${allSortedWords.length} lists to ${JSON_OUTPUT_PATH}`);
}

async function getDictArray() {
  const dictString = await fs.readFile(DICT_PATH, "utf8");
  return dictString.split("\n");
}

function isLowerCaseAlphabetical(str) {
  if (str.length <= 1) return false;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code < 97 || code > 122) return false;
  }
  return true;
}

function filterDictArray(arr, wordLength) {
  const filtered = arr.filter(
    (w) => w.length === wordLength && isLowerCaseAlphabetical(w),
  );

  if (filtered.length === 0) {
    throw new Error(`No matches for word length ${wordLength}`);
  }
  return filtered;
}

function getSortedRandomWords(filtered: string[]): string[] {
  if (filtered.length < WORD_COUNT) {
    throw new Error(
      `Need at least ${WORD_COUNT} words, but got ${filtered.length}`,
    );
  }

  const picked = new Set();
  const result: string[] = [];

  for (let i = 0; i < WORD_COUNT * 20; i++) {
    const word = filtered[Math.floor(Math.random() * filtered.length)];
    if (!picked.has(word) && !profanity.exists(word)) {
      picked.add(word);
      result.push(word);
      if (result.length === WORD_COUNT) {
        return result.sort();
      }
    }
  }

  throw new Error(
    `Only collected ${result.length} unique clean words, expected ${WORD_COUNT}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
