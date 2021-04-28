interface FunctionProps {
  vectors: any[][]; // NOTE: may have id at 0th index
}

const getDotProduct = (a: number[], b: number[]) => {
  return a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
  // Credit: https://stackoverflow.com/questions/64816766/dot-product-of-two-arrays-in-javascript
};

export const generateCosineSimilarities = (
  props: FunctionProps,
): (number | string)[][] => {
  const vectors = props.vectors;
  const comparisons = vectors.map((vector: any[]) => {
    const stageId = vector[0];
    const vectorWithoutStageId = vector.slice(1); // TODO: use hasIds param to determine whether to slice ids off and add them back on at the end
    const sumOfSquares = vectorWithoutStageId
      .map((number: number) => number * number)
      .reduce((runningTotal, currentNumber) => runningTotal + currentNumber);
    const magnitude = Math.sqrt(sumOfSquares);

    const cosineSimilarities = vectors.map((secondVector: any[]) => {
      // TODO: I could map over a clone of the original vectors, and then slice off the last vector each iteration to improve performance (since you only need half half of the table)

      const secondVectorWithoutStageId = secondVector.slice(1);
      const secondSumOfSquares = secondVectorWithoutStageId
        .map((number: number) => number * number)
        .reduce((runningTotal, currentNumber) => runningTotal + currentNumber);
      const secondMagnitude = Math.sqrt(secondSumOfSquares);

      const dotProduct = getDotProduct(
        vectorWithoutStageId,
        secondVectorWithoutStageId,
      );
      const crossMultipliedMagnitude = magnitude * secondMagnitude;
      const cosineSimilarity = dotProduct / crossMultipliedMagnitude;
      return cosineSimilarity;
    });

    const similaritiesByStage = [stageId, ...cosineSimilarities];
    return similaritiesByStage;
  });
  return comparisons;
};
