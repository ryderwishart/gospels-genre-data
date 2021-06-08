import { useEffect, useRef } from 'react';
import { Episode, GraphEdge, GraphNode } from '../types';
import handleHighlightExpressionsByIDs from '../functions/highlightByIds';
import dynamic from 'next/dynamic';
import { getFirstTitleHyphenatedLowerCaseStringFromTitleString } from '../functions/getFirstTitleHyphenatedLowerCaseStringFromTitleString';

interface GraphProps {
  graphData: {
    nodes: GraphNode[];
    links: GraphEdge[];
  };
  width: number;
  height: number;
  cooldown?: number;
}

const ForceGraphDynamicLoad = dynamic(() => import('./ForceGraphDynamicLoad'), {
  ssr: false,
});

const Graph = (props: GraphProps) => {
  return (
    <ForceGraphDynamicLoad
      graphData={props.graphData}
      width={props.width}
      height={props.height}
      cooldownTicks={props.cooldown ? props.cooldown : 'Inf'}
      nodeLabel={(node: GraphNode) => node.id}
      nodeColor={(node: GraphNode) => node.__indexColor}
      nodeCanvasObject={(node, ctx, globalScale) => {
        const label = node.id;
        const fontSize = 10 / globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        const textWidth = ctx.measureText(label).width;
        const bckgDimensions = [textWidth, fontSize].map(
          (n) => n + fontSize * 0.2,
        ); // some padding

        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(
          node.x - bckgDimensions[0] / 2,
          node.y - bckgDimensions[1] / 2,
          ...bckgDimensions,
        );

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = node.__indexColor;
        ctx.fillText(label, node.x, node.y);

        node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
      }}
      nodePointerAreaPaint={(node, color, ctx) => {
        ctx.fillStyle = color;
        const bckgDimensions = node.__bckgDimensions;
        bckgDimensions &&
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            ...bckgDimensions,
          );
      }}
      linkVisibility={true}
      onNodeClick={(node: GraphNode) => {
        const nodeTitle = node.id
          .split(' ')
          .filter((idSection) => !idSection.includes('§'))
          .join(' ');
        const nodeEpisodeLinkString = getFirstTitleHyphenatedLowerCaseStringFromTitleString(
          { string: nodeTitle },
        );
        window.open(`/episodes/${nodeEpisodeLinkString}`, '_self');
      }}
    />
  );
};

export default Graph;
