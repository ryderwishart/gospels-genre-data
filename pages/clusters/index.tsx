import { server } from '../../config';
import Layout from '../../components/Layout';
import styles from '../../styles/Home.module.css';
import Link from 'next/link';

const AllClustersPage = (props) => {
  const sortedClusters = Object.keys(props.response)
    .map((cluster) => cluster)
    .sort((a, b) =>
      props.response[a].length < props.response[b].length ? 1 : -1,
    );
  console.log({ props });
  return (
    <Layout
      pageTitle="All Clusters"
      pageDescription="Situation types for episodes in the New Testament"
    >
      <div className={styles.grid}>
        {sortedClusters.map((cluster) => (
          <Link href={`/clusters/${cluster}`} key={cluster}>
            <a>
              <div className={styles.card}>
                <h2>Cluster: {cluster}</h2>
                {props.response[cluster].map((episode) => (
                  <p key={episode.section}>{episode.title}</p>
                ))}
              </div>
            </a>
          </Link>
        ))}
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
