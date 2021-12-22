import { constants, server } from '../../config';
import { Badge, Button, Slider, Tooltip } from 'antd';
import jsonpath from 'jsonpath';
import { useEffect, useState } from 'react';
import styles from '../../styles/Home.module.css';
import {
  allFeaturesSept2021,
  systemLookupByFeatureSept2021,
} from '../../types/systemDefinitions';
import Layout from '../Layout';
import { Table } from 'ant-table-extensions';
import { VerticalAlignTopOutlined } from '@ant-design/icons';

const FeatureSetsTable = (props) => {
  const depthDefaultValue = 3;
  const [selectedDepth, setSelectedDepth] = useState(depthDefaultValue);
  const [scrollToTopButtonIsVisible, setScrollToTopButtonIsVisible] = useState(
    null,
  );

  const root = props.response.root;

  const moves = jsonpath.query(
    root,
    `$..move[?(@.embeddedDepth === ${selectedDepth})]`,
  );

  // SCROLL TO TOP BUTTON
  const handleScroll = (): void => {
    if (window.scrollY > 100) {
      setScrollToTopButtonIsVisible(true);
    } else {
      setScrollToTopButtonIsVisible(false);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  return (
    <div style={{ marginTop: 100 }}>
      <Layout pageTitle="Features Table Appendix">
        <Slider
          marks={{
            0: 'First Order',
            1: 'Second Order',
            2: 'Third Order',
            3: 'Fourth Order',
          }}
          style={{ width: 300 }}
          min={0}
          max={3}
          defaultValue={depthDefaultValue}
          tipFormatter={(value) => {
            if (value === 1) {
              return 'Display grammatical tallies for second-order (one-depth) moves';
            } else if (value === 2) {
              return 'Display grammatical tallies for third-order (two-depth) moves';
            } else if (value === 3) {
              return 'Display grammatical tallies for fourth-order (three-depth) moves';
            }
            return 'Display grammatical tallies for first-order (zero-depth) moves';
          }}
          onChange={(value) => setSelectedDepth(value)}
        />
        <Table // PICKING UP: recursively render tables? for directDiscourse children, or only display a given order with all relevant data, then spit this into a CSV and run PCA with R?
          dataSource={moves}
          style={{ maxWidth: '95vw', marginRight: '1em' }}
          // scroll={{ x: 1000 }}
          exportable
          columns={[
            {
              title: 'Stage',
              dataIndex: 'stage',
              key: 'stage',
              fixed: 'left',
              width: 100,
              ellipsis: true,
              render: (text, record) => {
                return <Tooltip title={text}>{text}</Tooltip>;
              },
            },
            {
              title: 'Reference',
              dataIndex: 'ref',
              key: 'ref',
              fixed: 'left',
              width: 100,
            },
            ...allFeaturesSept2021.map((feature) => {
              return {
                title: feature,
                dataIndex: 'features',
                key: feature,
                width: 120,
                render: (featuresInMove) => {
                  // NOTE: count the number of times the feature substring occurs in any of the features in the move
                  const featureRegex = new RegExp(feature, 'g');
                  const count = featuresInMove?.reduce((acc, featureSet) => {
                    const matches = featureSet.match(featureRegex);
                    if (matches) {
                      return acc + matches.length;
                    } else {
                      return acc;
                    }
                  }, 0);
                  return count;
                },
              };
            }),
            // {
            //   title: '',
            //   fixed: 'right',
            //   dataIndex: null,
            //   key: 'depth',
            //   width: 40,
            //   render: () => (
            //     <Tooltip title="Depth: the order of text for this row's move">
            //       <Badge
            //         count={selectedDepth}
            //         style={{ backgroundColor: constants.color.blue }}
            //       />
            //     </Tooltip>
            //   ),
            // },
          ]}
          pagination={false}
          loading={props.loading}
        />
      </Layout>
      <Tooltip title="Scroll to top" placement="top">
        <Button
          style={{
            display: scrollToTopButtonIsVisible ? 'block' : 'none',
            position: 'fixed',
            bottom: 50,
            zIndex: 100,
            // width: 'max-content',
          }}
          icon={<VerticalAlignTopOutlined />}
          onClick={() => {
            (document && (document.body.scrollTop = 0)) ||
              (document && (document.documentElement.scrollTop = 0));
          }}
        ></Button>
      </Tooltip>
    </div>
  );
};

export default FeatureSetsTable;

export async function getStaticProps(context) {
  try {
    const response = await (
      await fetch(`${server}/api/features/ordered-features`)
    ).json();
    return {
      props: {
        response,
      },
    };
  } catch (err) {
    console.error(err);
  }
}
