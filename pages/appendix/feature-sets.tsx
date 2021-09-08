import { server } from '../../config';
import { Table } from 'antd';
import { useState } from 'react';

const MoveTable = ({ moves, stage }) => {
  return (
    <Table
      dataSource={moves}
      pagination={false}
      columns={[
        {
          title: 'Moves',
          dataIndex: 'chStart',
          key: 'chStart',
          render: (text, record) =>
            `${text}:${record.vStart}-${record.chEnd}:${record.vEnd}`,
        },
        {
          title: 'Unit Type',
          dataIndex: ['featureSet', 'unitType'],
          key: 'unitType',
        },
        {
          title: 'Feature Set',
          dataIndex: ['featureSet', 'content'],
          key: 'featureSet',
          render: (featuresString, move) => {
            const featureSet = featuresString?.split(' ').sort();
            const featureSpans = featureSet?.map((feature, index) => (
              <span
                key={Math.random()}
                style={{
                  margin: '0px 3px',
                }}
              >
                {feature}{' '}
                {featuresString.split(' ').length - 1 === index ? '' : '\t'}
              </span>
            ));
            return featureSpans;
          },
        },
      ]}
    />
  );
};

const FeatureSetsTable = (props) => {
  const [useBinaryFeatureValues, setUseBinaryFeatureValues] = useState(true);
  console.log({ props });

  const stages = props.response[0];

  const flattenedFeaturesWithStageAndUnitType = stages.map((unitsWithStage) => {
    const movesIsArray = Array.isArray(unitsWithStage.move);
    if (movesIsArray) {
      const moves = unitsWithStage.move.map((moveWithFeatureSet) => {
        const moveRef = `${moveWithFeatureSet.chStart}:${moveWithFeatureSet.vStart}-${moveWithFeatureSet.chEnd}:${moveWithFeatureSet.vEnd}`;
        const { featureSet } = moveWithFeatureSet;
        if (Array.isArray(featureSet)) {
          const featureSetWithUnitType = featureSet.map((featureSet) => {
            const { unitType } = featureSet;
            return {
              ...featureSet,
              unitType,
              moveRef,
            };
          });
          return featureSetWithUnitType;
        } else {
          const unitType = featureSet?.unitType;
          const content = featureSet?.content;
          return {
            stageID: unitsWithStage.key,
            title: unitsWithStage.title,
            moveRef,
            unitType,
            content,
          };
        }
      });
      return moves;
    } else {
      const moves = unitsWithStage.move;
      const moveRef = `${moves.chStart}:${moves.vStart}-${moves.chEnd}:${moves.vEnd}`;
      const { featureSet } = moves;
      const unitType = featureSet?.unitType;
      const content = featureSet?.content;
      return {
        stageID: unitsWithStage.key,
        moveRef,
        unitType,
        content,
      };
    }
  });

  const flattenedData = flattenedFeaturesWithStageAndUnitType.flat(4);

  const allFeatureSets = [];
  flattenedData.forEach((move) => {
    move.content?.split(' ').forEach((feature) => allFeatureSets.push(feature));
  });

  const uniqueFeatures = new Set(allFeatureSets);
  const uniqueFeaturesArray = [...uniqueFeatures];

  const flattenedDataWithItemizedFeatureSets = flattenedData.map((row) => {
    const features = row.content?.split(' ');
    const uniqueFeatureCells = uniqueFeaturesArray.map((feature) => {
      const rowHasFeatureForCell = features?.includes(feature);
      return {
        feature: rowHasFeatureForCell ? 1 : 0,
      };
    });
    return {
      ...row,
      ...uniqueFeatureCells,
    };
  });

  if (!useBinaryFeatureValues) {
    return (
      <Table
        columns={[
          {
            title: 'Stage',
            dataIndex: 'key',
            key: 'stage',
            width: 80,
            fixed: 'left',
          },
          {
            title: null,
            dataIndex: 'move',
            key: 'move',
            render: (move, stage) => <MoveTable moves={move} stage={stage} />,
          },
        ]}
        dataSource={stages}
      />
    );
  } else {
    return (
      <>
        {JSON.stringify(flattenedData[0])}
        <Table
          columns={[
            {
              title: 'Stage',
              dataIndex: 'stageID',
              key: 'stage',
              width: 80,
              fixed: 'left',
            },
            {
              title: 'Title',
              dataIndex: 'title',
              key: 'title',
              fixed: 'left',
            },
            {
              title: 'Move',
              dataIndex: 'moveRef',
              key: 'move',
            },
            {
              title: 'Unit Type',
              dataIndex: 'unitType',
              key: 'unitType',
              width: 80,
            },
            ...uniqueFeaturesArray.map((feature) => ({
              title: feature,
              dataIndex: 'feature',
              key: feature,
            })),
          ]}
          dataSource={flattenedDataWithItemizedFeatureSets}
          pagination={false}
        />
      </>
    );
  }
};

export default FeatureSetsTable;

export async function getStaticProps(context) {
  const response = await (await fetch(`${server}/api/features`)).json();

  return {
    props: {
      response: response,
    },
  };
}
