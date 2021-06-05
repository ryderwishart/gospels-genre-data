interface functionProps {
  string: string;
}

export const getFirstTitleHyphenatedLowerCaseStringFromTitleString = (
  props: functionProps,
): string => {
  try {
    const firstTitle = props.string.split(',')[0];
    return firstTitle
      .split(' ')
      .flat(2)
      .map((word) => word.toLowerCase())
      .join('-')
      .split(/['"’“”]+/)
      .join('');
  } catch (error) {
    throw new Error(
      'getFirstTitleHyphenatedLowerCaseStringFromTitleString did not receive a valid string, or a string was passed directly instead of an object. Did you mean to use getFirstTitleHyphenatedLowerCaseStringFromTitleString({string: /* string you wished to pass */})',
    );
  }
};
