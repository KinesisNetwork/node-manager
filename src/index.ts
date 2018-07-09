import chalk from 'chalk'
import { exec } from 'child_process'
import * as figlet from 'figlet'
import * as vorpal from 'vorpal'

const initialisedVorpal = vorpal()

figlet('KINESIS MANAGER', (_, d) => {
  console.log(chalk.yellow(d))

  initialisedVorpal
    .command('start_node', 'Boot a node against a Kinesis network')
    .action(async () => {
      exec('docker', (error) => {
        if (error) {
          initialisedVorpal.log('Docker must be installed to continue')
          initialisedVorpal.ui.cancel()
        }
      })

      initialisedVorpal.log(chalk.green(`Hello`))
    })

  initialisedVorpal
    .delimiter('Kinesis $')
    .show()
})
