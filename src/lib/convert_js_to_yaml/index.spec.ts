import { expect } from 'chai'

import { getSelectedNetworkDetails } from '.'

describe('convert js to yaml', () => {
  it.only('#getHorizonURL returns the horizonURL for the correct network', () => {
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
})
