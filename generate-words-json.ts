import { profanity } from "@2toad/profanity";

/* 
  CAUTION, you are generating a json with an amount of strings equal to:
  (CHAR_COUNT_MAX - CHAR_COUNT_MIN) * WORD_COUNT
*/

const CHAR_COUNT_MIN = 3;
const CHAR_COUNT_MAX = 12;
const WORD_COUNT = 500;
const DICT_PATH = "/usr/share/dict/american-english";
const JSON_OUTPUT_PATH = "./words.json";
const JSON_INDENT = "    ";

async function main() {
  const dictArray = await getDictArray();

  const allSortedWords: string[][] = [];

  for (let i = CHAR_COUNT_MIN; i <= CHAR_COUNT_MAX; i++) {
    const filteredDict = filterDictArray(dictArray, i);
    const sortedRandomWords = getSortedRandomWords(filteredDict);
    allSortedWords.push(sortedRandomWords);
  }

  await Bun.write(
    JSON_OUTPUT_PATH,
    JSON.stringify(allSortedWords, null, JSON_INDENT)
  );
}

async function getDictArray(): Promise<string[]> {
  const dictFile = Bun.file(DICT_PATH);
  const dictString = await dictFile.text();

  return dictString.split("\n");
}

function isLowerCaseAlphabetical(str: string) {
  if (str.length <= 1) {
    return false;
  }
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if (charCode < 97 || charCode > 122) {
      return false;
    }
  }
  return true;
}

function filterDictArray(dictArray: string[], wordLength: number): string[] {
  const filteredDict = dictArray.filter(
    (word) => word.length === wordLength && isLowerCaseAlphabetical(word)
  );

  if (filteredDict.length === 0) {
    throw new Error(`No matches for filter of word length: ${wordLength}.`);
  }

  return filteredDict;
}

function getSortedRandomWords(filteredDict: string[]): string[] {
  if (filteredDict.length < WORD_COUNT) {
    throw new Error(
      `Filtered dict length: ${filteredDict.length} needs to be greater then word count: ${WORD_COUNT}.`
    );
  }
  const randomWords: string[] = [];

  for (let i = 0; i < WORD_COUNT * 20; i++) {
    const randomIndex = Math.floor(Math.random() * filteredDict.length);
    const randomWord = filteredDict[randomIndex];
    if (
      randomWords.includes(randomWord) === false &&
      profanity.exists(randomWord) === false
    ) {
      randomWords.push(randomWord);
    }
    if (randomWords.length === WORD_COUNT) {
      return randomWords.sort();
    }
  }

  throw new Error(
    `Random words array has length: ${randomWords.length}, expects ${WORD_COUNT}.`
  );
}

main();
