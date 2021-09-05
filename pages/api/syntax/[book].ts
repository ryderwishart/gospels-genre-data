import xml from '../../../public/data/texts/2021-08-31/02-mark.json';
import { OpenTextJsonDataType } from '../../../types';
import jsonPath from 'jsonpath';

const xmlData: OpenTextJsonDataType = xml;

const selectedData = jsonPath.query(xmlData, `$..e`);

const handler = (req, res) => {
  console.log(req.query);

  if (req.query.book) {
    const filteredData = selectedData.filter((item) =>
      item['xml:id']?.toLowerCase().includes(req.query.book),
    );
    const dataWithChildren = jsonPath.query(filteredData, `$..e`);
    res.status(200).send(dataWithChildren);
  } else {
    res.status(404).send(selectedData);
  }
};

export default handler;
