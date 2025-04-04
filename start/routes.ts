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

router.get('/game/:theme', async ({ params, response }: HttpContext) => {

  const theme = decodeURI(params.theme)

  const game = new Game(theme)
  //try {
  await game.init()
  return game
  // } catch (error) {
  //   return response.status(400).json({ error })
  // }



})
