/* eslint-disable react/jsx-key */
import { server } from '../../config';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';
import styles from '../../styles/Home.module.css';
import { Tag, Tooltip } from 'antd';
import { getFirstTitleHyphenatedLowerCaseStringFromTitleString } from '../../functions/getFirstTitleHyphenatedLowerCaseStringFromTitleString';
import { getSentenceCaseString } from '../../functions/getSentenceCaseString';
import getSystemFromFeature from '../../functions/getSystemFromFeature';
import { systemsDictionary } from '../../types/systemDefinitions';
import { GraphEdge, GraphNode } from '../../types';

interface EpisodeProps {
  response: {
    currentEpisode: Episode;
    previousEpisode?: Episode;
    nextEpisode?: Episode;
    similarNodes?: GraphNode[];
    similarEdges?: GraphEdge[];
  };
}

type Episode = {
  episode: string;
  title: string;
  preTextFeatures: string[];
  viaTextFeatures: string[];
};

const ForceGraph2DDynamicLoad = dynamic(
  () => import('../../components/ForceGraph2DDynamicLoad'),
  {
    ssr: false,
  },
);

const EpisodePage: React.FC<EpisodeProps> = (props) => {
  const currentEpisode = props.response.currentEpisode;
  if (currentEpisode) {
    const nextTitle = props.response.nextEpisode?.title;
    const previousTitle = props.response.previousEpisode?.title;
    const sharedFeatures =
      Array.isArray(currentEpisode.preTextFeatures) &&
      currentEpisode.preTextFeatures?.filter((feature) =>
        currentEpisode.viaTextFeatures.includes(feature),
      );
    const mutations = [];
    Array.isArray(currentEpisode.preTextFeatures) &&
      currentEpisode.preTextFeatures.forEach(
        (feature) =>
          !currentEpisode.viaTextFeatures.includes(feature) &&
          mutations.push(feature),
      );
    Array.isArray(currentEpisode.viaTextFeatures) &&
      currentEpisode.viaTextFeatures.forEach(
        (feature) =>
          !currentEpisode.preTextFeatures.includes(feature) &&
          mutations.push(feature),
      );
    return (
      <Layout
        pageTitle={currentEpisode.title}
        pageDescription={`Episode analysis for ${currentEpisode.title}`}
      >
        {(mutations.length > 0 && (
          <div>
            <h2>Situation Mutations</h2>
            <div>
              <h3>Field</h3>
              {Object.keys(systemsDictionary.field).map((system) => {
                return (
                  <div>
                    {systemsDictionary.field[system]
                      .filter((feature) => mutations.includes(feature))
                      .filter((mutation) =>
                        currentEpisode.preTextFeatures.includes(mutation),
                      )
                      .map((mutation) => (
                        <span>
                          {mutation}{' '}
                          <span style={{ color: '#1890ff' }}>&rarr;</span>{' '}
                        </span>
                      ))}
                    {systemsDictionary.field[system]
                      .filter((feature) => mutations.includes(feature))
                      .filter((mutation) =>
                        currentEpisode.viaTextFeatures.includes(mutation),
                      )}
                  </div>
                );
              })}
            </div>
            <div>
              <h3>Tenor</h3>
              {Object.keys(systemsDictionary.tenor).map((system) => {
                return (
                  <div>
                    {systemsDictionary.tenor[system]
                      .filter((feature) => mutations.includes(feature))
                      .filter((mutation) =>
                        currentEpisode.preTextFeatures.includes(mutation),
                      )
                      .map((mutation) => (
                        <span>
                          {mutation}{' '}
                          <span style={{ color: '#1890ff' }}>&rarr;</span>{' '}
                        </span>
                      ))}
                    {systemsDictionary.tenor[system]
                      .filter((feature) => mutations.includes(feature))
                      .filter((mutation) =>
                        currentEpisode.viaTextFeatures.includes(mutation),
                      )}
                  </div>
                );
              })}
            </div>
            <div>
              <h3>Mode</h3>
              {Object.keys(systemsDictionary.mode).map((system) => {
                return (
                  <div>
                    {systemsDictionary.mode[system]
                      .filter((feature) => mutations.includes(feature))
                      .filter((mutation) =>
                        currentEpisode.preTextFeatures.includes(mutation),
                      )
                      .map((mutation) => (
                        <span>
                          {mutation}{' '}
                          <span style={{ color: '#1890ff' }}>&rarr;</span>{' '}
                        </span>
                      ))}
                    {systemsDictionary.mode[system]
                      .filter((feature) => mutations.includes(feature))
                      .filter((mutation) =>
                        currentEpisode.viaTextFeatures.includes(mutation),
                      )}
                  </div>
                );
              })}
            </div>
          </div>
        )) || <h2>Non-mutating situation</h2>}
        <div
          style={{ display: 'flex', maxWidth: '90vw', flexDirection: 'row' }}
        >
          <div
            style={{ display: 'flex', flexFlow: 'column', maxWidth: '42vw' }}
          >
            <h2>Pre-text Features</h2>
            {Array.isArray(currentEpisode.preTextFeatures) ? ( // TODO: abstract this entire feature-map
              currentEpisode.preTextFeatures.map((feature) => {
                const featureTruncated =
                  feature.length > 18
                    ? `${feature.slice(0, 10)}...${feature.slice(-10)}`
                    : feature;
                try {
                  const system = getSystemFromFeature(feature);
                  const registerParameter = getSystemFromFeature(feature, true);

                  const highlightColor =
                    registerParameter === 'field'
                      ? 'orange'
                      : registerParameter === 'tenor'
                      ? 'red'
                      : registerParameter === 'mode'
                      ? 'green'
                      : 'grey';
                  if (currentEpisode.viaTextFeatures.includes(feature)) {
                    return (
                      <Tooltip
                        title={getSentenceCaseString(system) + ': ' + feature}
                      >
                        <Tag>{featureTruncated}</Tag>
                      </Tooltip>
                    );
                  } else {
                    return (
                      <Tooltip
                        title={getSentenceCaseString(system) + ': ' + feature}
                      >
                        <Tag color={highlightColor}>{featureTruncated}</Tag>
                      </Tooltip>
                    );
                  }
                } catch (error) {
                  return <Tag>{featureTruncated}</Tag>;
                }
              })
            ) : (
              <Tag>{currentEpisode.preTextFeatures}</Tag>
            )}
          </div>
          <div
            style={{ display: 'flex', flexFlow: 'column', maxWidth: '42vw' }}
          >
            <h2>Via-text Features</h2>
            {Array.isArray(currentEpisode.viaTextFeatures) ? (
              currentEpisode.viaTextFeatures.map((feature) => {
                const featureTruncated =
                  feature.length > 18
                    ? `${feature.slice(0, 10)}...${feature.slice(-10)}`
                    : feature;
                try {
                  const system = getSystemFromFeature(feature);
                  const registerParameter = getSystemFromFeature(feature, true);
                  const highlightColor = // TODO: abstract highlight colour getter
                    registerParameter === 'field'
                      ? 'orange'
                      : registerParameter === 'tenor'
                      ? 'red'
                      : registerParameter === 'mode'
                      ? 'green'
                      : 'grey';
                  if (currentEpisode.preTextFeatures.includes(feature)) {
                    return (
                      <Tooltip
                        title={getSentenceCaseString(system) + ': ' + feature}
                      >
                        <Tag>{featureTruncated}</Tag>
                      </Tooltip>
                    );
                  } else {
                    return (
                      <Tooltip
                        title={getSentenceCaseString(system) + ': ' + feature}
                      >
                        <Tag color={highlightColor}>{featureTruncated}</Tag>
                      </Tooltip>
                    );
                  }
                } catch (error) {
                  return <Tag>{featureTruncated}</Tag>;
                }
              })
            ) : (
              <Tag>{currentEpisode.viaTextFeatures}</Tag>
            )}
          </div>
        </div>
        <div style={{ maxHeight: '50vh', border: '1px' }} id="graph-container">
          {typeof window !== 'undefined' && (
            <ForceGraph2DDynamicLoad
              graphData={{
                links: props.response.similarEdges,
                nodes: props.response.similarNodes,
              }}
            />
          )}
        </div>
        <div
          className={styles.grid}
          style={{
            display: 'flex',
            flexFlow: 'row nowrap',
            maxWidth: '90vw',
          }}
        >
          {/* TODO: add keyframes and transition to previous or next episodes? */}
          {/* FIXME: previous and next buttons only increment single-digit changes? Go to index 0 and press 'previous' */}
          {previousTitle && (
            <Link
              href={`/episodes/${getFirstTitleHyphenatedLowerCaseStringFromTitleString(
                {
                  string: previousTitle,
                },
              )}`}
            >
              <a className={styles.card}>&larr; Previous Episode</a>
            </Link>
          )}
          <Link href={`/episodes`}>
            <a className={styles.card}>&darr; Back to all episodes</a>
          </Link>
          {nextTitle && (
            <Link
              href={`/episodes/${getFirstTitleHyphenatedLowerCaseStringFromTitleString(
                {
                  string: nextTitle,
                },
              )}`}
            >
              <a className={styles.card}>Next Episode &rarr;</a>
            </Link>
          )}
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Link href="/episodes">
          <div>
            <h1>Episode data not found</h1>
            <p>Back to all episodes</p>
          </div>
        </Link>
      </Layout>
    );
  }
};

export default EpisodePage;

export async function getStaticProps(context: { params: { title: string } }) {
  const hasContext = !!(Object.keys(context.params).length > 0);
  if (hasContext) {
    const response = await (
      await fetch(`${server}/api/episodes/${context.params.title}`)
    ).json();
    return {
      props: {
        response,
      },
    };
  } else {
    return {
      props: {},
    };
  }
}

export const getStaticPaths = async () => {
  const response = await (await fetch(`${server}/api/episodes/`)).json();
  const titles = response?.episodes.episode.map((episodeContainer) => {
    return getFirstTitleHyphenatedLowerCaseStringFromTitleString({
      string: episodeContainer.$.title,
    });
  });
  const paths = titles?.map((title) => ({
    params: { title: title.toString() },
  }));
  return {
    paths,
    fallback: false,
  };
};
