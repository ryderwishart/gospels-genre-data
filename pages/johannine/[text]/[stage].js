import { server } from '../../../config';
import styles from '../../../styles/Home.module.css';
import Link from 'next/link';

const Stage = props => {
    console.log(props)
    const moves = props.response;
    return (
            <div className={styles.container}>

        <main className={styles.main}>
            <h1>{props.currentText, props.currentStage}</h1>
            <div className={styles.grid}>
                {
                    moves.map(move => {
                        return (
                                    <div className={styles.card}>
                                        <h2>{move.key}</h2>
                                        {
                                            move.expressions.map(expression => expression.word.string + ' ')
                                        }
                                    </div>
                        )
                    })
                }
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
                return {text: text.key, stageKey: stageContainer.stage.key}
            })
        )

    console.log('BOOM', textStages)
    

    const paths = [];
    
    textStages.map(text => {
        text.map(paramSet => {
            paths.push( ({
                params: { 
                    text: paramSet.text.toString(),
                    stage: paramSet.stageKey.toString(),
                }
            }) )
        })
    })
    console.log('BOOUBOUBOUBOU', paths)
    return {
        paths,
        fallback: false,
    }
}