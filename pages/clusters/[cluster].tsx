import { DimensionLabels, EpisodeMetadata } from '../../types';
import { server, SignificantDimensionThresholdValue } from '../../config';
import Layout from '../../components/Layout';
import styles from '../../styles/Home.module.css';
import { Table, Tag, Tooltip } from 'antd';
import Link from 'next/link';
import { getURLSlugFromClusterName } from '../../functions/getURLSlugFromClusterName';
import { getFirstTitleHyphenatedLowerCaseStringFromTitleString } from '../../functions/getFirstTitleHyphenatedLowerCaseStringFromTitleString';

interface ComponentProps {
  response: EpisodeMetadata[];
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

  props.response.forEach((episode) => {
    if (episode.dimensions) {
      Object.keys(episode.dimensions).forEach((dimension, index) => {
        if (index < 7) {
          const currentValues = dimensions[dimension];
          const additionalValue = episode.dimensions[dimension];
          dimensions[dimension] = currentValues && [
            ...currentValues,
            additionalValue,
          ];
        }
      });
    }
  });

  const dimensionAverages = Object.keys(dimensions).map((dimension, index) => {
    const values = dimensions[dimension];
    const sum = values?.reduce((runningAverage, value) => {
      return runningAverage + value;
    }, 0);
    const average = parseFloat((sum / values.length).toFixed(2));
    const label =
      average > SignificantDimensionThresholdValue
        ? DimensionLabels[dimension].positive
        : average < -SignificantDimensionThresholdValue
        ? DimensionLabels[dimension].negative
        : `Neither (+) ${DimensionLabels[dimension].positive} nor (–) ${DimensionLabels[dimension].negative}`;
    return {
      dimension: dimension,
      value: average,
      label,
    };
  });

  const averagesTableColumns = [
    { title: 'Dimension', dataIndex: 'dimension' },
    {
      title: 'Value',
      dataIndex: 'value',
      render: (value, row) => {
        const color = row.label.startsWith('Neither')
          ? 'grey'
          : value > 0
          ? 'blue'
          : 'red'; // NOTE: Only color for significant values (take average of all dimension readings)
        return (
          <Tag color={color}>
            {value + ' ' + (row.label ? row.label : null)}
          </Tag>
        );
      },
    },
  ];

  return (
    <Layout
      pageTitle={`New Testament Situations Cluster ${props.response[0].cluster}`}
    >
      <div>
        <Table
          dataSource={dimensionAverages}
          pagination={false}
          columns={averagesTableColumns}
        />
      </div>
      <div className={styles.grid} style={{ maxWidth: '95vw' }}>
        <Table
          pagination={false}
          scroll={{ x: 1000 }}
          columns={[
            // TODO: non-averages table needs to have episodes as rows and dimensions as columns
            {
              title: 'Episode',
              dataIndex: 'title',
              fixed: 'left',
              width: 50,
            },
            {
              title: 'Dimensions of Variation (Based on Principal Components)',
              children:
                Object.keys(props.response[0].dimensions) &&
                [
                  ...Object.keys(props.response[0].dimensions).map(
                    (dimension) => {
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
                              const color = value > 0 ? 'blue' : 'red'; // NOTE: Only color for significant values (take average of all dimension readings)
                              return (
                                <Tooltip title={tooltipContent}>
                                  <Tag color={color}>{value}</Tag>
                                </Tooltip>
                              );
                            },
                          };
                        }
                      }
                    },
                  ),
                ].filter((column) => column !== undefined),
            },
          ]}
          dataSource={props.response}
          //   summary={(pageData) => {
          //     return (
          //       <>
          //         {dimensionAverages.map((averageObject) => {
          //           return (
          //             <Table.Summary.Row>
          //               <Table.Summary.Cell>
          //                 <Typography.Text>
          //                   {averageObject.dimension}
          //                 </Typography.Text>
          //               </Table.Summary.Cell>
          //               <Table.Summary.Cell>
          //                 {averageObject.value}
          //               </Table.Summary.Cell>
          //               <Table.Summary.Cell>
          //                 <Typography.Text type="danger">
          //                   {averageObject.label}
          //                 </Typography.Text>
          //               </Table.Summary.Cell>
          //             </Table.Summary.Row>
          //           );
          //         })}
          //       </>
          //     );
          //   }}
        />
        {props.response?.map((episode) => {
          if (episode.dimensions) {
            const dimensions = Object.keys(episode.dimensions).map(
              (dimension) => {
                return {
                  dimension: dimension,
                  value: episode.dimensions[dimension],
                };
              },
            );
            return (
              <div key={episode.section} className={styles.card}>
                <p>{episode.title}</p>
                <Link
                  href={`${server}/episodes/${getFirstTitleHyphenatedLowerCaseStringFromTitleString(
                    { string: episode.title },
                  )}`}
                >
                  <a>View Episode</a>
                </Link>
                <Table
                  dataSource={dimensions.slice(0, 7)}
                  pagination={false}
                  columns={[
                    { title: 'Dimension', dataIndex: 'dimension' },
                    {
                      title: 'Value',
                      dataIndex: 'value',
                      render: (value) => {
                        const color = value > 0 ? 'blue' : 'red'; // NOTE: Only color for significant values (take average of all dimension readings)
                        return <Tag color={color}>{value}</Tag>;
                      },
                    },
                  ]}
                />
              </div>
            );
          }
        })}
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
