import { expect } from 'chai'

import {
  flattenNodesList,
  getSelectedNodeData
} from '../modules/manage_networks_and_regions_data'

describe('node_manager_logic', () => {
  it('#flattenNodesList throws exception when invalild input is given', () => {
    expect(() => flattenNodesList(null)).to.throw(Error, 'No nodeslist received from the user.')
    expect(() => flattenNodesList({})).to.throw(Error, 'No nodeslist received from the user.')
  })

  it('#flattenNodesList correctly flattens the regions into nodes list', () => {
    const networkChosen = {
      'kau-testnet-oceania': {
        node0: {
          name: 'oceania-1'
        },
        node1: {
          name: 'oceania-2'
        },
        node2: {
          name: 'oceania-3'
        },
      },
      'kau-testnet-europe': {
        node0: {
          name: 'europe-4'
        },
        node1: {
          name: 'europe-5'
        },
      },
    }

    const expectedNodesList = {
      'kau-testnet-oceania-node0': {
        name: 'oceania-1'
      },
      'kau-testnet-oceania-node1': {
        name: 'oceania-2'
      },
      'kau-testnet-oceania-node2': {
        name: 'oceania-3'
      },
      'kau-testnet-europe-node0': {
        name: 'europe-4'
      },
      'kau-testnet-europe-node1': {
        name: 'europe-5'
      },
    }

    const nodesListResult = flattenNodesList(networkChosen)

    expect(nodesListResult).to.deep.equal(expectedNodesList)
  })

  it('#getSelectedNodeData returns the correct nodes list objects', () => {
    const nodesList = {
      'kau-testnet-oceania-node0': {
        name: 'oceania-1'
      },
      'kau-testnet-oceania-node1': {
        name: 'oceania-2'
      },
      'kau-testnet-oceania-node2': {
        name: 'oceania-3'
      },
      'kau-testnet-europe-node0': {
        name: 'europe-4'
      },
      'kau-testnet-europe-node1': {
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
        name: 'oceania-2'
      },
      {
        name: 'europe-4'
      },
      {
        name: 'europe-5'
      }
    ]

    const nodesListResult = getSelectedNodeData(selectedNodesList, nodesList)

    expect(nodesListResult).to.have.lengthOf(3)
    expect(nodesListResult).to.deep.equal(expectedNodesList)
  })
})
