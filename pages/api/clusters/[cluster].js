import { getURLSlugFromClusterName } from '../../../functions/getURLSlugFromClusterName';
import episodesData from '../../../public/data/stages/episodes-ranges.xml';
import dimensionScoresByEpisode from '../../../public/data/stages/principal-component-analysis/episode-dimension-values.json';
import episodesFeatures from '../../../public/data/stages/episodesDynamicFeatures.json';
import groupBy from '../../../functions/groupBy'

const episodes = episodesData.root.episode;

const allEpisodesWithClusterValue = episodes.filter(
  (episodeContainer) => episodeContainer.$.cluster,
);

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
  let selectedEpisodeFeatures = []
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
      selectedEpisodeFeatures.push(episodesFeatures.find((episodeFeatureSet, index) => {
        if (episodeFeatureSet.title.includes(episode.title)) {
          return episodeFeatureSet;
        } else {
          return null;
        }
      }));
      return episode;
    });

    const episodeData = {selectedDimensionValues, selectedEpisodeFeatures}

    res.status(200).send(episodeData);
  } catch (error) {
    res.status(404).send('Error ' + error);
  }
};

export default handler;
