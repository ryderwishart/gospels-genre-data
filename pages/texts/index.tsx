import Link from 'next/link';
import styles from '../../styles/Home.module.css';
import { server } from '../../config';
import Head from 'next/head';
import { TextFromAPITexts } from './[text]';

export default function John(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Texts</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href="/">
        <a>Home</a>
      </Link>
      <main className={styles.main}>
        <h1 className={styles.h1}>New Testament</h1>
        {props.textTitles.map((textTitle) => {
          return (
            // eslint-disable-next-line react/jsx-key
            <Link href={`/texts/${textTitle}`}>
              <a>
                <h2>{textTitle.toString()}</h2>
              </a>
            </Link>
          );
        })}
      </main>

      <footer className={styles.footer}>
        <a href="" target="_blank" rel="noopener noreferrer">
          Open-sourced data by OpenText.org
        </a>
      </footer>
    </div>
  );
}

export async function getStaticProps(context) {
  // TODO: ** all getStaticProps functions should call server functions directly, not an api route, and fetch() should not be used since getStaticProps is always run on the server directly
  // cf. https://stackoverflow.com/questions/65981235/how-to-make-a-request-to-an-api-route-from-getstaticprops for more information.
  try {
    const response = await (await fetch(`${server}/api/texts`)).json();
    const textTitles = response?.Nestle1904.text.map(
      (textContainer: TextFromAPITexts) => textContainer.$.title,
    );
    return {
      props: {
        textTitles,
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
}
