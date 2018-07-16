import chalk from 'chalk'
import * as figlet from 'figlet'
import * as vorpal from 'vorpal'

import {
  getLocalConfigFile,
  userInstructions
} from './commands/advanced_node'
import startNodeManager from './commands/start_node'
import { confirmExistanceOfLocalNodesConfig } from './modules/cli_questions_and_validations'
import {
  checkIfDockerInstalled,
  dockerStackDeploy,
  logErrors,
  runDockerCompose,
  runDockerSwarmInit
} from './modules/run_commands_in_exec'

const initialisedVorpal = vorpal()

figlet('KINESIS MANAGER', (_, d) => {
  console.log(chalk.yellow(d))

  initialisedVorpal
    .command('start_node', 'Boot a node against a Kinesis network')
    .action(async () => {
      try {
        await checkIfDockerInstalled()
        const { networkChosen: userNetwork, nodeName: userNodeName } = await startNodeManager()

        await runDockerSwarmInit()
        await runDockerCompose()
        await dockerStackDeploy(userNetwork, userNodeName)
      } catch (error) {
        logErrors(error.message)
        return
      }

      initialisedVorpal.log(chalk.green('Done!'))
    })

  initialisedVorpal
    .command('advanced_node', 'Boot a node using local configuration')
    .action(async () => {
      initialisedVorpal.log(chalk.dim(userInstructions()))

      const confirmation = (await (confirmExistanceOfLocalNodesConfig())).isConfirmed
      if (!confirmation) {
        return
      }

      try {
        await checkIfDockerInstalled()
        const {
          networkChosen: userNetwork,
          nodeName: userNodeName
        } = await startNodeManager(getLocalConfigFile())

        await runDockerSwarmInit()
        await runDockerCompose()
        await dockerStackDeploy(userNetwork, userNodeName)
      } catch (error) {
        logErrors(error.message)
        return
      }

      initialisedVorpal.log(chalk.green('Done!'))
    })

  initialisedVorpal
    .delimiter('Kinesis $')
    .show()
})
