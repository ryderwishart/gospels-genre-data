import { server } from '../../config';
import Link from 'next/link';
import styles from '../../styles/Home.module.css'
import { StageContainer, System, TextContainer } from '../../types';
import { allChoices } from '../../types/systemDefinitions';
import { calculateUnitVectors } from '../../functions/calculateUnitVectors';
import { generateCosineSimilarities } from '../../functions/generateCosineSimilarities';
import React, { useState } from 'react';
import { Button, Collapse, Input, message as antMessage, message, Space, Tag } from 'antd'
import getFeatureStatistics from '../../functions/getFeatureStatistics';
import { showFeedback } from '../../functions/showFeedback'
import { elementType } from 'prop-types';

interface ComponentProps {
    currentText: string;
    response: TextContainer;
}

const TextPage = (props: ComponentProps) => {
    console.log(props)
    const [separator, setSeparator] = useState(',');
    const [drawerIsVisible, setDrawerIsVisible] = useState(null);
    const [shouldUseUnitVectors, setShouldUseUnitVectors] = useState(null)

    const getCosineSimilaritiesForStageVectors = (vectorsForGeneratingCosineSimilarities: any[][]) => {
        let vectors = vectorsForGeneratingCosineSimilarities;
        if(shouldUseUnitVectors) {
            const unitVectors = calculateUnitVectors(vectorsForGeneratingCosineSimilarities);
            vectors = unitVectors;
        }
        const comparisons = generateCosineSimilarities({vectors: vectors})
        const comparisonsForCopyingString: string = comparisons.map(i => i.join(',')).join('\n');
        const comparisonsForCopyingElement = document.getElementById('analysis-text-area');
        comparisonsForCopyingElement.textContent = comparisonsForCopyingString
        showFeedback('analysis-text-area')
    }
    
    interface CopyVectorsProps {
        vectorsInput: (number | String)[][];
        useUnitVectors: boolean;
    };


    const copyFeatureVectorsToCSV = ({ vectorsInput, useUnitVectors=true }: CopyVectorsProps) => {
        const vectorsForCopying: string[] = [];
        const vectorsCSVHeaders = ['stageId', ...allChoices];
        vectorsForCopying.push(vectorsCSVHeaders.join(separator));
        if(useUnitVectors){
            const unitVectors = calculateUnitVectors(vectorsInput);
            unitVectors.forEach(unitVector => vectorsForCopying.push(unitVector.join(separator)))
        } else {
            vectorsInput.forEach((vector: number[]) => {
                vectorsForCopying.push(vector.join(separator))
            });
        };
        const vectorsForCopyingString: string = vectorsForCopying.join('\n');

        const vectorsForCopyingElement: HTMLTextAreaElement = document.createElement('textarea');
        document.body.appendChild(vectorsForCopyingElement);
        vectorsForCopyingElement.textContent = vectorsForCopyingString;
        vectorsForCopyingElement.select();
        document.execCommand('copy');
        document.body.removeChild(vectorsForCopyingElement);

        vectorsForCopying?.length > 1 
            ? antMessage.success(`Copied all stage vectors!`)
            : antMessage.error('Could not copy all stage vectors.')
    }

    const text = props.response?.text;
    if(!!text) {
        const allMoveSets = text.content.turn.content.map((stageContainer: StageContainer) => {
            const moves = stageContainer.stage.content.map(moveContainer => {
                return moveContainer.move
            })
            return { stageId: stageContainer.stage.key, moves}
        })

        const stageFeatureData = allMoveSets.map(moveSet => {
            const { stageId, moves } = moveSet
            const currentSystems: System[] = moves.map(move => move.meanings?.map(systemContainer => systemContainer.system)).flat()
            const tableRow = getFeatureStatistics({ allSystems: currentSystems, stageId })
            return tableRow;
        })

        return (
            <div className={styles.container}>
    
            <main className={styles.main}>
                <h1>{text.key}</h1>
                <div className={styles.grid}>
                    {
                        text.content.turn.content.map(stageContainer => {
                            return (
                                <Link href={`/johannine/${props.currentText}/${stageContainer.stage.key}`}>
                                    <a>
                                        <div className={styles.card}>
                                            <h2>Stage</h2>
                                            
                                                    {stageContainer.stage.key} {/* TODO: again, these stage slugs should be based on the first episode title, if multiple, and on the id only as a fallback */}
                                        </div>
                                    </a>
                                </Link>
                            )
                        })
                    }
                </div>
                    <Collapse
                        style={{ width: '100%' }}
                    >
                        <Collapse.Panel
                            key="analysis"
                            header={<h2>Analysis</h2>}
                        >
                            <div>
                                <Tag>
                                    Separator: {separator === ',' ? 'Commas' : 'Tabs'}
                                </Tag>
                                <Button
                                    onClick={() => copyFeatureVectorsToCSV({vectorsInput: stageFeatureData, useUnitVectors: shouldUseUnitVectors})}
                                >
                                    Copy Stage Data
                                </Button>
                                <Button
                                    onClick={() => separator === ',' ? setSeparator('\t') : setSeparator(',')}
                                >
                                    Use {separator === ',' ? 'TSV' : 'CSV'}
                                </Button>
                                <Button
                                    onClick={() => shouldUseUnitVectors ? setShouldUseUnitVectors(false) : setShouldUseUnitVectors(true)}
                                >
                                    {shouldUseUnitVectors ? 'Do not use ' : 'Use '} Unit Vectors
                                </Button>
                                <Button
                                    onClick={() => {

                                        getCosineSimilaritiesForStageVectors(stageFeatureData)
                                    }}
                                >
                                    Calculate Cosine Similarities for Stages
                                </Button>
                            </div>
                            <Space size={10} direction="vertical" />

                            <Input.TextArea
                                autoSize
                                id='analysis-text-area'
                                onClick={() => {
                                    const element = document.getElementById('analysis-text-area')
                                    if(element.textContent.length > 0){
                                        element.select()
                                        document.execCommand('copy')
                                        showFeedback('analysis-text-area')
                                        message.success('Copied Cosine Similarities CSV!')
                                    } else {
                                        message.warning('Nothing to copy!')
                                    }
                                }}
                            >
                            </Input.TextArea>
                        </Collapse.Panel>
                    </Collapse>
            </main>
            <footer className={styles.footer}>
                    <Link href={`/johannine`}>
                        <a className={styles.card}>
                        &larr; Back to all Johannine texts
                        </a>
                    </Link>
                    
            </footer>
            </div>
        )
    }
    return null;
}

export default TextPage;

export async function getStaticProps(context) {
    console.log('building page:', JSON.stringify(context))
    const response = await (
        await fetch(`${server}/api/johannine/${context.params.text}`)
    ).json()

    const currentText = context.params.text

    return {
        props: {
            response,
            currentText,
        }
    }
}

export const getStaticPaths = async () => {
    let response;
    try {
        response = await (
            await fetch(`${server}/api/johannine/`)
        ).json()
     } catch(error) {
        response = null;
     }
    // const response = await (
    //     await fetch(`${server}/api/johannine/`)
    // ).json()
    const textKeys = response?.data.map(textContainer => textContainer.text.key)
    const paths = textKeys?.map(textKey => ({params: { text: textKey.toString()}}))
    return {
        paths,
        fallback: false,
    }
}
