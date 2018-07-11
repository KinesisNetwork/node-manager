import chalk from 'chalk'
import { Keypair } from 'js-kinesis-sdk'
import * as rp from 'request-promise-native'
import * as vorpal from 'vorpal'

import getDeploymentConfig from './deployment_config'

const initialisedVorpal = vorpal()

export default async function convertJsToYaml(
  networkChosen: string,
  selectedNodes: any[],
  nodeNameByUser: string
): Promise<any> {
  let kinesisServerDetails: any[]
  try {
    kinesisServerDetails = await getKinesisServerDetails()
  } catch (error) {
    initialisedVorpal.log(chalk.red(error.message))
    return
  }

  const networkDetails = getSelectedNetworkDetails(kinesisServerDetails, networkChosen)

  const publicKeysFromSelectedNodes = extractValuesFromSelectedNodes(selectedNodes, 'publicKey')
  const endpointsFromSelectedNodes = extractValuesFromSelectedNodes(selectedNodes, 'endpoint')
  const namesFromSelectedNodes = extractValuesFromSelectedNodes(selectedNodes, 'name')

  const keypair = generateKeypair()

  const deploymentConfig = getDeploymentConfig({
    nodeNameByUser,
    userKeys: keypair,
    selectedNodesConfigs: {
      publicKeys: publicKeysFromSelectedNodes,
      endpoints: endpointsFromSelectedNodes,
      names: namesFromSelectedNodes
    },
    networkPassphrase: networkDetails.networkPassphrase,
    selectedNetwork: networkChosen
  })

  return deploymentConfig
}

function getKinesisServerDetails(): Promise<any> {
  return rp({
    uri: 'https://s3-ap-southeast-2.amazonaws.com/kinesis-config/kinesis-server-details.json',
    method: 'GET',
    json: true,
  })
}

export function getSelectedNetworkDetails(serverDetails: any[], networkChosen: string): any {
  const [networkDetails] = serverDetails.filter(({ horizonURL }) => horizonURL.includes(networkChosen))
  return networkDetails
}

export function extractValuesFromSelectedNodes(selectedNodes: any[], nodeProperty: string): string[] {
  return selectedNodes.map((node) => node[nodeProperty])
}

function generateKeypair(): any {
  const keypair = Keypair.random()
  return {
    publicKey: keypair.publicKey(),
    privateKey: keypair.secret()
  }
}
