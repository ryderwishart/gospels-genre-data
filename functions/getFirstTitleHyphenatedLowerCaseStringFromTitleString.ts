interface functionProps {
  string: string;
}

export const getFirstTitleHyphenatedLowerCaseStringFromTitleString = (
  props: functionProps,
): string => {
  try {
    const firstTitle = props.string.split(/[,;]+/)[0]; // get first of multi-title situations separated by comma or semicolon
    return (
      firstTitle
        .split(' ') // split by word
        .flat(2) // flatten to one list
        .map((word) => word.toLowerCase())
        .join('-') // turn into an seo-friendly url string
        .split(/[,'".;’’“”]+/) // remove special characters
        // TODO: use a regex to remove non-letter or hyphen characters
        .join('') // get one string
    );
  } catch (error) {
    throw new Error(
      'getFirstTitleHyphenatedLowerCaseStringFromTitleString did not receive a valid string, or a string was passed directly instead of an object. Did you mean to use getFirstTitleHyphenatedLowerCaseStringFromTitleString({string: /* string you wished to pass */})',
    );
  }
};
