import * as rp from 'request-promise-native'

export function getNetworksAndRegions(): Promise<any> {
  return rp({
    uri: 'https://s3-ap-southeast-2.amazonaws.com/kinesis-config/keypairs/nodes.json',
    method: 'GET',
    json: true,
  })
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
