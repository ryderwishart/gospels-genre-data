import speechActs from '../../../public/data/stages/stage-speech-acts/speechActs.json';
import jsonPath from 'jsonpath';

const speechActsJson = speechActs['root'];

const handler = (req, res) => {
  const stageIDFormatted = req.query.stage.replace('$', '-');
  const stageJSONPathExpression = `$..stage[?(@.key === '${stageIDFormatted}')]`;
  const selectedData = jsonPath.query(speechActsJson, stageJSONPathExpression);
  if (req.query.stage) {
    res.status(200).send(selectedData);
  } else {
    res.status(404).send('Not found');
  }
};

export default handler;
