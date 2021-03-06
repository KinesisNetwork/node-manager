export default function getDeploymentConfig(deploymentConfigVariables: DeploymentConfigVariables) {
  const validators = [
    deploymentConfigVariables.userKeys.publicKey,
    ...deploymentConfigVariables.selectedNodesConfigs.publicKeys
  ]
  const historyPeers = [
    ...deploymentConfigVariables.selectedNodesConfigs.names
  ]

  const config = {
    version: '3.3',
    services: {
      db: {
        image: 'postgres:9.6',
        ports: ['5432'],
        environment: [
          'POSTGRES_PASSWORD=dbpw',
          'POSTGRES_DB = postgres'
        ],
        volumes: [
          `${process.cwd()}/buckets/${deploymentConfigVariables.nodeNameByUser}/pgdata:/var/lib/postgresql/data`
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
          `${deploymentConfigVariables.nodeNameByUser}_NODE_SEED=${deploymentConfigVariables.userKeys.seed}`,
          `PREFERRED_PEERS=${JSON.stringify(deploymentConfigVariables.selectedNodesConfigs.endpoints)}`,
          'THRESHOLD_PERCENT=66',
          'NODE_IS_VALIDATOR=true',
          'CATCHUP_COMPLETE=true',
          'UNSAFE_QUORUM=false',
          'FAILURE_SAFETY=-1',
          `VALIDATORS=${JSON.stringify(validators)}`,
          `HISTORY_PEERS=${JSON.stringify(historyPeers)}`,
          `NETWORK_PASSPHRASE=${deploymentConfigVariables.networkPassphrase}`,
          'HISTORY_GET=curl -sf https://s3-ap-southeast-2.amazonaws.com/' +
          'kinesis-network-history/' + deploymentConfigVariables.selectedNetwork + '/%s/{0} -o {1}',
          'STELLAR_DB=stellar',
          'HORIZON_DB=horizon'
        ],
        volumes: [
          `${process.cwd()}/buckets/${deploymentConfigVariables.nodeNameByUser}/coredata:/data`
        ]
      },
      horizon: {
        image: 'abxit/kinesis-horizon:testnet-v1',
        ports: [`${deploymentConfigVariables.port}:8000`],
        environment: [
          'DATABASE_URL=postgresql://postgres:dbpw@db:5432/horizon?sslmode=disable',
          'STELLAR_CORE_DATABASE_URL=postgresql://postgres:dbpw@db:5432/stellar?sslmode=disable',
          'STELLAR_CORE_URL=http://node:11626',
          'INGEST=true'
        ]
      }
    }
  }

  return config
}
