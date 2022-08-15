import Link from 'next/link';
import styles from '../../styles/Situations.module.css';
import Layout from '../../components/Layout';
import { Button, Collapse, Table, /* Progress,  */ Tooltip } from 'antd';
import { server } from '../../config';
import { getFirstTitleHyphenatedLowerCaseStringFromTitleString } from '../../functions/getFirstTitleHyphenatedLowerCaseStringFromTitleString';
import { NewTestamentBooks } from '../../types/newTestamentBooks';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
// import Graph from '../../components/Graph';
import { GraphEdge, GraphNode } from '../../types';

interface SituationListProps {
  response: {
    situations: {
      root: {
        situation: {
          $: {
            section: string;
            title: string;
            start: string;
            cluster?: string;
          };
        }[];
      };
    };
    graphData: {
      nodes: GraphNode[];
      links: GraphEdge[];
    };
  };
}

function AllSituations(props: SituationListProps) {
  const [collapseHasActiveKey, setCollapseHasActiveKey] = useState(null);
  const situations = props.response.situations.root;
  const handleScroll = (): void => {
    if (window.scrollY > 100) {
      setCollapseHasActiveKey(true);
    } else {
      setCollapseHasActiveKey(false);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
  const allSituations = situations.situation
    .filter(
      (s) =>
        s.$.section.startsWith('01') ||
        s.$.section.startsWith('02') ||
        s.$.section.startsWith('03') ||
        s.$.section.startsWith('04'),
    )
    .map((situationContainer) => ({
      section: situationContainer.$.section,
      title: situationContainer.$.title,
      start: situationContainer.$.start,
      cluster: situationContainer.$.cluster,
    }));
  const getSituationsByBook = ({ situations, book }): Element[] => {
    const filteredSituationLinks = situations
      .filter((situationContainer) => {
        const situationID = situationContainer.$.section;
        const bookID = parseInt(situationID.split('-')[0]) - 1;
        const situationBook = NewTestamentBooks[bookID];
        if (situationBook === book) {
          return situationContainer.$;
        }
      })
      .map((situationContainer) => {
        const situation = situationContainer.$;
        const titleStringForLink = getFirstTitleHyphenatedLowerCaseStringFromTitleString(
          { string: situation.title },
        );
        return (
          <Link
            href={`/situations/${situation.section}`}
            key={situation.section}
          >
            <a className={styles.row}>
              <p>{situation.section}</p>
              <p>{situation.title}</p>
              <p>{situation.start}</p>
            </a>
          </Link>
        );
      });
    return filteredSituationLinks;
  };
  const allBooksList = new Array(
    ...new Set(
      situations.situation.map((situationContainer) => {
        const situationID = situationContainer.$.section;
        const bookID = parseInt(situationID.split('-')[0]) - 1;
        return NewTestamentBooks[bookID];
      }),
    ),
  );
  return (
    <Layout pageTitle="All Situations">
      {/* <Collapse
        style={{ width: '90vw', maxWidth: '800px' }}
        onChange={(activeKey) => {
          activeKey.length > 0
            ? setCollapseHasActiveKey(true)
            : setCollapseHasActiveKey(false);
        }}
      > */}
      {/* {typeof window !== 'undefined' && (
          <Collapse.Panel
            className={styles.complete_graph}
            key="graph"
            header={<h2>Complete Graph</h2>}
          >
            <p>
              This graph displays all situations for which similarity data is
              available. Node color indicates average similarity to all other
              nodes.
            </p>
            <Progress
              strokeColor={{
                '0%': '#2C7BB6',
                '50%': '#FFFFBF',
                '100%': '#D7191C',
              }}
              percent={100}
              showInfo={false}
              status="active"
            ></Progress>
            <div className={styles.graph}>
              <Graph graphData={props.response.graphData} />
            </div>
          </Collapse.Panel>
        )} */}
      <Table
        dataSource={allSituations}
        columns={[
          {
            title: 'ID',
            dataIndex: 'section',
            width: '8em',
            key: 'section',
            render: (text, record) => (
              <Link href={`/situations/${record.section}`} key={record.section}>
                <a className={styles.cell}>
                  <p>{record.section}</p>
                </a>
              </Link>
            ),
          },
          {
            title: 'Start Verse',
            dataIndex: 'start',
            key: 'start',
            render: (text, record) => (
              <Link href={`/situations/${record.section}`} key={record.section}>
                <a className={styles.cell}>
                  <p>{record.start}</p>
                </a>
              </Link>
            ),
          },
          {
            title: 'Title',
            dataIndex: 'title',
            key: 'section',
            render: (text, record) => (
              <Link href={`/situations/${record.section}`} key={record.section}>
                <a className={styles.cell}>
                  <p>{record.title}</p>
                </a>
              </Link>
            ),
          },
          {
            title: 'Situation Type',
            dataIndex: 'cluster',
            key: 'section',
            render: (text, record) => {
              if (record.cluster) {
                return (
                  <Link
                    href={`/clusters/${record.cluster}`}
                    key={record.cluster}
                  >
                    <a className={styles.cell}>
                      <p>{record.cluster}</p>
                    </a>
                  </Link>
                );
              }
            },
          },
        ]}
        pagination={false}
      />
      {/* {allBooksList.map((book) => {
          return (
            <Collapse.Panel header={book} key={`${book}`}>
              <div className={styles.list}>
                {getSituationsByBook({
                  situations: situations.situation,
                  book,
                })}
              </div>
            </Collapse.Panel>
          );
        })} */}
      {/* </Collapse> */}
      <Tooltip title="Scroll to top" placement="top">
        <Button
          style={{
            display: collapseHasActiveKey ? 'block' : 'none',
            position: 'fixed',
            bottom: 50,
            zIndex: 100,
            // width: 'max-content',
          }}
          icon={<VerticalAlignTopOutlined />}
          onClick={() => {
            (document && (document.body.scrollTop = 0)) ||
              (document && (document.documentElement.scrollTop = 0));
          }}
        ></Button>
      </Tooltip>
    </Layout>
  );
}

export default AllSituations;

export async function getStaticProps(context) {
  const response = await (await fetch(`${server}/api/situations`)).json();

  return {
    props: {
      response: response,
    },
  };
}
