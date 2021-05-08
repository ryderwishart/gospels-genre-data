import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>OpenText</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.h1}>OpenText</h1>
        <div className={styles.card}>
          <Link href="/episodes">
            <a>Episodes</a>
          </Link>
        </div>
        <div className={styles.card}>
          <Link href="/johannine">
            <a>Johannine Texts</a>
          </Link>
        </div>
        <div className={styles.card}>
          <Link href="/texts">
            <a>New Testament Texts</a>
          </Link>
        </div>
        <div className={styles.card}>
          <Link href="/analysis">
            <a>Analyze Stage Data</a>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="" target="_blank" rel="noopener noreferrer">
          Open-sourced data by OpenText.org
        </a>
      </footer>
    </div>
  );
}
