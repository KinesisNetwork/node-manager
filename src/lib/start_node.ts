import chalk from 'chalk'
import * as flatten from 'flat'
import * as vorpal from 'vorpal'

import { chooseNetwork, getNetworksAndRegions, getSelectedNodeData, selectNodes } from './node_manager_logic'

const initialisedVorpal = vorpal()

export default async function startNodeManager() {
  try {
    const networksAndRegions: any = await getNetworksAndRegions()
    const networkChosen: string = (await chooseNetwork(Object.keys(networksAndRegions))).network

    const flattenedNodes: any = flatten(
      networksAndRegions[networkChosen],
      {
        delimiter: '-',
        maxDepth: 2
      }
    )

    const nodesSelected = (await selectNodes(flattenedNodes)).nodes
    const nodesSelectedWithAllData = getSelectedNodeData(nodesSelected, flattenedNodes)

    // TODO: replace comments with action and remove them
    initialisedVorpal.log(chalk.blue(JSON.stringify(nodesSelected, null, 2)))
    initialisedVorpal.log(chalk.yellow(JSON.stringify(nodesSelectedWithAllData, null, 2)))
  } catch (error) {
    initialisedVorpal.log(chalk.red('Unable to fetch data from the server.'))
  }
}
