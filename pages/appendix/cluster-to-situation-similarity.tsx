import { server } from '../../config';
import Layout from '../../components/Layout';
import { AutoComplete, Input, Table, Tag, Tooltip } from 'antd';
import jsonpath from 'jsonpath';
import { SituationMetadata } from '../../types';
import { useState } from 'react';
import { UnorderedListOutlined } from '@ant-design/icons';
import clusterLabels from '../../types/clusterLabels';
import Link from 'next/link';

interface AutoCompleteProps {
  options: { value: string }[];
  onSelect: (state: any) => void;
}

const Complete: React.FC<AutoCompleteProps> = (props) => {
  function handleSelect(value: string) {
    props.onSelect(value);
  }
  return (
    <>
      <p>
        Select situations using this search box in order to add comparison
        columns to the table
      </p>
      <AutoComplete
        options={Array.isArray(props.options) ? props.options : [props.options]}
        autoFocus
        onSelect={(value) => handleSelect(value)}
      >
        <Input
          placeholder="Select situation IDs to filter the table..."
          addonAfter={<UnorderedListOutlined />}
          width={300}
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
                  <a>{clusterLabels[cluster]}</a>
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
                  return (
                    <Tooltip
                      title={`This is the cosine similarity between ${selectedID.value} and ${record.id}`}
                      placement="left"
                    >
                      {typeof value === 'string'
                        ? value?.slice(0, 1).toUpperCase() + value?.slice(1)
                        : value}
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
