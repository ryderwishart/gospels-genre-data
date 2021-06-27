import { Episode } from '../types';
import { systemsDictionary } from '../types/systemDefinitions';
import { constants } from '../config';

const MutationSet = ({
  registerParameterSelection,
  mutations,
  preAndViaFeatureSets,
}: {
  registerParameterSelection: string;
  mutations: string[];
  preAndViaFeatureSets: Episode;
}): JSX.Element => {
  //   const usesMultipleFeatureSets =
  //     preAndViaFeatureSets.preTextFeatures?.length > 0;
  return (
    <>
      {Object.keys(systemsDictionary[registerParameterSelection]).map(
        (system) => {
          return (
            <div key={system}>
              {systemsDictionary[registerParameterSelection][system]
                .filter((feature) => mutations.includes(feature))
                .filter((mutation) =>
                  /* 
                  usesMultipleFeatureSets
                    ? preAndViaFeatureSets.some((episodeFeatureSet) =>
                        episodeFeatureSet.preTextFeatures.includes(mutation),
                      )
                    :  */ preAndViaFeatureSets?.preTextFeatures?.includes(
                    mutation,
                  ),
                )
                .map((mutation) => (
                  <span key={mutation}>
                    {mutation}{' '}
                    <span style={{ color: constants.color.blue }}>&rarr;</span>{' '}
                  </span>
                ))}
              {systemsDictionary[registerParameterSelection][system]
                .filter((feature) => mutations.includes(feature))
                .filter((mutation) =>
                  /* 
                  usesMultipleFeatureSets
                    ? preAndViaFeatureSets.some((episodeFeatureSet) =>
                        episodeFeatureSet.viaTextFeatures.includes(mutation),
                      )
                    : */ preAndViaFeatureSets?.viaTextFeatures?.includes(
                    mutation,
                  ),
                )}
            </div>
          );
        },
      )}
    </>
  );
};

export default MutationSet;
