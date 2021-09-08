// DEPRECATED:

// export interface TextContainer {
//   text: Text;
// }
// export interface Text {
//   key: string;
//   content: TurnContainer;
// }

// export interface TurnContainer {
//   turn: Turn;
// }
// export interface Turn {
//   key: string;
//   content: StageContainer[];
// }

// export interface StageContainer {
//   stage: Stage;
// }
// export interface Stage {
//   key: string;
//   content: MoveContainer[];
// }

// export interface MoveContainer {
//   move: Move;
// }
// export interface Move {
//   key: string;
//   expressions: WordContainer[];
//   meanings: SystemContainer[];
// }

// export interface WordContainer {
//   word: Word;
// }
// export interface Word {
//   key: string;
//   lemma: string;
//   norm: string;
//   string: string;
// }

// export interface SystemContainer {
//   system: System;
// }

// export interface System {
//   key: string;
//   instances: ChoiceContainer[];
// }

// export interface ChoiceContainer {
//   choice: Choice;
// }
// export interface Choice {
//   key: string;
//   realization: string; // NOTE: This string is like a stringified array ("N1904.John.9.1.2' 'N1904.John.9.1.3") Basically it should be split on `' '`
// }

// SITUATION FEATURES

export type StageFeatureSet = {
  id: string;
  title: string;
  features: string[];
};

export type Episode = {
  episode: string;
  title: string;
  section?: string;
  preTextFeatures: string[];
  viaTextFeatures: string[];
};

export interface EpisodeMetadata {
  title: string;
  start: string;
  episodeSlug: string;
  passage: Verse[] | Paragraph[];
  section: string;
  morphGntId: string;
  cluster?: string;
  dimensions?: Dimensions;
}

export interface Paragraph {
  verses: Verse[];
}

export interface Verse {
  text: string;
  osisID: string;
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
  episodeId: string;
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
    positive: 'unconventional',
    negative: 'conventional',
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

// NOTE: XML loader uses $ property to store attributes of any node

// export type XMLNode = {
//   $?: {
//     [key: string]: unknown;
//   };
// };
// export interface OpenTextXMLData extends XMLNode {
//   header: {
//     fileDesc: any;
//     encodingDesc: any;
//     text: Text[] /* | Token | Word | PunctuationCharacter; */;
//   };
// }

// export interface Text extends XMLNode {
//   e: MeaningContainer | Meaning;

// }

// export interface MeaningContainer extends XMLNode {
//   m: Meaning[];
// }

// export interface Meaning extends XMLNode {
//   w?: WordContainer[];
//   m?: MeaningContainer[];
// }

// export interface WordContainer extends XMLNode {
//   w: Word[];

// FULL XML DATA TYPES
export interface OpenTextJsonDataType {
  OpenText: OpenTextData;
}

export interface OpenTextData {
  header: {
    fileDesc: any;
    encodingDesc: any;
  };
  text: TextJSON;
  'xmlns:xs': string;
  'xmlns:fn': string;
  'xmlns:cblte': string;
}

export interface NodeContainer {
  w?: WordingJSON | WordingJSON[];
  m?: MeaningJSON | MeaningJSON[];
  e?: ExpressionJSON | ExpressionJSON[];
}

export interface TextJSON extends NodeContainer {
  'xml:id': string;
}

export interface EnumerableElement extends NodeContainer {
  n?: number;
  type?: string;
  content?: string;
}
export interface ExpressionJSON extends EnumerableElement {
  'xml:id'?: string;
  pos?: string;
  formal?: string;
  functional?: string;
  gloss?: string;
  case?: string;
  gender?: string;
  mood?: string;
  norm?: string;
  number?: string;
  person?: string;
  strong?: number;
  tense?: string;
  lemma?: string;
  voice?: string;
  proj_end?: string;
  posClass?: string;
}

export interface MeaningJSON extends NodeContainer {
  feat?: string;
  lemma?: string;
  sys?: string;
}

export interface WordingJSON extends EnumerableElement {
  status?: string;
  pos?: string;
  class?: string;
}

// SPEECH ACTS JSON TYPES
export interface SpeechActsJson {
  root: { stage: SpeechActStage | SpeechActStage[] };
}

export type SpeechActJsonChild = {
  move?: SpeechActMove | SpeechActMove[];
  speechAct?: SpeechActData | SpeechActData[];
  directDiscourse?: SpeechActDirectDiscourse | SpeechActDirectDiscourse[];
  w?: SpeechActWording | SpeechActWording[];
};

export interface SpeechActStage extends SpeechActJsonChild {
  key: string;
  title: string;
  move: SpeechActMove[];
}

export interface SpeechActMove extends SpeechActJsonChild {
  chStart: string;
  chEnd: string;
  vStart: string;
  vEnd: string;
}

export interface SpeechActData extends SpeechActJsonChild {
  direction: string;
  orientation: string;
  contemplation: string;
  tentativeness: string;
  associated: boolean;
  w: SpeechActWording | SpeechActWording[];
}

export interface SpeechActWording {
  pos: string;
  lemma: string;
  content: string;
  gloss: string;
}

export interface SpeechActDirectDiscourse extends SpeechActJsonChild {
  ostentatious?: string;
}

// SPEECH ACT CLASSIFICATIONS
export enum InitiatingSpeechActClassification {
  closedDirecting = 'command',
  closedDiscussing = 'statement',
  openDirecting = 'request',
  openDiscussing = 'question',
}

export enum RespondingSpeechActClassification { // THESE VALUES ARE NOT CORRECT
  closedDirectingExpected = 'command',
  closedDirectingDiscretionary = 'command',
  closedDiscussingExpected = 'affirm (state?)',
  closedDiscussingDiscretionary = 'contradict (state?)',
  openDirectingExpected = 'request',
  openDirectingDiscretionary = 'request',
  openDiscussingExpected = 'question',
  openDiscussingDiscretionary = 'question',
}
export enum Direction {
  directive = 'directive',
  not_directive = '!directive',
  direction_tbd = 'direction_tbd',
}

export enum Orientation {
  internal_orientation = 'internal_orientation',
  orientation_tbd = 'orientation_tbd',
}

export enum Contemplation {
  contemplative = 'contemplative',
  assertive = 'assertive',
}

export enum Tentativeness {
  tentative = 'tentative',
  not_tentative = '!tentative',
  tentative_tbd = 'tentative_tbd',
}
