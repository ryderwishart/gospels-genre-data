import Link from 'next/link';
import styles from '../../styles/Home.module.css';
import Layout from '../../components/Layout';
import { Button, Collapse, Tooltip } from 'antd';
import { server } from '../../config';
import { getFirstTitleHyphenatedLowerCaseStringFromTitleString } from '../../functions/getFirstTitleHyphenatedLowerCaseStringFromTitleString';
import { NewTestamentBooks } from '../../types/newTestamentBooks';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const AllEpisodes = (props) => {
  const [collapseHasActiveKey, setCollapseHasActiveKey] = useState(null);
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
      props.response.episodes.episode.map((episodeContainer) => {
        const episodeID = episodeContainer.$.section;
        const bookID = parseInt(episodeID.split('-')[0]) - 1;
        return NewTestamentBooks[bookID];
      }),
    ),
  );
  console.log(allBooksList);
  return (
    <Layout pageTitle="All Episodes">
      <Collapse
        onChange={(activeKey) => {
          console.log({ activeKey });
          activeKey.length > 0
            ? setCollapseHasActiveKey(true)
            : setCollapseHasActiveKey(false);
        }}
      >
        {allBooksList.map((book) => {
          return (
            <Collapse.Panel header={book} key={`${book}`}>
              <div className={styles.grid}>
                {getEpisodesByBook({
                  episodes: props.response.episodes.episode,
                  book,
                })}
              </div>
            </Collapse.Panel>
          );
        })}
      </Collapse>
      <Tooltip title="Scroll to top" placement="left">
        <Button
          style={{
            display: collapseHasActiveKey ? 'block' : 'none',
            position: 'fixed',
            bottom: 20,
            right: 20,
          }}
          icon={<VerticalAlignTopOutlined />}
          onClick={() => {
            (document && (document.body.scrollTop = 0)) ||
              (document && (document.documentElement.scrollTop = 0));
          }}
        />
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
