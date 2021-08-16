import graphData from '../../../public/data/graphData/graphData.json';


const { nodes } = graphData;

const allEdges = graphData.edges;

const edgesWithWeightOfMoreThanPointSeven = allEdges.filter(edge => edge.weight > 0.7);

const edges = edgesWithWeightOfMoreThanPointSeven;

const handler = (req, res) => {
  res.status(200).send({ nodes, edges });
};

export default handler;
