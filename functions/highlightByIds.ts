import { constants } from '../config';

const handleHighlightExpressionsByIDs = async (
  shouldHighlight: boolean,
  realizations: string[],
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 20)); // NOTE: throttles highlight function a tiny bit to prevent crashing app on spastic hovering
  // TODO: this throttle doesn't seem to really solve the problem.
  const backgroundColor = shouldHighlight
    ? constants.color.blue
    : 'transparent';
  const highlightedIDs = realizations;
  for (const ID in realizations) {
    highlightedIDs.push(realizations[ID]);
    const element = !!document && document.getElementById(realizations[ID]);
    if (element) {
      element.style.backgroundColor = backgroundColor;
    }
  }
};

export default handleHighlightExpressionsByIDs;
