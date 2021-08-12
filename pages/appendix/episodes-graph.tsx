import { useState } from 'react';
import Layout from '../../components/Layout';
import { server, constants } from '../../config';
import { GraphEdge, GraphNode } from '../../types';
import styles from '../../styles/Home.module.css';
import Graph from '../../components/Graph';
import { Slider, Typography } from 'antd';

interface ComponentProps {
  response: {
    nodes?: GraphNode[];
    edges?: GraphEdge[];
  };
}

const edgeStrengthDefaultValue = 83;

const EpisodesGraphPage = (props: ComponentProps) => {
  const [edgeStrengthInputValue, setEdgeStrengthInputValue] = useState<number>(
    edgeStrengthDefaultValue / 100,
  );
  const { nodes, edges } = props.response;

  const filteredEdges = props.response.edges.filter((similarEdge) => {
    return similarEdge.weight >= edgeStrengthInputValue;
  });

  //   const filteredNodes = props.response.nodes;

  const graphData = {
    links: filteredEdges,
    nodes: props.response.nodes,
  };
  return (
    <Layout pageTitle="Appendix: Episodes Graph">
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
        nearly one-to-one link-to-node ratio, at 0.89 links per node.
      </p>
      <div style={{ width: 500, maxWidth: '50vw' }}>
        <Slider
          min={0.8}
          max={1.0}
          step={0.01}
          defaultValue={0.83}
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
        />
      )}
      {/* </div> */}
    </Layout>
  );
};

export default EpisodesGraphPage;

export async function getStaticProps(context) {
  const response = await (await fetch(`${server}/api/graph-data`)).json();

  return {
    props: {
      response: response,
    },
  };
}
