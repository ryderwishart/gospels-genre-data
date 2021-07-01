import { server, SignificantDimensionThresholdValue } from '../../config';
import Layout from '../../components/Layout';
import styles from '../../styles/Home.module.css';
import Link from 'next/link';
import { getURLSlugFromClusterName } from '../../functions/getURLSlugFromClusterName';
import { Typography } from 'antd';
import clusterLabels from '../../types/clusterLabels';

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
      <div className={styles.grid}>
        {sortedClusters.map((cluster) => {
          const clusterLabel =
            clusterLabels && clusterLabels[parseInt(cluster)];
          return (
            <Link
              href={`/clusters/${getURLSlugFromClusterName({
                string: cluster,
              })}`}
              key={cluster}
            >
              <a>
                <div className={styles.card}>
                  <h2>
                    Cluster: {clusterLabel} (number {cluster})
                  </h2>
                  {props.response[cluster].map((episode) => (
                    <p key={episode.section}>{episode.title}</p>
                  ))}
                </div>
              </a>
            </Link>
          );
        })}
      </div>
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
