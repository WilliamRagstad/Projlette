function capitalizeFirstLetterInWord(word: string) {
  return word[0].toUpperCase() + word.slice(1);
}

function stripSpecialCharacters(str: string) {
  return str.replace(/[^a-zA-Z0-9\s\-\.\,\&\?\:]/g, "");
}

function removeAllWhitespace(str: string) {
  return str.replace(/\s/g, "");
}

/**
 * Formats a username for storing as an ID in the database.
 * This takes a username and formats it to be safe and ensures it is unique.
 * @param username The username to be formatted
 * @returns The formatted username
 */
export function formatUsername(username) {
  return stripSpecialCharacters(removeAllWhitespace(username)).toLowerCase();
}
