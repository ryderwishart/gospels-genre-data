import React from 'react';
import { ChoiceContainer, System } from '../types'
import { allChoices } from '../types/systemDefinitions'

interface ComponentProps {
    stageId: String;
    allSystems: System[];
    showChoices?: Boolean;
    asTable?: Boolean;
}

const getFeatureStatistics = (props: ComponentProps) => {
    const allInstances = allChoices.map((choice: String) => {
        let count = 0;
        props.allSystems?.forEach((system: System) => {
            const instances = system.instances.forEach((instance: ChoiceContainer) => {
                if(instance.choice.key === choice){
                    count += 1
                }
            });
        });
        return {choice, count};
    })
    const row = [props.stageId, ...allInstances.map(instance => instance.count)]
    return row;
    // let row;
    // if(props.asTable){
    //     row = (
    //         <tr>
    //             <td>{props.stageId}</td>
    //             {allInstances.map(instance => {
    //                 return <td>{instance.count},</td>
    //             })}
    //         </tr>
    //     )
    //     if(props.showChoices){
    //         const table = (
    //             <table>
    //                 <tr>
    //                     <th>Stage</th>
    //                     {allChoices.map(choice => <th>{choice}</th>)}
    //                 </tr>
    //                 {row}
    //             </table>
    //         )
    //         return table
    //     } else {
    //         return row
    //     }
    // }
    // const separator = ',' /* '\t' */
    // return (
    //     <>
    //         {props.stageId}{props.showChoices
    //             ? separator + 'count'
    //             : null}
    //         {
    //             allInstances.map(instance => {
    //                 return (
    //                     <div>{`${props.showChoices
    //                         ? instance.choice + separator
    //                         : ''}${instance.count}`}</div>
    //                 )
    //             } )
    //         }
    //     </>
    // )
} // TODO: picking up: need to format this as csv for copying, and then work on getting data for only ostentatious spans
// TODO: this component logic could also be modified to process each stage in a text in the API (for a features api route or something)

export default getFeatureStatistics;