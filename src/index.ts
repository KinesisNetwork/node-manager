import chalk from 'chalk'
import * as figlet from 'figlet'
import * as vorpal from 'vorpal'
const initialisedVorpal = vorpal()

figlet('KINESIS MANAGER', (_, d) => {
  console.log(chalk.yellow(d))

  initialisedVorpal
    .command('start_node', 'Boot a node against a Kinesis network')
    .action(async () => {
      console.log(chalk.green(`Hello`))
    })

  initialisedVorpal
    .delimiter('Kinesis $')
    .show()
})
