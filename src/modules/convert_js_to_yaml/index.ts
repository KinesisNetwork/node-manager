import chalk from 'chalk'
import * as fs from 'fs'
import { Keypair } from 'js-kinesis-sdk'
import * as yaml from 'js-yaml'
import * as path from 'path'
import * as vorpal from 'vorpal'

import getDeploymentConfig from './deployment_config'

import { fetchKinesisServerDetails } from '../fetch_data'

const initialisedVorpal = vorpal()

export default async function generateYamlConfigFile(
  networkChosen: string,
  selectedNodes: any[],
  nodeNameByUser: string
): Promise<any> {
  let kinesisServerDetails: any[]
  try {
    kinesisServerDetails = await fetchKinesisServerDetails()
  } catch (error) {
    initialisedVorpal.log(chalk.red(error.message))
    return
  }

  const networkDetails = getSelectedNetworkDetails(kinesisServerDetails, networkChosen)

  const publicKeysFromSelectedNodes = extractValuesFromSelectedNodes(selectedNodes, 'publicKey')
  const endpointsFromSelectedNodes = extractValuesFromSelectedNodes(selectedNodes, 'endpoint')
  const namesFromSelectedNodes = extractValuesFromSelectedNodes(selectedNodes, 'name')

  const keypair = generateKeypair()

  const deploymentConfigInJs = getDeploymentConfig({
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

  convertJsIntoYaml(deploymentConfigInJs)
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

function convertJsIntoYaml(configInJs: any): void {
  const deploymentYaml = yaml.safeDump(configInJs)
  const deploymentFilePath = path.join(__dirname, '../../../', 'deployment_config.yml')
  fs.writeFileSync(deploymentFilePath, deploymentYaml)
}
