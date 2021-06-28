import Layout from '../../components/Layout';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';

export default function Appendices() {
  return (
    <Layout pageTitle="Appendices">
      <div className={styles.card}>
        <Link href="/appendix/principal-components">
          <a>Principal Components</a>
        </Link>
      </div>
      <div className={styles.card}>
        <Link href="/appendix/episodes-graph">
          <a>Graph of All Episode Situation Similarities</a>
        </Link>
      </div>
    </Layout>
  );
}
