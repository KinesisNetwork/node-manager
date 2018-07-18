export function hasAtLeastSixNodesSelected(selectedNodes: string[]): any {
  if (selectedNodes.length < 6) {
    return 'You must select at least six nodes.'
  }
  return true
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

export function validatePort(portNumber) {
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
