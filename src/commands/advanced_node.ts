import chalk from 'chalk'
import * as fs from 'fs'
import * as process from 'process'
import * as vorpal from 'vorpal'

const initialisedVorpal = vorpal()

export function getLocalConfigFile() {
  let localConfig: string
  try {
    localConfig = fs.readFileSync(`${process.cwd()}/network_config.json`, 'utf-8')
  } catch (error) {
    initialisedVorpal.log(
      chalk.red('The configuration file is either not in the root folder or it\'s incorrectly named.')
    )
  }
  return JSON.parse(localConfig)
}

export function userInstructions() {
  return 'The nodes configuration file should be saved in json and it\'s structure should match the right format.' +
    'The following link is an example of the correct structure of your configuration file:\n\n' +
    'https://s3-ap-southeast-2.amazonaws.com/kinesis-config/keypairs/nodes.json\n\n' +
    'When you have your configuration file in the correct structure and format, place it in the root folder!'
}
