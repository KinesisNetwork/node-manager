import chalk from 'chalk'
import { ChildProcess, exec } from 'child_process'
import * as vorpal from 'vorpal'

const initialisedVorpal = vorpal()

export function runCommandInTerminal(command: string): Promise<ChildProcess> {
  return new Promise((res, rej) => {
    return exec(command, (error: Error, stdout: string) => {
      if (error && error.message.includes('Error response from daemon: This node is already part of a swarm.')) {
        res()
      }

      if (error) {
        rej(error)
      }

      initialisedVorpal.log(chalk.yellow(stdout))
      res()
    })
  })
}

export async function checkIfDockerInstalled() {
  initialisedVorpal.log(chalk.yellow('Checking if Docker is installed...'))
  await runCommandInTerminal('docker')
}

export async function runDockerSwarmInit() {
  initialisedVorpal.log(chalk.yellow('Checking if Docker is in swarm mode...'))
  await runCommandInTerminal('docker swarm init')
}

export async function runDockerCompose() {
  initialisedVorpal.log(chalk.yellow('Pulling Docker images...'))
  await runCommandInTerminal('docker-compose -f deployment_config.yml pull')
}

export async function dockerStackDeploy(userNetwork: any, userNodeName: any) {
  initialisedVorpal.log(chalk.yellow('Deploying stack...'))
  await runCommandInTerminal(`docker stack deploy --compose-file deployment_config.yml ${userNetwork}-${userNodeName}`)
}

export function logErrors(errorMessage: string): void {
  initialisedVorpal.log(chalk.red(errorMessage))
  initialisedVorpal.ui.cancel()
}
