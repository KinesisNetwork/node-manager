import {
  getSelectedNodesWithAllData,
  networksAndRegionsLookup
} from '../modules/manage_networks_and_regions_data'

import {
  chooseNetwork,
  giveNameToUserNode,
  removeWhiteSpaceAndConvertToUppercase
} from '../modules/cli_questions_and_validations'

import generateYamlConfigFile from '../modules/convert_js_to_yaml'

export default async function startNodeManager(configFile: any = {}): Promise<any> {
  const networksAndRegions = await networksAndRegionsLookup(configFile)

  const networkChosen: string = (await chooseNetwork(Object.keys(networksAndRegions))).network
  const nodesSelectedWithAllData: any[] = await getSelectedNodesWithAllData(networksAndRegions[networkChosen])
  const nodeName: string = removeWhiteSpaceAndConvertToUppercase((await giveNameToUserNode()).nodeName)

  await generateYamlConfigFile({ networkChosen, nodesData: nodesSelectedWithAllData, nodeName })

  return { networkChosen, nodeName }
}
