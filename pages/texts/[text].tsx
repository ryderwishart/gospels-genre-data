import { server } from '../../config';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';
import { StageContainer, System, TextContainer } from '../../types';
import { allChoices } from '../../types/systemDefinitions';
import { calculateUnitVectors } from '../../functions/calculateUnitVectors';
import { generateCosineSimilarities } from '../../functions/generateCosineSimilarities';
import React, { useState } from 'react';
import {
  Button,
  Collapse,
  Input,
  message as antMessage,
  message,
  Space,
  Tag,
} from 'antd';
import getFeatureStatistics from '../../functions/getFeatureStatistics';
import { showFeedback } from '../../functions/showFeedback';

interface HTMLInputElementForCopying extends HTMLInputElement {
  select(): void;
}

interface ComponentProps {
  currentText: string;
  response: TextContainer;
}

const TextPage: React.FC<ComponentProps> = (props) => {
  console.log('here', props);

  const [separator, setSeparator] = useState(',');
  const [shouldUseUnitVectors, setShouldUseUnitVectors] = useState<boolean>(
    true,
  );

  const getCosineSimilaritiesForStageVectors = (
    vectorsForGeneratingCosineSimilarities: any[][],
  ) => {
    let vectors = vectorsForGeneratingCosineSimilarities;
    if (shouldUseUnitVectors) {
      const unitVectors = calculateUnitVectors(
        vectorsForGeneratingCosineSimilarities,
      );
      vectors = unitVectors;
    }
    const comparisons = generateCosineSimilarities({ vectors: vectors });
    const comparisonsForCopyingString: string = comparisons
      .map((i) => i.join(','))
      .join('\n');
    const comparisonsForCopyingElement = document.getElementById(
      'analysis-text-area',
    );
    if (comparisonsForCopyingElement) {
      comparisonsForCopyingElement.textContent = comparisonsForCopyingString;
    }
    showFeedback('analysis-text-area');
  };

  interface CopyVectorsProps {
    vectorsInput: (number | string)[][];
    useUnitVectors: boolean;
  }

  const copyFeatureVectorsToCSV = ({
    vectorsInput,
    useUnitVectors = true,
  }: CopyVectorsProps) => {
    const vectorsForCopying: string[] = [];
    const vectorsCSVHeaders = ['stageId', ...allChoices];
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

  const text = props.response?.text || props.response['data'][0]['text'];
  if (text) {
    const allMoveSets = text.content.turn.content.map(
      (stageContainer: StageContainer) => {
        const moves = stageContainer.stage.content.map((moveContainer) => {
          return moveContainer.move;
        });
        return { stageId: stageContainer.stage.key, moves };
      },
    );

    const stageFeatureData = allMoveSets.map((moveSet) => {
      const { stageId, moves } = moveSet;
      const currentSystems: System[] = moves
        .map((move) =>
          move.meanings?.map((systemContainer) => systemContainer.system),
        )
        .flat();
      const tableRow = getFeatureStatistics({
        allSystems: currentSystems,
        stageId,
      });
      return tableRow;
    });

    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1>{text.key}</h1>
          <div className={styles.grid}>
            {text.content.turn.content.map((stageContainer) => {
              return (
                <Link
                  key={stageContainer.stage.key}
                  href={`/johannine/${props.currentText}/${stageContainer.stage.key}`}
                >
                  <a>
                    <div className={styles.card}>
                      <h2>Stage</h2>
                      {stageContainer.stage.key}{' '}
                      {/* TODO: again, these stage slugs should be based on the first episode title, if multiple, and on the id only as a fallback */}
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>
          <Collapse style={{ width: '100%' }}>
            <Collapse.Panel key="analysis" header={<h2>Analysis</h2>}>
              <div>
                <Tag>Separator: {separator === ',' ? 'Commas' : 'Tabs'}</Tag>
                <Button
                  onClick={() =>
                    copyFeatureVectorsToCSV({
                      vectorsInput: stageFeatureData,
                      useUnitVectors: shouldUseUnitVectors,
                    })
                  }
                >
                  Copy Stage Data
                </Button>
                <Button
                  onClick={() =>
                    separator === ',' ? setSeparator('\t') : setSeparator(',')
                  }
                >
                  Use {separator === ',' ? 'TSV' : 'CSV'}
                </Button>
                <Button
                  onClick={() =>
                    shouldUseUnitVectors
                      ? setShouldUseUnitVectors(false)
                      : setShouldUseUnitVectors(true)
                  }
                >
                  {shouldUseUnitVectors ? 'Do not use ' : 'Use '} Unit Vectors
                </Button>
                <Button
                  onClick={() => {
                    getCosineSimilaritiesForStageVectors(stageFeatureData);
                  }}
                >
                  Calculate Cosine Similarities for Stages
                </Button>
              </div>
              <Space size={10} direction="vertical" />

              <Input.TextArea
                autoSize
                id="analysis-text-area"
                onClick={() => {
                  const element: HTMLInputElementForCopying = document.getElementById(
                    'analysis-text-area',
                  ) as HTMLInputElementForCopying;
                  if (element?.textContent && element.textContent.length > 0) {
                    element?.select();
                    document.execCommand('copy');
                    showFeedback('analysis-text-area');
                    message.success('Copied Cosine Similarities CSV!');
                  } else {
                    message.warning('Nothing to copy!');
                  }
                }}
              ></Input.TextArea>
            </Collapse.Panel>
          </Collapse>
        </main>
        <footer className={styles.footer}>
          <Link href={`/texts`}>
            <a className={styles.card}>&larr; Back to all texts</a>
          </Link>
        </footer>
      </div>
    );
  }
  return null;
};

export default TextPage;

export async function getStaticProps(context: {
  params: { text: string };
}): Promise<{ props: { response: JSON; currentText: string } }> {
  const { text } = context.params;
  console.log('text: ', text);
  const response = await (
    await fetch(`${server}/api/texts/${text.toLowerCase()}`)
  ).json();

  const currentText = context.params.text;

  return {
    props: {
      response,
      currentText,
    },
  };
}

export interface TextFromAPITexts {
  $: {
    href: string;
    title: string;
    index: string;
  };
}

export const getStaticPaths = async () => {
  let metaDataResponse;
  try {
    metaDataResponse = await (await fetch(`${server}/api/texts/`)).json();
  } catch (error) {
    metaDataResponse = null;
  }
  const texts = metaDataResponse?.Nestle1904.text.map(
    (textFromAPITexts: TextFromAPITexts) => textFromAPITexts.$.title,
  );
  const paths = texts?.map((title: string) => ({
    params: { text: title.toString() },
  }));
  return {
    paths,
    fallback: false,
  };
};
