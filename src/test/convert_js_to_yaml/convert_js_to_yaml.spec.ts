import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as fs from 'fs'
import * as mockFs from 'mock-fs'
import * as nock from 'nock'

import generateYamlConfigFile, {
  convertJsIntoYamlAndWriteOnFs,
  extractValuesFromSelectedNodes,
  generateKeypair,
  getSelectedNetworkDetails,
} from '../../modules/convert_js_to_yaml'

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

  it('#generateKeypair returns an object with public key and seed', () => {
    const keypair = generateKeypair()

    expect(keypair).to.be.an('object')
    expect(keypair).to.have.property('publicKey')
    expect(keypair).to.have.property('seed')
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

describe('convertJsIntoYaml', () => {
  before(() => {
    const setUpRootDirectory = () => {
      return mockFs()
    }

    setUpRootDirectory()
  })

  after(() => {
    mockFs.restore()
  })

  it('writes a yaml file on the file system given an object config input', () => {
    const deploymentConfigAsObject = {
      version: '3'
    }

    convertJsIntoYamlAndWriteOnFs(deploymentConfigAsObject)
    const fileCreated = fs.readdirSync(process.cwd())

    expect(fileCreated).to.have.lengthOf(1)
    expect(fileCreated[0]).to.equal('deployment_config.yml')
  })
})
