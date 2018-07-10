import chalk from 'chalk'
import * as figlet from 'figlet'
import * as vorpal from 'vorpal'

import checkIfDockerIsInstalled from './lib/check_docker'
import startNodeManager from './lib/start_node'

const initialisedVorpal = vorpal()

figlet('KINESIS MANAGER', (_, d) => {
  console.log(chalk.yellow(d))

  initialisedVorpal
    .command('start_node', 'Boot a node against a Kinesis network')
    .action(async () => {
      checkIfDockerIsInstalled()
      startNodeManager()
    })

  initialisedVorpal
    .delimiter('Kinesis $')
    .show()
})
