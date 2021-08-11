import principalComponentFeatures from '../../../public/data/stages/principal-component-analysis/principal-component-features.json';

export default function handler(req, res) {
  res.status(200).send(principalComponentFeatures);
}
