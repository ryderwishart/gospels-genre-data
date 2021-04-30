import { server } from '../../config';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';

interface EpisodeProps {
  response: { $: any };
  previous: { $: any };
  next: { $: any };
}

const EpisodePage: React.FC<EpisodeProps> = (props) => {
  const episode = props.response?.$;
  const nextId = props.next?.$?.section;
  const previousId = props.previous?.$.section;
  if (episode) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.card}>
            <h1>{episode.title}</h1>
            <p>Word count: {episode.wordLength}</p>
            <p>Unique lexemes: {episode.lexemeCount}</p>
            <p>
              <strong>Start ID: </strong>
              {episode.start}
              <br />
              <strong>End ID: </strong>
              {episode.end}
            </p>
          </div>
        </main>
        <footer className={styles.footer}>
          <div
            style={{
              display: 'flex',
              flexFlow: 'row nowrap',
            }}
          >
            {/* TODO: add keyframes and transition to previous or next episodes? */}
            {previousId && (
              <Link href={`/episodes/${previousId}`}>
                <a className={styles.card}>&larr; Previous Episode</a>
              </Link>
            )}
            <Link href={`/episodes`}>
              <a className={styles.card}>&darr; Back to all episodes</a>
            </Link>
            {nextId && (
              <Link href={`/episodes/${nextId}`}>
                <a className={styles.card}>Next Episode &rarr;</a>
              </Link>
            )}
          </div>
        </footer>
      </div>
    );
  }
  return null;
};

export default EpisodePage;

export async function getStaticProps(context: { params: { id?: any } }) {

  let counter = null;
  let bookId = null;
  let episodeId = null;
  let previousEpisodeId = null;
  let nextEpisodeId = null;

  const hasContext = !!(Object.keys(context.params).length > 0);

  if (hasContext) {
    counter = context.params.id?.split('_');
    bookId = counter[0];
    episodeId = counter && parseInt(counter[1]);
    previousEpisodeId = episodeId ? episodeId - 1 : null;
    nextEpisodeId = episodeId + 1;

    const response = await (
      await fetch(`${server}/api/episodes/${context.params.id}`)
    ).json();

    const previousEpisodeIdString =
      previousEpisodeId < 10 ? '0' + previousEpisodeId : previousEpisodeId;
    let previous = null;
    if (previousEpisodeId) {
      previous = await (
        await fetch(
          `${server}/api/episodes/${bookId}_${previousEpisodeIdString}`,
        )
      ).json();
    }

    const nextEpisodeIdString =
      nextEpisodeId < 10 ? '0' + nextEpisodeId : nextEpisodeId;
    let next;
    try {
      next = await fetch(
        `${server}/api/episodes/${bookId}_${nextEpisodeIdString}`,
      ).then((response) => response.json());
    } catch (error) {
      next = null;
    }

    return {
      props: {
        response,
        previous,
        next: next ? next : null,
      },
    };
  } else {
    return {
      props: {},
    };
  }
}

export const getStaticPaths = async () => {
  const response = await (await fetch(`${server}/api/episodes/`)).json();
  const ids = response?.root.episode.map(
    (episodeContainer) => episodeContainer.$.section,
  );
  const paths = ids?.map((id) => ({ params: { id: id.toString() } }));
  return {
    paths,
    fallback: false,
  };
};
