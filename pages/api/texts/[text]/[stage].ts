import { TextContainer } from './../../../../types/index';
import root from '../../../../public/data/stages/N1904.Matt.json';

interface HandlerProps {
  query: {
    stage: string;
    text: string;
  };
}

const handler = (
  req: HandlerProps,
  res: { status: (number: number) => { json?: any } },
): void => {
  const { stage, text } = req.query;
  const selectedTextContainer: TextContainer | undefined = root['data'].find(
    (textContainer: TextContainer) =>
      textContainer.text.key === text ||
      /* note, for initial commit only */ textContainer,
  );
  console.log('1', selectedTextContainer);
  const selectedStage = selectedTextContainer?.text.content.turn.content.find(
    (stageContainer) =>
      stageContainer.stage.key === stage ||
      stageContainer.stage.key === 'N1904.Matt.1.1.1-6.16_S',
  );
  console.log('2', selectedStage);

  // const selectedTextContainer = root.data
  //     .find(textContainer => textContainer.text.key === text)
  // const selectedStage = selectedTextContainer.text.content.turn.content
  //     .find(stageContainer => stageContainer.stage.key === stage)

  // const moves = selectedStage.stage.content.map(moveContainer => moveContainer.move)
  const moves = null;
  if (moves) {
    res.status(200).json(moves);
  } else if (selectedStage) {
    res.status(200).json(selectedStage);
  } else {
    res.status(404).json({ message: `Stage with id ${stage} not found.` });
  }
};

export default handler;
