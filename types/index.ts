export interface TextContainer {
  text: Text;
}
export interface Text {
  key: string;
  content: TurnContainer;
}

export interface TurnContainer {
  turn: Turn;
}
export interface Turn {
  key: string;
  content: StageContainer[];
}

export interface StageContainer {
  stage: Stage;
}
export interface Stage {
  key: string;
  content: MoveContainer[];
}

export interface MoveContainer {
  move: Move;
}
export interface Move {
  key: string;
  expressions: WordContainer[];
  meanings: SystemContainer[];
}

export interface WordContainer {
  word: Word;
}
export interface Word {
  key: string;
  lemma: string;
  norm: string;
  string: string;
}

export interface SystemContainer {
  system: System;
}

export interface System {
  key: string;
  instances: ChoiceContainer[];
}

export interface ChoiceContainer {
  choice: Choice;
}
export interface Choice {
  key: string;
  realization: string; // NOTE: This string is like a stringified array ("N1904.John.9.1.2' 'N1904.John.9.1.3") Basically it should be split on `' '`
}
