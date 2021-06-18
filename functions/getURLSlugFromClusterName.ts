interface functionProps {
  string: string;
}

export const getURLSlugFromClusterName = (props: functionProps): string => {
  try {
    const clusterName = props.string.split(/[ ?/();]+/); // get first of multi-title episodes separated by comma or semicolon
    return (
      clusterName
        .filter((word) => word.length > 0)
        .map((word) => word.toLowerCase())
        .join('-') // turn into an seo-friendly url string
        .split(/[,'".;’’“”]+/) // remove special characters
        // TODO: use a regex to remove non-letter or hyphen characters
        .join('') // get one string
    );
  } catch (error) {
    throw new Error(
      'getURLSlugFromClusterName did not receive a valid string, or a string was passed directly instead of an object. Did you mean to use getURLSlugFromClusterName({string: /* string you wished to pass */})',
    );
  }
};
