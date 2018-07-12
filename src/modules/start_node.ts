import {
  getSelectedNodesWithAllData,
  networksAndRegionsLookup
} from './manage_networks_and_regions_data'

import {
  chooseNetwork,
  giveNameToUserNode,
  removeWhiteSpaceAndConvertToUppercase
} from './cli_questions_and_validations'

import generateYamlConfigFile from './convert_js_to_yaml'

export default async function startNodeManager(): Promise<void> {
  const networksAndRegions = await networksAndRegionsLookup()

  const networkChosen: string = (await chooseNetwork(Object.keys(networksAndRegions))).network
  const nodesSelectedWithAllData: any[] = await getSelectedNodesWithAllData(networksAndRegions[networkChosen])
  const nodeName: string = removeWhiteSpaceAndConvertToUppercase((await giveNameToUserNode()).nodeName)

  await generateYamlConfigFile(networkChosen, nodesSelectedWithAllData, nodeName)
}
