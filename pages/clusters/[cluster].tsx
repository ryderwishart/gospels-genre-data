import { DimensionLabels, Situation, SituationMetadata } from '../../types';
import {
  constants,
  server,
  SignificantDimensionThresholdValue,
} from '../../config';
import Layout from '../../components/Layout';
import styles from '../../styles/Home.module.css';
import { Collapse, Table, Tag, Tooltip } from 'antd';
import Link from 'next/link';
import { getURLSlugFromClusterName } from '../../functions/getURLSlugFromClusterName';
import { getFirstTitleHyphenatedLowerCaseStringFromTitleString } from '../../functions/getFirstTitleHyphenatedLowerCaseStringFromTitleString';
import { getSentenceCaseString } from '../../functions/getSentenceCaseString';
import MutationSet from '../../components/MutationSet';
import clusterLabels from '../../types/clusterLabels';

interface ComponentProps {
  response: {
    selectedDimensionValues: SituationMetadata[];
    selectedSituationFeatures: Situation[];
  };
}

const ClusterPage = (props: ComponentProps) => {
  const dimensions = {
    dim_1: [],
    dim_2: [],
    dim_3: [],
    dim_4: [],
    dim_5: [],
    dim_6: [],
    dim_7: [],
  };

  props.response.selectedDimensionValues?.forEach((situation) => {
    // TODO: add a function name here to explain what's going on...
    if (situation.dimensions) {
      Object.keys(situation.dimensions).forEach((dimension, index) => {
        if (index < 7) {
          const currentValues = dimensions[dimension];
          const additionalValue = situation.dimensions[dimension];
          dimensions[dimension] = currentValues && [
            ...currentValues,
            additionalValue,
          ];
        }
      });
    }
  });

  const allAveragesArray = [];

  const dimensionAverages = Object.keys(dimensions).map((dimension, index) => {
    const values = dimensions[dimension];
    const sum = values?.reduce((runningAverage, value) => {
      return runningAverage + value;
    }, 0);
    const average = parseFloat((sum / values.length).toFixed(2));
    allAveragesArray.push(average);
    const label =
      average > SignificantDimensionThresholdValue
        ? DimensionLabels[dimension].positive
        : average < -SignificantDimensionThresholdValue
        ? DimensionLabels[dimension].negative
        : `Neither`;
    return {
      dimension: dimension,
      value: average,
      label,
    };
  });
  allAveragesArray.sort((a, b) => a - b);
  const lowestAverageValue = allAveragesArray[0];
  const highestAverageValue = allAveragesArray[allAveragesArray.length - 1]; // NOTE: assumes only seven principal components

  const averagesTableColumns = [
    {
      title: 'Dimension',
      dataIndex: 'dimension',
      fixed: true,
      render: (dimension) =>
        `${DimensionLabels[dimension].positive} or ${DimensionLabels[dimension].negative}`,
    },
    {
      title: 'Average Value',
      dataIndex: 'value',
      render: (value, row) => {
        const normalizedRowValue =
          (value - lowestAverageValue) /
          (highestAverageValue - lowestAverageValue);
        const tagColor = row.label.startsWith('Neither')
          ? 'grey'
          : value > 0
          ? 'blue'
          : 'red'; // NOTE: Only color for significant values (take average of all dimension readings)
        return (
          <Tag color={tagColor} key={row.label + row.value}>
            {value + ' ' + (row.label ? row.label : null)}{' '}
          </Tag>
        );
      },
    },
    {
      // FIXME: this hack displays the value as a bar graph... but outliers break it because negative values are shifted left using a negative margin
      title: '',
      dataIndex: 'value',
      width: 100,
      render: (value, row) => {
        const barColor = row.label.startsWith('Neither')
          ? constants.color.lightGrey
          : value > 0
          ? constants.color.blue
          : constants.color.red;
        const shouldShiftBarLeft = value < 0;
        return (
          <div
            style={{
              display: 'flex',
              flexFlow: 'row nowrap',
              paddingLeft: 50,
            }}
          >
            <div
              style={{
                width:
                  row.label === 'Neither'
                    ? 0
                    : shouldShiftBarLeft
                    ? `${-value * 20}px`
                    : `${value * 20}px`,
                backgroundColor: barColor,
                marginLeft: `${shouldShiftBarLeft ? value * 20 : 0}px`,
                height: '20px',
                opacity: '80%',
              }}
            />
          </div>
        );
      },
    },
  ];

  const allFeatures = [];
  const sharedFeatures = [];
  const globalPreTextFeatures = [];
  const globalViaTextFeatures = [];
  props.response.selectedSituationFeatures?.forEach((situationDataSet) => {
    situationDataSet?.preTextFeatures &&
      Array.isArray(situationDataSet?.preTextFeatures) &&
      sharedFeatures.push(
        ...situationDataSet.preTextFeatures?.filter((feature) =>
          situationDataSet.viaTextFeatures?.includes(feature),
        ),
      );
    situationDataSet?.preTextFeatures &&
      globalPreTextFeatures.push(...situationDataSet.preTextFeatures);
    situationDataSet?.viaTextFeatures &&
      globalViaTextFeatures.push(...situationDataSet.viaTextFeatures);
    situationDataSet?.preTextFeatures &&
      allFeatures.push(...situationDataSet.preTextFeatures);
    situationDataSet?.viaTextFeatures &&
      allFeatures.push(...situationDataSet.viaTextFeatures);
  });
  const allFeaturesSet = new Set(allFeatures);

  const groupedPreTextFeatures = globalPreTextFeatures.reduce(function (
    accumulator,
    currentItem,
  ) {
    if (typeof accumulator[currentItem] == 'undefined') {
      accumulator[currentItem] = 1;
    } else {
      accumulator[currentItem] += 1;
    }
    return accumulator;
  },
  {});
  const groupedViaTextFeatures = globalViaTextFeatures.reduce(function (
    accumulator,
    currentItem,
  ) {
    if (typeof accumulator[currentItem] == 'undefined') {
      accumulator[currentItem] = 1;
    } else {
      accumulator[currentItem] += 1;
    }
    return accumulator;
  },
  {});

  const clusterLabel =
    clusterLabels[props.response.selectedDimensionValues[0].cluster];
  const clusterTitle =
    (props.response.selectedDimensionValues &&
      clusterLabel &&
      `${getSentenceCaseString(clusterLabel, ' ')}`) ||
    `number ${props.response.selectedDimensionValues[0].cluster}`;
  return (
    <Layout
      pageTitle={`New Testament Situation Type: ${
        clusterLabel ? clusterLabel : clusterTitle
      }`}
    >
      <p>
        Cluster number:{' '}
        <span style={{ color: constants.color.red }}>
          {props.response.selectedDimensionValues[0].cluster}
        </span>
      </p>
      <p>
        Cluster size (number of situations):{' '}
        <span style={{ color: constants.color.red }}>
          {props.response.selectedDimensionValues.length}
        </span>
      </p>
      <div className={styles.grid} style={{ maxWidth: '95vw' }}>
        <Collapse
          defaultActiveKey={['dimension-averages', 'dimensions']}
          style={{ maxWidth: '99vw' }}
        >
          <Collapse.Panel
            header="Principal Component Averages"
            key="dimension-averages"
          >
            <Table
              dataSource={dimensionAverages}
              scroll={{ x: true }}
              size={'small'}
              style={{ maxWidth: '100%' }}
              pagination={false}
              columns={averagesTableColumns}
            />
          </Collapse.Panel>
          <Collapse.Panel
            header="Feature Patterns Across Cluster"
            key="feature-patterns"
          >
            <div className={styles.card}>
              <Table
                style={{ maxWidth: '100%' }}
                size={'small'}
                scroll={{ x: true }}
                columns={[
                  {
                    title: 'Feature',
                    dataIndex: 'key',
                    fixed: true,
                    render: (label, row) => {
                      const featureAlwaysOccurs =
                        row.preCount /
                          props.response.selectedDimensionValues.length ==
                        1;
                      if (featureAlwaysOccurs) {
                        return (
                          <span style={{ color: constants.color.blue }}>
                            {label}
                          </span>
                        );
                      } else {
                        return <span>{label}</span>;
                      }
                    },
                  },
                  {
                    title: 'Pre-Text',
                    dataIndex: 'preCount',
                    sorter: (a, b) => a.preCount - b.preCount,
                    render: (featureCount, row) => {
                      if (typeof featureCount !== 'undefined') {
                        const ratio: any = props.response
                          .selectedDimensionValues
                          ? (
                              featureCount /
                              props.response.selectedDimensionValues?.length
                            ).toFixed(2)
                          : 0;
                        return (
                          <Tooltip
                            title={`${featureCount} out of ${props.response.selectedDimensionValues.length} situations in this cluster have the [${row.key}] feature at the outset of the situation.`}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexFlow: 'row nowrap',
                              }}
                            >
                              <span
                                style={{
                                  color:
                                    ratio === '1.00'
                                      ? constants.color.blue
                                      : null,
                                }}
                              >
                                {ratio}
                              </span>
                              <div
                                style={{
                                  width: `${ratio * 50}px`,
                                  backgroundColor: constants.color.blue,
                                  marginLeft: '5px',
                                  borderRadius: constants.border.radius,
                                }}
                              />
                            </div>
                          </Tooltip>
                        );
                      } else {
                        return (
                          <Tooltip
                            title={`No situations in this cluster have the [${row.key}] feature at the outset of the situation.`}
                          >
                            <span style={{ color: constants.color.lightGrey }}>
                              0
                            </span>
                          </Tooltip>
                        );
                      }
                    },
                  },
                  {
                    title: 'Via-Text',
                    dataIndex: 'viaCount',
                    sorter: (a, b) => a.viaCount - b.viaCount,
                    render: (featureCount, row) => {
                      if (typeof featureCount !== 'undefined') {
                        const ratio: any = (
                          featureCount /
                          props.response.selectedDimensionValues.length
                        ).toFixed(2);
                        return (
                          <Tooltip
                            title={`${featureCount} out of ${props.response.selectedDimensionValues.length} situations in this cluster have the [${row.key}] feature at the conclusion of the situation.`}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexFlow: 'row nowrap',
                              }}
                            >
                              <span
                                style={{
                                  color:
                                    ratio === '1.00'
                                      ? constants.color.blue
                                      : null,
                                }}
                              >
                                {ratio}
                              </span>
                              <div
                                style={{
                                  width: `${ratio * 50}px`,
                                  backgroundColor: constants.color.blue,
                                  marginLeft: '5px',
                                  borderRadius: constants.border.radius,
                                }}
                              />
                            </div>
                          </Tooltip>
                        );
                      } else {
                        return (
                          <Tooltip
                            title={`No situations in this cluster have the [${row.key}] feature at the outset of the situation.`}
                          >
                            <span style={{ color: constants.color.lightGrey }}>
                              0
                            </span>
                          </Tooltip>
                        );
                      }
                    },
                  },
                ]}
                dataSource={[...allFeaturesSet].map((feature) => ({
                  key: feature,
                  preCount: groupedPreTextFeatures[feature],
                  viaCount: groupedViaTextFeatures[feature],
                }))}
                pagination={false}
              />
            </div>
          </Collapse.Panel>
          <Collapse.Panel
            header="All Principal Component Values"
            key="dimensions"
          >
            <Table
              pagination={false}
              style={{ maxWidth: '100%' }}
              scroll={{ x: 1000 }}
              size={'small'}
              columns={[
                {
                  title: 'Situation',
                  dataIndex: 'title',
                  fixed: 'left',
                  width: 50,
                },
                {
                  title: 'Reference',
                  dataIndex: 'start',
                  fixed: 'left',
                  width: 50,
                  render: (startReference) => {
                    const situationStartReferenceArray = startReference.split(
                      '.',
                    );
                    if (situationStartReferenceArray) {
                      return `Starts at ${situationStartReferenceArray[1]} ${situationStartReferenceArray[2]}:${situationStartReferenceArray[3]}`;
                    }
                  },
                },
                {
                  title:
                    'Dimensions of Variation (Based on Principal Components)',
                  children:
                    props.response.selectedDimensionValues &&
                    Object.keys(
                      props.response.selectedDimensionValues[0].dimensions,
                    ) &&
                    [
                      ...Object.keys(
                        props.response.selectedDimensionValues[0].dimensions,
                      ).map((dimension) => {
                        if (dimension) {
                          const inRangeDimensions = [
                            '1',
                            '2',
                            '3',
                            '4',
                            '5',
                            '6',
                            '7',
                          ];
                          const dimensionValue = dimension.split('_')[1];
                          const tooltipContent = `(+) ${DimensionLabels[dimension]?.positive} or (–) ${DimensionLabels[dimension]?.negative}`;
                          if (inRangeDimensions.includes(dimensionValue)) {
                            return {
                              title: dimensionValue,
                              dataIndex: ['dimensions', dimension],
                              width: 50,
                              render: (value) => {
                                const color =
                                  value > SignificantDimensionThresholdValue
                                    ? 'blue'
                                    : value <
                                      -SignificantDimensionThresholdValue
                                    ? 'red'
                                    : 'grey';
                                return (
                                  <Tooltip title={tooltipContent}>
                                    <Tag color={color}>{value}</Tag>
                                  </Tooltip>
                                );
                              },
                            };
                          }
                        }
                      }),
                    ].filter((column) => column !== undefined),
                },
              ]}
              dataSource={props.response.selectedDimensionValues}
            />
          </Collapse.Panel>
          <Collapse.Panel
            header="Individual Situation Mutations"
            key="mutations"
          >
            {props.response.selectedSituationFeatures?.map((situation) => {
              const mutations = []; // PICKING UP: for some reason I'm not creating a new list of mutations for every situation here
              const currentSituation = props.response.selectedSituationFeatures.find(
                (selectedSituation) =>
                  selectedSituation?.title === (situation && situation.title),
              );
              if (currentSituation) {
                currentSituation.preTextFeatures &&
                  Array.isArray(currentSituation.preTextFeatures) &&
                  currentSituation.preTextFeatures.forEach(
                    (feature) =>
                      !currentSituation.viaTextFeatures.includes(feature) &&
                      mutations.push(feature),
                  );
                currentSituation.preTextFeatures &&
                  Array.isArray(currentSituation.viaTextFeatures) &&
                  currentSituation.viaTextFeatures.forEach(
                    (feature) =>
                      !currentSituation.preTextFeatures.includes(feature) &&
                      mutations.push(feature),
                  );
                return (
                  <div key={situation.section} className={styles.card}>
                    <p>{situation.title}</p>
                    <Link
                      href={`${server}/situations/${situation.situation},
                      )}`}
                    >
                      <a>View Situation</a>
                    </Link>
                    <div>
                      {(mutations.length > 0 && (
                        <div>
                          <h2>Situation Mutations</h2>
                          <div>
                            <h3>Field</h3>
                            <MutationSet
                              preAndViaFeatureSets={currentSituation}
                              mutations={mutations}
                              registerParameterSelection="field"
                            />
                          </div>
                          <div>
                            <h3>Tenor</h3>
                            <MutationSet
                              preAndViaFeatureSets={currentSituation}
                              mutations={mutations}
                              registerParameterSelection="tenor"
                            />
                          </div>
                          <div>
                            <h3>Mode</h3>
                            <MutationSet
                              preAndViaFeatureSets={currentSituation}
                              mutations={mutations}
                              registerParameterSelection="mode"
                            />
                          </div>
                        </div>
                      )) || <h2>Non-mutating situation</h2>}
                    </div>
                  </div>
                );
              }
            })}
          </Collapse.Panel>
        </Collapse>
      </div>
      <Link href="/clusters">
        <a>
          <div className={styles.card}>Back to all clusters</div>
        </a>
      </Link>
    </Layout>
  );
};

export default ClusterPage;

export async function getStaticProps(context: { params: { cluster: string } }) {
  const hasContext = !!(Object.keys(context.params).length > 0);
  if (hasContext) {
    const response = await (
      await fetch(`${server}/api/clusters/${context.params.cluster}`)
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
  const clusters = await (await fetch(`${server}/api/clusters/`)).json();
  const clusterNumbers = Object.keys(clusters);
  const paths = clusterNumbers.map((cluster) => ({
    params: {
      cluster: getURLSlugFromClusterName({ string: cluster.toString() }),
    },
  }));
  return {
    paths,
    fallback: false,
  };
};
