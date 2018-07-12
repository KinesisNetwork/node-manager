import chalk from 'chalk'
import * as vorpal from 'vorpal'

import { selectNodes } from './cli_questions_and_validations'

import { fetchNetworksAndRegions } from './fetch_data'

const initialisedVorpal = vorpal()

export async function networksAndRegionsLookup(): Promise<any> {
  let networksAndRegions: any
  try {
    networksAndRegions = await fetchNetworksAndRegions()
  } catch (error) {
    initialisedVorpal.log(chalk.red(error.message))
    return
  }

  return networksAndRegions
}

export async function getSelectedNodesWithAllData(networkChosen: any): Promise<any[]> {
  const flattenedNodes: any = flattenNodesList(networkChosen)
  const nodesSelected: any = (await selectNodes(flattenedNodes)).nodes
  return getSelectedNodeData(nodesSelected, flattenedNodes)
}

export function getSelectedNodeData(selectedNodesList: any[], allNodes: any): any[] {
  return selectedNodesList.map((node) => allNodes[node])
}

export function flattenNodesList(networkChosen: any): any {
  return Object.entries(networkChosen).reduce(addRegionToNodes, {})
}

function addRegionToNodes(nodeList: any, [region, nodes]): any {
  const regionNodeList = Object.keys(nodes).reduce((acc, node) => {
    const nodeInRegionKey = `${region}-${node}`
    const nodeLookup = { [nodeInRegionKey]: nodes[node] }
    return { ...acc, ...nodeLookup }
  }, {})

  return { ...nodeList, ...regionNodeList }
}
