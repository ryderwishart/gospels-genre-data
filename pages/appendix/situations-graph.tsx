import { useState } from 'react';
import Layout from '../../components/Layout';
import { server, constants } from '../../config';
import { GraphEdge, GraphNode } from '../../types';
import styles from '../../styles/Home.module.css';
import Graph from '../../components/Graph';
import { Slider, Typography } from 'antd';
import clusterLabels from '../../types/clusterLabels';

interface ComponentProps {
  response: {
    nodes?: GraphNode[];
    edges?: GraphEdge[];
  };
}

const edgeStrengthDefaultValue = 88;

const SituationsGraphPage = (props: ComponentProps) => {
  const [edgeStrengthInputValue, setEdgeStrengthInputValue] = useState<number>(
    edgeStrengthDefaultValue / 100,
  );
  const { nodes, edges } = props.response;

  const filteredEdges = props.response.edges.filter((similarEdge) => {
    return similarEdge.weight >= edgeStrengthInputValue;
  });

  const graphData = {
    links: filteredEdges,
    nodes: props.response.nodes,
  };
  return (
    <Layout pageTitle="Appendix: Situations Graph">
      <p>
        Drag the slider to reduce or increase the number of links on the graph.
        A higher link threshold results in more but sparser clusters. A lower
        link threshold results in fewer but denser clusters.
      </p>
      <p>
        The default value,{' '}
        <Typography.Text type="danger">
          0.{edgeStrengthDefaultValue}
        </Typography.Text>
        , allows for connections between texts if they are{' '}
        {edgeStrengthDefaultValue}% similar or more. This value results in a
        nearly one-to-one link-to-node ratio among nodes with links, at 1.03
        links per node.
      </p>
      <div style={{ width: 500, maxWidth: '50vw' }}>
        <Slider
          marks={{
            0.7: '70%',
            0.8: '80%',
            0.88: '88%',
            0.95: '95%',
            1: '100%',
          }}
          min={0.7}
          max={1.0}
          step={0.01}
          tipFormatter={(value) => {
            if (value < 0.8) {
              return `${value * 100}% similar: ${
                graphData.links.length
              } links reveal low differentiation between clusters`;
            }
            if (value < 0.88) {
              return `${value * 100}% similar: ${
                graphData.links.length
              } links reveal medium differentiation between clusters, with a nearly one-to-one ratio between links and nodes with links`;
            }
            if (value < 0.95) {
              return `${value * 100}% similar: ${
                graphData.links.length
              } links reveal high differentiation between clusters, with few links between clusters`;
            }
            if (value < 1) {
              return `${value * 100}% similar: ${
                graphData.links.length
              } links reveal low clustering with only the most similar situations linked`;
            }
            return `100% similar: ${graphData.links.length} links reveal only links between identical situations are displayed`;
          }}
          defaultValue={edgeStrengthDefaultValue / 100}
          onChange={(value) => setEdgeStrengthInputValue(value)}
        />
      </div>
      {/* <div className={styles.largeGraph}> */}
      {typeof window !== 'undefined' && (
        <Graph
          graphData={graphData}
          // cooldown={50}
          threeDimensional
          width={window.innerWidth * 0.9}
          height={window.innerHeight * 0.7}
          nodeLabel={(node) => {
            return `TYPE: ${
              node.attributes.modularity_class !== null
                ? clusterLabels[node.attributes.modularity_class]
                : 'UNCLASSIFIED'
            }\nSITUATION: ${node.label}`;
          }}
        />
      )}
      {/* </div> */}
    </Layout>
  );
};

export default SituationsGraphPage;

export async function getStaticProps(context) {
  const response = await (await fetch(`${server}/api/graph-data`)).json();

  return {
    props: {
      response: response,
    },
  };
}
