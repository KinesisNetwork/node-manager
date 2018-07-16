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
