import episodesFeatures from '../../../public/data/stages/episodesDynamicFeatures.json';
import { getFirstTitleHyphenatedLowerCaseStringFromTitleString } from '../../../functions/getFirstTitleHyphenatedLowerCaseStringFromTitleString';
import nodes from '../../../public/data/graphData/episodeNodes.json';
import edges from '../../../public/data/graphData/episodeEdges.json';

const handler = (req, res) => {
  const title = req.query.title;
  let currentEpisode = null;
  let previousEpisode = null;
  let nextEpisode = null;
  let similarNodes = null;
  let similarEdges = null;

  try {
    episodesFeatures.find((episode, index) => {
      const formattedEpisodeTitle = getFirstTitleHyphenatedLowerCaseStringFromTitleString(
        { string: episode.title },
      );
      const edgeIDReferences = [];
      if (formattedEpisodeTitle.includes(title)) {
        const episodeIDAndTitle = `${episode.episode} ${episode.title}`
          .split(/s ,'".;’“”/)
          .join('');
        // TODO: This query could be easily adapted for any episodes that include a given feature or that do NOT include a given feature
        currentEpisode = episode;
        previousEpisode = episodesFeatures[index - 1];
        nextEpisode = episodesFeatures[index + 1];

        similarEdges = edges.filter((edge) => {
          const edgeIDs = edge.ID.split('-').join(' ');
          if (edgeIDs.includes(episodeIDAndTitle)) {
            edgeIDReferences.push(edge.SOURCE);
            edgeIDReferences.push(edge.TARGET);
            return edge;
          }
        });

        similarNodes = nodes.filter((node) => {
          if (edgeIDReferences.includes(node.ID)) {
            return node;
          }
        });
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
      similarEdges,
      similarNodes,
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
