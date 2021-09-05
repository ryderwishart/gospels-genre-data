import episodesFeatures from '../../../public/data/stages/episodesDynamicFeatures.json';
import graphData from '../../../public/data/graphData/graphData.json';
import episodesMetaData from '../../../public/data/stages/episodes-ranges.xml';

const { nodes, edges } = graphData;

const handler = (req, res) => {
  const { stageID } = req.query;
  let currentEpisode = null;
  let previousEpisode = null;
  let nextEpisode = null;
  let similarNodes = null;
  let similarEdges = null;
  let currentEpisodeMetaData = null;
  episodesMetaData.root.episode.find((episodeContainer) => {
    if (episodeContainer.$.section.includes(stageID)) {
      // TODO: This query could be easily adapted for any episodes that include a given feature or that do NOT include a given feature
      currentEpisodeMetaData = episodeContainer.$;
      return;
    } else {
      return null;
    }
  });

  try {
    const selectedEpisode = episodesFeatures.find((episode, index) => {
      if (episode.episode.includes(stageID)) {
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
      req.query,
    );
  }
  if (currentEpisode !== null) {
    res.status(200).json({
      currentEpisode,
      previousEpisode,
      nextEpisode,
      similarEdges,
      similarNodes,
      currentEpisodeMetaData,
    });
  } else {
    res.status(404).json({
      message: `Episode with stageID '${stageID}' not found.`,
    });
  }
};

export default handler;
