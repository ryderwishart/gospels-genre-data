export const getMostSimilarVectors = ({queriedVector, vectorsDataSet, returnTopN=10}): (string|number)[] => {
    const topNIndexes = queriedVector.filter((cell, index) => [cell, index])
    const vectorsDataSet.filter(row[0])  matches queriedVector[0]
    // 
    const mostSimilarVectors = matches.map(match => [match[0], ])
        return mostSimilarVectors;
    // else message.error('queried vector not found in vectors. Ensure the first item in the vector is a string (e.g. an ID or a title to identify the vector)
    
}