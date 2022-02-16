import { Situation } from '../types';
import { systemsDictionary } from '../types/systemDefinitions';
import { constants } from '../config';

const MutationSet = ({
  registerParameterSelection,
  mutations,
  preAndViaFeatureSets,
}: {
  registerParameterSelection: string;
  mutations: string[];
  preAndViaFeatureSets: Situation;
}): JSX.Element => {
  //   const usesMultipleFeatureSets =
  //     preAndViaFeatureSets.preTextFeatures?.length > 0;
  const hasMutations = [];
  const mutationElements = Object.keys(
    systemsDictionary[registerParameterSelection],
  ).map((system) => {
    const existingMutations = systemsDictionary[registerParameterSelection][
      system
    ]
      .filter((feature) => mutations.includes(feature))
      .filter((mutation) =>
        preAndViaFeatureSets?.preTextFeatures?.includes(mutation),
      )
      .map((mutation) => (
        <span key={mutation}>
          {mutation} <span style={{ color: constants.color.blue }}>&rarr;</span>{' '}
        </span>
      ));

    existingMutations.length > 0
      ? hasMutations.push(true)
      : hasMutations.push(false);

    if (hasMutations) {
      return (
        <div key={system}>
          {existingMutations.length > 0 && existingMutations}
          {systemsDictionary[registerParameterSelection][system]
            .filter((feature) => mutations.includes(feature))
            .filter((mutation) =>
              preAndViaFeatureSets?.viaTextFeatures?.includes(mutation),
            )}
        </div>
      );
    }
    return '';
  });

  return (
    <>
      {hasMutations.includes(true) ? (
        mutationElements
      ) : (
        <span style={{ color: constants.color.lightGrey }}>None</span>
      )}
    </>
  );
};

export default MutationSet;
