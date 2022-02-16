import Link from 'next/link';
import styles from '../../styles/Home.module.css';
import Layout from '../../components/Layout';
import { Button, Collapse, /* Progress,  */ Tooltip } from 'antd';
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
          $: { section: string; title: string; start: string };
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
            <a className={styles.card}>
              <p>{situation.title}</p>
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
      <Collapse
        style={{ width: '90vw', maxWidth: '800px' }}
        onChange={(activeKey) => {
          activeKey.length > 0
            ? setCollapseHasActiveKey(true)
            : setCollapseHasActiveKey(false);
        }}
      >
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
        {allBooksList.map((book) => {
          return (
            <Collapse.Panel header={book} key={`${book}`}>
              <div className={styles.grid}>
                {getSituationsByBook({
                  situations: situations.situation,
                  book,
                })}
              </div>
            </Collapse.Panel>
          );
        })}
      </Collapse>
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
