import chalk from 'chalk'
import * as figlet from 'figlet'
import * as vorpal from 'vorpal'

import startNodeManager from 'commands/start_node'
import { logErrors, runCommandInTerminal } from 'modules/run_commands_in_exec'

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
    })

  initialisedVorpal
    .delimiter('Kinesis $')
    .show()
})
