import chalk from 'chalk'
import * as rp from 'request-promise-native'
import * as vorpal from 'vorpal'

import getDeploymentConfig from './deployment_config'

const initialisedVorpal = vorpal()

export default async function convertJsToYaml(networkChosen: string): Promise<any> {
  let kinesisServerDetails: any[]
  try {
    kinesisServerDetails = await getNetworkPassPhrase()
  } catch (error) {
    initialisedVorpal.log(chalk.red(error.message))
    return
  }

  const networkDetails = getSelectedNetworkDetails(kinesisServerDetails, networkChosen)

  return networkDetails
}

function getNetworkPassPhrase(): Promise<any> {
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
