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

interface EpisodeListProps {
  response: {
    episodes: {
      episodes: {
        episode: {
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

const AllEpisodes = (props: EpisodeListProps) => {
  const [collapseHasActiveKey, setCollapseHasActiveKey] = useState(null);
  const episodes = props.response.episodes.episodes;
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
  const getEpisodesByBook = ({ episodes, book }): Element[] => {
    const filteredEpisodeLinks = episodes
      .filter((episodeContainer) => {
        const episodeID = episodeContainer.$.section;
        const bookID = parseInt(episodeID.split('-')[0]) - 1;
        const episodeBook = NewTestamentBooks[bookID];
        if (episodeBook === book) {
          return episodeContainer.$;
        }
      })
      .map((episodeContainer) => {
        const episode = episodeContainer.$;
        const titleStringForLink = getFirstTitleHyphenatedLowerCaseStringFromTitleString(
          { string: episode.title },
        );
        return (
          <Link href={`/episodes/${titleStringForLink}`} key={episode.section}>
            <a className={styles.card}>
              <p>{episode.title}</p>
            </a>
          </Link>
        );
      });
    return filteredEpisodeLinks;
  };
  const allBooksList = new Array(
    ...new Set(
      episodes.episode.map((episodeContainer) => {
        const episodeID = episodeContainer.$.section;
        const bookID = parseInt(episodeID.split('-')[0]) - 1;
        return NewTestamentBooks[bookID];
      }),
    ),
  );
  return (
    <Layout pageTitle="All Episodes">
      <Collapse
        style={{ width: '90vw', maxWidth: '1200px' }}
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
              This graph displays all episodes for which similarity data is
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
                {getEpisodesByBook({
                  episodes: episodes.episode,
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
};

export default AllEpisodes;

export async function getStaticProps(context) {
  const response = await (await fetch(`${server}/api/episodes`)).json();

  return {
    props: {
      response: response,
    },
  };
}
