import situationsFeatures from '../../../public/data/stages/situationsDynamicFeatures.json';
import graphData from '../../../public/data/graphData/graphData.json';
import situationsMetaData from '../../../public/data/stages/situations-ranges.xml';

const { nodes, edges } = graphData;

const handler = (req, res) => {
  const { stageID } = req.query;
  let currentSituation = null;
  let previousSituation = null;
  let nextSituation = null;
  let similarNodes = null;
  let similarEdges = null;
  let currentSituationMetaData = null;
  situationsMetaData.root?.situation?.find((situationContainer) => {
    if (situationContainer.$.section.includes(stageID)) {
      // TODO: This query could be easily adapted for any situations that include a given feature or that do NOT include a given feature
      currentSituationMetaData = situationContainer.$;
      return;
    } else {
      return null;
    }
  });

  try {
    const selectedSituation = situationsFeatures.find((situation, index) => {
      if (situation?.situation.includes(stageID)) {
        // TODO: This query could be easily adapted for any situations that include a given feature or that do NOT include a given feature
        currentSituation = situation;
        previousSituation = situationsFeatures[index - 1];
        nextSituation = situationsFeatures[index + 1];
        return situation;
      } else {
        return null;
      }
    });

    const selectedSituationIDAndTitle = `${selectedSituation?.situation} ${selectedSituation.title}`
      .split(/[,'".;’“”]+/)
      .join('');

    const edgeIDReferences = [];

    const adjacentEdges = edges
      .filter((edge) => {
        const edgeIDs = edge.id
          .split(/[,'".;’“”]+/)
          .join('');
        // const edgeIDs = edge.id.split('-').join(' ');
        if (edgeIDs.includes(selectedSituationIDAndTitle)) {
          return edge;
        }
      })
      .sort((a, b) => (a.weight > b.weight ? -1 : 1)) // NOTE: sort adjacent edges by weight descending
      .slice(0, 9) // NOTE: return only the top ten
      .map((edge) => {
        edgeIDReferences.push(edge.source);
        edgeIDReferences.push(edge.target);
        return edge;
      });
    similarNodes = nodes.filter((node) => {
      if (edgeIDReferences.includes(node.id)) {
        return node;
      }
    });

    const allNodeIDs = similarNodes.map((node) => node.id);
    const remainingEdgesForSelectedNodes = edges
      .filter((edge) => {
        if (
          allNodeIDs.includes(edge.source) &&
          allNodeIDs.includes(edge.target)
        ) {
          return edge;
        }
      })
      .sort((a, b) => (a.weight > b.weight ? -1 : 1)) // NOTE: sort remaining edges by weight descending
      .slice(0, 9); // NOTE: return only the top ten;
    similarEdges = [...adjacentEdges, ...remainingEdgesForSelectedNodes];
  } catch (error) {
    console.warn(
      'Encountered an error trying to match the URL query string with an situation title',
      req.query,
      {error}
    );
  }
  if (currentSituation !== null) {
    res.status(200).json({
      currentSituation,
      previousSituation,
      nextSituation,
      similarEdges,
      similarNodes,
      currentSituationMetaData,
    });
  } else {
    res.status(404).json({
      message: `Situation with stageID '${stageID}' not found.`,
    });
  }
};

export default handler;
