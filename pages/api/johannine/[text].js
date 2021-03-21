import root from '../../../data/stages/johannine_sample_Feb-22.json'

const handler = (req, res) => {
console.log('*********in text API [text].js', req.query)
  const key = req.query.text
  const selectedTextArray = root.data.filter(textContainer => textContainer.text.key === key)
//   const selectedTextArray = root.data
  if(selectedTextArray){
    //   res.status(200).json(selectedTextArray)
      res.status(200).json(selectedTextArray[0])
  } else {
      res.status(404).json({message: `Text with id ${key} not found.`})
  }
}

export default handler;

// TODO: these routes should be determined by the title, not the id, for SEO purposes