import chalk from 'chalk'
import * as vorpal from 'vorpal'

import {
  chooseNetwork,
  flattenNodesList,
  getNetworksAndRegions,
  getSelectedNodeData,
  selectNodes
} from './manage_fetched_data'

const initialisedVorpal = vorpal()

export default async function startNodeManager(): Promise<void> {
  let networksAndRegions: any
  try {
    networksAndRegions = await getNetworksAndRegions()
  } catch (error) {
    initialisedVorpal.log(chalk.red(error.message))
    return
  }

  const networkChosen: string = (await chooseNetwork(Object.keys(networksAndRegions))).network

  const flattenedNodes: any = flattenNodesList(networksAndRegions[networkChosen])
  const nodesSelected = (await selectNodes(flattenedNodes)).nodes

  const nodesSelectedWithAllData = getSelectedNodeData(nodesSelected, flattenedNodes)

  // TODO: replace logs with action and remove them
  initialisedVorpal.log(chalk.blue(JSON.stringify(networkChosen, null, 2)))
  initialisedVorpal.log(chalk.yellow(JSON.stringify(nodesSelectedWithAllData, null, 2)))
}
