import chalk from 'chalk'
import * as fs from 'fs'
import * as vorpal from 'vorpal'

const initialisedVorpal = vorpal()

export function checkIfBucketExists() {
  try {
    fs.accessSync('buckets')
  } catch (e) {
    fs.mkdirSync('buckets')
    initialisedVorpal.log(chalk.green('Buckets created.'))
  }
}

export function checkFoldersInBucket(nodeName: string): void {
  try {
    fs.accessSync(`buckets/${nodeName}`)
    createFoldersInBucket(nodeName)
  } catch (error) {
    fs.mkdirSync(`buckets/${nodeName}`)
    createFoldersInBucket(nodeName)
  }
}

export function createFoldersInBucket(nodeName: string): void {
  fs.mkdirSync(`buckets/${nodeName}/pgdata`)
  fs.mkdirSync(`buckets/${nodeName}/coredata`)
  initialisedVorpal.log(chalk.green('Bucket folders created.'))
}
