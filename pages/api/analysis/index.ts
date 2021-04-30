// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import episodeFeatures from '../../../public/data/stages/episodeFeatures.json';

const handler = (req, res) => {
  res.status(200).send(episodeFeatures);
};

export default handler;
