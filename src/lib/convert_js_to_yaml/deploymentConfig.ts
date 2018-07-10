export default function getDeploymentConfig(
  nodeName: string,
  secretKey: string,
  namesFromSelectedNodes,
  publicKey: string,
  publicKeysFromSelectedNodes: string[],
  selectedNetwork,
  endpointsFromNodeSelection,
  passPhrase
) {
  return {
    version: '3.3',
    services: {
      db: {
        image: 'postgres:9.6',
        ports: ['5432'],
        environment: [
          'POSTGRES_PASSWORD=dbpw',
          'POSTGRES_DB = postgres'
        ]
      },
      node: {
        image: 'abxit/kinesis-core:testnet-v1',
        command: [
          '/start',
          nodeName,
          'fresh',
          'forcescp'
        ],
        ports: [
          '11625',
          '11626'
        ],
        environment: [
          'POSTGRES_PASSWORD=dbpw',
          'PGPASSWORD=dbpw',
          'PGHOST=db',
          'DATABASE=postgresql://dbname=stellar user=postgres host=db',
          `${nodeName}_POSTGRES_PORT=5432`,
          `${nodeName}_PEER_PORT=11625`,
          `${nodeName}_HTTP_PORT=11626`,
          `${nodeName}_NODE_SEED=${secretKey}`,
          `PREFERRED_PEERS=${endpointsFromNodeSelection}`,
          'THRESHOLD_PERCENT=66',
          'NODE_IS_VALIDATOR=true',
          'CATCHUP_COMPLETE=true',
          'UNSAFE_QUORUM=false',
          'FAILURE_SAFETY=-1',
          `VALIDATORS=[${publicKey}, ${publicKeysFromSelectedNodes}]`,
          `HISTORY_PEERS=[${nodeName}, ${namesFromSelectedNodes}]`,
          `NETWORK_PASSPHRASE=${passPhrase}`,
          `HISTORY_GET=aws s3 cp --region eu-west-1 s3://kinesis-network-history/${selectedNetwork}/%s/{0} {1}`
        ]
      },
      horizon: {
        image: 'abxit/kinesis-horizon:testnet-v1',
        ports: ['8000'],
        environment: [
          'DATABASE_URL=postgresql://postgres:dbpw@db:5432/postgres?sslmode=disable',
          'STELLAR_CORE_DATABASE_URL=postgresql://postgres:dbpw@db:5432/stellar?sslmode=disable',
          'STELLAR_CORE_URL=http://node:11626',
          'INGEST=true'
        ]
      }
    }
  }
}
