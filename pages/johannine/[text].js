import { server } from '../../config';
import Link from 'next/link';
import styles from '../../styles/Home.module.css'

const TextPage = props => {
    console.log(props)
    const text = props.response?.text;
    if(!!text) {

        return (
            <div className={styles.container}>
    
            <main className={styles.main}>
                <h1>{text.key}</h1>
                <div className={styles.grid}>
                    {/* text.content.turn.content.map(stageContainer).stageContainer.content.map(moveContainer).expressions || .meanings */
                        text.content.turn.content.map(stageContainer => {
                            return (
                                        <div className={styles.card}>
                                <Link href={`/johannine/${props.currentText}/${stageContainer.stage.key}`}>
                                    <a>
                                            <h2>Stage: [need stage titles in data 🤓]</h2>
                                            
                                                    {stageContainer.stage.key} {/* TODO: again, these stage slugs should be based on the first episode title, if multiple, and on the id only as a fallback */}
                                    </a>
                                </Link>
                                        </div>
                            )
                        })
                    }
                </div>
            </main>
            <footer className={styles.footer}>
                    <Link href={`/johannine`}>
                        <a className={styles.card}>
                        &larr; Back to all Johnannine texts
                        </a>
                    </Link>
            </footer>
            </div>
        )
    }
    return null;
}

export default TextPage;

export async function getStaticProps(context) {
    console.log('building page:', JSON.stringify(context))
    const response = await (
        await fetch(`${server}/api/johannine/${context.params.text}`)
    ).json()

    const currentText = context.params.text

    return {
        props: {
            response,
            currentText,
        }
    }
}

export const getStaticPaths = async () => {
    let response;
    try {
        response = await (
            await fetch(`${server}/api/johannine/`)
        ).json()
     } catch(error) {
        response = null;
     }
    // const response = await (
    //     await fetch(`${server}/api/johannine/`)
    // ).json()
    const textKeys = response?.data.map(textContainer => textContainer.text.key)
    const paths = textKeys?.map(textKey => ({params: { text: textKey.toString()}}))
    return {
        paths,
        fallback: false,
    }
}
