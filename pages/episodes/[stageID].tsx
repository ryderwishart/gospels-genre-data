/* eslint-disable react/jsx-key */
import { server } from '../../config';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Graph from '../../components/Graph';
import styles from '../../styles/Home.module.css';
import {
  Button,
  Drawer,
  InputNumber,
  Tag,
  Tooltip,
  Slider,
  Collapse,
} from 'antd';
import { getFirstTitleHyphenatedLowerCaseStringFromTitleString } from '../../functions/getFirstTitleHyphenatedLowerCaseStringFromTitleString';
import { getSentenceCaseString } from '../../functions/getSentenceCaseString';
import getSystemFromFeature from '../../functions/getSystemFromFeature';
import { Episode, GraphEdge, GraphNode } from '../../types';
import { useState } from 'react';
import MutationSet from '../../components/MutationSet';
import { getURLSlugFromClusterName } from '../../functions/getURLSlugFromClusterName';
import clusterLabels from '../../types/clusterLabels';
import SpeechActContainer from '../../components/SpeechActContainer';
import MoveContainer from '../../components/MoveContainer';

interface EpisodeProps {
  response: {
    currentEpisode: Episode;
    previousEpisode?: Episode;
    nextEpisode?: Episode;
    similarNodes?: GraphNode[];
    similarEdges?: GraphEdge[];
    currentEpisodeMetaData?: {
      title: string;
      start: string;
      section: string;
      mormorphGntId: string;
      cluster?: string;
    };
  };
  speechActsResponse: {
    speechActs: {
      [key: string]: any;
    }[];
  };
}

