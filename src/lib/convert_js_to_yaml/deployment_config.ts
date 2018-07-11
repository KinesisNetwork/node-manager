export default function getDeploymentConfig(deploymentConfigVariables: DeploymentConfigVariables) {
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
          deploymentConfigVariables.nodeNameByUser,
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
          `${deploymentConfigVariables.nodeNameByUser}_POSTGRES_PORT=5432`,
          `${deploymentConfigVariables.nodeNameByUser}_PEER_PORT=11625`,
          `${deploymentConfigVariables.nodeNameByUser}_HTTP_PORT=11626`,
          `${deploymentConfigVariables.nodeNameByUser}_NODE_SEED=${secretKey}`,
          `PREFERRED_PEERS=${deploymentConfigVariables.selectedNodesConfigs.endpoints}`,
          'THRESHOLD_PERCENT=66',
          'NODE_IS_VALIDATOR=true',
          'CATCHUP_COMPLETE=true',
          'UNSAFE_QUORUM=false',
          'FAILURE_SAFETY=-1',
          `VALIDATORS=[${publicKey}, ${deploymentConfigVariables.selectedNodesConfigs.publicKeys}]`,
          `HISTORY_PEERS=[${deploymentConfigVariables.nodeNameByUser}, ${deploymentConfigVariables.selectedNodesConfigs.names}]`,
          `NETWORK_PASSPHRASE=${deploymentConfigVariables.networkPassphrase}`,
          `HISTORY_GET=aws s3 cp --region eu-west-1 s3://kinesis-network-history/${deploymentConfigVariables.selectedNetwork}/%s/{0} {1}`
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
