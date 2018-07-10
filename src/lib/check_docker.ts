import { ChildProcess, exec } from 'child_process'

export default function checkIfDockerIsInstalled(): Promise<ChildProcess> {
  return new Promise((res, rej) => {
    return exec('docker', (error: Error) => {
      if (error) {
        rej(error)
      }

      res()
    })
  })
}
