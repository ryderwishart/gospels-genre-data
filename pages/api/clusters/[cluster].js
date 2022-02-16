import { getURLSlugFromClusterName } from '../../../functions/getURLSlugFromClusterName';
import situationsData from '../../../public/data/stages/situations-ranges.xml';
import dimensionScoresBySituation from '../../../public/data/stages/principal-component-analysis/situation-dimension-values.json';
import situationsFeatures from '../../../public/data/stages/situationsDynamicFeatures.json';
import groupBy from '../../../functions/groupBy'

const situations = situationsData.root.situation;

const allSituationsWithClusterValue = situations.filter(
  (situationContainer) => situationContainer.$.cluster,
);

const flattenedSituations = allSituationsWithClusterValue.map(
  (situation) => {
    const situationWithSlugForMatching = {
      ...situation.$, 
      situationSlug: getURLSlugFromClusterName({string: situation.$.cluster}),
    }
    return situationWithSlugForMatching
  }
);

const situationsByCluster = groupBy(flattenedSituations, 'cluster');

const handler = (req, res) => {
  const cluster = req.query.cluster;
  const clusterName = Object.keys(situationsByCluster) && Object.keys(situationsByCluster).filter(clusterName => situationsByCluster[clusterName][0]?.situationSlug === cluster);
  const selectedSituations = clusterName && situationsByCluster[clusterName]
  let selectedSituationFeatures = []
  try {
    const selectedDimensionValues = selectedSituations.map((situation) => {
      const situationID = situation.section.split('-').join('-').split(' ');
      const dimensionValuesForSituation = dimensionScoresBySituation.find(
        (dimensions) => situationID.some(id => dimensions.situationId.split(' ').includes(id)),
      );
      if (dimensionValuesForSituation) {
        const { situationId, ...dimensions } =
          dimensionValuesForSituation && dimensionValuesForSituation;
        situation.dimensions = dimensions;
      }
      selectedSituationFeatures.push(situationsFeatures.find((situationFeatureSet, index) => {
        if (situationFeatureSet.title.includes(situation.title)) {
          return situationFeatureSet;
        } else {
          return null;
        }
      }));
      return situation;
    });

    const situationData = {selectedDimensionValues, selectedSituationFeatures}

    res.status(200).send(situationData);
  } catch (error) {
    res.status(404).send('Error ' + error);
  }
};

export default handler;
