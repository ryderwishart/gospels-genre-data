// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import root from '../../../public/data/stages/episodes-ranges.xml';
import nodes from '../../../public/data/graphData/episodeNodes.json';
import edges from '../../../public/data/graphData/episodeEdges.json';

const links = edges.filter((edge) => edge.weight > 0.9);

const handler = (req, res) => {
  res.status(200).send({ episodes: root, graphData: { nodes, links } });
};

export default handler;
