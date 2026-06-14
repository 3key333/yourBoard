import "dotenv/config"
import { initDataBase } from "./src/db/pool"
import { createAppServer, startServer } from "./src/server"
import { authRouter } from "./src/api/auth"
import { userRouter } from './src/api/user'

const startApp = async () => {
    try {

        await initDataBase()
        const {app, httpServer} = createAppServer()

        app.use('/api/auth', authRouter)
        app.use('/api/user', userRouter)

        startServer(httpServer)

    } catch (error) {
        console.log("не удалось запустить приложенее", error)
        process.exit(1)
    }
}

startApp()
