import { GraphEdge, GraphNode } from '../types';
import dynamic from 'next/dynamic';
import SpriteText from 'three-spritetext';

interface GraphProps {
  graphData: {
    nodes: GraphNode[];
    links: GraphEdge[];
  };
  width?: number;
  height?: number;
  cooldown?: number;
  threeDimensional?: boolean;
  useNonTextNodes?: boolean;
  onNodeHover?: (node: GraphNode) => void;
  nodeLabel?: (node: GraphNode) => string;
}

const ForceGraphDynamicLoad = dynamic(() => import('./ForceGraphDynamicLoad'), {
  ssr: false,
});

const ForceGraph3dDynamicLoad = dynamic(
  () => import('./ForceGraph3dDynamicLoad'),
  {
    ssr: false,
  },
);

const Graph = (props: GraphProps) => {
  // NOTE: 'any' types below are attempting to reconcile my data with react-force-graph's types
  const width = !props.width
    ? window.innerWidth <= 350
      ? 200
      : window.innerWidth <= 400
      ? 270
      : window.innerWidth <= 800
      ? 400
      : 600
    : props.width;
  if (props.threeDimensional) {
    return (
      <ForceGraph3dDynamicLoad
        linkWidth={(link) => 4}
        graphData={props.graphData}
        width={width}
        height={width && !props.height ? width * 0.5 : props.height}
        cooldownTicks={props.cooldown ? props.cooldown : Infinity}
        nodeLabel={
          props.nodeLabel ? props.nodeLabel : (node: GraphNode) => node.id
        }
        nodeThreeObject={
          !props.useNonTextNodes
            ? (node) => {
                const sprite: any = new SpriteText(node.id);
                sprite.material.depthWrite = false; // make sprite background transparent
                sprite.color = node.color;
                sprite.textHeight = 8;
                return sprite;
              }
            : false
        }
        linkVisibility={true}
        onNodeHover={props.onNodeHover}
        //   onNodeClick={(node: GraphNode) => {
        //     const nodeTitle = node.id
        //       .split(' ')
        //       .filter((idSection) => !idSection.includes('-'))
        //       .join(' ');
        //     const nodeEpisodeLinkString = getFirstTitleHyphenatedLowerCaseStringFromTitleString(
        //       { string: nodeTitle },
        //     );
        //     window.open(`/episodes/${nodeEpisodeLinkString}`, '_self');
        //   }}
      />
    );
  } else {
    return (
      <ForceGraphDynamicLoad
        linkWidth={(link) => 4}
        graphData={props.graphData}
        width={width}
        height={width && !props.height ? width * 0.5 : props.height}
        cooldownTicks={props.cooldown ? props.cooldown : Infinity}
        nodeLabel={(node: GraphNode) => node.id}
        nodeCanvasObject={
          !props.useNonTextNodes
            ? (node: any, context, globalScale) => {
                if (node) {
                  const label = node.id;
                  const fontSize = 12 / globalScale;
                  context.font = `${fontSize}px Sans-Serif`;
                  const textWidth = context.measureText(label).width;

                  // NOTE: Background rectangle
                  const bckgDimensions = [textWidth, fontSize].map(
                    (n) => n + fontSize * 0.2,
                  ); // NOTE: Adds some padding
                  context.fillStyle = 'rgba(255, 255, 255, 0.8)';
                  context.fillRect(
                    node.x - bckgDimensions[0] / 2,
                    node.y - bckgDimensions[1] / 2,
                    bckgDimensions[0],
                    bckgDimensions[1],
                  );

                  // NOTE: Text outline
                  context.strokeStyle = node.color;
                  context.miterLimit = 2;
                  context.lineJoin = 'round';
                  context.lineWidth = 1 / globalScale;
                  context.strokeText(label, node.x, node.y);
                  context.lineWidth = 1 / globalScale;
                  context.fillText(label, node.x, node.y);

                  // NOTE: Text label
                  context.textAlign = 'center';
                  context.textBaseline = 'middle';
                  context.fillStyle = 'black';
                  context.fillText(label, node.x, node.y);
                  node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
                }
              }
            : null
        }
        nodePointerAreaPaint={(node: any, color, context) => {
          context.fillStyle = color;
          const bckgDimensions = node.__bckgDimensions;
          bckgDimensions &&
            context.fillRect(
              node.x - bckgDimensions[0] / 2,
              node.y - bckgDimensions[1] / 2,
              bckgDimensions[0],
              bckgDimensions[1],
            );
        }}
        linkVisibility={true}
        //   onNodeClick={(node: GraphNode) => {
        //     const nodeTitle = node.id
        //       .split(' ')
        //       .filter((idSection) => !idSection.includes('-'))
        //       .join(' ');
        //     const nodeEpisodeLinkString = getFirstTitleHyphenatedLowerCaseStringFromTitleString(
        //       { string: nodeTitle },
        //     );
        //     window.open(`/episodes/${nodeEpisodeLinkString}`, '_self');
        //   }}
      />
    );
  }
};

export default Graph;
