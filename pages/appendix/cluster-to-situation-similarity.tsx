import { server } from '../../config';
import Layout from '../../components/Layout';
import { AutoComplete, Input, Switch, Table, Tag, Tooltip } from 'antd';
import jsonpath from 'jsonpath';
import { SituationMetadata } from '../../types';
import { useState } from 'react';
import { UnorderedListOutlined } from '@ant-design/icons';
import clusterLabels from '../../types/clusterLabels';
import Link from 'next/link';
import { constants } from '../../config';

interface AutoCompleteProps {
  options: { value: string }[];
  onSelect: (state: any) => void;
}

const Complete: React.FC<AutoCompleteProps> = (props) => {
  const [currentInputValue, setCurrentInputValue] = useState('');
  function handleSelect(value: string) {
    props.onSelect(value);
  }
  const filteredOptions = props.options.filter((option) =>
    option.value.includes(currentInputValue),
  );
  return (
    <>
      <p>
        Select situations using this search box in order to add comparison
        columns to the table
      </p>
      <AutoComplete
        options={
          Array.isArray(filteredOptions) ? filteredOptions : [filteredOptions]
        }
        autoFocus
        onSelect={(value) => handleSelect(value)}
      >
        <Input
          placeholder="Select situation IDs to filter the table..."
          addonAfter={<UnorderedListOutlined />}
          width={300}
          onChange={(e) => setCurrentInputValue(e.target.value)}
        />
      </AutoComplete>
      <br />
    </>
  );
};

interface ComponentProps {
  clusterToSituationSimilarities: {
    id: string;
    [key: string]: string;
  }[];
  situationMetadataResponse: {
    situations: {
      root: {
        situation: { $: SituationMetadata }[];
      };
    };
  };
}

