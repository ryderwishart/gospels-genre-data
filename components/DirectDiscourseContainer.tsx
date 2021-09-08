import { Collapse } from 'antd';
import { SpeechActDirectDiscourse } from '../types';
import MoveContainer from './MoveContainer';
import WordContainer from './WordContainer';

interface ComponentProps {
  directDiscourse: SpeechActDirectDiscourse | SpeechActDirectDiscourse[];
  embedded?: boolean;
}

const DirectDiscourseContainer: React.FunctionComponent<ComponentProps> = (
  props,
) => {
  const directDiscourseWords =
    !Array.isArray(props.directDiscourse) &&
    props.directDiscourse?.w &&
    Array.isArray(props.directDiscourse.w) ? (
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
        key={`${
          !Array.isArray(props.directDiscourse) &&
          props.directDiscourse?.w &&
          !Array.isArray(props.directDiscourse.w) &&
          props.directDiscourse.w?.content
        }`}
        word={
          !Array.isArray(props.directDiscourse) &&
          props.directDiscourse?.w &&
          !Array.isArray(props.directDiscourse.w) &&
          props.directDiscourse.w
        }
      />
    );

  let directDiscourseContent = null;

  if (
    !Array.isArray(props.directDiscourse) &&
    props.directDiscourse?.w &&
    !Array.isArray(props.directDiscourse.w) &&
    props.directDiscourse.move &&
    Array.isArray(props.directDiscourse.move)
  ) {
    directDiscourseContent = props.directDiscourse.move.map((move, index) => (
      <MoveContainer key={'move' + index} move={move} embedded />
    ));
  } else if (
    !Array.isArray(props.directDiscourse) &&
    props.directDiscourse?.w &&
    !Array.isArray(props.directDiscourse.w) &&
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
