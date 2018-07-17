import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as nock from 'nock'

import {
  removeWhiteSpaceAndConvertToUppercase,
  userNodeNameValidation
} from '../modules/cli_questions_and_validations'
import generateYamlConfigFile from '../modules/convert_js_to_yaml'

const { expect } = chai.use(chaiAsPromised)

describe('cli questions and validations', () => {
  it('#removeWhiteSpaceAndConvertToUppercase should return uppercase name with no whitespace', () => {
    const userNodeName = 'bob3s and lizs node'

    const expectedNodeName = 'BOB3SANDLIZSNODE'
    const convertedNodeName = removeWhiteSpaceAndConvertToUppercase(userNodeName)

    expect(convertedNodeName).to.equal(expectedNodeName)
  })

  it('#userNodeNameValidation returns warning message if nothing is entered', () => {
    const returnedWarningMessage = userNodeNameValidation('')

    expect(returnedWarningMessage).to.equal('Please enter a valid node name!')
  })

  it('#userNodeNameValidation should return warning message if the input contains special characters', () => {
    const returnedWarningMessage = userNodeNameValidation('^Bob & Liz $\'')

    expect(returnedWarningMessage).to.equal('You may only use letters and numbers!')
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
