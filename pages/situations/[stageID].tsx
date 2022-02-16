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
import { Situation, GraphEdge, GraphNode } from '../../types';
import { useState } from 'react';
import MutationSet from '../../components/MutationSet';
import { getURLSlugFromClusterName } from '../../functions/getURLSlugFromClusterName';
import clusterLabels from '../../types/clusterLabels';
import SpeechActContainer from '../../components/SpeechActContainer';
import MoveContainer from '../../components/MoveContainer';

interface SituationProps {
  response: {
    currentSituation: Situation;
    previousSituation?: Situation;
    nextSituation?: Situation;
    similarNodes?: GraphNode[];
    similarEdges?: GraphEdge[];
    currentSituationMetaData?: {
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

const SituationPage: React.FC<SituationProps> = (props) => {
  const [showWordings, setShowWordings] = useState(false);
  const [useGraphLabel, setUseGraphLabel] = useState(false);
  const [isResponsive, setIsResponsive] = useState(null);
  const [edgeStrengthInputValue, setEdgeStrengthInputValue] = useState<number>(
    0.8,
  );
  const [drawerIsVisible, setDrawerIsVisible] = useState(false);
  const currentSituation = props.response?.currentSituation;
  if (currentSituation) {
    const filteredEdges = props.response.similarEdges.filter((similarEdge) => {
      return similarEdge.weight >= edgeStrengthInputValue;
    });

    const filteredNodes = props.response.similarNodes;

    const graphData = {
      links: filteredEdges,
      nodes: props.response.similarNodes,
    };

    const nextSituation = props.response.nextSituation?.situation;
    const previousSituation = props.response.previousSituation?.situation;
    const sharedFeatures =
      Array.isArray(currentSituation.preTextFeatures) &&
      currentSituation.preTextFeatures?.filter((feature) =>
        currentSituation.viaTextFeatures.includes(feature),
      );
    const mutations = [];
    Array.isArray(currentSituation.preTextFeatures) &&
      currentSituation.preTextFeatures.forEach(
        (feature) =>
          !currentSituation.viaTextFeatures.includes(feature) &&
          mutations.push(feature),
      );
    Array.isArray(currentSituation.viaTextFeatures) &&
      currentSituation.viaTextFeatures.forEach(
        (feature) =>
          !currentSituation.preTextFeatures.includes(feature) &&
          mutations.push(feature),
      );

    const situationStartReferenceArray = props.response.currentSituationMetaData?.start.split(
      '.',
    );
    const situationStartReference =
      situationStartReferenceArray &&
      `Starts at ${situationStartReferenceArray[1]} ${situationStartReferenceArray[2]}:${situationStartReferenceArray[3]}`;

    const situationCluster = clusterLabels[
      props.response.currentSituationMetaData?.cluster
    ]
      ? clusterLabels[props.response.currentSituationMetaData?.cluster]
      : props.response.currentSituationMetaData?.cluster;

    return (
      <Layout
        pageTitle={currentSituation.title}
        pageDescription={`Situation analysis for ${currentSituation.title}`}
      >
        {situationStartReference && situationStartReference}
        <br />
        {situationCluster && (
          <Link
            href={`${server}/clusters/${getURLSlugFromClusterName({
              string: props.response.currentSituationMetaData.cluster,
            })}`}
          >
            <p>
              Situation type: <a>{situationCluster}</a>
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
                {Array.isArray(currentSituation.preTextFeatures) ? ( // TODO: abstract this entire feature-map
                  currentSituation.preTextFeatures.map((feature) => {
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
                      if (currentSituation.viaTextFeatures.includes(feature)) {
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
                  <Tag>{currentSituation.preTextFeatures}</Tag>
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
                {Array.isArray(currentSituation.viaTextFeatures) ? (
                  currentSituation.viaTextFeatures.map((feature) => {
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
                      if (currentSituation.preTextFeatures.includes(feature)) {
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
                  <Tag>{currentSituation.viaTextFeatures}</Tag>
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
                      preAndViaFeatureSets={currentSituation}
                      mutations={mutations}
                      registerParameterSelection="field"
                    />
                  </div>
                  <div>
                    <h3>Tenor</h3>
                    <hr />
                    <MutationSet
                      preAndViaFeatureSets={currentSituation}
                      mutations={mutations}
                      registerParameterSelection="tenor"
                    />
                  </div>
                  <div>
                    <h3>Mode</h3>
                    <hr />
                    <MutationSet
                      preAndViaFeatureSets={currentSituation}
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
          <p>
            This graph shows the ten most similar situations to the current
            situations, and the connections between them
          </p>
          <p>
            Note: if you don&apos;t see anything in this box, try zooming out by
            pinching or scrolling out. If this doesn&apos;t work, try opening
            this page in a new tab.
          </p>
        </div>
        <ul>
          {graphData.nodes.map((node) => {
            // FIXME: I'm not sure if this string manipulation is still necessary
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
            const currentSituationID = currentSituation.situation
              .split(' ')
              .filter((idSection) => idSection.includes('-'))
              .join(' ');
            if (!currentSituationID.includes(nodeID)) {
              // const nodeSituationLinkString = getFirstTitleHyphenatedLowerCaseStringFromTitleString(
              //   { string: nodeTitle },
              // );
              const nodeSituationLinkString = nodeID;
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
                  <Link href={`/situations/${nodeSituationLinkString}`}>
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
          {/* TODO: add keyframes and transition to previous or next situations? */}
          {/* FIXME: previous and next buttons only increment single-digit changes? Go to index 0 and press 'previous' */}
          {previousSituation && (
            <Link href={`/situations/${previousSituation}`}>
              <a className={styles.card}>&larr; Previous Situation</a>
            </Link>
          )}
          <Link href={`/situations`}>
            <a className={styles.card}>&darr; Back to all situations</a>
          </Link>
          {nextSituation && (
            <Link href={`/situations/${nextSituation}`}>
              <a className={styles.card}>Next Situation &rarr;</a>
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
        <Link href="/situations">
          <div className={styles.card}>
            <h1>Situation data not found</h1>
            <p>Back to all situations</p>
          </div>
        </Link>
      </Layout>
    );
  }
};

export default SituationPage;

export async function getStaticProps(context: { params: { stageID: string } }) {
  const hasContext = !!(Object.keys(context.params).length > 0);
  if (hasContext) {
    const response = await (
      await fetch(`${server}/api/situations/${context.params.stageID}`)
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
  const situationsResponse = await (
    await fetch(`${server}/api/situations/`)
  ).json();
  const stageIDs = situationsResponse?.situations.root.situation.map(
    (situationContainer) => situationContainer.$.section,
  );
  const paths = stageIDs?.map((stageID) => ({
    params: { stageID: stageID.toString() },
  }));
  return {
    paths,
    fallback: false,
  };
};
