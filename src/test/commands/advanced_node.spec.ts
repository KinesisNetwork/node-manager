import { expect } from 'chai'
import * as mockFs from 'mock-fs'

import { getLocalConfigFile } from '../../commands/advanced_node'

describe('check if local config exists', () => {
  it('#getLocalConfigFile returns the config object if exists', () => {
    const networkConfig = JSON.stringify({ version: 3 })
    const setUpRootDirectory = () => {
      return mockFs({
        'network_config.json': networkConfig
      })
    }
    setUpRootDirectory()

    const localConfig = getLocalConfigFile()
    const expectedConfig = { version: 3 }

    expect(localConfig).to.deep.equal(expectedConfig)

    mockFs.restore()
  })

  it('#getLocalConfigFile throws an error if the file does not exist', () => {
    const setUpRootDirectory = () => {
      return mockFs()
    }
    setUpRootDirectory()

    expect(getLocalConfigFile).to.throw()

    mockFs.restore()
  })
})
