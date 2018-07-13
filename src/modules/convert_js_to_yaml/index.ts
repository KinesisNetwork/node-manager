import chalk from 'chalk'
import * as fs from 'fs'
import { Keypair } from 'js-kinesis-sdk'
import * as yaml from 'js-yaml'
import * as path from 'path'
import * as vorpal from 'vorpal'

import getDeploymentConfig from './deployment_config'

import { fetchKinesisServerDetails } from '../fetch_data'

const initialisedVorpal = vorpal()

export default async function generateYamlConfigFile(yamlConfigInput: YamlConfigInput): Promise<any> {
  let kinesisServerDetails: any[]
  try {
    kinesisServerDetails = await fetchKinesisServerDetails()
  } catch (error) {
    initialisedVorpal.log(chalk.red(error.message))
    return
  }

  const networkDetails = getSelectedNetworkDetails(kinesisServerDetails, yamlConfigInput.networkChosen)

  const publicKeysFromSelectedNodes = extractValuesFromSelectedNodes(yamlConfigInput.nodesData, 'publicKey')
  const endpointsFromSelectedNodes = extractValuesFromSelectedNodes(yamlConfigInput.nodesData, 'endpoint')
  const namesFromSelectedNodes = extractValuesFromSelectedNodes(yamlConfigInput.nodesData, 'name')

  const keypair = generateKeypair()

  const deploymentConfigInJs = getDeploymentConfig({
    nodeNameByUser: yamlConfigInput.nodeName,
    userKeys: keypair,
    selectedNodesConfigs: {
      publicKeys: publicKeysFromSelectedNodes,
      endpoints: endpointsFromSelectedNodes,
      names: namesFromSelectedNodes
    },
    networkPassphrase: networkDetails.networkPassphrase,
    selectedNetwork: yamlConfigInput.networkChosen
  })

  convertJsIntoYaml(deploymentConfigInJs)
}

export function getSelectedNetworkDetails(networks: any[], networkChosen: string): any {
  const [networkDetails] = networks.filter(({ horizonURL }) => horizonURL && horizonURL.includes(networkChosen))

  if (!networkDetails) {
    throw new Error('Some required data are missing.')
  }
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
