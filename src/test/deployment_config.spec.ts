import { expect } from 'chai'

import getDeploymentConfig from '../modules/convert_js_to_yaml/deployment_config'

const configVariables = () => {
  return {
    nodeNameByUser: 'MYNODE',
    userKeys: {
      publicKey: '1234',
      seed: '5678'
    },
    selectedNodesConfigs: {
      publicKeys: ['a'],
      endpoints: ['111', '112'],
      names: ['b', 'c']
    },
    networkPassphrase: 'password',
    selectedNetwork: 'kau-testnet',
    port: '8001'
  }
}

describe('#getDeploymentConfig', () => {
  it('correctly handles user nodeName', () => {
    const configParams = configVariables()

    const configResult = getDeploymentConfig(configParams)

    expect(configResult.services.db.volumes).to.have.lengthOf(1)
    expect(configResult.services.db.volumes[0]).to.include('MYNODE')
  })

  it('should place userKeys to the right locations', () => {
    const configParams = configVariables()
    const validatorKeys = JSON.stringify(['1234', 'a'])

    const configResult = getDeploymentConfig(configParams)

    expect(configResult.services.node.environment).to.have.lengthOf(20)
    expect(configResult.services.node.environment).to.include('MYNODE_NODE_SEED=5678')
    expect(configResult.services.node.environment).to.include(`VALIDATORS=${validatorKeys}`)
  })

  it('returns an object with selected nodes properties at the right place', () => {
    const configParams = configVariables()
    const preferredPeers = JSON.stringify(['111', '112'])
    const historyPeers = JSON.stringify(['b', 'c'])

    const configResult = getDeploymentConfig(configParams)

    expect(configResult.services.node.environment).to.include(`PREFERRED_PEERS=${preferredPeers}`)
    expect(configResult.services.node.environment).to.include(`HISTORY_PEERS=${historyPeers}`)
  })

  it('should place network passphrase at the right place', () => {
    const configParams = configVariables()

    const configResult = getDeploymentConfig(configParams)

    expect(configResult.services.node.environment).to.include('NETWORK_PASSPHRASE=password')
  })

  it('should assign selected network to the right variable', () => {
    const configParams = configVariables()
    const AWSUrl = 'https://s3-ap-southeast-2.amazonaws.com/kinesis-network-history/kau-testnet/%s/{0}'

    const configResult = getDeploymentConfig(configParams)

    expect(configResult.services.node.environment).to.include(`HISTORY_GET=curl -sf ${AWSUrl} -o {1}`)
  })

  it('returns an object with port at the right place', () => {
    const configParams = configVariables()

    const configResult = getDeploymentConfig(configParams)

    expect(configResult.services.horizon).to.have.property('ports')
    expect(configResult.services.horizon.ports).to.have.lengthOf(1)
    expect(configResult.services.horizon.ports[0]).to.equal('8001:8000')
  })
})
