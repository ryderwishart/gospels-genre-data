import { Collapse, Popover, Tag } from 'antd';
import React from 'react';
import { constants } from '../config';
import {
  InitiatingSpeechActClassification,
  SpeechActData,
  SpeechActMove,
  SpeechActDirectDiscourse,
} from '../types';
import { Direction, Orientation, Contemplation, Tentativeness } from '../types';

function getSpeechActType(
  speechActFunctionProp: SpeechActData,
): { type: InitiatingSpeechActClassification; color: string } {
  console.log({ speechActFunctionProp });
  const typicalProperties = [];
  const {
    direction,
    orientation,
    contemplation,
    tentativeness,
  } = speechActFunctionProp;

  direction == Direction.directive
    ? typicalProperties.push('directing')
    : direction == Direction.not_directive
    ? typicalProperties.push('discussing')
    : direction == Direction.direction_tbd
    ? typicalProperties.push('discussing')
    : null;

  orientation == Orientation.internal_orientation
    ? typicalProperties.push('internal')
    : orientation == Orientation.orientation_tbd
    ? typicalProperties.push('external')
    : null;

  contemplation == Contemplation.contemplative
    ? typicalProperties.push('assertive/contemplative')
    : contemplation == Contemplation.assertive
    ? typicalProperties.push('assertive')
    : null;

  tentativeness == Tentativeness.tentative
    ? typicalProperties.push('open')
    : tentativeness == Tentativeness.tentative_tbd
    ? typicalProperties.push('closed')
    : tentativeness == Tentativeness.not_tentative
    ? typicalProperties.push('closed')
    : null;

  const typicalPropertiesString = typicalProperties.join('/');
  console.log(direction, orientation, contemplation, tentativeness, {
    typicalPropertiesString,
  });
  if (typicalPropertiesString.includes('closed')) {
    if (typicalPropertiesString.includes('discussing')) {
      return {
        type: InitiatingSpeechActClassification.closedDiscussing,
        color: 'geekblue',
      };
    } else {
      return {
        type: InitiatingSpeechActClassification.closedDirecting,
        color: 'red',
      };
    }
  } else if (typicalPropertiesString.includes('open')) {
    if (typicalPropertiesString.includes('discussing')) {
      return {
        type: InitiatingSpeechActClassification.openDiscussing,
        color: 'purple',
      };
    } else {
      return {
        type: InitiatingSpeechActClassification.openDirecting,
        color: 'cyan',
      };
    }
  } else {
    // throw new Error(`Speech act type not found: ${speechAct}`);
    console.log(
      `Speech act type not found: ${JSON.stringify(speechActFunctionProp)}`,
    );
  }
}

interface ComponentProps {
  speechAct: SpeechActData;
  move: SpeechActMove;
  embedded?: boolean;
}

const startAndEndAreDifferent = (start, end) => {
  return start !== end;
};

const SpeechActContainer: React.FunctionComponent<ComponentProps> = (props) => {
  const moveReferenceStart = props.move?.chStart + ':' + props.move?.vStart;
  const moveReferenceEnd = props.move?.chEnd + ':' + props.move?.vEnd;

  const speechActWords = Array.isArray(props.speechAct.w)
    ? props.speechAct.w.map((word) => word.content).join(' ')
    : props.speechAct.w.content;

  const speechActHasEmbeddedDirectDiscourse = !!props.speechAct.directDiscourse;

  let embeddedMoves = null;
  if (speechActHasEmbeddedDirectDiscourse) {
    const embeddedDirectDiscourse: SpeechActDirectDiscourse =
      props.speechAct.directDiscourse;
    const { move: embeddedMove } = embeddedDirectDiscourse;
    const { speechAct: embeddedSpeechActs } = embeddedMove;
    const embeddedSpeechActsIsArray = Array.isArray(embeddedSpeechActs);
    if (embeddedSpeechActsIsArray) {
      embeddedMoves = embeddedSpeechActs.map((embeddedSpeechAct, index) => (
        <div
          key={`${embeddedSpeechAct.content}-${index}`}
          style={{ padding: 5 }} // TODO: embedded speech act styling
        >
          <SpeechActContainer
            speechAct={embeddedSpeechAct}
            move={embeddedMove}
            embedded={true}
          />
        </div>
      ));
    } else if (!embeddedSpeechActsIsArray) {
      embeddedMoves = (
        <div
          style={{
            padding: 5,
          }} // TODO: embedded speech act styling
        >
          <SpeechActContainer
            speechAct={embeddedSpeechActs}
            move={embeddedMove}
            embedded={true}
          />
        </div>
      );
    }
  }

  return (
    <>
      <tr style={{ marginBottom: '10px' }}>
        <td style={{ textAlign: 'right' }}>
          {props.move && (
            <span
              style={{
                alignSelf: 'right',
                //   marginLeft: props.embedded
                //     ? ``
                //     : `-${moveReference.length / 1.5}em`,
                marginRight: '1em',
                color: 'lightgrey',
                //   gridColumn: '1',
              }}
            >
              {moveReferenceStart}
              {startAndEndAreDifferent(moveReferenceStart, moveReferenceEnd) &&
                `-${moveReferenceEnd}`}
            </span>
          )}
        </td>
        <td>
          <Tag
            color={getSpeechActType(props.speechAct)?.color}
            //   style={{ gridColumn: '2' }}
          >
            {getSpeechActType(props.speechAct)?.type}
          </Tag>
        </td>
        <td /* style={{ gridColumn: '3', alignContent: 'left' }} */>
          {speechActWords}
        </td>
      </tr>
      <tr style={{ columnSpan: 'all' }}>
        {embeddedMoves?.length > 0 && (
          <Collapse>
            <Collapse.Panel key="speechActWords" header="Embedded Speech Act">
              {embeddedMoves.map((embeddedMove: JSX.Element) => embeddedMove)}
            </Collapse.Panel>
          </Collapse>
        )}
      </tr>
    </>
    // <div
    //   style={{
    //     border: props.speechAct.discourse
    //       ? `3px solid ${constants.color.blue}`
    //       : '',
    //     padding: '0.5em',
    //     borderRadius: '0.5em',
    //   }}
    // >
    //   <Tag>{getSpeechActType(props.speechAct)}</Tag>
    //   <p>
    //
    //     {words}
    //   </p>
    // </div>
  );
};

export default SpeechActContainer;
