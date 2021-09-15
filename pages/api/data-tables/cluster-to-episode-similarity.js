import clusterToEpisodeSimilarities from '../../../public/data/stages/features/cluster-to-episode-similarities-by-grammar.json';

export default function handler(req, res) {
  res.status(200).send(clusterToEpisodeSimilarities);
}
