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
  const kinesisServerDetails = await fetchKinesisServerDetails()
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
    throw new Error('Couldn\'t find either a url or a network passphrase for the selected network.')
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
    seed: keypair.secret()
  }
}

function checkIfBucketExists() {
  try {
    fs.accessSync('buckets')
  } catch (e) {
    fs.mkdirSync('buckets')
    initialisedVorpal.log(chalk.green('Buckets created.'))
  }
}

function checkFoldersInBucket(nodeName: string): void {
  try {
    fs.accessSync(`buckets/${nodeName}`)
    createFoldersInBucket(nodeName)
  } catch (error) {
    fs.mkdirSync(`buckets/${nodeName}`)
    createFoldersInBucket(nodeName)
  }
}

function createFoldersInBucket(nodeName: string): void {
  fs.mkdirSync(`buckets/${nodeName}/pgdata`)
  fs.mkdirSync(`buckets/${nodeName}/coredata`)
  initialisedVorpal.log(chalk.green('Bucket folders created.'))
}

function convertJsIntoYaml(configInJs: any): void {
  const deploymentYaml = yaml.safeDump(configInJs)
  const deploymentFilePath = path.join(__dirname, '../../../', 'deployment_config.yml')
  fs.writeFileSync(deploymentFilePath, deploymentYaml)
}
