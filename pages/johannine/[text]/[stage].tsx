import React, { useState } from 'react';
import { server } from '../../../config';
import styles from '../../../styles/Home.module.css';
import Link from 'next/link';
import { Badge, Drawer, Switch, Table, Tooltip } from 'antd';
import {
  Choice,
  ChoiceContainer,
  Move,
  StageContainer,
  SystemContainer,
  TextContainer,
  Word,
  WordContainer,
} from '../../../types';
import { systemGroups } from '../../../types/systemDefinitions';
import handleHighlightExpressionsByIDs from '../../../functions';
import { ColumnsType } from 'antd/lib/table';

interface ExpressionProps {
  word: Word;
}

const ExpressionElement: React.FC<ExpressionProps> = (props) => {
  return (
    <span
      style={{
        margin: '0.2em',
        backgroundColor: 'transparent',
      }}
      id={props.word.key}
    >
      {props.word.string}
    </span>
  );
};

interface FeatureProps {
  choice: Choice;
}

const Feature: React.FC<FeatureProps> = (props) => {
  const realizations = props.choice?.realization?.split(`' '`);
  return (
    <div
      onMouseEnter={() => handleHighlightExpressionsByIDs(true, realizations)}
      onMouseLeave={() => handleHighlightExpressionsByIDs(false, realizations)}
      key={props.choice?.realization}
    >
      <Badge count={props.choice?.key} />

      {/* <Badge color={isMarkedFeature ? 'blue' : 'green'} count={props.choice?.key} /> */}
    </div>
  );
};

interface System {
  key: string;
  instances: ChoiceContainer[];
}

