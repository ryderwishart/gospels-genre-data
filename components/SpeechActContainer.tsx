import { Tag } from 'antd';
import React from 'react';
import {
  InitiatingSpeechActClassification,
  SpeechActData,
  SpeechActDirectDiscourse,
} from '../types';
import { Direction, Orientation, Contemplation, Tentativeness } from '../types';
import DirectDiscourseContainer from './DirectDiscourseContainer';
import WordContainer from './WordContainer';

function getSpeechActType(
  speechActFunctionProp: SpeechActData,
): { type: InitiatingSpeechActClassification; color: string } {
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
  //   console.log(direction, orientation, contemplation, tentativeness, {
  //     typicalPropertiesString,
  //   });
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
    // console.log(
    //   `Speech act type not found: ${JSON.stringify(speechActFunctionProp)}`,
    // );
    null;
  }
}

interface ComponentProps {
  speechAct: SpeechActData;
  embedded?: boolean;
}

const SpeechActContainer: React.FunctionComponent<ComponentProps> = (props) => {
  const speechActWords = Array.isArray(props.speechAct.w) ? (
    props.speechAct.w?.map((word, index) => (
      <WordContainer key={`${word.content}-${index}`} word={word} />
    ))
  ) : (
    <WordContainer
      key={`${props.speechAct.w.content}`}
      word={props.speechAct.w}
    />
  );
  const speechActHasEmbeddedDirectDiscourse = !!props.speechAct.directDiscourse;
  const speechActHasEmbeddedSpeechAct = !!props.speechAct.speechAct;
  let embeddedContent = null;
  if (speechActHasEmbeddedDirectDiscourse) {
    const embeddedDirectDiscourse: SpeechActDirectDiscourse =
      props.speechAct.directDiscourse;
    embeddedContent = (
      <DirectDiscourseContainer
        directDiscourse={embeddedDirectDiscourse}
        embedded={true}
      />
    );
  }
  if (speechActHasEmbeddedSpeechAct) {
    const embeddedSpeechAct: SpeechActData = props.speechAct.speechAct;
    embeddedContent = (
      <SpeechActContainer speechAct={embeddedSpeechAct} embedded={true} />
    );
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexFlow: 'row wrap',
          marginBottom: 10,
          marginTop: 10,
        }}
      >
        {!props.speechAct.associated && (
          <Tag color={getSpeechActType(props.speechAct)?.color}>
            {getSpeechActType(props.speechAct)?.type}
          </Tag>
        )}
        {speechActWords}
      </div>
      {embeddedContent}
    </>
  );
};

export default SpeechActContainer;
