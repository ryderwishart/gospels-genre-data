/* eslint-disable react/jsx-key */
import { server } from '../../config';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';
import { Tag, Tooltip } from 'antd';
import { getFirstTitleHyphenatedLowerCaseStringFromTitleString } from '../../functions/getFirstTitleHyphenatedLowerCaseStringFromTitleString';
import { getSentenceCaseString } from '../../functions/getSentenceCaseString';
import getSystemFromFeature from '../../functions/getSystemFromFeature';
import { systemsDictionary } from '../../types/systemDefinitions';
interface EpisodeProps {
  response: {
    currentEpisode: Episode;
    previousEpisode?: Episode;
    nextEpisode?: Episode;
  };
}

type Episode = {
  episode: string;
  title: string;
  preTextFeatures: string[];
  viaTextFeatures: string[];
};

const EpisodePage: React.FC<EpisodeProps> = (props) => {
  const currentEpisode = props.response.currentEpisode;
  const nextTitle = props.response.nextEpisode?.title;
  const previousTitle = props.response.previousEpisode?.title;
  const sharedFeatures =
    Array.isArray(currentEpisode.preTextFeatures) &&
    currentEpisode.preTextFeatures?.filter((feature) =>
      currentEpisode.viaTextFeatures.includes(feature),
    );
  console.log(sharedFeatures);
  const mutations = [];
  Array.isArray(currentEpisode.preTextFeatures) &&
    currentEpisode.preTextFeatures.forEach(
      (feature) =>
        !currentEpisode.viaTextFeatures.includes(feature) &&
        mutations.push(feature),
    );
  Array.isArray(currentEpisode.viaTextFeatures) &&
    currentEpisode.viaTextFeatures.forEach(
      (feature) =>
        !currentEpisode.preTextFeatures.includes(feature) &&
        mutations.push(feature),
    );
  return (
    <div className={styles.container} key={currentEpisode.title}>
      <main className={styles.main}>
        <div className={styles.card}>
          <h1>{currentEpisode.title}</h1>
          <div>
            Pre-text features:{' '}
            {Array.isArray(currentEpisode.preTextFeatures) ? (
              currentEpisode.preTextFeatures.map((feature) => {
                try {
                  const system = getSystemFromFeature(feature);
                  const registerParameter = getSystemFromFeature(feature, true);
                  const highlightColor = // TODO: abstract highlight colour getter
                    registerParameter === 'field'
                      ? 'orange'
                      : registerParameter === 'tenor'
                      ? 'red'
                      : registerParameter === 'mode'
                      ? 'green'
                      : 'grey';
                  if (currentEpisode.viaTextFeatures.includes(feature)) {
                    return (
                      <Tooltip title={getSentenceCaseString(system)}>
                        <Tag>{feature}</Tag>
                      </Tooltip>
                    );
                  } else {
                    return (
                      <Tooltip title={getSentenceCaseString(system)}>
                        <Tag color={highlightColor}>{feature}</Tag>
                      </Tooltip>
                    );
                  }
                } catch (error) {
                  return <Tag>{feature}</Tag>;
                }
              })
            ) : (
              <Tag>{currentEpisode.preTextFeatures}</Tag>
            )}
          </div>
          <div>
            Via-text features:{' '}
            {Array.isArray(currentEpisode.viaTextFeatures) ? (
              currentEpisode.viaTextFeatures.map((feature) => {
                try {
                  const system = getSystemFromFeature(feature);
                  const registerParameter = getSystemFromFeature(feature, true);
                  const highlightColor = // TODO: abstract highlight colour getter
                    registerParameter === 'field'
                      ? 'orange'
                      : registerParameter === 'tenor'
                      ? 'red'
                      : registerParameter === 'mode'
                      ? 'green'
                      : 'grey';
                  if (currentEpisode.preTextFeatures.includes(feature)) {
                    return (
                      <Tooltip title={system}>
                        <Tag>{feature}</Tag>
                      </Tooltip>
                    );
                  } else {
                    return (
                      <Tooltip title={system}>
                        <Tag color={highlightColor}>{feature}</Tag>
                      </Tooltip>
                    );
                  }
                } catch (error) {
                  return <Tag>{feature}</Tag>;
                }
              })
            ) : (
              <Tag>{currentEpisode.viaTextFeatures}</Tag>
            )}
          </div>
          <div>
            Mutations:
            <div>
              <h2>Field</h2>
              {Object.keys(systemsDictionary.field).map((system) => {
                return (
                  <div>
                    {systemsDictionary.field[system]
                      .filter((feature) => mutations.includes(feature))
                      .filter((mutation) =>
                        currentEpisode.preTextFeatures.includes(mutation),
                      )
                      .map((mutation) => mutation + ' ->')}{' '}
                    {systemsDictionary.field[system]
                      .filter((feature) => mutations.includes(feature))
                      .filter((mutation) =>
                        currentEpisode.viaTextFeatures.includes(mutation),
                      )}
                  </div>
                );
              })}
            </div>
            <div>
              <h2>Tenor</h2>
              {Object.keys(systemsDictionary.tenor).map((system) => {
                return (
                  <div>
                    {systemsDictionary.tenor[system]
                      .filter((feature) => mutations.includes(feature))
                      .filter((mutation) =>
                        currentEpisode.preTextFeatures.includes(mutation),
                      )
                      .map((mutation) => mutation + ' ->')}{' '}
                    {systemsDictionary.tenor[system]
                      .filter((feature) => mutations.includes(feature))
                      .filter((mutation) =>
                        currentEpisode.viaTextFeatures.includes(mutation),
                      )}
                  </div>
                );
              })}
            </div>
            <div>
              <h2>Mode</h2>
              {Object.keys(systemsDictionary.mode).map((system) => {
                return (
                  <div>
                    {systemsDictionary.mode[system]
                      .filter((feature) => mutations.includes(feature))
                      .filter((mutation) =>
                        currentEpisode.preTextFeatures.includes(mutation),
                      )
                      .map((mutation) => mutation + ' ->')}{' '}
                    {systemsDictionary.mode[system]
                      .filter((feature) => mutations.includes(feature))
                      .filter((mutation) =>
                        currentEpisode.viaTextFeatures.includes(mutation),
                      )}
                  </div>
                );
              })}
            </div>
          </div>
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
          {previousTitle && (
            <Link
              href={`/episodes/${getFirstTitleHyphenatedLowerCaseStringFromTitleString(
                {
                  string: previousTitle,
                },
              )}`}
            >
              <a className={styles.card}>&larr; Previous Episode</a>
            </Link>
          )}
          <Link href={`/episodes`}>
            <a className={styles.card}>&darr; Back to all episodes</a>
          </Link>
          {nextTitle && (
            <Link
              href={`/episodes/${getFirstTitleHyphenatedLowerCaseStringFromTitleString(
                {
                  string: nextTitle,
                },
              )}`}
            >
              <a className={styles.card}>Next Episode &rarr;</a>
            </Link>
          )}
        </div>
      </footer>
    </div>
  );
};

export default EpisodePage;

export async function getStaticProps(context: { params: { title: string } }) {
  const hasContext = !!(Object.keys(context.params).length > 0);
  if (hasContext) {
    const response = await (
      await fetch(`${server}/api/episodes/${context.params.title}`)
    ).json();
    return {
      props: {
        response,
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
  const titles = response?.episodes.episode.map((episodeContainer) => {
    return getFirstTitleHyphenatedLowerCaseStringFromTitleString({
      string: episodeContainer.$.title,
    });
  });
  const paths = titles?.map((title) => ({
    params: { title: title.toString() },
  }));
  return {
    paths,
    fallback: false,
  };
};