const EpisodePage: React.FC<EpisodeProps> = (props) => {
  console.log(props);
  const [showWordings, setShowWordings] = useState(false);
  const [useGraphLabel, setUseGraphLabel] = useState(false);
  const [isResponsive, setIsResponsive] = useState(null);
  const [edgeStrengthInputValue, setEdgeStrengthInputValue] = useState<number>(
    0.8,
  );
  const [drawerIsVisible, setDrawerIsVisible] = useState(false);
  const currentEpisode = props.response?.currentEpisode;
  if (currentEpisode) {
    const filteredEdges = props.response.similarEdges.filter((similarEdge) => {
      return similarEdge.weight >= edgeStrengthInputValue;
    });

    const filteredNodes = props.response.similarNodes;

    const graphData = {
      links: filteredEdges,
      nodes: props.response.similarNodes,
    };

    const nextEpisode = props.response.nextEpisode?.episode;
    const previousEpisode = props.response.previousEpisode?.episode;
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

    const episodeStartReferenceArray = props.response.currentEpisodeMetaData?.start.split(
      '.',
    );
    const episodeStartReference =
      episodeStartReferenceArray &&
      `Starts at ${episodeStartReferenceArray[1]} ${episodeStartReferenceArray[2]}:${episodeStartReferenceArray[3]}`;

    const episodeCluster = clusterLabels[
      props.response.currentEpisodeMetaData?.cluster
    ]
      ? clusterLabels[props.response.currentEpisodeMetaData?.cluster]
      : props.response.currentEpisodeMetaData?.cluster;

    return (
      <Layout
        pageTitle={currentEpisode.title}
        pageDescription={`Episode analysis for ${currentEpisode.title}`}
      >
        {episodeStartReference && episodeStartReference}
        <br />
        {episodeCluster && (
          <Link
            href={`${server}/clusters/${getURLSlugFromClusterName({
              string: props.response.currentEpisodeMetaData.cluster,
            })}`}
          >
            <p>
              Situation type: <a>{episodeCluster}</a>
            </p>
          </Link>
        )}
        <Collapse defaultActiveKey={['moves-and-speech-acts']}>
          <Collapse.Panel
            header="Moves and Speech Acts"
            key="moves-and-speech-acts"
          >
            <div
              style={{
                display: 'flex',
                flexFlow: 'column',
                marginTop: '1em',
              }}
            >
              <h2>Speech Acts</h2>
              <div
                style={{
                  maxWidth: '700px',
                  // display: 'flex',
                  // flexDirection: 'column',
                  // gridTemplateColumns: 'auto auto auto',
                }}
              >
                {Array.isArray(props.speechActsResponse[0]?.move)
                  ? props.speechActsResponse[0]?.move.map((moveData) => {
                      return <MoveContainer move={moveData} />;
                    })
                  : props.speechActsResponse[0]?.move && (
                      <MoveContainer move={props.speechActsResponse[0]?.move} />
                    )}
              </div>
            </div>
          </Collapse.Panel>
          <Collapse.Panel
            header="Situational Features"
            key="situational-features"
          >
            <div
              style={{
                display: 'flex',
                maxWidth: '90vw',
                flexDirection: 'row',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexFlow: 'column',
                  maxWidth: '42vw',
                }}
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
                      const registerParameter = getSystemFromFeature(
                        feature,
                        true,
                      );

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
                            key={feature}
                            title={
                              getSentenceCaseString(system) + ': ' + feature
                            }
                          >
                            <Tag>{featureTruncated}</Tag>
                          </Tooltip>
                        );
                      } else {
                        return (
                          <Tooltip
                            key={feature}
                            title={
                              getSentenceCaseString(system) + ': ' + feature
                            }
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
                style={{
                  display: 'flex',
                  flexFlow: 'column',
                  maxWidth: '42vw',
                }}
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
                      const registerParameter = getSystemFromFeature(
                        feature,
                        true,
                      );
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
                            title={
                              getSentenceCaseString(system) + ': ' + feature
                            }
                          >
                            <Tag>{featureTruncated}</Tag>
                          </Tooltip>
                        );
                      } else {
                        return (
                          <Tooltip
                            title={
                              getSentenceCaseString(system) + ': ' + feature
                            }
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
          </Collapse.Panel>
          <Collapse.Panel
            header="Situational Mutations"
            key="situational-mutations"
          >
            {(mutations.length > 0 && (
              <div>
                <h2>Situation Mutations</h2>
                <div>
                  <div>
                    <h3>Field</h3>
                    <hr />
                    <MutationSet
                      preAndViaFeatureSets={currentEpisode}
                      mutations={mutations}
                      registerParameterSelection="field"
                    />
                  </div>
                  <div>
                    <h3>Tenor</h3>
                    <hr />
                    <MutationSet
                      preAndViaFeatureSets={currentEpisode}
                      mutations={mutations}
                      registerParameterSelection="tenor"
                    />
                  </div>
                  <div>
                    <h3>Mode</h3>
                    <hr />
                    <MutationSet
                      preAndViaFeatureSets={currentEpisode}
                      mutations={mutations}
                      registerParameterSelection="mode"
                    />
                  </div>
                </div>
              </div>
            )) || <h2>Non-mutating situation</h2>}
          </Collapse.Panel>
        </Collapse>

        <Button
          style={{ margin: '20px' }}
          onClick={() => setDrawerIsVisible(drawerIsVisible ? false : true)}
        >
          Open Drawer
        </Button>
        <div className={styles.graph}>
          {typeof window !== 'undefined' && (
            <Graph graphData={graphData} cooldown={50} />
          )}
        </div>
        <ul>
          {graphData.nodes.map((node) => {
            const nodeID = node.id
              .split(' ')
              .filter((idSection) => idSection.includes('-'))
              .join(' ');
            const nodeTitle = node.id
              .split(/[,'".’“”]+/)
              .join('')
              .split(' ')
              .filter((idSection) => !idSection.includes('-'))
              .join(' ');
            const currentEpisodeID = currentEpisode.episode
              .split(' ')
              .filter((idSection) => idSection.includes('-'))
              .join(' ');
            if (!currentEpisodeID.includes(nodeID)) {
              const nodeEpisodeLinkString = getFirstTitleHyphenatedLowerCaseStringFromTitleString(
                { string: nodeTitle },
              );
              const nodeSimilarityToCentralNode = graphData.links.find(
                (edge) => {
                  const edgeIDs = edge.id
                    .split(/[,'".’“”]+/)
                    .join('')
                    .split('-')
                    .join(' ');
                  if (edgeIDs.includes(node.id)) {
                    return edge;
                  }
                },
              )?.size;
              return (
                <li id={node.id}>
                  <Link href={`/episodes/${nodeEpisodeLinkString}`}>
                    <a>
                      {node.label}{' '}
                      <strong>{nodeSimilarityToCentralNode}</strong>
                    </a>
                  </Link>
                </li>
              );
            }
          })}
        </ul>

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
          {previousEpisode && (
            <Link href={`/episodes/${previousEpisode}`}>
              <a className={styles.card}>&larr; Previous Episode</a>
            </Link>
          )}
          <Link href={`/episodes`}>
            <a className={styles.card}>&darr; Back to all episodes</a>
          </Link>
          {nextEpisode && (
            <Link href={`/episodes/${nextEpisode}`}>
              <a className={styles.card}>Next Episode &rarr;</a>
            </Link>
          )}
        </div>
        <Drawer
          visible={drawerIsVisible}
          onClose={() => setDrawerIsVisible(false)}
        >
          <br />

          {/* <Button
            onClick={() => setUseGraphLabel(useGraphLabel ? false : true)}
          >
            {useGraphLabel ? 'Hide labels' : 'Show labels'}
          </Button> */}
          <Slider
            min={0.8}
            max={1.0}
            step={0.01}
            value={
              typeof edgeStrengthInputValue === 'number'
                ? edgeStrengthInputValue
                : 0
            }
            onChange={(value) => value && setEdgeStrengthInputValue(value)}
          />
          <InputNumber
            defaultValue={edgeStrengthInputValue}
            min={0.8}
            max={1.0}
            step={0.01}
            onChange={(value) => setEdgeStrengthInputValue(value)}
          />
          <div>
            <h4>Nodes</h4>
            {filteredNodes.map((node) => {
              return (
                <div key={node.id}>
                  {node.label}
                  <ul>
                    <li>
                      Average Similarity:{' '}
                      <strong>
                        {parseFloat(node.attributes.average_similarity).toFixed(
                          2,
                        )}
                      </strong>
                    </li>
                    <li>
                      Number of connections:{' '}
                      <strong>{node.attributes.Degree}</strong>
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>
          <div>
            <h4>Links</h4>
            {props.response.similarEdges.map((edge) => {
              return (
                <p>
                  {edge.id} <strong>{edge.weight}</strong>
                </p>
              );
            })}
          </div>
        </Drawer>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Link href="/episodes">
          <div className={styles.card}>
            <h1>Episode data not found</h1>
            <p>Back to all episodes</p>
          </div>
        </Link>
      </Layout>
    );
  }
};

export default EpisodePage;

export async function getStaticProps(context: { params: { stageID: string } }) {
  const hasContext = !!(Object.keys(context.params).length > 0);
  if (hasContext) {
    const response = await (
      await fetch(`${server}/api/episodes/${context.params.stageID}`)
    ).json();
    const speechActsResponse = await (
      await fetch(`${server}/api/speech-acts/${context.params.stageID}`)
    ).json();
    return {
      props: {
        response,
        speechActsResponse,
      },
    };
  } else {
    return {
      props: {},
    };
  }
}

export const getStaticPaths = async () => {
  const episodesResponse = await (
    await fetch(`${server}/api/episodes/`)
  ).json();
  const stageIDs = episodesResponse?.episodes.root.episode.map(
    (episodeContainer) => episodeContainer.$.section,
  );
  const paths = stageIDs?.map((stageID) => ({
    params: { stageID: stageID.toString() },
  }));
  return {
    paths,
    fallback: false,
  };
};
