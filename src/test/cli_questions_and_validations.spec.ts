import { expect } from 'chai'

import {
  removeWhiteSpaceAndConvertToUppercase,
  userNodeNameValidation
} from 'modules/cli_questions_and_validations'

describe('cli questions and validations', () => {
  it('#removeWhiteSpaceAndConvertToUppercase should return uppercase name with no whitespace', () => {
    const userNodeName = 'bob3s and lizs node'

    const expectedNodeName = 'BOB3SANDLIZSNODE'
    const convertedNodeName = removeWhiteSpaceAndConvertToUppercase(userNodeName)

    expect(convertedNodeName).to.equal(expectedNodeName)
  })

  describe('#userNodeNameValidation', () => {
    it('returns warning message if nothing is entered', () => {
      const returnedWarningMessage = userNodeNameValidation('')

      expect(returnedWarningMessage).to.equal('Please enter a valid node name!')
    })

    it('should return warning message if the input contains special characters', () => {
      const returnedWarningMessage = userNodeNameValidation('^Bob & Liz $\'')

      expect(returnedWarningMessage).to.equal('You may only use letters and numbers!')
    })
  })
})
