import featuresJSON from '../../../public/data/stages/features/moves-by-stage-with-features-depth.json';

const handler = (req, res) => {
  res.status(200).send(featuresJSON);
};

export default handler;
