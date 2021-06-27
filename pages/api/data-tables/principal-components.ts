import dimensionScoresByEpisode from '../../../public/data/stages/principal-component-analysis/episode-dimension-values.json';

export default function handler(req, res) {
  res.status(200).send(dimensionScoresByEpisode);
}
