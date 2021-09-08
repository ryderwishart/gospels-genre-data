import { Tooltip } from 'antd';
import { constants } from '../config';

const WordContainer = (props) => {
  const { word } = props;
  const useMoveWordStyle = !!props.move;
  if (word?.content) {
    return (
      <Tooltip
        title={`${word?.lemma} ('${word?.gloss}', ${word?.pos})${
          useMoveWordStyle
            ? ' NOTE: This wording is move-level, and does not directly realize a speech act'
            : ''
        }`}
      >
        <span
          style={{
            marginLeft: 3,
            marginRight: 3,
            color: useMoveWordStyle ? constants.color.blue : '',
          }}
        >
          {word.content}
        </span>
      </Tooltip>
    );
  }
  return null;
};

export default WordContainer;
