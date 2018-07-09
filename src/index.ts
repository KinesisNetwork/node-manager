import chalk from 'chalk'
import { exec } from 'child_process'
import * as figlet from 'figlet'
import * as flatten from 'flat'
import * as inquirer from 'inquirer'
import * as rp from 'request-promise-native'
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

      const networks = await rp({
        uri: 'https://s3-ap-southeast-2.amazonaws.com/kinesis-config/keypairs/nodes.json',
        method: 'GET',
        json: true,
      })
      const keys: string[] = Object.keys(networks)

      const networkChosen = (await inquirer
        .prompt([
          {
            type: 'list',
            name: 'network',
            message: 'Which network do you choose?',
            choices: keys
          },
        ])).network
      const availableNodes = networks[networkChosen]
      const flattenedNodes = flatten(availableNodes, { delimiter: '-', maxDepth: 2 })

      const nodesSelected = await inquirer
        .prompt([
          {
            type: 'checkbox',
            message: 'Select nodes',
            name: 'nodes',
            choices() {
              const result = []
              for (const key in flattenedNodes) {
                if (flattenedNodes[key]) {
                  result.push(flattenedNodes[key])
                }
              }
              return result
            },
            validate(answer) {
              if (answer.length < 6) {
                return 'You must select at least six nodes.'
              }
              return true
            }
          }
        ])

      initialisedVorpal.log(chalk.blue(JSON.stringify(nodesSelected, null, 2)))

    })

  initialisedVorpal
    .delimiter('Kinesis $')
    .show()
})
