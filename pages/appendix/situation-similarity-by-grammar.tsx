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
  tableDataResponse: {
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
  const allTableHeaders = Object.keys(props.tableDataResponse[0])
    .slice(1)
    .map((header) => ({ value: header }));
  const tableDataWithMetadata = props.tableDataResponse.map((situation) => {
    return {
      ...situation,
      metadata: props.situationMetadataResponse.situations.root.situation.filter(
        (metadata) => situation.id.includes(metadata.$.section),
      ),
    };
  });
  function handleAutoCompleteChange(value) {
    if (selectedIDs.includes(value)) {
      setSelectedIDs(selectedIDs.filter((id) => id !== value));
    } else {
      setSelectedIDs([...selectedIDs, value]);
    }
  }
  return (
    <Layout pageTitle="Features Table Appendix">
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
        dataSource={tableDataWithMetadata}
        pagination={false}
        columns={[
          {
            title: 'Situation Start Reference and Title',
            dataIndex: 'metadata',
            key: 'metadata',
            render: (allMetadata, record) => {
              return (
                <span>
                  {allMetadata?.map((metadata) => {
                    const startReference = metadata.$.start
                      .replace('SBLGNT.', '')
                      .replace('.w1', '');
                    const sectionID = metadata.$.section;
                    const title = metadata.$.title;
                    return (
                      <div key={sectionID}>
                        {metadata.$.cluster && (
                          <>
                            <Link
                              href={`${server}/clusters/${metadata.$.cluster}`}
                            >
                              <a>{clusterLabels[metadata.$.cluster]}</a>
                            </Link>
                            <br />
                          </>
                        )}
                        <b>{startReference}</b> {title} <br />
                      </div>
                    );
                  })}
                </span>
              );
            },
          },
          {
            title: 'Situation ID',
            dataIndex: 'id',
            key: 'id',
            render: (id, record) => {
              return (
                <span>
                  {typeof id === 'string'
                    ? id.slice(0, 1).toUpperCase() + id.slice(1)
                    : id}
                </span>
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
        ]}
      />
    </Layout>
  );
};

export default CosineSimilaritiesTable;

export async function getStaticProps(context) {
  const tableDataResponse = await (
    await fetch(`${server}/api/data-tables/situation-similarity-by-grammar`)
  ).json();
  const situationMetadataResponse = await (
    await fetch(`${server}/api/situations`)
  ).json();
  return {
    props: {
      tableDataResponse,
      situationMetadataResponse,
    },
  };
}
