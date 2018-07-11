interface DeploymentConfigVariables {
  nodeNameByUser: string
  userKeys: UserKeys
  selectedNodesConfigs: SelectedNodesConfigs
  networkPassphrase: string
  selectedNetwork: string
}

interface SelectedNodesConfigs {
  publicKeys: string[]
  endpoints: string[]
  names: string[]
}

interface UserKeys {
  privateKey: string
  publicKey: string
}
