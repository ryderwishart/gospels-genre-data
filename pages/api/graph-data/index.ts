import graphData from '../../../public/data/graphData/graphData.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { nodes, edges }: any = graphData;

const handler = (req, res) => {
  res.status(200).send({ nodes, edges });
};

export default handler;
