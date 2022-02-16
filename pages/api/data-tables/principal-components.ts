import dimensionScoresBySituation from '../../../public/data/stages/principal-component-analysis/situation-dimension-values.json';

export default function handler(req, res) {
  res.status(200).send(dimensionScoresBySituation);
}
