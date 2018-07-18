import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as nock from 'nock'

import {
  removeWhiteSpaceAndConvertToUppercase,
  userNodeNameValidation,
  validatePort
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

  describe('#validatePort', () => {
    it('returns true if a number between 8000 and 8999 is entered', () => {
      expect(validatePort('7999')).to.equal('Please enter a port number between 8000 and 8999.')
      expect(validatePort('9000')).to.equal('Please enter a port number between 8000 and 8999.')
      // tslint:disable-next-line:no-unused-expression
      expect(validatePort('8000')).to.be.true
    })

    it('gives back an error message if not a number type is entered', () => {
      expect(validatePort('hello')).to.equal('You may only use numbers.')
      expect(validatePort('')).to.equal('You may only use numbers.')
      // tslint:disable-next-line:no-unused-expression
      expect(validatePort('8005')).to.be.true
    })

    it('returns a message if the number entered is not an integer', () => {
      expect(validatePort('3.14')).to.equal('Please enter an integer.')
    })
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
