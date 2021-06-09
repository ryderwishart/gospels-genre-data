import episodesFeatures from '../../../public/data/stages/episodesDynamicFeatures.json';
import { getFirstTitleHyphenatedLowerCaseStringFromTitleString } from '../../../functions/getFirstTitleHyphenatedLowerCaseStringFromTitleString';
import graphData from '../../../public/data/graphData/graphData.json';

const { nodes, edges } = graphData;

function handler(req, res) {
  const title = req.query.title;
  let currentEpisode = null;
  let previousEpisode = null;
  let nextEpisode = null;
  let similarNodes = null;
  let similarEdges = null;

  try {
    const selectedEpisode = episodesFeatures.find((episode, index) => {
      const formattedEpisodeTitle = getFirstTitleHyphenatedLowerCaseStringFromTitleString(
        { string: episode.title },
      );
      if (formattedEpisodeTitle.includes(title)) {
        // TODO: This query could be easily adapted for any episodes that include a given feature or that do NOT include a given feature
        currentEpisode = episode;
        previousEpisode = episodesFeatures[index - 1];
        nextEpisode = episodesFeatures[index + 1];
        return episode;
      } else {
        return null;
      }
    });

    const selectedEpisodeIDAndTitle = `${selectedEpisode.episode} ${selectedEpisode.title}`
      .split(/[,'".;’“”]+/)
      .join('');

    const edgeIDReferences = [];

    const adjacentEdges = edges
      .filter((edge) => {
        const edgeIDs = edge.id
          .split('-')
          .join(' ')
          .split(/[,'".;’“”]+/)
          .join('');
        // const edgeIDs = edge.id.split('-').join(' ');
        if (edgeIDs.includes(selectedEpisodeIDAndTitle)) {
          return edge;
        }
      })
      .sort((a, b) => (a.weight > b.weight ? -1 : 1)) // NOTE: sort adjacent edges by weight descending
      .slice(0, 9) // NOTE: return only the top ten
      .map((edge) => {
        edgeIDReferences.push(edge.source);
        edgeIDReferences.push(edge.target);
        return edge;
      });

    similarNodes = nodes.filter((node) => {
      if (edgeIDReferences.includes(node.id)) {
        return node;
      }
    });

    const allNodeIDs = similarNodes.map((node) => node.id);

    const remainingEdgesForSelectedNodes = edges
      .filter((edge) => {
        if (
          allNodeIDs.includes(edge.source) &&
          allNodeIDs.includes(edge.target)
        ) {
          return edge;
        }
      })
      .sort((a, b) => (a.weight > b.weight ? -1 : 1)) // NOTE: sort remaining edges by weight descending
      .slice(0, 9); // NOTE: return only the top ten;

    similarEdges = [...adjacentEdges, ...remainingEdgesForSelectedNodes];
  } catch (error) {
    console.warn(
      'Encountered an error trying to match the URL query string with an episode title',
      req.query.title,
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
}

export default handler;
