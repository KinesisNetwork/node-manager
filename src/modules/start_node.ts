import chalk from 'chalk'
import * as vorpal from 'vorpal'

import {
  flattenNodesList,
  getNetworksAndRegions,
  getSelectedNodeData
} from './manage_fetched_data'

import {
  chooseNetwork,
  giveNameToUserNode,
  selectNodes
} from './cli_questions'

import convertJsToYaml from './convert_js_to_yaml'

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

  const nodeName = (await giveNameToUserNode()).nodeName
    .replace(/\s/g, '')
    .replace(/[`~!@#\$%\^&\*\(\)-_=\+\{\}\[\]\|;:'",\.<>\?\/\\]/g, '')
    .toUpperCase()

  const yaml = await convertJsToYaml(networkChosen, nodesSelectedWithAllData, nodeName)

  // TODO: replace logs with action and remove them
  initialisedVorpal.log(chalk.magenta(JSON.stringify(yaml, null, 2)))
  // initialisedVorpal.log(chalk.blue(JSON.stringify(nodesSelectedWithAllData, null, 2)))
  // initialisedVorpal.log(chalk.yellow(JSON.stringify(networkChosen, null, 2)))
}
