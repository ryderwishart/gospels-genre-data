export const calculateUnitVectors = (vectors: any[][]) => {
  const unitVectors = vectors.map((vector: any[]) => {
    const stageId = vector[0];
    const vectorWithoutStageId = vector.slice(1); // TODO: use a hasIds param to determine whether to slice ids off and add them back on at the end
    const sumOfSquares = vectorWithoutStageId
      .map((number: number) => number * number)
      .reduce((runningTotal, currentNumber) => runningTotal + currentNumber);
    const magnitude = Math.sqrt(sumOfSquares);
    const unitVector = [
      stageId,
      ...vectorWithoutStageId.map((number: number) => number / magnitude),
    ];
    return unitVector;
  });
  return unitVectors;
};
