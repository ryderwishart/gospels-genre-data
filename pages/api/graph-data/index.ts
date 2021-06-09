import graphData from '../../../public/data/graphData/graphData.json';

const { nodes, edges } = graphData;

const handler = (req, res) => {
  res.status(200).send({ nodes, edges });
};

export default handler;
