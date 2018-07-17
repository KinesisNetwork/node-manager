import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as nock from 'nock'

import {
  flattenNodesList,
  getSelectedNodeData,
  networksAndRegionsLookup
} from '../modules/manage_networks_and_regions_data'

const { expect } = chai.use(chaiAsPromised)

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

describe('#networksAndRegionsLookup', () => {
  it('returns the argument if it is not an empty object', async () => {
    const configObject = {
      'local': {},
      'kau-testnet': {}
    }

    const networksAndRegions = await networksAndRegionsLookup(configObject)

    expect(networksAndRegions).to.deep.equal(configObject)
  })

  it('returns data fetched from AWS if config file is an empty object', async () => {
    const configObject = {}
    const responseFromAWS = {
      'local': {},
      'kau-testnet': {}
    }
    nock('https://s3-ap-southeast-2.amazonaws.com')
      .get('/kinesis-config/keypairs/nodes.json')
      .reply(200, responseFromAWS)

    const networksAndRegions = await networksAndRegionsLookup(configObject)

    expect(networksAndRegions).to.deep.equal(responseFromAWS)
  })

  it('should return a custom error if no data is fetched from AWS', () => {
    const configObject = {}
    const responseFromAWS = {}
    nock('https://s3-ap-southeast-2.amazonaws.com')
      .get('/kinesis-config/keypairs/nodes.json')
      .reply(200, responseFromAWS)

    expect(networksAndRegionsLookup(configObject)).to.be.rejectedWith('No network and nodes data could be found.')
  })
})
