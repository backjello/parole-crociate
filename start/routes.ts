/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import { Game } from '../app/classes/game.js'

router.get('/game/:theme', async ({ params }: HttpContext) => {

  const theme = params.theme

  const game = new Game(theme)
  await game.init()


  return game

})
