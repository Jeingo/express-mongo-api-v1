import { runDb } from './repositories/db'
import { app } from './app'
import { settings } from './settings/settings'

const PORT = settings.PORT

const startApp = async () => {
  await runDb()
  app.listen(PORT, () => {
    console.log(`Server is starting on port: ${PORT}`)
  })
}

startApp()
