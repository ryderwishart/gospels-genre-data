import Link from 'next/link';
import styles from '../../styles/Home.module.css'
import { server } from '../../config'
import { getFirstTitleHyphenatedLowerCaseStringFromTitleString } from '../../functions/getFirstTitleHyphenatedLowerCaseStringFromTitleString'

const AllEpisodes = (props) => {
    return (
        <div>
            <h1>All Episodes!</h1>
            <Link href="/">
                <a>Home</a>
            </Link>
            <div className={styles.grid}>
                {props.response.episodes.episode.map(episodeContainer => {
                    const episode = episodeContainer.$
                    const titleStringForLink = getFirstTitleHyphenatedLowerCaseStringFromTitleString({string: episode.title})
                    return (
                        <Link href={`/episodes/${titleStringForLink}`}>
                            <a className={styles.card}>
                                    <h3>{episode.title}</h3>
                            </a>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default AllEpisodes;

export async function getStaticProps(context) {
    const response = await (
        await fetch(`${server}/api/episodes`)
    ).json()

    return {
        props: {
            response: response
        }
    }
}