import * as inquirer from 'inquirer'
import {
  hasAtLeastSixNodesSelected,
  userNodeNameValidation,
  validatePort
} from './validators'

export function chooseNetwork(keys: string[]): Promise<any> {
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

export function selectNodes(nodesList: any): Promise<any> {
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

export function giveNameToUserNode() {
  return inquirer
    .prompt([
      {
        type: 'input',
        message: 'Please type the name of your node. You may use letters and numbers.',
        name: 'nodeName',
        validate(answer) {
          return userNodeNameValidation(answer)
        }
      }
    ])
}

export function providePortNumber() {
  return inquirer
    .prompt([
      {
        type: 'input',
        message: 'Please enter a port number between 8000 and 8999.',
        name: 'port',
        validate(answer) {
          return validatePort(answer)
        }
      }
    ])
}

export function confirmExistanceOfLocalNodesConfig() {
  return inquirer
    .prompt([
      {
        type: 'confirm',
        message: 'When you have your configuration file ready at the right location, press Yes to continue!',
        name: 'isConfirmed'
      }
    ])
}
