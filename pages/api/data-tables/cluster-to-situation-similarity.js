import clusterToSituationSimilarities from '../../../public/data/stages/features/cluster-to-situation-similarities-by-grammar.json';

export default function handler(req, res) {
  res.status(200).send(clusterToSituationSimilarities);
}
