import root from '../../../public/data/texts/Nestle1904.xml'

const handler = (req, res) => {
  res.status(200).json(root)
}

export default handler
