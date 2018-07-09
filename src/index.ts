import chalk from 'chalk'
import { ChildProcess, exec } from 'child_process'
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
      checkIfDockerIsInstalled()

      try {
        const networksAndRegions: any = await getNetworksAndRegions()
        const networkChosen: string = (await chooseNetwork(Object.keys(networksAndRegions))).network

        const flattenedNodes: any = flatten(
          networksAndRegions[networkChosen],
          {
            delimiter: '-',
            maxDepth: 2
          }
        )

        const nodesSelected = await selectNodes(flattenedNodes)

        // TODO: replace comments with action and remove them
        initialisedVorpal.log(chalk.blue(JSON.stringify(nodesSelected, null, 2)))
        initialisedVorpal.log(chalk.yellow(JSON.stringify(flattenedNodes, null, 2)))
      } catch (error) {
        initialisedVorpal.log(chalk.red('Unable to fetch data from the server.'))
      }
    })

  initialisedVorpal
    .delimiter('Kinesis $')
    .show()
})

function checkIfDockerIsInstalled(): ChildProcess {
  return exec('docker', (error: Error) => {
    if (error) {
      initialisedVorpal.log('To continue, please install Docker!')
      initialisedVorpal.ui.cancel()
    }
  })
}

function getNetworksAndRegions(): Promise<any> {
  return rp({
    uri: 'https://s3-ap-southeast-2.amazonaws.com/kinesis-config/keypairs/nodes.json',
    method: 'GET',
    json: true,
  })
}

function chooseNetwork(keys: string[]): Promise<any> {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'network',
        message: 'Which network do you choose?',
        choices: keys,
      },
    ])
}

function hasAtLeastSixNodesSelected(selectedNodes: string[]): any {
  if (selectedNodes.length < 6) {
    return 'You must select at least six nodes.'
  }
  return true
}

function selectNodes(nodesList: any): Promise<any> {
  return inquirer
    .prompt([
      {
        type: 'checkbox',
        message: 'Select nodes',
        name: 'nodes',
        choices: Object.keys(nodesList),
        validate(answer) {
          return hasAtLeastSixNodesSelected(answer)
        },
      }
    ])
}
