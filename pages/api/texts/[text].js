import root from '../../../public/data/texts/Nestle1904.xml';
import matthew from '../../../public/data/stages/N1904.Matt.json';

const handler = (req, res) => {
  const key = req.query.text;
  const selectedTextArray = root.Nestle1904.text.filter(
    (textContainer) =>
      textContainer.$.title.toLowerCase() === key ||
      textContainer.$.title === key,
  );
  const isMatthew = key === 'matthew';
  if (isMatthew) {
    res.status(200).json(matthew);
  } else if (selectedTextArray) {
    res.status(200).json(selectedTextArray[0]);
  } else {
    res.status(404).json({ message: `Text with id ${key} not found.` });
  }
};

export default handler;

// TODO: these routes should be determined by the title, not the id, for SEO purposes
