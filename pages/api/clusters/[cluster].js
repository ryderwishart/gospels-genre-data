import episodesData from '../../../public/data/stages/episodes-ranges.xml';
import dimensionScoresByEpisode from '../../../public/data/stages/principal-component-analysis/episode-dimension-values.json';

const episodes = episodesData.root.episode;

const allEpisodesWithClusterValue = episodes.filter(
  (episodeContainer) => episodeContainer.$.cluster,
);

const groupBy = (arrayOfObjects, key) => {
  return arrayOfObjects.reduce((accumulator, item) => {
    const group = item[key];
    accumulator[group] = accumulator[group] || [];
    accumulator[group].push(item);
    return accumulator;
  }, {}); // NOTE: {} is the initial value of the accumulator
};

const flattenedEpisodes = allEpisodesWithClusterValue.map(
  (episode) => episode.$,
);

const episodesByCluster = groupBy(flattenedEpisodes, 'cluster');

const handler = (req, res) => {
  const cluster = req.query.cluster;
  const selectedEpisodes = episodesByCluster[cluster];
  try {
    const selectedDimensionValues = selectedEpisodes.map((episode) => {
      const episodeID = episode.section.split('-').join('§');
      const episodeIDAndTitle = `${episodeID} ${episode.title}`;
      const dimensionValuesForEpisode = dimensionScoresByEpisode.find(
        (dimensions) => dimensions.episodeId === episodeIDAndTitle,
      );
      if (dimensionValuesForEpisode) {
        const { episodeId, ...dimensions } =
          dimensionValuesForEpisode && dimensionValuesForEpisode;
        episode.dimensions = dimensions;
      }
      return episode;
    });
    res.status(200).send(selectedDimensionValues);
  } catch (error) {
    res.status(404).send('Error ' + error);
  }
};

export default handler;
