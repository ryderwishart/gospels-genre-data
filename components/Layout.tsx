import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { defaultSEOMeta } from '../config';

interface LayoutProps {
  pageTitle?: string;
  pageDescription?: string;
  children?: any;
}

const Home: React.FC<LayoutProps> = (props): JSX.Element => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{props.pageTitle || defaultSEOMeta.pageTitle}</title>
        <meta
          name="description"
          content={props.pageDescription || defaultSEOMeta.pageDescription}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/about">
          <a>About</a>
        </Link>
      </header>

      <main className={styles.main}>
        <h1 className={styles.h1}>
          {props.pageTitle || defaultSEOMeta.pageTitle}
        </h1>
        {props.children}
      </main>

      <footer className={styles.footer}>
        <a href="" target="_blank" rel="noopener noreferrer">
          Open-sourced data by OpenText.org
        </a>
      </footer>
    </div>
  );
};

export default Home;
