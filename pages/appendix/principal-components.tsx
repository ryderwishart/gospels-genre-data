import {
  constants,
  server,
  SignificantDimensionThresholdValue,
} from '../../config';
import { Button, Table, Tooltip } from 'antd';
import Layout from '../../components/Layout';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const PrincipalComponentsTable = (props) => {
  const [scrollToTopButtonIsVisible, setScrollToTopButtonIsVisible] = useState(
    null,
  );

  console.log({ props });
  const maxValue = 4.54;
  const minValue = -10.98;

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

  function heatMapColorforValue(value) {
    if (
      value < SignificantDimensionThresholdValue &&
      value > -SignificantDimensionThresholdValue
    ) {
      return constants.color.lightGrey;
    }
    if (value > 0) {
      const valuePercent = value / maxValue;
      const valueOn255Scale = (255 - valuePercent * 255).toFixed(0);
      return `rgb(255,${valueOn255Scale},${valueOn255Scale})`;
    } else {
      const valuePercent = (value * -1) / (minValue * -1);
      const valueOn255Scale = (255 - valuePercent * 255).toFixed(0);
      return `rgb(${valueOn255Scale},${valueOn255Scale},255)`;
    }
  }

  return (
    <Layout pageTitle="Appendix: Principal Components">
      <Table
        style={{ maxWidth: '95vw' }}
        dataSource={props.response}
        pagination={{
          pageSize: 300,
          showSizeChanger: false,
          showQuickJumper: false,
          hideOnSinglePage: true,
        }}
        scroll={{ x: 1000 }}
        columns={[
          {
            title: 'Episode',
            key: 'episodeId',
            dataIndex: 'episodeId',
            fixed: 'left',
            width: 200,
            defaultSortOrder: 'ascend',
          },
          {
            title: 'Dim. 1',
            key: 'dim_1',
            dataIndex: 'dim_1',
            width: 100,
            sorter: (a, b) => a.dim_1 - b.dim_1,
            render: (cellContent) => (
              <span
                style={{ backgroundColor: heatMapColorforValue(cellContent) }}
              >
                {cellContent}
              </span>
            ),
          },
          {
            title: 'Dim. 2',
            key: 'dim_2',
            dataIndex: 'dim_2',
            width: 100,
            sorter: (a, b) => a.dim_2 - b.dim_2,
            render: (cellContent) => (
              <span
                style={{ backgroundColor: heatMapColorforValue(cellContent) }}
              >
                {cellContent}
              </span>
            ),
          },
          {
            title: 'Dim. 3',
            key: 'dim_3',
            dataIndex: 'dim_3',
            width: 100,
            sorter: (a, b) => a.dim_3 - b.dim_3,
            render: (cellContent) => (
              <span
                style={{ backgroundColor: heatMapColorforValue(cellContent) }}
              >
                {cellContent}
              </span>
            ),
          },
          {
            title: 'Dim. 4',
            key: 'dim_4',
            dataIndex: 'dim_4',
            width: 100,
            sorter: (a, b) => a.dim_4 - b.dim_4,
            render: (cellContent) => (
              <span
                style={{ backgroundColor: heatMapColorforValue(cellContent) }}
              >
                {cellContent}
              </span>
            ),
          },
          {
            title: 'Dim. 5',
            key: 'dim_5',
            dataIndex: 'dim_5',
            width: 100,
            sorter: (a, b) => a.dim_5 - b.dim_5,
            render: (cellContent) => (
              <span
                style={{ backgroundColor: heatMapColorforValue(cellContent) }}
              >
                {cellContent}
              </span>
            ),
          },
          {
            title: 'Dim. 6',
            key: 'dim_6',
            dataIndex: 'dim_6',
            width: 100,
            sorter: (a, b) => a.dim_6 - b.dim_6,
            render: (cellContent) => (
              <span
                style={{ backgroundColor: heatMapColorforValue(cellContent) }}
              >
                {cellContent}
              </span>
            ),
          },
          {
            title: 'Dim. 7',
            key: 'dim_7',
            dataIndex: 'dim_7',
            width: 100,
            sorter: (a, b) => a.dim_7 - b.dim_7,
            render: (cellContent) => (
              <span
                style={{ backgroundColor: heatMapColorforValue(cellContent) }}
              >
                {cellContent}
              </span>
            ),
          },
          {
            title: 'Dim. 8',
            key: 'dim_8',
            dataIndex: 'dim_8',
            width: 100,
            sorter: (a, b) => a.dim_8 - b.dim_8,
            render: (cellContent) => (
              <span
                style={{ backgroundColor: heatMapColorforValue(cellContent) }}
              >
                {cellContent}
              </span>
            ),
          },
        ]}
      />
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
    </Layout>
  );
};

export default PrincipalComponentsTable;

export async function getStaticProps(context) {
  const response = await (
    await fetch(`${server}/api/data-tables/principal-components`)
  ).json();

  return {
    props: {
      response: response,
    },
  };
}
