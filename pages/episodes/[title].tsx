/* eslint-disable react/jsx-key */
import { server } from '../../config';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';
import styles from '../../styles/Home.module.css';
import {
  Button,
  Collapse,
  Drawer,
  InputNumber,
  Tag,
  Tooltip,
  Slider,
} from 'antd';
import { getFirstTitleHyphenatedLowerCaseStringFromTitleString } from '../../functions/getFirstTitleHyphenatedLowerCaseStringFromTitleString';
import { getSentenceCaseString } from '../../functions/getSentenceCaseString';
import getSystemFromFeature from '../../functions/getSystemFromFeature';
import { systemsDictionary } from '../../types/systemDefinitions';
import { GraphEdge, GraphNode } from '../../types';
import SpriteText from 'three-spritetext';
import { useEffect, useState } from 'react';

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

const ForceGraph3DDynamicLoad = dynamic(
  () => import('../../components/ForceGraphDynamicLoad'),
  {
    ssr: false,
  },
);

const EpisodePage: React.FC<EpisodeProps> = (props) => {
  const [useGraphLabel, setUseGraphLabel] = useState(false);
  const [filteredEdges, setFilteredEdges] = useState<GraphEdge[]>(
    props.response.similarEdges,
  );
  const [filteredNodes, setFilteredNodes] = useState<GraphNode[]>(
    props.response.similarNodes,
  );
  const [edgeStrengthInputValue, setEdgeStrengthInputValue] = useState<number>(
    null,
  );
  const [drawerIsVisible, setDrawerIsVisible] = useState(false);

  // useEffect(() => {
  //   async () => updateFilteredGraphData();
  // }, [edgeStrengthInputValue]);

  // const updateFilteredGraphData = async () => {
  //   const edgeIDReferences = [];
  //   const updatedEdges = props.response.similarEdges.filter(
  //     (edge) => edge.weight > edgeStrengthInputValue / 100,
  //   );
  //   updatedEdges.forEach((edge) => {
  //     edgeIDReferences.push(edge.source);
  //     edgeIDReferences.push(edge.target);
  //   });
  //   const updatedNodes = props.response.similarNodes.filter((node) =>
  //     edgeIDReferences.includes(node),
  //   );
  //   setFilteredEdges(updatedEdges);
  //   setFilteredNodes(updatedNodes);
  // };

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
        <Button
          style={{ margin: '20px' }}
          onClick={() => setDrawerIsVisible(drawerIsVisible ? false : true)}
        >
          Open Drawer
        </Button>
        {typeof window !== 'undefined' && (
          <div className={styles.card}>
            <ForceGraph3DDynamicLoad
              width={500}
              height={400}
              linkVisibility={false}
              graphData={{
                nodes: props.response.similarNodes,
                links: props.response.similarEdges,
              }}
              nodeThreeObject={(node) => {
                if (useGraphLabel) {
                  const sprite = new SpriteText(node.id);
                  sprite.material.depthWrite = false; // NOTE: make sprite background transparent
                  sprite.color = '#fff';
                  sprite.textHeight = 3;
                  return sprite;
                }
              }}
            />
          </div>
        )}
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
        <Drawer
          visible={drawerIsVisible}
          onClose={() => setDrawerIsVisible(false)}
        >
          <Slider
            min={0.0}
            max={1.0}
            step={0.01}
            value={
              typeof edgeStrengthInputValue === 'number'
                ? edgeStrengthInputValue
                : 0
            }
            onChange={(value) => setEdgeStrengthInputValue(value)}
          ></Slider>
          <InputNumber
            defaultValue={edgeStrengthInputValue}
            min={0}
            max={100}
            onChange={(value) => setEdgeStrengthInputValue(value)}
          ></InputNumber>
          <Button
            onClick={() => setUseGraphLabel(useGraphLabel ? false : true)}
          >
            {useGraphLabel ? 'Hide labels' : 'Show labels'}
          </Button>
        </Drawer>
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
