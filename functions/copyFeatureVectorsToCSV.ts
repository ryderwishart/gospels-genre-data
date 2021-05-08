import { message as antMessage } from 'antd';
import { calculateUnitVectors } from './calculateUnitVectors';

interface CopyVectorsProps {
  vectorsInput: (number | string)[][];
  useUnitVectors?: boolean;
  columns?: string[];
  useTSV?: boolean;
  useRowIdsAsColumns?: boolean;
}

export const copyFeatureVectorsToCSV = ({
  vectorsInput,
  useUnitVectors = true,
  columns,
  useTSV = false,
  useRowIdsAsColumns = false,
}: CopyVectorsProps): void => {
  const columnsForCSV = useRowIdsAsColumns ? vectorsInput.map((row) => row[0]) : columns;
  const separator = useTSV ? '\t' : ',';
  const vectorsForCopying: string[] = [];
  const vectorsCSVHeaders = ['ID', ...columnsForCSV];
  vectorsForCopying.push(vectorsCSVHeaders.join(separator));
  if (useUnitVectors) {
    const unitVectors = calculateUnitVectors(vectorsInput);
    unitVectors.forEach((unitVector) =>
      vectorsForCopying.push(unitVector.join(separator)),
    );
  } else {
    vectorsInput.forEach((vector: (string | number)[]): void => {
      vectorsForCopying.push(vector.join(separator));
    });
  }
  const vectorsForCopyingString: string = vectorsForCopying.join('\n');

  const vectorsForCopyingElement: HTMLTextAreaElement = document.createElement(
    'textarea',
  );
  document.body.appendChild(vectorsForCopyingElement);
  vectorsForCopyingElement.textContent = vectorsForCopyingString;
  vectorsForCopyingElement.select();
  document.execCommand('copy');
  document.body.removeChild(vectorsForCopyingElement);

  vectorsForCopying?.length > 1
    ? antMessage.success(`Copied all stage vectors!`)
    : antMessage.error('Could not copy all stage vectors.');
};
