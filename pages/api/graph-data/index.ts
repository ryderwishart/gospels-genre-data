// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import nodes from '../../../public/data/graphData/episodeNodes.json';
import edges from '../../../public/data/graphData/episodeEdges.json';

const handler = (req, res) => {
  res.status(200).send({ nodes, edges });
};

export default handler;
