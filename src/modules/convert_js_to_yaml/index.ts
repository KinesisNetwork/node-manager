import * as fs from 'fs'
import { Keypair } from 'js-kinesis-sdk'
import * as yaml from 'js-yaml'
import * as path from 'path'

import getDeploymentConfig from './deployment_config'

import { fetchKinesisServerDetails } from '../fetch_data'
import {
  checkFoldersInBucket,
  checkIfBucketExists
} from './create_folders'

export default async function generateYamlConfigFile(yamlConfigInput: YamlConfigInput): Promise<any> {
  const kinesisServerDetails = await fetchKinesisServerDetails()
  if (!kinesisServerDetails.length) {
    return Promise.reject(CustomError.serverError)
  }

  const networkDetails = getSelectedNetworkDetails(kinesisServerDetails, yamlConfigInput.networkChosen)

  const publicKeysFromSelectedNodes = extractValuesFromSelectedNodes(yamlConfigInput.nodesData, 'publicKey')
  const endpointsFromSelectedNodes = extractValuesFromSelectedNodes(yamlConfigInput.nodesData, 'endpoint')
  const namesFromSelectedNodes = extractValuesFromSelectedNodes(yamlConfigInput.nodesData, 'name')

  const keypair = generateKeypair()

  checkIfBucketExists()
  checkFoldersInBucket(yamlConfigInput.nodeName)

  const deploymentConfigInJs = getDeploymentConfig({
    nodeNameByUser: yamlConfigInput.nodeName,
    userKeys: keypair,
    selectedNodesConfigs: {
      publicKeys: publicKeysFromSelectedNodes,
      endpoints: endpointsFromSelectedNodes,
      names: namesFromSelectedNodes
    },
    networkPassphrase: networkDetails.networkPassphrase,
    selectedNetwork: yamlConfigInput.networkChosen,
    port: yamlConfigInput.port
  })

  convertJsIntoYaml(deploymentConfigInJs)
}

export function getSelectedNetworkDetails(networks: any[], networkChosen: string): any {
  const [networkDetails] = networks.filter(({ horizonURL }) => horizonURL && horizonURL.includes(networkChosen))

  if (!networkDetails) {
    throw new Error(CustomError.dataError)
  }
  return networkDetails
}

export function extractValuesFromSelectedNodes(selectedNodes: any[], nodeProperty: string): string[] {
  return selectedNodes.map((node) => node[nodeProperty])
}

export function generateKeypair(): any {
  const keypair = Keypair.random()
  return {
    publicKey: keypair.publicKey(),
    seed: keypair.secret()
  }
}

function convertJsIntoYaml(configInJs: any): void {
  const deploymentYaml = yaml.safeDump(configInJs)
  const deploymentFilePath = path.join(__dirname, '../../../', 'deployment_config.yml')
  fs.writeFileSync(deploymentFilePath, deploymentYaml)
}
