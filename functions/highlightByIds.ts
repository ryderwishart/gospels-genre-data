const handleHighlightExpressionsByIDs = async (shouldHighlight: boolean, realizations: string[]) => {
    await new Promise(resolve => setTimeout(resolve, 20)); // NOTE: throttles highlight function a tiny bit to prevent crashing app on spastic hovering
    const backgroundColor = shouldHighlight ? '#FFFF77' : 'transparent';
    const highlightedIDs = realizations;
    for (var ID in realizations) {
        highlightedIDs.push(realizations[ID]);
        const element = !!document && document.getElementById(realizations[ID])      
        if(!!element) {
            element.style.backgroundColor = backgroundColor;
        }
    }
}

export default handleHighlightExpressionsByIDs;