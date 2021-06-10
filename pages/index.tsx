import Layout from '../components/Layout';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <Layout>
      <div className={styles.card}>
        <Link href="/episodes">
          <a>Episodes</a>
        </Link>
      </div>
    </Layout>
  );
}
