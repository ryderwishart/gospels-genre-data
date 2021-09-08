import { Collapse } from 'antd';
import { SpeechActMove } from '../types';
import SpeechActContainer from './SpeechActContainer';
import DirectDiscourseContainer from './DirectDiscourseContainer';
import WordContainer from './WordContainer';
import styles from '../styles/Home.module.css';

interface ComponentProps {
  move: SpeechActMove | SpeechActMove[];
  embedded?: boolean;
}

const MoveContainer: React.FunctionComponent<ComponentProps> = (props) => {
  const moveWords =
    !Array.isArray(props.move) && Array.isArray(props.move.w) ? (
      props.move.w.map((word, index) => (
        <WordContainer move key={`${word.content}-${index}`} word={word} />
      ))
    ) : (
      <WordContainer
        move
        key={`${
          !Array.isArray(props.move) &&
          !Array.isArray(props.move.w) &&
          props.move?.w?.content
        }`}
        word={!Array.isArray(props.move) && props.move?.w}
      />
    );

  const moveHasDirectDiscourse =
    !Array.isArray(props.move) && !!props.move?.directDiscourse;

  const moveContent = Array.isArray(props.move)
    ? props.move.map((move, moveIndex) => {
        const speechActKey = (speechActProp) =>
          `${speechActProp.direction}-${speechActProp.orientation}-${speechActProp.tentativeness}-${moveIndex}`;

        if (Array.isArray(move.speechAct)) {
          return move.speechAct.map((speechAct, speechActIndex) => {
            return (
              <SpeechActContainer
                key={speechActKey(speechAct) + speechActIndex}
                speechAct={speechAct}
              />
            );
          });
        } else {
          return (
            <SpeechActContainer
              key={speechActKey(move.speechAct)}
              speechAct={move.speechAct}
            />
          );
        }
      })
    : (!Array.isArray(props.move) &&
        Array.isArray(props.move.speechAct) &&
        props.move.speechAct.map((speechAct, index) => (
          <SpeechActContainer
            key={Math.random() + index}
            speechAct={speechAct}
          />
        ))) || (
        <SpeechActContainer
          speechAct={
            !Array.isArray(props.move.speechAct) && props.move.speechAct
          }
        />
      );

  const startAndEndAreDifferent = (start, end) => {
    return start !== end;
  };
  const moveReferenceStart =
    !Array.isArray(props.move) &&
    props.move?.chStart + ':' + props.move?.vStart;
  const moveReferenceEnd =
    !Array.isArray(props.move) && props.move?.chEnd + ':' + props.move?.vEnd;

  if (moveHasDirectDiscourse) {
    console.log('MOVE HAS DIRECT DISCOURSE');
    return (
      <div>
        {props.move && (
          <span
            style={{
              color: 'lightgrey',
            }}
          >
            {moveReferenceStart}
            {startAndEndAreDifferent(moveReferenceStart, moveReferenceEnd) &&
              `-${moveReferenceEnd}`}
          </span>
        )}
        {moveWords}
        {moveContent}
        <Collapse>
          <Collapse.Panel header={moveWords} key={Math.random()}>
            <DirectDiscourseContainer
              directDiscourse={
                !Array.isArray(props.move) && props.move?.directDiscourse
              }
              embedded={props.embedded}
            />
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  }

  const moveWrapper = (
    <div className={styles.card}>
      {moveReferenceStart.length > 0 && (
        <span style={{ color: 'lightgrey' }}>
          {moveReferenceStart}
          {startAndEndAreDifferent(moveReferenceStart, moveReferenceEnd) &&
            `-${moveReferenceEnd}`}
        </span>
      )}
      {moveWords} {moveContent}
    </div>
  );

  return moveWrapper;
};

export default MoveContainer;