const Stage: React.FC<any> = (props) => {
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [drawerIsVisible, setDrawerIsVisible] = useState<boolean | null>(null);
  // console.log(props)
  const moves = props.response;

  const allSystems: System[] = moves
    .map((move: Move) =>
      move.meanings?.map(
        (systemContainer: SystemContainer) => systemContainer.system,
      ),
    )
    .flat();
  const allSystemLabels =
    allSystems &&
    Array.from(new Set(allSystems.map((system: System) => system.key)));

  const columns: ColumnsType<Move> = [
    {
      dataIndex: 'key',
      fixed: 'left',
      ellipsis: true,
      width: 50,
      render: (key) => key.split('.')[3],
    },
    {
      dataIndex: 'expressions',
      fixed: 'left',
      width: selectedSystems.length < 1 ? 600 : 300,
      render: (expressions) => {
        return (
          <div
            style={{
              display: 'flex',
              flexFlow: 'row wrap',
            }}
          >
            {expressions.map(
              (
                wordContainer: WordContainer,
                index: React.Key | null | undefined,
              ) => (
                <ExpressionElement key={index} word={wordContainer.word} />
              ),
            )}
          </div>
        );
      },
    },
    {
      dataIndex: 'meanings',
      ellipsis: true,
      render: (systems) => {
        return (
          <div
            style={{
              display: 'flex',
              flexFlow: 'row wrap',
            }}
          >
            {systems.map((systemContainer: SystemContainer) => {
              if (selectedSystems?.includes(systemContainer.system.key)) {
                const systemHasInstances =
                  systemContainer.system.instances.length > 0;
                if (systemHasInstances) {
                  const choices = systemContainer.system.instances.map(
                    (instance) => instance.choice,
                  );
                  return choices.map((choice: Choice) => {
                    return <Feature key={choice.key} choice={choice} />;
                  });
                }
              }
            })}
          </div>
        );
      },
      children: selectedSystems.map((system) => {
        console.log(system);
        return {
          title: system,
          dataIndex: '',
          ellipsis: true,
          width: 100,
          render: (move: Move) => {
            console.log(move);
            const systemContainer:
              | SystemContainer
              | undefined = move.meanings.find(
              (systemContainer: SystemContainer) =>
                systemContainer.system.key === system,
            );
            console.log(systemContainer);
            const instances =
              systemContainer && systemContainer.system.instances;
            console.log(instances);
            if (instances) {
              return (
                <div
                  style={{
                    display: 'flex',
                    flexFlow: 'row wrap',
                  }}
                >
                  {instances.map((instance) => {
                    const realizations = instance.choice.realization.split(
                      `' '`,
                    );
                    return (
                      <Tooltip
                        key={instance.choice.key}
                        title={instance.choice.key}
                      >
                        <div
                          onMouseEnter={() =>
                            handleHighlightExpressionsByIDs(true, realizations)
                          }
                          onMouseLeave={() =>
                            handleHighlightExpressionsByIDs(false, realizations)
                          }
                        >
                          <Badge color={'geekblue'} />
                        </div>
                      </Tooltip>
                    );
                  })}
                </div>
              );
            }
            return null;
          },
        };
      }),
    },
  ];

  const onClose = () => {
    setDrawerIsVisible(false);
  };

  console.log({ selectedSystems });

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>{`${props.currentText}, ${props.currentStage}`}</h1>
        <div className={styles.grid}>
          <button onClick={() => setDrawerIsVisible(true)}>
            Filter Systems
          </button>
          <Table
            size="small"
            dataSource={moves}
            columns={columns}
            sticky
            scroll={{ x: selectedSystems.length * 100 }}
          />
          <Drawer
            title="Systems Drawer"
            placement="right"
            closable={false}
            onClose={onClose}
            visible={drawerIsVisible || undefined}
          >
            <h2>System Groups</h2>
            <p>
              Note: combining system groups is buggy and negates any existing
              selection each time. For best results use individual toggles below
            </p>
            {Object.keys(systemGroups).map((group: string) => {
              const labels: string[] = systemGroups[group];
              return (
                <Switch
                  key={systemGroups[group]}
                  checkedChildren={group}
                  unCheckedChildren={group}
                  onChange={() => {
                    const someLabelsAreSelected: boolean = labels
                      .map((label) => selectedSystems.includes(label))
                      .includes(true);
                    console.log(someLabelsAreSelected);
                    if (someLabelsAreSelected) {
                      const poppedSystemSelection = selectedSystems.filter(
                        (system) => system! in labels,
                      );
                      console.log({ poppedSystemSelection });
                      setSelectedSystems(poppedSystemSelection);
                    } else {
                      setSelectedSystems([...selectedSystems, ...labels]);
                    }
                  }}
                />
              );
            })}
            <h2>Individual Systems</h2>
            {allSystemLabels.map((label: string) => {
              return (
                <Switch
                  key={label}
                  checkedChildren={label}
                  unCheckedChildren={label}
                  checked={selectedSystems.includes(label)}
                  onChange={() => {
                    if (selectedSystems.includes(label)) {
                      const poppedSystemSelection = selectedSystems.filter(
                        (system) => system !== label,
                      );
                      setSelectedSystems(poppedSystemSelection);
                    } else {
                      setSelectedSystems([...selectedSystems, label]);
                    }
                  }}
                />
              );
            })}
          </Drawer>
        </div>
      </main>
      <footer className={styles.footer}>
        <Link href={`/johannine/${props.currentText}`}>
          <a className={styles.card}>
            &larr; Back to all {props.currentText} stages
          </a>
        </Link>
      </footer>
    </div>
  );
};

export default Stage;

export async function getStaticProps(context: {
  params: { text: any; stage: any };
}): Promise<{
  props: { response: any; currentText: string; currentStage: string };
}> {
  console.log('building page:', JSON.stringify(context));
  const response = await (
    await fetch(
      `${server}/api/johannine/${context.params.text}/${context.params.stage}`,
    )
  ).json();

  const currentText = context.params.text; // NOTE: for future ryder, context params are the square bracket filenames in the file path, which correspond to the URL path
  const currentStage = context.params.stage; // NOTE: for future ryder, so in this case, there are two context params, because it's a nested folder with square brackets in the folder and filename

  return {
    props: {
      response,
      currentText,
      currentStage,
    },
  };
}

export const getStaticPaths = async () => {
  const response = await (await fetch(`${server}/api/johannine/`)).json();
  const texts = response?.data.map((textContainer: TextContainer) => {
    return textContainer.text;
  });
  const textStages = texts.map(
    (text: { content: { turn: { content: StageContainer[] } }; key: any }) =>
      text.content.turn.content.map((stageContainer: StageContainer) => {
        return { text: text.key, stageKey: stageContainer.stage.key };
      }),
  );

  const paths: { params: { text: string; stage: string } }[] = [];

  textStages.map((text: any[]) => {
    text.map((paramSet: { text: string; stageKey: string }) => {
      paths.push({
        params: {
          text: paramSet.text.toString(),
          stage: paramSet.stageKey.toString(),
        },
      });
    });
  });
  return {
    paths,
    fallback: false,
  };
};
