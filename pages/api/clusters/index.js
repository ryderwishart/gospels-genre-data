import situationsData from '../../../public/data/stages/situations-ranges.xml';

const situations = situationsData.root.situation;

const allSituationsWithClusterValue = situations.filter(
  (situationContainer) => situationContainer.$.cluster,
);

const groupBy = (arrayOfObjects, key) => {
  return arrayOfObjects.reduce((accumulator, item) => {
    const group = item[key];
    accumulator[group] = accumulator[group] || [];
    accumulator[group].push(item);
    return accumulator;
  }, {}); // NOTE: {} is the initial value of the accumulator
};

const flattenedSituations = allSituationsWithClusterValue.map(
  (situation) => situation.$,
);

const situationsByCluster = groupBy(flattenedSituations, 'cluster');

const handler = (req, res) => {
  res.status(200).send(situationsByCluster);
};

export default handler;
