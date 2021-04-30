import { server } from '../../config';
import { StageFeatureSet } from '../../types';
import styles from '../../styles/Home.module.css';
import { Button, Table, Tag, message as antMessage, Drawer } from 'antd';
import { allSituationalChoices } from '../../types/systemDefinitions';
import { generateCosineSimilarities } from '../../functions/generateCosineSimilarities';
import { copyFeatureVectorsToCSV } from '../../functions/copyFeatureVectorsToCSV';
import { showFeedback } from '../../functions/showFeedback';
import { useState } from 'react';

interface ComponentProps {
  response: StageFeatureSet[];
}
const AnalysisPage: React.FC<ComponentProps> = (props) => {
  const [useCosine, setUseCosine] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const stageTableData = props.response;
  const stageTableColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Features',
      dataIndex: 'features',
      key: 'features',
      render: (featureSet: string[]) => {
        const features = featureSet.map((feature, index) => (
          <Tag key={index} color="blue">
            {feature}
          </Tag>
        ));
        return features;
      },
    },
  ];

  const getStageFeatureVectors = (
    stageFeatureSets: StageFeatureSet[],
  ): (string | number)[][] => {
    return stageFeatureSets.map((stageFeatureSet: StageFeatureSet) => {
      const binaryValues = allSituationalChoices.map((choice: string) => {
        if (stageFeatureSet.features.includes(choice)) {
          return 1;
        }
        return 0;
      });
      const rowId = `${stageFeatureSet.id}: ${stageFeatureSet.title}`;
      return [rowId, ...binaryValues];
    });
  };

  const getCosineSimilaritiesForStageFeatureVectors = (
    stageFeatureSets: StageFeatureSet[],
  ): (string | number)[][] => {
    const stageFeatureVectors = getStageFeatureVectors(stageFeatureSets);
    const cosineSimilarities = generateCosineSimilarities({
      vectors: stageFeatureVectors,
    });
    const cosineSimilaritiesWithHeaders = [
      ['ID', ...cosineSimilarities.map((row) => row[0])],
      ...cosineSimilarities,
    ];
    console.log(cosineSimilaritiesWithHeaders);
    return cosineSimilaritiesWithHeaders;
  };

  const handleClickAnalysisButton = (shouldUseCosine: boolean): void => {
    const vectors = shouldUseCosine
      ? getCosineSimilaritiesForStageFeatureVectors(stageTableData)
      : getStageFeatureVectors(stageTableData);
    populateTextArea(vectors);
  };

  const handleClickTextArea = (): void => {
    const onPageTextAreaContent = document.getElementById('analysis-text-area')
      .textContent;
    const vectorsForCopyingElement: HTMLTextAreaElement = document.createElement(
      'textarea',
    );
    document.body.appendChild(vectorsForCopyingElement);
    vectorsForCopyingElement.textContent = onPageTextAreaContent;
    vectorsForCopyingElement.select();
    document.execCommand('copy');
    document.body.removeChild(vectorsForCopyingElement);

    onPageTextAreaContent?.length > 1
      ? antMessage.success(`Copied all stage vectors!`)
      : antMessage.error('Could not copy all stage vectors.');
  };

  const populateTextArea = (data): void => {
    const dataForPopulatingTextArea: string = data
      .map((i) => i.join(','))
      .join('\n');
    const textArea = document?.getElementById('analysis-text-area');
    if (textArea) {
      textArea.textContent += dataForPopulatingTextArea;
    }
    showFeedback('analysis-text-area');
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
            <Button
              style={{ display: 'flex' }}
              onClick={() => {
                setUseCosine(useCosine ? false : true);
              }}
            >
              Switch to {useCosine ? 'Feature Vectors' : 'Cosine Values'}
            </Button>
            <Button onClick={() => handleClickAnalysisButton(useCosine)}>
              Generate Analysis
            </Button>
            <h2>{useCosine ? 'Cosine Values' : 'Feature Vectors'}</h2>
            <textarea
              id="analysis-text-area"
              onClick={() => handleClickTextArea()}
            />
            {/* <Table
              dataSource={stageTableData}
              columns={stageTableColumns}
              pagination={false}
            /> */}
          </div>
        </Drawer>
        {props.response?.map((stageFeatureSet: StageFeatureSet) => {
          return (
            <div className={styles.card} key={stageFeatureSet.id}>
              <h2>{stageFeatureSet.title}</h2>
              <p>{stageFeatureSet.id}</p>
              {stageFeatureSet.features}
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default AnalysisPage;

export async function getStaticProps() {
  try {
    const response = await (await fetch(`${server}/api/analysis`)).json();
    return {
      props: {
        response,
      },
    };
  } catch (error) {
    return {
      props: {
        response: null,
      },
    };
  }
}
