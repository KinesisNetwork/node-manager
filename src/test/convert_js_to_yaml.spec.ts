import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as nock from 'nock'

import generateYamlConfigFile, {
  extractValuesFromSelectedNodes,
  getSelectedNetworkDetails
} from '../modules/convert_js_to_yaml'

const { expect } = chai.use(chaiAsPromised)

describe('convert js to yaml', () => {
  it('#getSelectedNetworkDetails should throw an error if no data received from the server', () => {
    expect(() => getSelectedNetworkDetails([], 'kau-testnet')).to.throw()
  })

  it('#getSelectedNetworkDetails throws an error if no network name is selected', () => {
    const networks = [
      {
        horizonURL: 'https://kau-testnet/kinesisgroup.io'
      },
      {
        horizonURL: 'https://kau-livenet/kinesisgroup.io'
      }
    ]

    expect(() => getSelectedNetworkDetails(networks, null)).to.throw()
  })

  it('#getSelectedNetworkDetails throws an error if no horizonURL key is found', () => {
    const networks = [
      {
        name: 'Kinesis KAU Testnet',
      },
      {
        name: 'Kinesis KAU Livenet',
        horizonURL: 'https://kau-livenet/kinesisgroup.io'
      }
    ]

    expect(() => getSelectedNetworkDetails(networks, 'kau-testnet'))
      .to.throw(Error, 'No network and nodes data could be found.')
    expect(() => getSelectedNetworkDetails(networks, 'kau-livenet')).to.not.throw()
  })

  it('#getSelectedNetworkDetails returns the horizonURL for the correct network', () => {
    const networks = [
      {
        horizonURL: 'https://kau-testnet/kinesisgroup.io'
      },
      {
        horizonURL: 'https://kau-livenet/kinesisgroup.io'
      },
      {
        horizonURL: 'https://kag-testnet/kinesisgroup.io'
      },
      {
        horizonURL: 'https://kag-livenet/kinesisgroup.io'
      }
    ]

    const expectedNetwork = {
      horizonURL: 'https://kau-testnet/kinesisgroup.io'
    }

    const networkResult = getSelectedNetworkDetails(networks, 'kau-testnet')

    expect(networkResult).to.deep.equal(expectedNetwork)
  })

  it('#extractValuesFromSelectedNodes gives back the values of the requested key from all selected nodes', () => {
    const selectedNodes = [
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

    const expectedValues = [
      'endpoint.io:2222',
      'endpoint.io:4444',
      'endpoint.io:5555'
    ]

    const valuesResult = extractValuesFromSelectedNodes(selectedNodes, 'endpoint')

    expect(valuesResult).to.be.an('array')
    expect(valuesResult).to.have.lengthOf(3)
    expect(valuesResult).to.deep.equal(expectedValues)
  })
})

describe('#generateYamlConfigFile', () => {
  it('should return a custom error if an empty array is fetched from AWS', () => {
    const responseFromAWS = []
    const networkChosen = 'kau-testnet'
    const nodesData = []
    const nodeName = 'my node'
    const port = '8000'
    nock('https://s3-ap-southeast-2.amazonaws.com')
      .get('/kinesis-config/kinesis-server-details.json')
      .reply(200, responseFromAWS)

    expect(generateYamlConfigFile({ networkChosen, nodesData, nodeName, port }))
      .to.be.rejectedWith('No server details could be found.')
  })
})
