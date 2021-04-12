import root from '../../../../public/data/stages/johannine_sample_Feb-22.json'

const handler = (req, res) => {
    const { stage, text } = req.query

    const selectedText = root.data
        .find(textContainer => textContainer.text.key === text)
    const selectedStage = selectedText.text.content.turn.content
        .find(stageContainer => stageContainer.stage.key === stage)

    const moves = selectedStage.stage.content.map(moveContainer => moveContainer.move)

  if(moves){
      res.status(200).json(moves)
  } else {
      res.status(404).json({message: `Stage with id ${stage} not found.`})
  }
}

export default handler;