// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import episodeFeatures from '../../../public/data/stages/episodeFeatures.json';
import { episodeSimilarities } from '../../../public/data/stages/episodeSimilarities';

const handler = (req, res) => {
  res.status(200).send({ response: { episodeFeatures, episodeSimilarities } });
};

export default handler;
