import chalk from 'chalk'
import * as rp from 'request-promise-native'
import * as vorpal from 'vorpal'

const initialisedVorpal = vorpal()

export default async function convertJsToYaml(): Promise<any> {
  let kinesisServerDetails: any
  try {
    kinesisServerDetails = await getNetworkPassPhrase()
  } catch (error) {
    initialisedVorpal.log(chalk.red(error.message))
    return
  }

  return kinesisServerDetails
}

function getNetworkPassPhrase(): Promise<any> {
  return rp({
    uri: 'https://s3-ap-southeast-2.amazonaws.com/kinesis-config/kinesis-server-details.json',
    method: 'GET',
    json: true,
  })
}
