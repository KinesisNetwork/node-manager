import * as inquirer from 'inquirer'
import * as rp from 'request-promise-native'

export function getNetworksAndRegions(): Promise<any> {
  return rp({
    uri: 'https://s3-ap-southeast-2.amazonaws.com/kinesis-config/keypairs/nodes.json',
    method: 'GET',
    json: true,
  })
}

export function chooseNetwork(keys: string[]): Promise<any> {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'network',
        message: 'Which network do you choose?',
        choices: keys,
      },
    ])
}

export function selectNodes(nodesList: any): Promise<any> {
  return inquirer
    .prompt([
      {
        type: 'checkbox',
        message: 'Select nodes',
        name: 'nodes',
        choices: Object.keys(nodesList),
        validate(answer) {
          return hasAtLeastSixNodesSelected(answer)
        },
      }
    ])
}

export function getSelectedNodeData(selectedNodesList: any[], allNodes: any): any[] {
  return selectedNodesList.map((node) => allNodes[node])
}

export function flattenNodesList(networkChosen: any): any {
  return Object.entries(networkChosen).reduce(addRegionToNodes, {})
}

function hasAtLeastSixNodesSelected(selectedNodes: string[]): any {
  if (selectedNodes.length < 6) {
    return 'You must select at least six nodes.'
  }
  return true
}

function addRegionToNodes(nodeList: any, [region, nodes]): any {
  const regionNodeList = Object.keys(nodes).reduce((acc, node) => {
    const nodeInRegionKey = `${region}-${node}`
    const nodeLookup = {[nodeInRegionKey]: nodes[node]}
    return {...acc, ...nodeLookup}
  }, {})

  return {...nodeList, ...regionNodeList}
}
