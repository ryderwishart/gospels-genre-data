import episodesData from '../../../public/data/stages/episodes-ranges.xml';

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

// const clusters = clustersNumbers.map((clusterID) => {
//   const cluster = {
//     id: allEpisodesWithClusterValue.filter(
//       (episode) => episode.$.cluster === clusterID,
//     ),
//   };
//   return cluster;
// });

const handler = (req, res) => {
  const cluster = req.query.cluster;
  const selectedEpisodes = episodesByCluster[cluster];
  res.status(200).send(selectedEpisodes);
};

export default handler;
