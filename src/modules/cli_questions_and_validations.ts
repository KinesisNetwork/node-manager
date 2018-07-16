import * as inquirer from 'inquirer'

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

function hasAtLeastSixNodesSelected(selectedNodes: string[]): any {
  if (selectedNodes.length < 6) {
    return 'You must select at least six nodes.'
  }
  return true
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

export function userNodeNameValidation(userNodeName) {
  if (!userNodeName) {
    return 'Please enter a valid node name!'
  }

  const specialCharacters = /[-`~!@#%&_=;:'",\$\^\*\(\)\+\{\}\[\]\|\.\<\>\?\/\\]/g
  if (specialCharacters.test(userNodeName)) {
    return 'You may only use letters and numbers!'
  }

  return true
}

function validatePort(portNumber) {
  const port = Number(portNumber)
  if (!port) {
    return 'You may only use numbers.'
  }

  if (!Number.isInteger(port)) {
    return 'Please enter an integer.'
  }

  if (port < 8000 || port > 8999) {
    return 'Please enter a port number between 8000 and 8999.'
  }

  return true
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

export function removeWhiteSpaceAndConvertToUppercase(userNodeName: string) {
  return userNodeName
    .replace(/[\s]/g, '')
    .toUpperCase()
}