const CosineSimilaritiesTable = (props: ComponentProps) => {
  const [selectedIDs, setSelectedIDs] = useState([]);
  const [useNormalizedSimilarity, setUseNormalizedSimilarity] = useState(true);
  const [
    useDifferenceFromClusterAverage,
    setUseDifferenceFromClusterAverage,
  ] = useState(false);
  const allTableHeaders = Object.keys(props.clusterToSituationSimilarities[0])
    .slice(2)
    .map((header) => ({ value: header }));
  function handleAutoCompleteChange(value) {
    if (selectedIDs.includes(value)) {
      setSelectedIDs(selectedIDs.filter((id) => id !== value));
    } else {
      setSelectedIDs([...selectedIDs, value]);
    }
  }

  const situationData = {};
  props.situationMetadataResponse.situations.root.situation.forEach(
    (situation) => {
      situationData[situation.$.section] = {
        label: situation.$.title,
        startLocation: situation.$.start,
        max: null,
        min: null,
        similarityValues: [],
      };
    },
  );

  const MatthewSimilarityValues = [];
  const MarkSimilarityValues = [];
  const LukeSimilarityValues = [];
  const JohnSimilarityValues = [];
  const FrameworkSimilarityValues = [];

  // Gather all similarity values by stageId instead of cluster
  props.clusterToSituationSimilarities.map((cluster) => {
    Object.keys(cluster)
      .filter((stageId) => stageId !== 'cluster')
      .forEach((stageId) => {
        if (stageId === 'Matthew') {
          MatthewSimilarityValues.push(cluster[stageId]);
        }
        if (stageId === 'Mark') {
          MarkSimilarityValues.push(cluster[stageId]);
        }
        if (stageId === 'Luke') {
          LukeSimilarityValues.push(cluster[stageId]);
        }
        if (stageId === 'John') {
          JohnSimilarityValues.push(cluster[stageId]);
        }
        if (stageId === 'Framework') {
          FrameworkSimilarityValues.push(cluster[stageId]);
        } else {
          const similarityValue = parseFloat(cluster[stageId]);
          situationData[stageId]?.similarityValues?.push({
            clusterId: cluster.cluster,
            similarityValue,
          });
        }
      });
  });

  console.log(
    [
      MatthewSimilarityValues,
      MarkSimilarityValues,
      LukeSimilarityValues,
      JohnSimilarityValues,
      FrameworkSimilarityValues,
    ].forEach((similarityValues) => {
      const max = Math.max(...similarityValues);
      const min = Math.min(...similarityValues);
      console.log(max, min);
    }),
  );
  // Determine max and min similarity values for each situation in situationData
  Object.keys(situationData).forEach((situationId) => {
    if (situationData[situationId].similarityValues?.length > 0) {
      const situation = situationData[situationId];
      // NOTE: for some reason, the additionalSituationData I added above is being looped over five times at some point, resulting in 140 similarity values instead of 28.
      // remove similarityValues that have identical clusterIds and use the first one
      // uniqueSimilarityValues.push(
      //   ...situation.similarityValues.reduce((acc, curr) => {
      //     if (!acc.some((val) => val.clusterId === curr.clusterId)) {
      //       acc.push(curr);
      //     }
      //     return acc;
      //   }, []),
      // );

      // situation.similarityValues = uniqueSimilarityValues;

      // console.log(
      //   '>>>> MIN',
      //   situation.label,
      //   Math.min(
      //     ...uniqueSimilarityValues.map(
      //       (similarityValue) => similarityValue.similarityValue,
      //     ),
      //   ),
      //   'MAX',
      //   Math.max(
      //     ...uniqueSimilarityValues.map(
      //       (similarityValue) => similarityValue.similarityValue,
      //     ),
      //   ),
      // );

      situation.max = Math.max(
        ...situation.similarityValues.map(
          (similarityValue) => similarityValue.similarityValue,
        ),
      );
      situation.min = Math.min(
        ...situation.similarityValues.map(
          (similarityValue) => similarityValue.similarityValue,
        ),
      );
    }
  });

  const additionalSituationData = {
    label: '',
    startLocation: '',
    max: null,
    min: null,
    similarityValues: [],
  };

  situationData['Matthew'] = { ...additionalSituationData };
  situationData['Matthew'].similarityValues = MatthewSimilarityValues;
  situationData['Matthew'].max = Math.max(...MatthewSimilarityValues);
  situationData['Matthew'].min = Math.min(...MatthewSimilarityValues);

  situationData['Mark'] = { ...additionalSituationData };
  situationData['Mark'].similarityValues = MarkSimilarityValues;
  situationData['Mark'].max = Math.max(...MarkSimilarityValues);
  situationData['Mark'].min = Math.min(...MarkSimilarityValues);

  situationData['Luke'] = { ...additionalSituationData };
  situationData['Luke'].similarityValues = LukeSimilarityValues;
  situationData['Luke'].max = Math.max(...LukeSimilarityValues);
  situationData['Luke'].min = Math.min(...LukeSimilarityValues);

  situationData['John'] = { ...additionalSituationData };
  situationData['John'].similarityValues = JohnSimilarityValues;
  situationData['John'].max = Math.max(...JohnSimilarityValues);
  situationData['John'].min = Math.min(...JohnSimilarityValues);

  situationData['Framework'] = { ...additionalSituationData };
  situationData['Framework'].similarityValues = FrameworkSimilarityValues;
  situationData['Framework'].max = Math.max(...FrameworkSimilarityValues);
  situationData['Framework'].min = Math.min(...FrameworkSimilarityValues);

  //   Framework: {
  //     ...additionalSituationData,
  //     label: 'Averaged Gospel Framework',
  //   },
  //   Matthew: {
  //     ...additionalSituationData,
  //     label: 'Matthew',
  //   },
  //   Mark: {
  //     ...additionalSituationData,
  //     label: 'Mark',
  //   },
  //   Luke: {
  //     ...additionalSituationData,
  //     label: 'Luke',
  //   },
  //   John: {
  //     ...additionalSituationData,
  //     label: 'John',
  //   },
  // };
  // console.log('beforehand', Object.keys(situationData).length, {
  //   ...situationData,
  // });

  console.log({ props }, { situationData });
  // console.log(situationData.Matthew.similarityValues);

  return (
    <Layout pageTitle="Cluster-to-Situation Similarity Appendix">
      <Complete options={allTableHeaders} onSelect={handleAutoCompleteChange} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingBottom: '1rem',
        }}
      >
        {selectedIDs.length > 0 &&
          selectedIDs.map((id) => {
            return (
              <Tag
                key={id}
                closable
                onClose={() =>
                  setSelectedIDs(
                    selectedIDs.filter((closedID) => closedID !== id),
                  )
                }
              >
                {id}
              </Tag>
            );
          })}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <p>
          Currently using{' '}
          <span style={{ color: constants.color.blue }}>
            {useNormalizedSimilarity ? 'normalized' : 'raw'}
          </span>{' '}
          similarity values:&nbsp;&nbsp;
        </p>
        <Tooltip title="Toggle between raw and normalized similarity values">
          <Switch
            checked={useNormalizedSimilarity}
            onChange={(checked) => {
              setUseNormalizedSimilarity(checked);
            }}
          />
        </Tooltip>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <p>Use difference from cluster average&nbsp;&nbsp;</p>
        <Tooltip title="Toggle to display the difference between the raw similarity value and the cluster average">
          <Switch
            checked={useDifferenceFromClusterAverage}
            // disabled={useNormalizedSimilarity}
            onChange={(checked) => {
              setUseDifferenceFromClusterAverage(checked);
            }}
          />
        </Tooltip>
      </div>
      <Table
        dataSource={props.clusterToSituationSimilarities}
        pagination={false}
        columns={[
          {
            title: 'Cluster',
            dataIndex: 'cluster',
            key: 'cluster',
            render: (cluster) => {
              const averageSimilarityForCluster =
                (
                  parseFloat(
                    props.clusterToSituationSimilarities.find(
                      (clusterData) => clusterData.cluster === cluster,
                    ).cluster_avg_similarity,
                  ) * 100
                ).toFixed(2) + '%';
              return (
                <Tooltip
                  title={`This cluster has an average similarity score to all stages of ${averageSimilarityForCluster}`}
                >
                  <Link href={`${server}/clusters/${cluster}`}>
                    <a target="_blank" rel="noopener noreferrer">
                      {clusterLabels[cluster]}
                    </a>
                  </Link>
                  <br />
                </Tooltip>
              );
            },
          },
          ...allTableHeaders
            .filter((header) => selectedIDs.includes(header.value))
            .map((selectedID) => {
              const titleString =
                typeof selectedID.value === 'string'
                  ? selectedID.value.slice(0, 1).toUpperCase() +
                    selectedID.value.slice(1)
                  : selectedID.value;
              return {
                title: titleString,
                dataIndex: selectedID.value,
                key: selectedID.value,
                sorter: (a, b) => {
                  if (useDifferenceFromClusterAverage) {
                    const differenceAFromAverage =
                      a[selectedID.value] - a.cluster_avg_similarity;
                    const differenceBFromAverage =
                      b[selectedID.value] - b.cluster_avg_similarity;
                    return differenceAFromAverage - differenceBFromAverage;
                  }
                  return (
                    parseFloat(a[selectedID.value]) -
                    parseFloat(b[selectedID.value])
                  );
                },
                render: (value, record) => {
                  const { max, min } = situationData[selectedID.value];
                  const normalizedValue =
                    (parseFloat(value) - min) / (max - min) || 0;
                  const normalizedPercentage =
                    (normalizedValue * 100).toFixed(2) + '%';
                  const inverseNormalizedValue =
                    (parseFloat(value) - max) / (min - max) || 0;
                  const differenceFromClusterAverage =
                    parseFloat(value) -
                    parseFloat(record.cluster_avg_similarity);
                  const normalizedDifferenceFromClusterAverage =
                    (differenceFromClusterAverage / (max - min)) * 100;
                  const normalizedDifferenceFromClusterAveragePercentage =
                    normalizedDifferenceFromClusterAverage.toFixed(2) + '%';
                  const numberToUse = useDifferenceFromClusterAverage
                    ? useNormalizedSimilarity
                      ? normalizedDifferenceFromClusterAveragePercentage
                      : differenceFromClusterAverage.toFixed(2)
                    : useNormalizedSimilarity
                    ? normalizedPercentage
                    : value.toFixed(2);
                  return (
                    <Tooltip
                      title={`This is the normalized cosine similarity between ${
                        selectedID.value
                      } (${
                        situationData[selectedID.value]?.label || 'Framework'
                      } and ${clusterLabels[record.cluster]})`}
                      placement="left"
                    >
                      <div
                        style={{
                          backgroundColor: 'white',
                          width: 'max-content',
                        }}
                      >
                        <div
                          style={{
                            backgroundRepeat: 'no-repeat',
                            backgroundImage: `linear-gradient(to right, ${
                              constants.color.blue
                            } ${normalizedValue * 100}%, white ${
                              inverseNormalizedValue * 100
                            }%)`,
                            backgroundSize: `${normalizedValue * 100}% 100%`,
                          }}
                        >
                          {numberToUse}
                        </div>
                      </div>
                    </Tooltip>
                  );
                },
              };
            }),
          {
            title:
              selectedIDs.length > 0
                ? null
                : 'Use the search bar to add comparison situations',
          },
        ]}
      />
    </Layout>
  );
};

export default CosineSimilaritiesTable;

export async function getStaticProps(context) {
  const clusterToSituationSimilarities = await (
    await fetch(`${server}/api/data-tables/cluster-to-situation-similarity`)
  ).json();
  const situationMetadataResponse = await (
    await fetch(`${server}/api/situations`)
  ).json();
  return {
    props: {
      clusterToSituationSimilarities,
      situationMetadataResponse,
    },
  };
}
