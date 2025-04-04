import { args, BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { Game } from '../app/classes/game.js'

export default class Newgame extends BaseCommand {
  static commandName = 'newgame'
  static description = ''

  @flags.string({
    description: 'Tema',
    required: true,
    alias: 't'
  })
  public theme: string = ''

  static options: CommandOptions = {}

  async run() {
    const game = new Game(this.theme)
    await game.init()
  }
}