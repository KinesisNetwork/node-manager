import { expect } from 'chai'
import * as fs from 'fs'
import * as mockFs from 'mock-fs'

import {
  checkFoldersInBucket,
  checkIfBucketExists
} from '../../modules/convert_js_to_yaml/create_folders'

describe('creating bucket folder structure for local db backup', () => {
  before(() => {
    const setUpRootDirectory = () => {
      return mockFs()
    }

    setUpRootDirectory()
  })

  after(() => {
    mockFs.restore()
  })

  it('#checkIfBucketExists should create buckets folder if it does not exist', () => {
    checkIfBucketExists()

    const folders = fs.readdirSync(process.cwd())

    expect(folders).to.have.lengthOf(1)
    expect(folders[0]).to.equal('buckets')
  })

  it('#checkFoldersInBucket should create folder of nodename and its subfolders in bucket', () => {
    checkFoldersInBucket('MYNODE14')

    const folders = fs.readdirSync(`${process.cwd()}/buckets`)
    const subfolders = fs.readdirSync(`${process.cwd()}/buckets/MYNODE14`)

    expect(folders).to.have.lengthOf(1)
    expect(folders[0]).to.equal('MYNODE14')
    expect(subfolders).to.have.lengthOf(2)
    expect(subfolders).to.have.members(['coredata', 'pgdata'])
  })
})
