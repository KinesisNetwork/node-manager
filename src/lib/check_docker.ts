import { ChildProcess, exec } from 'child_process'
import * as vorpal from 'vorpal'

const initialisedVorpal = vorpal()

export default function checkIfDockerIsInstalled(): ChildProcess {
  return exec('docker', (error: Error) => {
    if (error) {
      initialisedVorpal.log('To continue, please install Docker!')
      initialisedVorpal.ui.cancel()
    }
  })
}
