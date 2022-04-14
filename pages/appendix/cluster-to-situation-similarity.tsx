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
import { whileStatement } from '@babel/types';

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
  const allTableHeaders = Object.keys(props.clusterToSituationSimilarities[0])
    .slice(1)
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

  // Gather all similarity values by stageId instead of cluster
  props.clusterToSituationSimilarities.map((cluster) => {
    Object.keys(cluster)
      .filter((stageId) => stageId !== 'cluster')
      .forEach((stageId) => {
        const similarityValue = parseFloat(cluster[stageId]);
        situationData[stageId]?.similarityValues.push({
          clusterId: cluster.cluster,
          similarityValue,
        });
      });
  });
  // Determine max and min similarity values for each situation in situationData
  Object.keys(situationData).forEach((situationId) => {
    if (situationData[situationId].similarityValues.length > 0) {
      const situation = situationData[situationId];
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
      <Table
        dataSource={props.clusterToSituationSimilarities}
        pagination={false}
        columns={[
          {
            title: 'Cluster',
            dataIndex: 'cluster',
            key: 'cluster',
            render: (cluster) => (
              <>
                <Link href={`${server}/clusters/${cluster}`}>
                  <a target="_blank" rel="noopener noreferrer">
                    {clusterLabels[cluster]}
                  </a>
                </Link>
                <br />
              </>
            ),
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
                sorter: (a, b) =>
                  parseFloat(a[selectedID.value]) -
                  parseFloat(b[selectedID.value]),
                render: (value, record) => {
                  const { max, min } = situationData[selectedID.value];
                  const normalizedValue =
                    (parseFloat(value) - min) / (max - min);
                  const inverseNormalizedValue =
                    (parseFloat(value) - max) / (min - max);
                  console.log(normalizedValue, inverseNormalizedValue);
                  return (
                    <Tooltip
                      title={`This is the normalized cosine similarity between ${
                        selectedID.value
                      } (${situationData[selectedID.value].label} and ${
                        clusterLabels[record.cluster]
                      })`}
                      placement="left"
                    >
                      <div
                        style={{
                          backgroundColor: 'white',
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
                          {useNormalizedSimilarity
                            ? (normalizedValue * 100).toFixed(2) + ' %'
                            : value.toFixed(2)}
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
