import { systemsDictionary } from '../types/systemDefinitions';

const getSystemFromFeature = (feature: string, systemType = false): string => {
  let returnValue = null;
  const registerParameters = Object.keys(systemsDictionary).map(
    (registerParameter) => registerParameter,
  );
  registerParameters.forEach((registerParameter) => {
    const systems = Object.keys(systemsDictionary[registerParameter]);
    systems.forEach((system) => {
      const features = systemsDictionary[registerParameter][system];
      if (features.includes(feature)) {
        returnValue = systemType ? registerParameter : system;
      }
    });
  });
  if (returnValue) {
    return returnValue;
  } else {
    throw Error(
      'Feature does not match any register parameters listed in systemsDictionary (location: ../types/systemDefinitions)',
    );
  }
};

export default getSystemFromFeature;
