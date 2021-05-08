import { server } from '../../config';
import { GraphDataObject, GraphEdge, StageFeatureSet } from '../../types';
import styles from '../../styles/Home.module.css';
import { Button, Collapse, message as antMessage, Drawer, Space } from 'antd';
import { allSituationalChoices } from '../../types/systemDefinitions';
import { generateCosineSimilarities } from '../../functions/generateCosineSimilarities';
import { showFeedback } from '../../functions/showFeedback';
import { useState } from 'react';
import { SettingFilled } from '@ant-design/icons';

interface ComponentProps {
  response: {
    episodeFeatures: StageFeatureSet[];
    episodeSimilarities: string[][];
  };
}

const AnalysisPage: React.FC<ComponentProps> = (props) => {
  const [cosineGraphData, setCosineGraphData] = useState<GraphDataObject>(null);
  const [cosineData, setCosineData] = useState(null);
  const [useCosine, setUseCosine] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [separator, setSeparator] = useState(',');

  const stageTableData = props.response.episodeFeatures;

  const getStageFeatureVectors = (
    stageFeatureSets: StageFeatureSet[],
  ): any[][] => {
    const stageFeatureVectors = [['ID', ...allSituationalChoices]];
    console.log({ stageFeatureVectors });
    stageFeatureSets.map((stageFeatureSet: StageFeatureSet) => {
      const binaryValues = allSituationalChoices.map((choice: string) => {
        if (stageFeatureSet.features.includes(choice)) {
          return '1';
        }
        return '0';
      });
      const rowId = `${stageFeatureSet.id}: ${stageFeatureSet.title}`;
      stageFeatureVectors.push([rowId, ...binaryValues]);
    });
    return stageFeatureVectors;
  };

  const getCosineSimilaritiesForStageFeatureVectors = (
    stageFeatureSets: StageFeatureSet[],
  ): (string | number)[][] => {
    console.log({ stageFeatureSets });
    const stageFeatureVectors = getStageFeatureVectors(stageFeatureSets);
    console.log({ stageFeatureVectors });

    const cosineSimilarities = generateCosineSimilarities({
      vectors: stageFeatureVectors,
    });
    console.log({ cosineSimilarities });
    const cosineSimilaritiesWithHeaders = [
      [...cosineSimilarities.map((row) => row[0])],
      ...cosineSimilarities,
    ];
    console.log({ cosineSimilaritiesWithHeaders });
    setCosineData(cosineSimilaritiesWithHeaders);
    return cosineSimilaritiesWithHeaders;
  };

  const handleClickAnalysisButton = async (
    shouldUseCosine: boolean,
  ): Promise<void> => {
    if (stageTableData) {
      const vectors = shouldUseCosine
        ? await getCosineSimilaritiesForStageFeatureVectors(stageTableData)
        : await getStageFeatureVectors(stageTableData);
      await populateTextArea(vectors, 'analysis-text-area');
    }
    antMessage.warning('Generation failed because data has not loaded yet');
  };

  const handleClickTextArea = (textArea: string): void => {
    const onPageTextAreaContent = document.getElementById(textArea).textContent;
    const vectorsForCopyingElement: HTMLTextAreaElement = document.createElement(
      'textarea',
    );
    document.body.appendChild(vectorsForCopyingElement);
    vectorsForCopyingElement.textContent = onPageTextAreaContent;
    vectorsForCopyingElement.select();
    document.execCommand('copy');
    document.body.removeChild(vectorsForCopyingElement);

    onPageTextAreaContent?.length > 1
      ? antMessage.success(`Copied data from text field!`)
      : antMessage.error('Could not copy data from text field.');
  };

  const populateTextArea = async (data, textArea: string): Promise<void> => {
    let dataForPopulatingTextArea = '';
    try {
      dataForPopulatingTextArea = data.map((i) => i.join(separator)).join('\n');
    } catch (error) {
      dataForPopulatingTextArea = JSON.stringify(data);
    }
    const textAreaElement = document?.getElementById(textArea);
    if (textAreaElement) {
      textAreaElement.textContent += dataForPopulatingTextArea;
    }
    showFeedback('analysis-text-area');
  };

  const handleClickGenerateGraphDataButton = async (
    cosineData: (string | number)[][],
  ): Promise<void> => {
    console.log({ cosineData });
    const cosineDataWithoutHeaders = cosineData.slice(1);
    console.log({ cosineDataWithoutHeaders });
    const dataHeadersWithoutIDColumn = cosineData[0].slice(1);
    const nodes = [];
    const edges = [];
    antMessage.info('Mapping over cosine data...');
    cosineDataWithoutHeaders.map((rowOfSimilarityScores) => {
      //  NOTE: All the 'any' types here are handling the (string | number)[] that is a vector type in my data model
      const id: any = rowOfSimilarityScores[0];
      const rowWithoutId = rowOfSimilarityScores.slice(1);
      // console.log({ rowOfSimilarityScores });
      const sumOfRow: any = rowWithoutId.reduce(
        (accumulator: any, currentValue: any) => {
          return accumulator + parseFloat(currentValue);
        },
      );
      // console.log({ sumOfRow });
      const averageSimilarity = sumOfRow / rowWithoutId.length;
      // console.log(averageSimilarity);
      rowWithoutId
        .map((comparisonValue: any, index): void => {
          const target: any = dataHeadersWithoutIDColumn[index];
          edges.push({
            id: `${id}${target}`,
            source: id,
            target: target,
            weight: comparisonValue,
          });
        })
        .map((graphEdge) => graphEdge);

      nodes.push({ id, label: id, averageSimilarity });
    });
    const graphData: GraphDataObject = {
      nodes,
      edges,
    };
    console.log(cosineGraphData);
    setCosineGraphData(graphData);
    await populateTextArea(graphData, 'graph-text-area');
    antMessage.success('Generated Graph Data!');
  };

  return (
    <main className={styles.main}>
      <h1>Stage Features Analysis</h1>
      <Button
        onClick={() => {
          setShowDrawer(true);
        }}
      >
        Show Drawer
      </Button>
      <div className={styles.grid}>
        <Drawer visible={showDrawer} onClose={() => setShowDrawer(false)}>
          <div
            style={{
              display: 'flex',
              flexFlow: 'column',
              alignItems: 'stretch',
              paddingTop: 40,
            }}
          >
            <SettingFilled
              spin={isLoading ? true : false}
              color="blue"
              style={{ marginBottom: 100 }}
            />
            <Button
              onClick={() =>
                separator === ',' ? setSeparator('\t') : setSeparator(',')
              }
            >
              Use {separator === ',' ? 'TSV' : 'CSV'}
            </Button>
            <Button
              style={{ display: 'flex' }}
              onClick={() => {
                setUseCosine(useCosine ? false : true);
              }}
            >
              Switch to {useCosine ? 'Feature Vectors' : 'Cosine Values'}
            </Button>

            <Button
              onClick={async () => {
                setIsLoading(true);
                await handleClickAnalysisButton(useCosine);
                setIsLoading(false);
              }}
              // disabled={useCosine && !!cosineData}
            >
              Generate Analysis
            </Button>
            <Button
              onClick={async () => {
                setIsLoading(true);
                await handleClickGenerateGraphDataButton(cosineData);
                setIsLoading(false);
              }}
              disabled={!cosineData}
            >
              Generate Similarity Graph Data
            </Button>
            <h2>{useCosine ? 'Cosine Values' : 'Feature Vectors'}</h2>
            <textarea
              id="analysis-text-area"
              onClick={() => handleClickTextArea('analysis-text-area')}
            />
            <br />
            <textarea
              id="graph-text-area"
              onClick={() => handleClickTextArea('graph-text-area')}
            />
            {/* <Table
              dataSource={stageTableData}
              columns={stageTableColumns}
              pagination={false}
            /> */}
          </div>
        </Drawer>
        <Collapse>
          <Collapse.Panel header="Similarities" key="similarities">
            Similarities
            {console.log(props.response?.episodeSimilarities)}
          </Collapse.Panel>
          <Collapse.Panel header="All Stages" key="stages">
            {props.response?.episodeFeatures?.map(
              (stageFeatureSet: StageFeatureSet) => {
                return (
                  <div className={styles.card} key={stageFeatureSet.id}>
                    <h2>{stageFeatureSet.title}</h2>
                    <p>{stageFeatureSet.id}</p>
                    {stageFeatureSet.features}
                  </div>
                );
              },
            )}
          </Collapse.Panel>
        </Collapse>
      </div>
    </main>
  );
};

export default AnalysisPage;

export async function getStaticProps(): Promise<{
  props: {
    episodeFeatures: StageFeatureSet[];
    episodeSimilarities: string[][];
  };
}> {
  try {
    const response: {
      episodeFeatures: StageFeatureSet[];
      episodeSimilarities: string[][];
    } = await (await fetch(`${server}/api/analysis`)).json();
    return {
      props: response,
    };
  } catch (error) {
    return {
      props: null,
    };
  }
}
