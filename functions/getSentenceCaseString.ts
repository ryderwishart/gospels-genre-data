export const getSentenceCaseString = (stringProp, delimiter?) => {
  const selectedDelimiter = delimiter ? delimiter : '_';
  return stringProp
    .split(selectedDelimiter)
    .map(
      (word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`,
    )
    .join(' ');
};
