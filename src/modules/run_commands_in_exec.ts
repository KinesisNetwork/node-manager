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

export function logErrors(errorMessage: string): void {
  initialisedVorpal.log(chalk.red(errorMessage))
  initialisedVorpal.ui.cancel()
}
