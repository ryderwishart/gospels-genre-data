import { number } from 'yargs';

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

// SITUATION FEATURES

export type StageFeatureSet = {
  id: string;
  title: string;
  features: string[];
};

export type Episode = {
  episode: string;
  title: string;
  preTextFeatures: string[];
  viaTextFeatures: string[];
};

export interface EpisodeMetadata {
  title: string;
  start: string;
  section: string;
  mormorphGntId: string;
  cluster?: string;
}

// GRAPH DATA
export interface GraphDataObject {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export type GraphNode = {
  id: string;
  label: string;
  attributes: any;
  [key: string]: string | number;
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  weight: number;
  [key: string]: string | number;
};

// PRINCIPAL COMPONENT ANALYSIS DATA

export interface Dimensions {
  dim_1: number;
  dim_2: number;
  dim_3: number;
  dim_4: number;
  dim_5: number;
  dim_6: number;
  dim_7: number;
  dim_8: number;
  dim_9: number;
  dim_10: number;
  dim_11: number;
  dim_12: number;
  dim_13: number;
  dim_14: number;
  dim_15: number;
  dim_16: number;
  dim_17: number;
  dim_18: number;
  dim_19: number;
}

export const DimensionLabels = {
  dim_1: {
    positive: 'semiotic',
    negative: 'material',
  },
  dim_2: {
    positive: 'interactive',
    negative: 'descriptive',
  },
  dim_3: {
    positive: 'public',
    negative: 'private',
  },
  dim_4: {
    positive: 'flexible',
    negative: 'procedural',
  },
  dim_5: {
    positive: 'discussing',
    negative: 'challenging',
  },
  dim_6: {
    positive: 'lecturing',
    negative: 'discoursing',
  },
  dim_7: {
    positive: 'determining',
    negative: 'influencing',
  },
};
