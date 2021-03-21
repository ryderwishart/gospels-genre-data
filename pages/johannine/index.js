import Link from 'next/link';
import styles from '../../styles/Home.module.css'
import { server } from '../../config'
import Head from 'next/head'

export default function John(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Johannine Texts</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href="/">
                <a>Home</a>
            </Link>
      <main className={styles.main}>
        <h1 className={styles.h1}>Johannine Texts</h1>
        {props.textKeys.map(textKey => {
            return (
                <Link href={`/johannine/${textKey}`}>
                    <a>
                        <h2>{textKey.toString()}</h2>
                    </a>
                </Link>
            )
        })}
      </main>

      <footer className={styles.footer}>
        <a
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          Open-sourced data by OpenText.org
        </a>
      </footer>
    </div>
  )
}

export async function getStaticProps() {

    const response = await (
        await fetch(`${server}/api/johannine`)
    ).json()
    const textKeys = response?.data.map(textContainer => textContainer.text.key)
    console.log(textKeys)
    return {
        props: {
            textKeys
        }
    }
}