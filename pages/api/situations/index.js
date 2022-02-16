// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import root from '../../../public/data/stages/situations-ranges.xml';
import graphData from '../../../public/data/graphData/graphData.json';

const { nodes, edges } = graphData;

const links = edges.filter((edge) => edge.weight > 0.9);

const handler = (req, res) => {
  res.status(200).send({ situations: root, graphData: { nodes, links } });
};

export default handler;
