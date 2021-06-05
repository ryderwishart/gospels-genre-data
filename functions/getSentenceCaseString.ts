export const getSentenceCaseString = (stringProp) => {
  return stringProp
    .split('_')
    .map(
      (word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`,
    )
    .join(' ');
};
