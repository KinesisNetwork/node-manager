import { expect } from 'chai'

import { flattenNodesList, getSelectedNodeData } from 'modules/manage_networks_and_regions_data'

describe('node_manager_logic', () => {
  it('#flattenNodesList correctly flattens the regions into nodes list', () => {
    const networkChosen = {
      'kau-testnet-oceania': {
        node0: {
          publicKey: '123',
          endpoint: 'endpoint.io:1111',
          name: 'oceania-1'
        },
        node1: {
          publicKey: '234',
          endpoint: 'endpoint.io:2222',
          name: 'oceania-2'
        },
        node2: {
          publicKey: '345',
          endpoint: 'endpoint.io:3333',
          name: 'oceania-3'
        },
      },
      'kau-testnet-europe': {
        node0: {
          publicKey: 'abc',
          endpoint: 'endpoint.io:4444',
          name: 'europe-4'
        },
        node1: {
          publicKey: 'def',
          endpoint: 'endpoint.io:5555',
          name: 'europe-5'
        },
      },
    }

    const expectedNodesList = {
      'kau-testnet-oceania-node0': {
        publicKey: '123',
        endpoint: 'endpoint.io:1111',
        name: 'oceania-1'
      },
      'kau-testnet-oceania-node1': {
        publicKey: '234',
        endpoint: 'endpoint.io:2222',
        name: 'oceania-2'
      },
      'kau-testnet-oceania-node2': {
        publicKey: '345',
        endpoint: 'endpoint.io:3333',
        name: 'oceania-3'
      },
      'kau-testnet-europe-node0': {
        publicKey: 'abc',
        endpoint: 'endpoint.io:4444',
        name: 'europe-4'
      },
      'kau-testnet-europe-node1': {
        publicKey: 'def',
        endpoint: 'endpoint.io:5555',
        name: 'europe-5'
      },
    }

    const nodesListResult = flattenNodesList(networkChosen)

    expect(nodesListResult).to.deep.equal(expectedNodesList)
  })

  it('#getSelectedNodeData returns the correct nodes list objects', () => {
    const nodesList = {
      'kau-testnet-oceania-node0': {
        publicKey: '123',
        endpoint: 'endpoint.io:1111',
        name: 'oceania-1'
      },
      'kau-testnet-oceania-node1': {
        publicKey: '234',
        endpoint: 'endpoint.io:2222',
        name: 'oceania-2'
      },
      'kau-testnet-oceania-node2': {
        publicKey: '345',
        endpoint: 'endpoint.io:3333',
        name: 'oceania-3'
      },
      'kau-testnet-europe-node0': {
        publicKey: 'abc',
        endpoint: 'endpoint.io:4444',
        name: 'europe-4'
      },
      'kau-testnet-europe-node1': {
        publicKey: 'def',
        endpoint: 'endpoint.io:5555',
        name: 'europe-5'
      },
    }

    const selectedNodesList = [
      'kau-testnet-oceania-node1',
      'kau-testnet-europe-node0',
      'kau-testnet-europe-node1'
    ]

    const expectedNodesList = [
      {
        publicKey: '234',
        endpoint: 'endpoint.io:2222',
        name: 'oceania-2'
      },
      {
        publicKey: 'abc',
        endpoint: 'endpoint.io:4444',
        name: 'europe-4'
      },
      {
        publicKey: 'def',
        endpoint: 'endpoint.io:5555',
        name: 'europe-5'
      }
    ]

    const nodesListResult = getSelectedNodeData(selectedNodesList, nodesList)

    expect(nodesListResult).to.have.lengthOf(3)
    expect(nodesListResult).to.deep.equal(expectedNodesList)
  })

})
