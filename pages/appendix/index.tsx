import Layout from '../../components/Layout';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';

export default function Appendices() {
  return (
    <Layout pageTitle="Appendices">
      <div className={styles.card}>
        <Link href="/appendix/principal-components">
          <a>Episode Principal Component Scores</a>
        </Link>
      </div>
      <div className={styles.card}>
        <Link href="/appendix/principal-component-features">
          <a>Principal Component Feature Correlations</a>
        </Link>
      </div>
      <div className={styles.card}>
        <Link href="/appendix/episodes-graph">
          <a>Graph of All Episode Situation Similarities</a>
        </Link>
      </div>
      <div className={styles.card}>
        <Link href="/appendix/feature-sets">
          <a>Grammatical Features by Order of Text</a>
        </Link>
      </div>
    </Layout>
  );
}
