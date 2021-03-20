import { server } from '../../config';
import Link from 'next/link';
import styles from '../../styles/Home.module.css'

const EpisodePage = props => {
    const episode = props.response.$;
    const nextId = props.next?.$.section;
    const previousId = props.previous?.$.section;
    return (
        <div className={styles.container}>

        <main className={styles.main}>
            <div className={styles.card}>
                <h1>{episode.title}</h1>
                <p>Word count: {episode.wordLength}</p>
                <p>Unique lexemes: {episode.lexemeCount}</p>
                <p><strong>Start ID: </strong>{episode.start}<br /><strong>End ID: </strong>{episode.end}</p>
            </div>
        </main>
        <footer className={styles.footer}>
            <div style={{
                display: 'flex',
                flexFlow: 'row nowrap',
            }}>
            {/* TODO: add keyframes and transition to previous or next episodes? */}
            {previousId &&
                <Link href={`/episodes/${previousId}`}>
                    <a className={styles.card}>
                    &larr; Previous Episode
                    </a>
                </Link>
            }
                <Link href={`/episodes`}>
                    <a className={styles.card}>
                    &darr; Back to all episodes
                    </a>
                </Link>
                {nextId &&
                    <Link href={`/episodes/${nextId}`}>
                        <a className={styles.card}>
                        Next Episode &rarr; 
                        </a>
                    </Link>
                }
            </div>
        </footer>
        </div>
    )
}

export default EpisodePage;

export async function getStaticProps(context) {
    const counter = context.params.id.split('§')
    const bookId = counter[0]
    const episodeId = parseInt(counter[1])
    const previousEpisodeId = episodeId ? episodeId - 1 : null
    const nextEpisodeId = episodeId + 1
    
    const response = await (
        await fetch(`${server}/api/episodes/${context.params.id}`)
    ).json()

    const previousEpisodeIdString = previousEpisodeId < 10 ? '0' + previousEpisodeId : previousEpisodeId
    let previous = null;
    if(previousEpisodeId){
        previous = await (
            await fetch(`${server}/api/episodes/${bookId}§${previousEpisodeIdString}`)
        ).json()
    }

    const nextEpisodeIdString = nextEpisodeId < 10 ? '0' + nextEpisodeId : nextEpisodeId
    const next = await (
        await fetch(`${server}/api/episodes/${bookId}§${nextEpisodeIdString}`)
    ).json()

    return {
        props: {
            response,
            previous,
            next: next ? next : null,
        }
    }
}

export const getStaticPaths = async () => {
    const response = await (
        await fetch(`${server}/api/episodes/`)
    ).json()
    const ids = response?.root.episode.map(episodeContainer => episodeContainer.$.section)
    const paths = ids?.map(id => ({params: { id: id.toString()}}))
    return {
        paths,
        fallback: false,
    }
}
