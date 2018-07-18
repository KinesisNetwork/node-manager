import { expect } from 'chai'
import * as inquirer from 'inquirer'
import * as sinon from 'sinon'

import {
  chooseNetwork,
  confirmExistanceOfLocalNodesConfig,
  giveNameToUserNode,
  providePortNumber,
  selectNodes
} from '../../modules/cli_questions_and_validations'

describe('cli questions', () => {
  let inquirerStub

  beforeEach(() => {
    inquirerStub = sinon.stub(inquirer, 'prompt')
  })

  afterEach(() => {
    inquirerStub.restore()
  })

  it('#chooseNetwork selects the correct option', async () => {
    inquirerStub.resolves({ network: 'kau-testnet' })

    const chosenNetwork = await chooseNetwork(['kau-testnet', 'kau-livenet'])

    expect(chosenNetwork).to.have.property('network', 'kau-testnet')
  })

  it('#selectNodes returns the selected nodes', async () => {
    inquirerStub.resolves({ nodes: 'node1, node3, node6' })
    const availableNodes = {
      node1: { name: 'kau_testnet_europe_11630' },
      node2: { name: 'kau_testnet_europe_11631' },
      node3: { name: 'kau_testnet_europe_11632' },
      node4: { name: 'kau_testnet_europe_11633' },
      node5: { name: 'kau_testnet_europe_11634' },
      node6: { name: 'kau_testnet_europe_11635' },
    }

    const selectedNodes = await selectNodes(availableNodes)

    expect(selectedNodes).to.have.property('nodes', 'node1, node3, node6')
  })

  it('#giveNameToUserNode retuns the name entered by the user', async () => {
    inquirerStub.resolves({ nodeName: 'my node 471' })

    const userNodeName = await giveNameToUserNode()

    expect(userNodeName).to.have.property('nodeName', 'my node 471')
  })

  it('#providePortNumber gives back the port the user has entered', async () => {
    inquirerStub.resolves({ port: '8006' })

    const userPort = await providePortNumber()

    expect(userPort).to.have.property('port', '8006')
  })

  it('#confirmExistanceOfLocalNodesConfig returns true on confirming the file location', async () => {
    inquirerStub.resolves({ isConfirmed: true })

    const hasUserConfirmed = await confirmExistanceOfLocalNodesConfig()

    expect(hasUserConfirmed).to.have.property('isConfirmed', true)
  })
})
