import * as rp from 'request-promise-native'

export function fetchNetworksAndRegions(): Promise<any> {
  return rp({
    uri: 'https://s3-ap-southeast-2.amazonaws.com/kinesis-config/keypairs/nodes.json',
    method: 'GET',
    json: true,
  })
}

export function fetchKinesisServerDetails(): Promise<any> {
  return rp({
    uri: 'https://s3-ap-southeast-2.amazonaws.com/kinesis-config/kinesis-server-details.json',
    method: 'GET',
    json: true,
  })
}
