import { server } from '../../config';
import Layout from '../../components/Layout';
import styles from '../../styles/Home.module.css';
import Link from 'next/link';

const AllClustersPage = (props) => {
  console.log({ props });
  return (
    <Layout pageTitle="All Episodes">
      All Clusters:{' '}
      <div className={styles.grid}>
        {Object.keys(props.response).map((cluster) => (
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
