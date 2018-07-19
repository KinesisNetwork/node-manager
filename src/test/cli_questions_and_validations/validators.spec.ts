import { expect } from 'chai'

import {
  hasAtLeastSixNodesSelected,
  userNodeNameValidation,
  validatePort
} from '../../modules/cli_questions_and_validations/validators'

describe('cli questions and validations', () => {
  describe('#userNodeNameValidation', () => {
    it('returnstrue if a string with no special characters is entered', () => {
      // tslint:disable-next-line:no-unused-expression
      expect(userNodeNameValidation('Bob and Liz 4')).to.be.true
    })

    it('returns error message if ', () => {
      expect(userNodeNameValidation('')).to.equal('Incorrect user input received.')
      expect((userNodeNameValidation('^Bob & Liz $\''))).to.equal('Incorrect user input received.')
    })
  })

  describe('#validatePort', () => {
    it('returns true if a number between 8000 and 8999 is entered', () => {
      // tslint:disable-next-line:no-unused-expression
      expect(validatePort('8000')).to.be.true
      // tslint:disable-next-line:no-unused-expression
      expect(validatePort('8299')).to.be.true
    })

    it('gives back a user error message if not the correct input is received', () => {
      expect(validatePort('hello')).to.equal('Incorrect user input received.')
      expect(validatePort('')).to.equal('Incorrect user input received.')
      expect(validatePort('8023.65')).to.equal('Incorrect user input received.')
      expect(validatePort('800')).to.equal('Incorrect user input received.')
      expect(validatePort('7999')).to.equal('Incorrect user input received.')
    })
  })

  describe('#hasAtLeastSixNodesSelected', () => {
    it('returns an error message if less than six nodes have been selected', () => {
      const nodes = ['node1', 'node2', 'node3']

      expect(hasAtLeastSixNodesSelected(nodes)).to.equal('You must select at least six nodes.')
    })

    it('returns true if at least six nodes have been selected', () => {
      const nodes = ['node1', 'node2', 'node3', 'node4', 'node5', 'node6']

      // tslint:disable-next-line:no-unused-expression
      expect(hasAtLeastSixNodesSelected(nodes)).to.be.true
    })
  })
})
