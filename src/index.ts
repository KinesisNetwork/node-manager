import chalk from 'chalk'
import * as figlet from 'figlet'
import * as vorpal from 'vorpal'

import { getLocalConfigFile } from './commands/advanced_node'
import startNodeManager from './commands/start_node'
import { confirmLocalNodesConfig } from './modules/cli_questions_and_validations'
import { logErrors, runCommandInTerminal } from './modules/run_commands_in_exec'

const initialisedVorpal = vorpal()

figlet('KINESIS MANAGER', (_, d) => {
  console.log(chalk.yellow(d))

  initialisedVorpal
    .command('start_node', 'Boot a node against a Kinesis network')
    .action(async () => {
      try {
        await runCommandInTerminal('docker')
      } catch (error) {
        logErrors('To continue, please install Docker!')
        return
      }

      const { networkChosen: userNetwork, nodeName: userNodeName } = await startNodeManager()

      try {
        await runCommandInTerminal('docker swarm init')
      } catch (error) {
        logErrors(error.message)
        return
      }

      try {
        await runCommandInTerminal(
          `docker stack deploy --compose-file deployment_config.yml ${userNetwork}-${userNodeName}`
        )
      } catch (error) {
        logErrors(error.message)
        return
      }

      initialisedVorpal.log(chalk.green('Done!'))
    })

  initialisedVorpal
    .command('advanced_node', 'Boot a node using local configuration')
    .action(async () => {
      initialisedVorpal.log(chalk.dim(
        `The nodes configuration file should be saved in json and it's structure should match the right format.
        The following link is an example of the correct structure of your configuration file:

        https://s3-ap-southeast-2.amazonaws.com/kinesis-config/keypairs/nodes.json

        When you have your configuration file in the correct structure and format, place it in the rot folder!`
      ))

      const confirmation = (await (confirmLocalNodesConfig())).isConfirmed
      if (!confirmation) {
        return
      }

      try {
        await runCommandInTerminal('docker')
      } catch (error) {
        logErrors('To continue, please install Docker!')
        return
      }

      const configFile = getLocalConfigFile()
      const { networkChosen: userNetwork, nodeName: userNodeName } = await startNodeManager(configFile)

      try {
        await runCommandInTerminal('docker swarm init')
      } catch (error) {
        logErrors(error.message)
        return
      }

      try {
        await runCommandInTerminal(
          `docker stack deploy --compose-file deployment_config.yml ${userNetwork}-${userNodeName}`
        )
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
