import episodesFeatures from '../../../public/data/stages/episodesDynamicFeatures.json';
import { getFirstTitleHyphenatedLowerCaseStringFromTitleString } from '../../../functions/getFirstTitleHyphenatedLowerCaseStringFromTitleString';

const handler = (req, res) => {
  const title = req.query.title;
  let currentEpisode = null;
  let previousEpisode = null;
  let nextEpisode = null;

  try {
    episodesFeatures.find((episode, index) => {
      const formattedEpisodeTitle = getFirstTitleHyphenatedLowerCaseStringFromTitleString(
        { string: episode.title },
      );
      if (formattedEpisodeTitle.includes(title)) {
        // TODO: This query could be easily adapted for any episodes that include a given feature or that do NOT include a given feature
        (currentEpisode = episode),
          (previousEpisode = episodesFeatures[index - 1]),
          (nextEpisode = episodesFeatures[index + 1]);
      } else {
        return null;
      }
    });
  } catch (error) {
    console.warn(
      'Encountered an error trying to match the URL query string with an episode title',
    );
  }
  if (currentEpisode !== null) {
    res.status(200).json({
      currentEpisode,
      previousEpisode,
      nextEpisode,
    });
  } else {
    res.status(404).json({
      message: `Episode with title '${title
        .split('-')
        .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
        .join(' ')}' not found.`,
    });
  }
};

export default handler;
