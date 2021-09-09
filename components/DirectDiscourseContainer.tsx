import { Collapse } from 'antd';
// import { SpeechActDirectDiscourse } from '../types';
import MoveContainer from './MoveContainer';
import WordContainer from './WordContainer';

interface ComponentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  directDiscourse: any; // NOTE: forcing any type because explicitly checking for array types is super cumbersome here and resulted in no content for the direct discourse containers
  embedded?: boolean;
}

const DirectDiscourseContainer: React.FunctionComponent<ComponentProps> = (
  props,
) => {
  const directDiscourseWords =
    props.directDiscourse?.w && Array.isArray(props.directDiscourse.w) ? (
      props.directDiscourse.w.map((word, index) => (
        <WordContainer
          directDiscourse
          key={`${word?.content}-${index}`}
          word={word}
        />
      ))
    ) : (
      <WordContainer
        directDiscourse
        key={`${props.directDiscourse.w?.content}`}
        word={props.directDiscourse.w}
      />
    );

  let directDiscourseContent = null;

  if (props.directDiscourse.move && Array.isArray(props.directDiscourse.move)) {
    directDiscourseContent = props.directDiscourse.move.map((move, index) => (
      <MoveContainer key={'move' + index} move={move} embedded />
    ));
  } else if (
    props.directDiscourse.move &&
    !Array.isArray(props.directDiscourse.move)
  ) {
    directDiscourseContent = (
      <MoveContainer move={props.directDiscourse.move} embedded />
    );
  }
  const moveWrapper = props.embedded ? (
    <div>
      <Collapse>
        <Collapse.Panel key="speechActWords" header="Embedded Discourse">
          {directDiscourseWords} {directDiscourseContent}
        </Collapse.Panel>
      </Collapse>
    </div>
  ) : (
    <div>
      {directDiscourseWords} {directDiscourseContent}
    </div>
  );

  return moveWrapper;
};

export default DirectDiscourseContainer;
