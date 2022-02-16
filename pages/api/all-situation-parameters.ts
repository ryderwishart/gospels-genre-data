import situationsFeatures from '../../public/data/stages/situationsDynamicFeatures.json';

const handler = (req, res) => {
  const countEveryTimeAFeatureAppearsInPreTextFeaturesOrViaTextFeatures = (
    situation,
  ) => {
    const features = {};
    Array.isArray(situation.preTextFeatures) &&
      situation.preTextFeatures.length > 0 &&
      situation.preTextFeatures.forEach((feature) => {
        if (features[feature]) {
          features[feature] += 1;
        } else {
          features[feature] = 1;
        }
      });
    Array.isArray(situation.viaTextFeatures) &&
      situation.viaTextFeatures.length > 0 &&
      situation.viaTextFeatures.forEach((feature) => {
        if (features[feature]) {
          features[feature] += 1;
        } else {
          features[feature] = 1;
        }
      });
    return features;
  };

  res.json({
    'total situations': situationsFeatures.length,
    'situations with embedded speech': situationsFeatures.filter(
      (situation) =>
        situation.preTextFeatures &&
        situation.preTextFeatures !== 'no embedded discourse',
    ).length,
    'counts for all unique features found in preTextFeatures and viaTextFeatures for each situation': situationsFeatures
      .map((situation) =>
        countEveryTimeAFeatureAppearsInPreTextFeaturesOrViaTextFeatures(
          situation,
        ),
      )
      .reduce((acc, curr) => {
        Object.keys(curr).forEach((feature) => {
          if (acc[feature]) {
            acc[feature] += curr[feature];
          } else {
            acc[feature] = curr[feature];
          }
        });
        return acc;
      }),
  });
};

export default handler;
