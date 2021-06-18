import { getURLSlugFromClusterName } from '../../../functions/getURLSlugFromClusterName';
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
  (episode) => {
    const episodeWithSlugForMatching = {
      ...episode.$, 
      episodeSlug: getURLSlugFromClusterName({string: episode.$.cluster}),
    }
    return episodeWithSlugForMatching
  }
);

const episodesByCluster = groupBy(flattenedEpisodes, 'cluster');

const handler = (req, res) => {
  const cluster = req.query.cluster;
  const clusterName = Object.keys(episodesByCluster) && Object.keys(episodesByCluster).filter(clusterName => episodesByCluster[clusterName][0]?.episodeSlug === cluster);
  const selectedEpisodes = clusterName && episodesByCluster[clusterName]
  try {
    const selectedDimensionValues = selectedEpisodes.map((episode) => {
      const episodeID = episode.section.split('-').join('§').split(' ');
      const dimensionValuesForEpisode = dimensionScoresByEpisode.find(
        (dimensions) => episodeID.some(id => dimensions.episodeId.split(' ').includes(id)),
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
