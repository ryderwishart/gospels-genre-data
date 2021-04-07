import React, { useState } from 'react';
import { server } from '../../../config';
import styles from '../../../styles/Home.module.css';
import Link from 'next/link'
import { Badge, Drawer, Switch, Table, Tooltip } from 'antd'
import 'antd/dist/antd.css'
import { Choice, ChoiceContainer, SystemContainer, Word } from '../../../types'
import { systemGroups } from '../../../types/systemDefinitions'
import handleHighlightExpressionsByIDs from '../../../functions'

const {
    moveSystems,
    actSystems,
    discourseSystems,
    otherSystems,
    morphologicalSystems,
} = systemGroups

interface ExpressionProps {
    word: Word;
}

const ExpressionElement: React.FC<ExpressionProps> = props => {
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
    )
}

interface System {
    key: string;
    instances: ChoiceContainer[];
}

const Stage: React.FC<any> = props => {
    const [ selectedSystems, setSelectedSystems ] = useState<string[]>([])
    const [ drawerIsVisible, setDrawerIsVisible ] = useState(null)
    console.log(props)
    const moves = props.response;

    const allSystems: System[] = moves.map(move => move.meanings.map(systemContainer => systemContainer.system)).flat()
    const allSystemLabels = allSystems && Array.from(new Set(allSystems.map((system: System) => system.key)))

    const columns = [
        {
            dataIndex: 'key',
            ellipsis: true,
        },
        {
            dataIndex: 'expressions',
            render: expressions => {
                return (
                    <div
                        style={{
                            display: 'flex',
                            flexFlow: 'row wrap',
                        }}
                    >
                        {expressions.map((wordContainer) => <ExpressionElement word={wordContainer.word} />)}
                    </div>
                )
            }
        },
        {
            dataIndex: 'meanings',
            ellipsis: true,
            render: systems => {
                return (
                    <div
                        style={{
                            display: 'flex',
                            flexFlow: 'row wrap',
                        }}
                    >
                        {systems.map((systemContainer: SystemContainer) => {
                            if (selectedSystems?.includes(systemContainer.system.key)) {
                                const systemHasInstances = systemContainer.system.instances.length > 0;
                                // console.log(systemHasInstances)
                                if (systemHasInstances) {
                                    const choices = systemContainer.system.instances.map(instance => instance.choice)
                                    return choices.map((choice: Choice) => {
                                        console.log(choice)
                                        // let currentChoiceCount = 0
                                        // currentChoiceCount += 1
                                        const realizations = choice.realization.split(`' '`)
                                        return (
                                            <div
                                                onMouseEnter={() => handleHighlightExpressionsByIDs(true, realizations)}
                                                onMouseLeave={() => handleHighlightExpressionsByIDs(false, realizations)}
                                                key={choice.realization}
                                            >
                                            <Badge count={choice.key} />
                                            </div>
                                        )
                                    })
                                }
                            }
                        }
                        )}
                    </div>
                )
            }
        },
    ]

    const onClose = () => {
        setDrawerIsVisible(false);
    };

    console.log({ selectedSystems })

    return (
        <div className={styles.container}>

            <main className={styles.main}>
                <h1>{`${props.currentText}, ${props.currentStage}`}</h1>
                <div className={styles.grid}>
                    <button
                        onClick={() => setDrawerIsVisible(true)}
                    >Filter Systems</button>
                    <Table
                        size="small"
                        dataSource={moves}
                        columns={columns}
                    />
                    <Drawer
                        title="Systems Drawer"
                        placement="right"
                        closable={false}
                        onClose={onClose}
                        visible={drawerIsVisible}
                    >
                        <h2>System Groups</h2>
                        {
                            Object.keys(systemGroups).map(group => {
                                const labels = systemGroups[ group ];
                                return (
                                    <Switch
                                        checkedChildren={group}
                                        unCheckedChildren={group}
                                        onChange={() => {
                                            const someLabelsAreSelected: boolean = labels.map(label => selectedSystems.includes(label)).includes(true)
                                            console.log(someLabelsAreSelected)
                                            if (someLabelsAreSelected) {
                                                const poppedSystemSelection = selectedSystems.filter(system => system! in labels)
                                                console.log({ poppedSystemSelection })
                                                setSelectedSystems(poppedSystemSelection)
                                            } else {
                                                setSelectedSystems([ ...selectedSystems, ...labels ])
                                            }
                                        }}
                                    />
                                )
                            })
                        }
                        <h2>Individual Systems</h2>
                        {
                            allSystemLabels.map(label => {
                                return (
                                    <Switch
                                        checkedChildren={label}
                                        unCheckedChildren={label}
                                        checked={selectedSystems.includes(label)}
                                        onChange={() => {
                                            if (selectedSystems.includes(label)) {
                                                const poppedSystemSelection = selectedSystems.filter(system => system !== label)
                                                setSelectedSystems(poppedSystemSelection)
                                            }
                                            else {
                                                setSelectedSystems([ ...selectedSystems, label ])
                                            }
                                        }}
                                    />
                                )
                            })
                        }
                    </Drawer>
                    {/* {
                    moves.map(move => {
                        return (
                                    <div className={styles.card}>
                                        <h2>{move.key}</h2>
                                        <Table 
                                            columns={[
                                                {dataIndex: 'id'}
                                            ]} 
                                            dataSource={moves}
                                        />
                                    </div>
                        )
                    })
                } */}
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
}

export default Stage;

export async function getStaticProps(context) {
    const response = await (
        await fetch(`${server}/api/johannine/${context.params.text}/${context.params.stage}`)
    ).json()

    const currentText = context.params.text; // NOTE: for future ryder, context params are the square bracket filenames in the file path, which correspond to the URL path
    const currentStage = context.params.stage; // NOTE: for future ryder, so in this case, there are two context params, because it's a nested folder with square brackets in the folder and filename

    return {
        props: {
            response,
            currentText,
            currentStage,
        }
    }
}

export const getStaticPaths = async () => {
    const response = await (
        await fetch(`${server}/api/johannine/`)
    ).json()
    const texts = response?.data.map(textContainer => {
        return textContainer.text;
    })
    const textStages = texts
        .map(text => text.content.turn.content
            .map(stageContainer => {
                return { text: text.key, stageKey: stageContainer.stage.key }
            })
        )

    const paths = [];

    textStages.map(text => {
        text.map(paramSet => {
            paths.push(({
                params: {
                    text: paramSet.text.toString(),
                    stage: paramSet.stageKey.toString(),
                }
            }))
        })
    })
    return {
        paths,
        fallback: false,
    }
}