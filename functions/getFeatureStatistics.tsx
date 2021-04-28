import { ChoiceContainer, System } from '../types';
import { allChoices } from '../types/systemDefinitions';

interface ComponentProps {
  stageId: string;
  allSystems: System[];
  showChoices?: boolean;
  asTable?: boolean;
}

const getFeatureStatistics = (props: ComponentProps) => {
  const allInstances = allChoices.map((choice: string) => {
    let count = 0;
    props.allSystems?.forEach((system: System) => {
      system.instances.forEach((instance: ChoiceContainer) => {
        if (instance.choice.key === choice) {
          count += 1;
        }
      });
    });
    return { choice, count };
  });
  const row = [
    props.stageId,
    ...allInstances.map((instance) => instance.count),
  ];
  return row;
};

export default getFeatureStatistics;
