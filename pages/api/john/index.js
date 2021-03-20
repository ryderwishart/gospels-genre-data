import root from '../../../data/stages/johannine_sample_Feb-22.json'

const handler = (req, res) => {
  res.status(200).send(root)
}

export default handler;
