import { EpisodeMetadata } from '../../types';
import { server } from '../../config';
import Layout from '../../components/Layout';
import styles from '../../styles/Home.module.css';

interface ComponentProps {
  response: EpisodeMetadata[];
}

const ClusterPage = (props: ComponentProps) => {
  console.log({ props });
  return (
    <Layout
      pageTitle={`New Testament Situations Cluster ${props.response[0].cluster}`}
    >
      <div>
        {props.response?.map((episode) => (
          <p>{episode.title}</p>
        ))}
      </div>
      <button className={styles.button}>Back to all clusters</button>
    </Layout>
  );
};

export default ClusterPage;

export async function getStaticProps(context: { params: { cluster: string } }) {
  console.log({ context });
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
    params: { cluster: cluster.toString() },
  }));
  return {
    paths,
    fallback: false,
  };
};
