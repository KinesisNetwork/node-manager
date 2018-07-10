import chalk from 'chalk'
import * as vorpal from 'vorpal'

import {
  chooseNetwork,
  flattenNodesList,
  getNetworksAndRegions,
  getSelectedNodeData,
  selectNodes
} from './node_manager_logic'

const initialisedVorpal = vorpal()

export default async function startNodeManager(): Promise<void> {
  try {
    const networksAndRegions: any = await getNetworksAndRegions()
    const networkChosen: string = (await chooseNetwork(Object.keys(networksAndRegions))).network

    const flattenedNodes: any = flattenNodesList(networksAndRegions[networkChosen])
    const nodesSelected = (await selectNodes(flattenedNodes)).nodes

    const nodesSelectedWithAllData = getSelectedNodeData(nodesSelected, flattenedNodes)

    // TODO: replace logs with action and remove them
    initialisedVorpal.log(chalk.blue(JSON.stringify(networkChosen, null, 2)))
    initialisedVorpal.log(chalk.yellow(JSON.stringify(nodesSelectedWithAllData, null, 2)))
  } catch (error) {
    initialisedVorpal.log(chalk.red(error.message))
  }
}
