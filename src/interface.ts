interface DeploymentConfigVariables {
  nodeNameByUser: string
  userKeys: UserKeys
  selectedNodesConfigs: SelectedNodesConfigs
  networkPassphrase: string
  selectedNetwork: string
  port: string
}

interface SelectedNodesConfigs {
  publicKeys: string[]
  endpoints: string[]
  names: string[]
}

interface UserKeys {
  seed: string
  publicKey: string
}

interface YamlConfigInput {
  networkChosen: string
  nodesData: any[]
  nodeName: string
  port: string
}

const enum CustomError {
  serverError = 'No server details could be found.',
  dataError = 'No network and nodes data could be found.',
  userError = 'No nodeslist received from the user.'
}
