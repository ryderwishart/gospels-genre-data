import xmlData from '../../../public/data/stages/features/featureSets.json';
import jsonpath from 'jsonpath';

interface Stage {
  key: string;
  title: string;
  move: Move | Move[];
}

interface Move {
  featureSet: {
    unitType: string;
    content: string;
  };
  content?: string;
  chStart: string;
  chEnd: string;
  vStart: string;
  vEnd: string;
}

const stages: Stage[] = jsonpath.query(
  xmlData,
  '$..stage',
); /* .map((stage) => {
  return {
    ...stage,
    move: {
      ...stage.move,
      featureSet: {
        ...stage.move?.featureSet,
        content: stage.move.featureSet.content.replace(/\n/g, '').split(' '),
      },
    },
  };
}); */

const handler = (req, res) => {
  res.status(200).send(stages);
};

export default handler;
