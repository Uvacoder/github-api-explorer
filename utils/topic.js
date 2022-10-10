/**
 * Cleans up query name user input to remove characters unsupported by the
 * GitHub API.
 *
 * @param {string} [name=""] — topic name
 * @return {string} a new string without restricted characters.
 */
export function normalizeTopicName(name = '') {
  if (typeof name !== 'string') {
    return '';
  }

  return name?.normalize("NFKD")
    .toLowerCase()
    .replace(/\p{Emoji_Component}|\p{Extended_Pictographic}|\p{Diacritic}/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}
