import { ChildProcess, exec } from 'child_process'

export default function runCommandInTerminal(command: string): Promise<ChildProcess> {
  return new Promise((res, rej) => {
    return exec(command, (error: Error) => {
      if (error && error.message.includes('Error response from daemon: This node is already part of a swarm.')) {
        res()
      }

      if (error) {
        rej(error)
      }

      res()
    })
  })
}
