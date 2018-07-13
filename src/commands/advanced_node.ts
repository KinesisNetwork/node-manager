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
