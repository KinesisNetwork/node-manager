import chalk from 'chalk'
import * as figlet from 'figlet'
import * as vorpal from 'vorpal'

import runCommandInTerminal from './modules/run_commands_in_exec'
import startNodeManager from './modules/start_node'

const initialisedVorpal = vorpal()

figlet('KINESIS MANAGER', (_, d) => {
  console.log(chalk.yellow(d))

  initialisedVorpal
    .command('start_node', 'Boot a node against a Kinesis network')
    .action(async () => {
      try {
        await runCommandInTerminal('docker')
      } catch (error) {
        initialisedVorpal.log('To continue, please install Docker!')
        initialisedVorpal.ui.cancel()
        return
      }

      const { networkChosen: userNetwork, nodeName: userNodeName } = await startNodeManager()

      try {
        await runCommandInTerminal('docker swarm init')
      } catch (error) {
        initialisedVorpal.log(error.message)
        initialisedVorpal.ui.cancel()
        return
      }

      try {
        await runCommandInTerminal(`docker stack deploy --compose-file deployment_config.yml ${userNetwork - userNodeName}`)
      } catch (error) {
        initialisedVorpal.log(error.message)
        initialisedVorpal.ui.cancel()
        return
      }

      // initialisedVorpal.log(chalk.cyan(message))
    })

  initialisedVorpal
    .delimiter('Kinesis $')
    .show()
})
