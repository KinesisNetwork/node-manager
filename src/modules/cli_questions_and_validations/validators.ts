export function hasAtLeastSixNodesSelected(selectedNodes: string[]): any {
  if (selectedNodes.length < 6) {
    return 'You must select at least six nodes.'
  }
  return true
}

export function userNodeNameValidation(userNodeName) {
  const specialCharacters = /[-`~!@#%&_=;:'",\$\^\*\(\)\+\{\}\[\]\|\.\<\>\?\/\\]/g
  if (isValidUserNodeName(userNodeName, specialCharacters)) {
    return true
  }

  return CustomError.userError
}

function isValidUserNodeName(userNodeName, specialCharacters) {
  return userNodeName && !specialCharacters.test(userNodeName)
}

export function validatePort(portNumber) {
  if (portNumber.match(/^8\d{3}$/)) {
    return true
  }

  return CustomError.userError
}
