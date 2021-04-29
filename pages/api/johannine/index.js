import root from '../../../public/data/stages/johannine_sample_Feb-22.json';

const handler = (req, res) => {
  res.status(200).json(root);
};

export default handler;
