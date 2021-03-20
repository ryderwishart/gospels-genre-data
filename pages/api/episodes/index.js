// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import root from '../../../data/episodes-ranges.xml'

const handler = (req, res) => {
  res.status(200).send(root)
}

export default handler;
