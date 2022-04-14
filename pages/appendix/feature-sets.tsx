import { constants, server } from '../../config';
import { Badge, Button, Input, Slider, Tag, Tooltip } from 'antd';
import jsonpath from 'jsonpath';
import { useEffect, useState } from 'react';
import styles from '../../styles/Home.module.css';
import {
  allFeaturesSept2021,
  allFeaturesApril2022,
  systemLookupByFeatureApril2022,
} from '../../types/systemDefinitions';
import Layout from '../../components/Layout';
import { Table } from 'ant-table-extensions';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { example } from 'yargs';
import { ConsoleWriter } from 'istanbul-lib-report';

const FeatureSetsTable = (props) => {
  const depthDefaultValue = 1;
  const [selectedDepth, setSelectedDepth] = useState(depthDefaultValue);
  const [scrollToTopButtonIsVisible, setScrollToTopButtonIsVisible] = useState(
    null,
  );
  const allStageIds = '01-01 01-02 01-03 01-04 01-05 01-06 01-07 01-08a 01-08b 01-09 01-10 01-11 01-12 01-13 01-14 01-15 01-16 01-17 01-18 01-19 01-20 01-21 01-22 01-23 01-24 01-25 01-26 01-27 01-28 01-29 01-30 01-31 01-32 01-33 01-34 01-35 01-36a 01-36b 01-37 01-38 01-39 01-40 01-41a 01-41b 01-42a 01-42b 01-43 01-44 01-45 01-46 01-47 01-48 01-49 01-50 01-51 01-52 01-53 01-54 01-55 01-56a 01-56b 01-57 01-58 01-59 01-60 01-61 01-62 01-63 01-64 01-65 01-66 01-67 01-68 01-69 01-70 01-71 01-72 01-73 01-74 01-75 01-76 01-77 01-78 01-79 01-80 01-81 01-82 01-83 01-84 01-85 01-86a 01-86b 01-86c 01-86d 01-86e 01-87a 01-87b 01-88a 01-88b 01-89 01-90a 01-90b 01-91 01-92 01-93 01-94 01-95a 01-95b 01-96 02-01 02-02a 02-02b 02-03a 02-03b 02-04 02-05 02-06 02-07a 02-07b 02-08 02-09 02-10a 02-10b 02-11a 02-11b 02-12 02-13 02-14 02-15 02-16 02-17 02-18 02-19 02-20 02-21 02-22 02-23 02-24 02-25a 02-25b 02-26 02-27a 02-27b 02-28 02-29 02-30 02-31 02-32 02-33 02-34a 02-34b 02-35 02-36 02-37 02-38 02-39 02-40a 02-40b 02-40c 02-41 02-42 02-43a 02-43b 02-43c 02-44a 02-44b 02-45a 02-45b 02-46 02-47 02-48 02-49a 02-49b 02-50a 02-50b 02-51 02-52 02-53 03-01 03-02a 03-02b 03-03 03-04 03-05 03-06a 03-06b 03-07 03-08 03-09 03-10a 03-10b 03-11 03-12 03-13a 03-13b 03-14 03-15a 03-15b 03-16 03-17 03-18 03-19 03-20 03-21 03-22 03-23 03-24a 03-24b 03-25 03-26 03-27 03-28a 03-28b 03-29 03-30 03-31 03-32 03-33 03-34a 03-34b 03-35 03-36 03-37 03-38 03-39, 03-40 03-41 03-42 03-43 03-44 03-45 03-46a 03-46b 03-47 03-48 03-49 03-50 03-51 03-52 03-53 03-54 03-55 03-56 03-57 03-58 03-59 03-60 03-61 03-62 03-63 03-64 03-65a 03-65b 03-65c 03-66a 03-66b 03-67a 03-67b 03-68 03-69 03-70a 03-71 03-72a 03-72b 03-73a 03-73b 03-73c 03-74 03-75a 03-75b 03-76 03-77 03-78 04-01 04-02 04-03 04-04a 04-04b 04-05 04-06 04-07 04-08 04-09a 04-09b 04-10 04-11 04-12 04-13 04-14 04-15 04-16 04-17 04-18a 04-18b 04-18c 04-18d 04-19 04-20 04-21 04-22 04-23 04-24a 04-24b 04-25a 04-25b 04-25c 04-26a 04-26b 04-27 04-28 04-29 04-30 04-31 04-32 04-33 04-34 04-35 04-36 04-37 04-38 04-39 04-40 04-41 04-42 04-43 04-44a 04-44b 04-44c 04-45 04-46 04-47a 04-47b 04-47c 04-48 04-49 04-50a 04-50b 04-51 04-52'.split(
    ' ',
  );
  const [selectedStages, setSelectedStages] = useState<string[]>([]);

  const rootMoves = props.response.root.move;
  const stagesNotIncluded = [...allStageIds];

  function flatten(moveArray) {
    // console.log(moveArray.ref);
    // if (moveArray === undefined) {
    //   console.log('moveArray is undefined', moveArray);
    //   return;
    // }
    if (Array.isArray(moveArray)) {
      return moveArray.reduce((acc, move) => {
        if (move.move) {
          Array.isArray(move.move)
            ? acc.push(...flatten(move.move))
            : acc.push({ ...move.move, move: undefined });
        }
        if (move.content) {
          acc.push({ ...move, move: undefined });
        }
        return acc;
      }, []);
    } else {
      return moveArray;
    }
  }

  const moves = flatten(rootMoves);
  const movesAtSelectedDepth = moves.filter((move) =>
    move?.embeddedDepth === selectedDepth ? true : false,
  );
  // const moves = jsonpath.query(
  //   root,
  //   `$..move[?(@.embeddedDepth === ${selectedDepth})]`,
  // );

  console.log(movesAtSelectedDepth.length, '/', moves.length);
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

  const csvData = [];
  csvData.push(['stage', 'ref', ...allFeaturesApril2022].join(','));
  movesAtSelectedDepth.forEach((move, index) => {
    stagesNotIncluded.forEach((id, index) =>
      id === move.stage ? stagesNotIncluded.splice(index, 1) : null,
    );
    // console.log('Gathering features for move', index, 'of ', moves.length);

    const row = [
      move.stage,
      move.ref,
      ...allFeaturesApril2022.map((feature) => {
        const featureRegex = new RegExp(feature, 'g');
        let matchCount = 0;
        if (Array.isArray(move.content)) {
          move.content.forEach((contentSet) => {
            matchCount += contentSet.match(featureRegex)?.length;
          });
        }
        if (!Array.isArray(move.content)) {
          matchCount += move.content.match(featureRegex)?.length;
        }
        return matchCount || 0;
      }),
    ];
    csvData.push(row.join(','));
  });

  const csv = csvData.join('\n');

  function downloadCSVFile() {
    // CREDIT: https://www.geeksforgeeks.org/how-to-export-html-table-to-csv-using-javascript/
    // CREDIT: critical unicode encoding fix! https://stackoverflow.com/questions/17879198/adding-utf-8-bom-to-string-blob

    const CSVFile = new Blob(['\ufeff' + csv], {
      type: 'text/csv;charset=utf-8',
    });

    // Create to temporary link to initiate
    // download process
    const temp_link = document.createElement('a');

    // Download csv file
    temp_link.download = `feature-counts-depth-${selectedDepth}.csv`;
    const url = window.URL.createObjectURL(CSVFile);
    temp_link.href = url;

    // This link should not be displayed
    temp_link.style.display = 'none';
    document.body.appendChild(temp_link);

    // Automatically click the link to trigger download
    temp_link.click();
    document.body.removeChild(temp_link);
  }

  const StagesSelector = (): JSX.Element => {
    // Autocomplete component to select stages and display them as AntD Tag components below the stage selector
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
      setInputValue(e.target.value);
    };

    const handleStageSelect = (value: string): void => {
      if (selectedStages.includes(value)) {
        setSelectedStages(selectedStages.filter((stage) => stage !== value));
      } else {
        setSelectedStages([...selectedStages, value]);
      }
    };

    const handleStageDeselect = (value: string): void => {
      setSelectedStages(selectedStages.filter((stage) => stage !== value));
    };

    const filteredStages = movesAtSelectedDepth.filter((move) =>
      selectedStages.includes(move.stage),
    );

    // input with handleStageSelect(inputValue) on submit
    const handleInputSubmit = (): void => {
      handleStageSelect(inputValue);
      setInputValue('');
    };

    return (
      <div>
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onSubmit={handleInputSubmit}
          placeholder="Search stages"
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {filteredStages.map((move) => (
            <Tag
              key={move.stage + move.ref}
              closable
              onClose={() => handleStageDeselect(move)}
              onClick={() => handleStageSelect(move)}
              style={{ margin: '5px' }}
            >
              {move.stage}
            </Tag>
          ))}
        </div>
      </div>
    );
  };

  const movesForDisplay = movesAtSelectedDepth.filter((move) =>
    selectedStages.includes(move.stage),
  );

  return (
    <div>
      <Layout pageTitle="Features Table Appendix">
        <div style={{ maxWidth: '80vw' }}>
          <pre>
            <code>
              {/* {JSON.stringify(Array.isArray(exampleData.root.move), null, 2)} */}
            </code>
          </pre>
        </div>
        <h2>Stages with no text in selected order:</h2>
        {stagesNotIncluded.join(',')}
        <h2>Stages with text in selected order:</h2>
        {allStageIds.filter((id) => !stagesNotIncluded.includes(id)).join(',')}
        {/* <StagesSelector /> */}
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
        <br />
        <Button onClick={() => downloadCSVFile()}>
          Download Raw Feature Counts as CSV
        </Button>
        {/* <p>
          Note: Table includes first 10 moves for selected depth. Excludes lemma
          features, since they add about 1600+ columns to the table
        </p> */}
        {/* <Table // PICKING UP: recursively render tables? for directDiscourse children, or only display a given order with all relevant data, then spit this into a CSV and run PCA with R?
          dataSource={movesForDisplay}
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
            },
            {
              title: 'Reference',
              dataIndex: 'ref',
              key: 'ref',
              fixed: 'left',
              width: 100,
            },
            ...allFeaturesApril2022
              .filter((feature) => systemLookupByFeatureApril2022[feature])
              .map((feature) => {
                return {
                  title: feature,
                  dataIndex: 'content',
                  key: feature,
                  width: 120,
                  render: (featuresInMove) => {
                    // NOTE: count the number of times the feature substring occurs in any of the features in the move
                    const featureRegex = new RegExp(feature, 'g');
                    let matchCount = 0;
                    if (Array.isArray(featuresInMove)) {
                      featuresInMove.forEach((contentSet) => {
                        matchCount += contentSet.match(featureRegex)?.length;
                      });
                    }
                    if (!Array.isArray(featuresInMove)) {
                      matchCount += featuresInMove?.match(featureRegex)?.length;
                    }
                    return matchCount || 0;
                  },
                };
              }),
          ]}
          pagination={false}
          loading={props.loading}
        />
        <Tooltip title="Scroll to top" placement="top">
          <Button
            style={{
              display: scrollToTopButtonIsVisible ? 'block' : 'none',
              position: 'fixed',
              bottom: 50,
              zIndex: 100,
            }}
            icon={<VerticalAlignTopOutlined />}
            onClick={() => {
              (document && (document.body.scrollTop = 0)) ||
                (document && (document.documentElement.scrollTop = 0));
            }}
          ></Button>
        </Tooltip> */}
      </Layout>
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
