import {
  constants,
  server,
  SignificantDimensionThresholdValue,
} from '../../config';
import Layout from '../../components/Layout';
import styles from '../../styles/Home.module.css';
import Link from 'next/link';
import { getURLSlugFromClusterName } from '../../functions/getURLSlugFromClusterName';
import { Table, Tag, Typography } from 'antd';
import clusterLabels from '../../types/clusterLabels';
import Graph from '../../components/Graph';
import { getFirstTitleHyphenatedLowerCaseStringFromTitleString } from '../../functions/getFirstTitleHyphenatedLowerCaseStringFromTitleString';

const AllClustersPage = (props) => {
  const sortedClusters = Object.keys(props.response)
    .map((cluster) => cluster)
    .sort((a, b) =>
      props.response[a].length < props.response[b].length ? 1 : -1,
    );
  return (
    <Layout
      pageTitle="All Clusters"
      pageDescription="Situation types for episodes in the New Testament"
    >
      <p>Each cluster represents a situation type.</p>
      <p>
        Episodes are clustered together on the basis of their annotated
        situational features. All episodes are compared, and only similarity
        values of 83% or greater (in this analysis) are retained. This produces
        the following clusters of episodes.
      </p>
      <p>
        Each episode is scored on the basis of the top-seven principal
        components of variation among all analyzed episodes (in the Gospels for
        this study). An episode scores either positively or negatively for each
        abstract dimension of variation.
      </p>
      <p>
        Cluster labels are interpretive and attempt to represent the average
        values for the principal-component scores. Scores below the threshold
        value of{' '}
        <Typography.Text type="danger">
          {SignificantDimensionThresholdValue}
        </Typography.Text>{' '}
        are, on average, insignificant for describing the situation.
      </p>
      <Table
        dataSource={sortedClusters.map((cluster) => {
          const clusterLabel =
            clusterLabels && clusterLabels[parseInt(cluster)];
          return {
            label: clusterLabel,
            key: clusterLabel,
            originalClusterObject: cluster,
            color: constants.color.blue,
            attributes: {
              size: props.response[cluster].length,
            },
          };
        })}
        pagination={false}
        size="small"
        expandable={{
          expandedRowRender: (cluster) => (
            <p style={{ margin: 0 }}>
              {props.response[cluster.originalClusterObject].map((episode) => {
                return (
                  <Link
                    href={`/episodes/${episode.section}`}
                    key={episode.section}
                  >
                    <a>
                      <p>{episode.title}</p>
                    </a>
                  </Link>
                );
              })}
            </p>
          ),
        }}
        columns={[
          {
            title: 'Cluster',
            dataIndex: 'label',
            key: 'label',
            render: (label, rowData) => (
              <Link
                href={`/clusters/${getURLSlugFromClusterName({
                  string: rowData.originalClusterObject,
                })}`}
                key={rowData.key}
              >
                <a>{label}</a>
              </Link>
            ),
          },
          {
            title: 'Number of Episodes in Cluster',
            dataIndex: ['attributes', 'size'],
            render: (size, rowData) => (
              <div
                style={{
                  display: 'flex',
                  flexFlow: 'row nowrap',
                }}
                key={rowData.key}
              >
                <div
                  style={{
                    width: `${size}vw`,
                    backgroundImage: `linear-gradient(45deg, ${constants.color.red}, ${constants.color.blue})`,
                    height: '21px',
                    marginRight: '5px',
                    borderRadius: constants.border.radius,
                  }}
                />
                <Tag>{size}</Tag>
              </div>
            ),
          },
        ]}
      />
    </Layout>
  );
};

export default AllClustersPage;

export async function getStaticProps(context) {
  const response = await (await fetch(`${server}/api/clusters`)).json();

  return {
    props: {
      response: response,
    },
  };
}
